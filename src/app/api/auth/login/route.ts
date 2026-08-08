import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { getSession } from '@/lib/session';
import { checkLoginRateLimit } from '@/lib/ratelimit';
import { eq } from 'drizzle-orm';
import { verify as argon2Verify } from '@node-rs/argon2';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    let rateCheck = { success: true };
    try {
      rateCheck = await checkLoginRateLimit(ip);
    } catch (e) {
      console.warn('[RateLimit check fallback]', e);
    }
    if (!rateCheck.success) {
      return jsonError('Too many login attempts. Please try again in 15 minutes.', 429);
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return jsonError('Missing required field: email', 422);
    }
    if (!password || typeof password !== 'string') {
      return jsonError('Missing required field: password', 422);
    }

    const cleanEmail = email.toLowerCase().trim();

    const userRows = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    const user = userRows[0];

    let isValid = false;
    if (user && user.passwordHash) {
      try {
        isValid = await argon2Verify(user.passwordHash, password);
      } catch (err) {
        // Fallback for non-argon2 legacy hashes if any (e.g. bcrypt)
        isValid = false;
      }
    }

    if (!user || !isValid) {
      return jsonError('Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return jsonError('This account has been deactivated. Please contact an administrator.', 403);
    }

    const session = await getSession();
    session.userId = user.id;
    session.userRole = user.role;

    const csrfToken = crypto.randomBytes(32).toString('hex');
    (session as any).csrfToken = csrfToken;
    await session.save();

    return jsonOk({
      message: 'Logged in successfully.',
      csrf_token: csrfToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('[Login error]', err);
    return jsonError('An unexpected error occurred.', 500);
  }
}
