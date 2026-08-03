import { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';
import { jsonOk } from '@/lib/response';

export async function POST(req: NextRequest) {
  const session = await getSession();
  session.destroy();
  return jsonOk({ message: 'Logged out.' });
}
