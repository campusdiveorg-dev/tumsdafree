export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { uploaderUpload, deleteImage } from '@/lib/cloudinary';
import { db } from '@/lib/db';
import { leadership, missions, resources, departmentsMinistries } from '@/lib/schema';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin } from '@/lib/auth';
import { eq } from 'drizzle-orm';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const table = formData.get('table') as string | null;
    const entityIdStr = formData.get('id') as string | null;

    if (!file) {
      return jsonError('No file provided in request body.', 400);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return jsonError(`Invalid file type (${file.type}). Allowed: JPG, PNG, WEBP, GIF, SVG.`, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError(`File size exceeds maximum allowed 5MB limit.`, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const folderName = table ? `tumsda/${table}` : 'tumsda';

    const uploadResult = await uploaderUpload(buffer, {
      folder: folderName,
    });

    const publicId = uploadResult.public_id;
    const secureUrl = uploadResult.secure_url;

    // If table & entity ID are provided, update the corresponding DB row
    if (table && entityIdStr) {
      const entityId = parseInt(entityIdStr, 10);
      if (!isNaN(entityId)) {
        try {
          if (table === 'leadership') {
            await db
              .update(leadership)
              .set({ cloudinaryPublicId: publicId, cloudinarySecureUrl: secureUrl })
              .where(eq(leadership.id, entityId));
          } else if (table === 'missions') {
            await db
              .update(missions)
              .set({ cloudinaryPublicId: publicId, cloudinarySecureUrl: secureUrl })
              .where(eq(missions.id, entityId));
          } else if (table === 'resources') {
            await db
              .update(resources)
              .set({ cloudinaryPublicId: publicId, cloudinarySecureUrl: secureUrl })
              .where(eq(resources.id, entityId));
          } else if (table === 'departments' || table === 'ministries' || table === 'departments_ministries') {
            await db
              .update(departmentsMinistries)
              .set({ cloudinaryPublicId: publicId, cloudinarySecureUrl: secureUrl })
              .where(eq(departmentsMinistries.id, entityId));
          }
        } catch (dbErr: any) {
          console.error('[Cloudinary upload DB update failed, cleaning up image]', dbErr);
          await deleteImage(publicId).catch(() => {});
          return jsonError('Database update failed after Cloudinary upload.', 500);
        }
      }
    }

    return jsonOk({
      public_id: publicId,
      secure_url: secureUrl,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error('[Cloudinary upload error]', err);
    return jsonError('Image upload failed: ' + (err.message || 'Unknown error'), 500);
  }
}
