import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { jsonOk, jsonError } from '@/lib/response';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const results: string[] = [];

    // Create announcements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`announcements\` (
        \`id\`         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`title\`      VARCHAR(150) NOT NULL,
        \`content\`    TEXT        NOT NULL,
        \`sort_order\` INT         NOT NULL DEFAULT 0,
        \`created_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    results.push('announcements: OK');

    // Create word_of_the_day table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`word_of_the_day\` (
        \`id\`         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`content\`    TEXT        NOT NULL,
        \`reference\`  VARCHAR(100) NOT NULL,
        \`created_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    results.push('word_of_the_day: OK');

    // Update sabbath_gallery columns
    try {
      await pool.query(`ALTER TABLE \`sabbath_gallery\` MODIFY COLUMN \`image_url\` VARCHAR(1000) NULL`);
      await pool.query(`ALTER TABLE \`sabbath_gallery\` ADD COLUMN \`link_url\` VARCHAR(500) NULL`);
      await pool.query(`ALTER TABLE \`sabbath_gallery\` ADD COLUMN \`icon\` VARCHAR(50) NULL`);
      results.push('sabbath_gallery schema update: OK');
    } catch (e: any) {
      results.push('sabbath_gallery schema note: ' + e.message);
    }

    return jsonOk({ message: 'Tables initialised & migrated', results });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Unauthorized', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Forbidden', 403);
    console.error('[init-tables error]', err);
    return jsonError('Init failed: ' + err.message, 500);
  }
}
