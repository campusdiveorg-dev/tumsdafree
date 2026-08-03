export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { uploadSignature } from '@/lib/cloudinary';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json().catch(() => ({}));
    const folder = body.folder || 'tumsda';
    const publicId = body.public_id || undefined;

    const paramsToSign: Record<string, any> = { folder };
    if (publicId) {
      paramsToSign.public_id = publicId;
    }

    const signatureData = uploadSignature(paramsToSign);

    return jsonOk({
      ...signatureData,
      folder,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error('[Cloudinary sign error]', err);
    return jsonError('Failed to generate upload signature.', 500);
  }
}
