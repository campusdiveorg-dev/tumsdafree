export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin } from '@/lib/auth';

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
    await requireAdmin();

    const token = await getMpesaAccessToken();
    if (!token) {
      return jsonError('Could not authenticate with M-Pesa API.', 502);
    }

    const shortcode = process.env.MPESA_SHORTCODE || '600987';
    const env = process.env.MPESA_ENV || 'sandbox';
    const baseUrl = env === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

    const origin = req.headers.get('origin') || req.headers.get('host') || 'https://tumsdafree.vercel.app';
    const domain = origin.startsWith('http') ? origin : `https://${origin}`;
    const callbackUrl = `${domain}/api/payments/c2b-callback`;

    const registerPayload = {
      ShortCode: shortcode,
      ResponseType: 'Completed',
      ConfirmationURL: callbackUrl,
      ValidationURL: callbackUrl,
    };

    const res = await fetch(`${baseUrl}/mpesa/c2b/v1/registerurl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(registerPayload),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (data.ResponseCode === '0' || data.ResponseDescription?.toLowerCase().includes('success')) {
      return jsonOk({
        message: 'Successfully registered M-Pesa C2B payment webhook!',
        details: data,
        callbackUrl,
      });
    }

    return jsonError(data.errorMessage || data.ResponseDescription || 'Failed to register C2B URLs with Safaricom.', 400);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error('[Register C2B Error]', err);
    return jsonError('An unexpected error occurred.', 500);
  }
}
