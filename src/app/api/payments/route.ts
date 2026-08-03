import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { payments, users } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin } from '@/lib/auth';
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
