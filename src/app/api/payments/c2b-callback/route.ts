export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments } from '@/lib/schema';
import { eq } from 'drizzle-orm';

type PurposeType = 'tithe' | 'offering' | 'mission_support' | 'other';

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawPayload);
    } catch {
      body = {};
    }

    console.log('[M-Pesa C2B Notification Received]', body);

    const transId = body.TransID || body.transID || '';
    const transAmount = body.TransAmount || body.transAmount || '0';
    const msisdn = body.MSISDN || body.msisdn || '';
    const firstName = body.FirstName || body.firstName || '';
    const lastName = body.LastName || body.lastName || '';
    const rawPurpose = (body.BillRefNumber || body.billRefNumber || 'offering').toLowerCase().trim();

    let purpose: PurposeType = 'offering';
    if (rawPurpose.includes('tithe')) purpose = 'tithe';
    else if (rawPurpose.includes('mission')) purpose = 'mission_support';
    else if (rawPurpose.includes('offering')) purpose = 'offering';
    else purpose = 'other';

    if (transId) {
      // Check for duplicate receipt number
      const existing = await db
        .select({ id: payments.id })
        .from(payments)
        .where(eq(payments.mpesaReceiptNumber, transId))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(payments).values({
          phoneNumber: msisdn ? String(msisdn) : '000000000000',
          amount: String(transAmount),
          purpose,
          status: 'completed',
          mpesaReceiptNumber: transId,
          rawCallbackPayload: body,
        });
      }
    }

    // Safaricom expects a ResultCode of 0 to acknowledge receipt
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 });
  } catch (err) {
    console.error('[M-Pesa C2B Callback Error]', err);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'C2B Endpoint Active' }, { status: 200 });
}
