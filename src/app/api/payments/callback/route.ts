import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Explicitly run on Node.js runtime per Vercel directive
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.text();
    let data: any = {};
    try {
      data = JSON.parse(rawPayload);
    } catch {
      data = {};
    }

    const stkCallback = data?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 });
    }

    const checkoutId = stkCallback.CheckoutRequestID || '';
    const resultCode = Number(stkCallback.ResultCode ?? -1);

    const paymentRows = await db
      .select({ id: payments.id, status: payments.status })
      .from(payments)
      .where(eq(payments.checkoutRequestId, checkoutId))
      .limit(1);

    const payment = paymentRows[0];

    // Reject callbacks for unknown or already-processed transactions
    if (!payment || payment.status !== 'pending') {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 });
    }

    let status: 'completed' | 'cancelled' | 'failed' = 'failed';
    if (resultCode === 0) {
      status = 'completed';
    } else if (resultCode === 1032) {
      status = 'cancelled';
    }

    let receipt: string | null = null;
    if (resultCode === 0 && stkCallback.CallbackMetadata?.Item) {
      const items: any[] = stkCallback.CallbackMetadata.Item;
      for (const item of items) {
        if (item.Name === 'MpesaReceiptNumber') {
          receipt = item.Value ? String(item.Value) : null;
        }
      }
    }

    await db
      .update(payments)
      .set({
        status,
        mpesaReceiptNumber: receipt,
        rawCallbackPayload: data,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      })
      .where(eq(payments.id, payment.id));

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 });
  } catch (err) {
    console.error('[M-Pesa Callback Error]', err);
    // Always return 200 to Safaricom to acknowledge receipt
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 });
  }
}
