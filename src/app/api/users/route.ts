import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        is_active: users.isActive,
        created_at: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return jsonOk(userList);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error('[GET /api/users error]', err);
    return jsonError('A database error occurred.', 500);
  }
}
