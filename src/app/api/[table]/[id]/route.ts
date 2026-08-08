export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin, auditLog } from '@/lib/auth';

const ALLOWED_TABLES: Record<string, string[]> = {
  departments: ['name', 'description', 'scripture_quote', 'scripture_reference', 'external_link', 'sort_order', 'cloudinary_public_id', 'cloudinary_secure_url'],
  ministries: ['name', 'description', 'scripture_quote', 'scripture_reference', 'sort_order', 'cloudinary_public_id', 'cloudinary_secure_url'],
  leadership: ['name', 'position', 'photo_path', 'statement', 'sort_order', 'cloudinary_public_id', 'cloudinary_secure_url'],
  sermons: ['title', 'youtube_url', 'description', 'is_featured', 'published_at'],
  events: ['title', 'event_date', 'facilitator', 'description'],
  weekly_meetings: ['day_of_week', 'time_range', 'program_name', 'sort_order'],
  resources: ['title', 'description', 'icon_path', 'link_url', 'category', 'sort_order', 'cloudinary_public_id', 'cloudinary_secure_url'],
  missions: ['title', 'theme_text', 'theme_verse', 'theme_song', 'start_date', 'end_date', 'description', 'is_upcoming', 'sort_order', 'cloudinary_public_id', 'cloudinary_secure_url'],
  announcements: ['title', 'content', 'sort_order'],
  word_of_the_day: ['content', 'reference'],
  sabbath_gallery: ['title', 'image_url', 'date_taken', 'sort_order'],
};


function getTableConfig(table: string) {
  if (!ALLOWED_TABLES[table]) return null;

  let realTable = table;
  if (table === 'departments' || table === 'ministries') {
    realTable = 'departments_ministries';
  }

  return { realTable, fields: ALLOWED_TABLES[table] };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  try {
    const { table, id } = params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return jsonError('Invalid ID', 400);

    const config = getTableConfig(table);
    if (!config) return jsonError(`Unknown resource: ${table}`, 404);

    const [rows]: any = await pool.query(
      `SELECT * FROM \`${config.realTable}\` WHERE id = ? LIMIT 1`,
      [numId]
    );

    if (!rows || rows.length === 0) {
      return jsonError(`${table} item not found.`, 404);
    }

    return jsonOk(rows[0]);
  } catch (err: any) {
    console.error(`[GET /api/${params.table}/${params.id} error]`, err);
    return jsonError('A database error occurred.', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  try {
    const actor = await requireAdmin();
    const { table, id } = params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return jsonError('Invalid ID', 400);

    const config = getTableConfig(table);
    if (!config) return jsonError(`Unknown resource: ${table}`, 404);

    const body = await req.json().catch(() => ({}));
    const data: Record<string, any> = {};

    for (const field of config.fields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        data[field] = body[field] === '' ? null : body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return jsonError('No valid fields provided.', 422);
    }

    const setClauses = Object.keys(data)
      .map((c) => `\`${c}\` = ?`)
      .join(', ');
    const values = [...Object.values(data), numId];

    const [result]: any = await pool.query(
      `UPDATE \`${config.realTable}\` SET ${setClauses} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return jsonError(`${table} item not found.`, 404);
    }

    await auditLog(actor.id, 'update', table, numId);

    const [rows]: any = await pool.query(
      `SELECT * FROM \`${config.realTable}\` WHERE id = ? LIMIT 1`,
      [numId]
    );

    return jsonOk(rows[0]);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error(`[PUT /api/${params.table}/${params.id} error]`, err);
    return jsonError('A database error occurred.', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  try {
    const actor = await requireAdmin();
    const { table, id } = params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return jsonError('Invalid ID', 400);

    const config = getTableConfig(table);
    if (!config) return jsonError(`Unknown resource: ${table}`, 404);

    const [result]: any = await pool.query(
      `DELETE FROM \`${config.realTable}\` WHERE id = ?`,
      [numId]
    );

    if (result.affectedRows === 0) {
      return jsonError(`${table} item not found.`, 404);
    }

    await auditLog(actor.id, 'delete', table, numId);

    return jsonOk({ message: `Deleted ${table} #${numId}.` });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error(`[DELETE /api/${params.table}/${params.id} error]`, err);
    return jsonError('A database error occurred.', 500);
  }
}
