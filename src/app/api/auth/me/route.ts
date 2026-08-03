import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAuth } from '@/lib/auth';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuth();

    const userRows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);

    const user = userRows[0];
    if (!user) {
      return jsonError('User not found.', 404);
    }

    const session = await getSession();
    let csrfToken = (session as any).csrfToken;
    if (!csrfToken) {
      csrfToken = crypto.randomBytes(32).toString('hex');
      (session as any).csrfToken = csrfToken;
      await session.save();
    }

    return jsonOk({
      user,
      csrf_token: csrfToken,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return jsonError('Unauthorized — please log in.', 401);
    }
    console.error('[Auth me error]', err);
    return jsonError('An unexpected error occurred.', 500);
  }
}
