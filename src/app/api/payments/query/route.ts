import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { payments } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { eq } from 'drizzle-orm';

async function getMpesaAccessToken(): Promise<string | null> {
  const key = process.env.MPESA_CONSUMER_KEY || '';
  const secret = process.env.MPESA_CONSUMER_SECRET || '';
  const env = process.env.MPESA_ENV || 'sandbox';
  const base = env === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  try {
    const res = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.error('[M-Pesa Token Error]', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { checkoutRequestId } = body;

    if (!checkoutRequestId) {
      return jsonError('Missing checkoutRequestId parameter.', 422);
    }

    // First check local DB to see if callback already completed it
    const existing = await db
      .select({ id: payments.id, status: payments.status, receipt: payments.mpesaReceiptNumber })
      .from(payments)
      .where(eq(payments.checkoutRequestId, checkoutRequestId))
      .limit(1);

    if (existing[0] && existing[0].status === 'completed' && existing[0].receipt) {
      return jsonOk({
        status: 'completed',
        ResultCode: '0',
        ResultDesc: 'The service request is processed successfully.',
        receipt: existing[0].receipt,
      });
    }

    const token = await getMpesaAccessToken();
    if (!token) {
      return jsonError('Could not authenticate with M-Pesa.', 502);
    }

    const storeNumber = process.env.MPESA_STORE_NUMBER || process.env.MPESA_SHORTCODE || '1328552';
    const passkey = process.env.MPESA_PASSKEY || '';

    const now = new Date();
    const timestamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const password = Buffer.from(`${storeNumber}${passkey}${timestamp}`).toString('base64');

    const env = process.env.MPESA_ENV || 'sandbox';
    const baseUrl = env === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

    const queryRes = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: storeNumber,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
      cache: 'no-store',
    });

    const queryData = await queryRes.json().catch(() => ({}));

    // If Safaricom confirmed completed — also extract receipt number if present
    if (queryData.ResultCode === '0' && existing[0]) {
      // STK query response may include receipt in CallbackMetadata items or directly
      let receiptNumber: string | null = queryData.MpesaReceiptNumber || null;
      if (!receiptNumber && queryData.CallbackMetadata?.Item) {
        for (const item of queryData.CallbackMetadata.Item) {
          if (item.Name === 'MpesaReceiptNumber' && item.Value) {
            receiptNumber = String(item.Value);
            break;
          }
        }
      }

      await db
        .update(payments)
        .set({
          status: 'completed',
          ...(receiptNumber ? { mpesaReceiptNumber: receiptNumber } : {}),
          rawCallbackPayload: queryData,
          updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        })
        .where(eq(payments.id, existing[0].id));
    }

    return jsonOk(queryData);
  } catch (err: any) {
    console.error('[M-Pesa STK Query Error]', err);
    return jsonError('An unexpected error occurred while querying status.', 500);
  }
}
