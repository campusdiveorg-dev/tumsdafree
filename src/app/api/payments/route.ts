export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { payments, users } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin, auditLog } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const rows = await db
      .select({
        id: payments.id,
        phone_number: payments.phoneNumber,
        amount: payments.amount,
        purpose: payments.purpose,
        status: payments.status,
        mpesa_receipt_number: payments.mpesaReceiptNumber,
        created_at: payments.createdAt,
        donor_name: users.name,
        donor_email: users.email,
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .orderBy(desc(payments.createdAt))
      .limit(500);

    return jsonOk(rows);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error('[GET /api/payments error]', err);
    return jsonError('A database error occurred.', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const actor = await requireAdmin();
    const url = new URL(req.url);
    const idParam = url.searchParams.get('id');
    const clearAllParam = url.searchParams.get('clearAll');

    if (clearAllParam === 'true') {
      await db.delete(payments);
      await auditLog(actor.id, 'delete_all', 'payments', 0);
      return jsonOk({ message: 'All payment logs cleared successfully.' });
    }

    if (idParam) {
      const numId = parseInt(idParam, 10);
      if (isNaN(numId)) return jsonError('Invalid payment ID.', 400);

      const deleted = await db.delete(payments).where(eq(payments.id, numId));
      await auditLog(actor.id, 'delete', 'payments', numId);
      return jsonOk({ message: `Deleted payment record #${numId}.` });
    }

    return jsonError('Missing query parameter: id or clearAll=true', 400);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error('[DELETE /api/payments error]', err);
    return jsonError('A database error occurred.', 500);
  }
}
