import { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';
import { jsonOk } from '@/lib/response';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const session = await getSession();
  let csrfToken = (session as any).csrfToken;
  if (!csrfToken) {
    csrfToken = crypto.randomBytes(32).toString('hex');
    (session as any).csrfToken = csrfToken;
    await session.save();
  }
  return jsonOk({ csrf_token: csrfToken });
}
