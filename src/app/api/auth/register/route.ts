import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { getSession } from '@/lib/session';
import { auditLog } from '@/lib/auth';
import { eq, sql } from 'drizzle-orm';
import argon2 from 'argon2';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return jsonError('Missing required field: name', 422);
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return jsonError('Missing required field: email', 422);
    }
    if (!password || typeof password !== 'string') {
      return jsonError('Missing required field: password', 422);
    }

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return jsonError('Invalid email address.', 422);
    }
    if (password.length < 8) {
      return jsonError('Password must be at least 8 characters.', 422);
    }

    // Check duplicate
    const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (existing.length > 0) {
      return jsonError('An account with this email already exists.', 409);
    }

    // Count existing users to decide role
    const userCountRes = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
    const userCount = Number(userCountRes[0]?.count || 0);
    const role: 'admin' | 'member' = userCount === 0 ? 'admin' : 'member';

    const hash = await argon2.hash(password, { type: argon2.argon2id });

    const insertResult = await db.insert(users).values({
      name: cleanName,
      email: cleanEmail,
      passwordHash: hash,
      role,
      isActive: 1,
    });

    const userId = Number((insertResult[0] as any).insertId);

    await auditLog(userId, 'register', 'users', userId);

    // Auto login
    const session = await getSession();
    session.userId = userId;
    session.userRole = role;

    const csrfToken = crypto.randomBytes(32).toString('hex');
    (session as any).csrfToken = csrfToken;
    await session.save();

    return jsonOk(
      {
        message: 'Account created successfully.',
        csrf_token: csrfToken,
        user: { id: userId, name: cleanName, email: cleanEmail, role },
      },
      201
    );
  } catch (err: any) {
    console.error('[Register error]', err);
    return jsonError('An unexpected error occurred.', 500);
  }
}
