import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin, auditLog } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) return jsonError('Invalid user ID', 400);

    const userRows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        is_active: users.isActive,
        created_at: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRows[0];
    if (!user) return jsonError('User not found.', 404);

    return jsonOk(user);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    return jsonError('A database error occurred.', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actor = await requireAdmin();
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) return jsonError('Invalid user ID', 400);

    const body = await req.json().catch(() => ({}));
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.role !== undefined) {
      if (!['admin', 'member'].includes(body.role)) {
        return jsonError('Invalid role. Must be admin or member.', 422);
      }
      updateData.role = body.role;
    }
    if (body.is_active !== undefined) updateData.isActive = body.is_active ? 1 : 0;

    if (Object.keys(updateData).length === 0) {
      return jsonError('No valid fields to update.', 422);
    }

    const result = await db.update(users).set(updateData).where(eq(users.id, userId));

    await auditLog(actor.id, 'update', 'users', userId);

    return GET(req, { params });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    return jsonError('A database error occurred.', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actor = await requireAdmin();
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) return jsonError('Invalid user ID', 400);

    if (userId === actor.id) {
      return jsonError(
        req.nextUrl.searchParams.get('permanent') || req.nextUrl.searchParams.get('hard')
          ? 'You cannot delete your own account.'
          : 'You cannot deactivate your own account.',
        403
      );
    }

    const isPermanent =
      req.nextUrl.searchParams.get('permanent') === 'true' ||
      req.nextUrl.searchParams.get('hard') === 'true';

    if (isPermanent) {
      const check = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
      if (!check[0]) return jsonError('User not found.', 404);

      await db.delete(users).where(eq(users.id, userId));
      await auditLog(actor.id, 'delete', 'users', userId);

      return jsonOk({ message: `User #${userId} has been permanently deleted.` });
    } else {
      const result = await db.update(users).set({ isActive: 0 }).where(eq(users.id, userId));
      await auditLog(actor.id, 'deactivate', 'users', userId);

      return jsonOk({ message: `User #${userId} has been deactivated.` });
    }
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    return jsonError('A database error occurred.', 500);
  }
}
