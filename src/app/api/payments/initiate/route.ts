import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { payments } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { getSession } from '@/lib/session';

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
    let { phone, amount, purpose } = body;

    if (!phone || !amount || !purpose) {
      return jsonError('Missing required fields: phone, amount, purpose.', 422);
    }

    const cleanPhone = String(phone).replace(/\D/g, '');
    const numAmount = Math.round(Number(amount));

    const validPurposes = ['tithe', 'offering', 'mission_support', 'other'];
    if (!validPurposes.includes(purpose)) {
      return jsonError('Invalid purpose. Choose: tithe, offering, mission_support, other.', 422);
    }
    if (numAmount < 1) {
      return jsonError('Amount must be at least KES 1.', 422);
    }
    if (!/^254\d{9}$/.test(cleanPhone)) {
      return jsonError('Phone must be in format 254XXXXXXXXX (12 digits, starts with 254).', 422);
    }

    const session = await getSession();
    const userId = session.userId ? session.userId : null;

    const token = await getMpesaAccessToken();
    if (!token) {
      return jsonError('Could not connect to M-Pesa. Please try again.', 502);
    }

    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || '';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || '';

    const now = new Date();
    const timestamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    const formattedDesc = purpose.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: numAmount,
      PartyA: cleanPhone,
      PartyB: shortcode,
      PhoneNumber: cleanPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'TUMSDA',
      TransactionDesc: formattedDesc,
    };

    const env = process.env.MPESA_ENV || 'sandbox';
    const baseUrl = env === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(stkPayload),
      cache: 'no-store',
    });

    const stkData = await stkRes.json().catch(() => ({}));

    if (!stkData.CheckoutRequestID) {
      return jsonError(`STK Push request failed: ${stkData.errorMessage || 'unknown error'}`, 502);
    }

    await db.insert(payments).values({
      userId,
      phoneNumber: cleanPhone,
      amount: String(numAmount),
      purpose,
      status: 'pending',
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID || null,
    });

    return jsonOk({
      message: 'Check your phone for the M-Pesa payment prompt.',
      checkout_request_id: stkData.CheckoutRequestID,
    });
  } catch (err: any) {
    console.error('[STK Push Initiate Error]', err);
    return jsonError('An unexpected error occurred.', 500);
  }
}
