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
  let whereClause = '';
  if (table === 'departments' || table === 'ministries') {
    realTable = 'departments_ministries';
    const typeVal = table === 'departments' ? 'department' : 'ministry';
    whereClause = `WHERE \`type\` = '${typeVal}'`;
  }

  let orderBy = 'sort_order, id';
  if (table === 'events') orderBy = 'event_date';
  else if (table === 'sermons') orderBy = 'published_at DESC, id';
  else if (table === 'weekly_meetings') orderBy = 'sort_order, id';
  else if (table === 'word_of_the_day') orderBy = 'id DESC';
  else if (table === 'sabbath_gallery') orderBy = 'sort_order ASC, date_taken DESC, id DESC';

  return { realTable, whereClause, orderBy, fields: ALLOWED_TABLES[table] };
}

export async function GET(req: NextRequest, { params }: { params: { table: string } }) {
  try {
    const table = params.table;
    const config = getTableConfig(table);
    if (!config) {
      return jsonError(`Unknown resource: ${table}`, 404);
    }

    const queryStr = `SELECT * FROM \`${config.realTable}\` ${config.whereClause} ORDER BY ${config.orderBy}`;
    const [rows]: any = await pool.query(queryStr);

    return jsonOk(rows);
  } catch (err: any) {
    console.error(`[GET /api/${params.table} error]`, err);
    return jsonError('A database error occurred.', 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { table: string } }) {
  try {
    const actor = await requireAdmin();
    const table = params.table;
    const config = getTableConfig(table);
    if (!config) {
      return jsonError(`Unknown resource: ${table}`, 404);
    }

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

    if (table === 'departments' || table === 'ministries') {
      data.type = table === 'departments' ? 'department' : 'ministry';
    }

    const cols = Object.keys(data).map((c) => `\`${c}\``).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const insertSql = `INSERT INTO \`${config.realTable}\` (${cols}) VALUES (${placeholders})`;
    const [result]: any = await pool.query(insertSql, values);
    const newId = Number(result.insertId);

    await auditLog(actor.id, 'create', table, newId);

    const getQuery = `SELECT * FROM \`${config.realTable}\` WHERE id = ? LIMIT 1`;
    const [newRows]: any = await pool.query(getQuery, [newId]);

    return jsonOk(newRows[0] || { id: newId, ...data }, 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized — please log in.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden — admin access required.', 403);
    console.error(`[POST /api/${params.table} error]`, err);
    return jsonError('A database error occurred.', 500);
  }
}
