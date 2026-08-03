/**
  Asset Migration Script: Local assets -> Cloudinary
  Scans database rows for local file paths, uploads existing image files
  to Cloudinary, and updates DB rows with Cloudinary public_id & secure_url.

  Usage:
    npx tsx scripts/migrate-assets-to-cloudinary.ts [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import mysql from 'mysql2/promise';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const text = fs.readFileSync(envPath, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).replace(/^["']|["']$/g, '').trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const isDryRun = process.argv.includes('--dry-run');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function runMigration() {
  console.log('====================================================');
  console.log(` Starting Asset Migration to Cloudinary ${isDryRun ? '[DRY RUN MODE]' : ''}`);
  console.log('====================================================\n');

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: CLOUDINARY_CLOUD_NAME or CLOUDINARY_API_SECRET is missing from environment.');
    if (!isDryRun) process.exit(1);
  }

  const rawUrl = process.env.TIDB_POOLED_URL || process.env.DATABASE_URL || 'mysql://root:@localhost:3306/tumsda';
  const cleanUrl = rawUrl.replace(/[\?&]ssl=true/i, '');

  const caPath = process.env.TIDB_CA_PATH || './certs/tidb-ca.pem';
  const resolvedCa = path.resolve(process.cwd(), caPath);
  let ca: Buffer | undefined;
  if (fs.existsSync(resolvedCa)) {
    ca = fs.readFileSync(resolvedCa);
  }

  const pool = mysql.createPool({
    uri: cleanUrl,
    ssl: process.env.TIDB_SSL === 'true' || rawUrl.includes('ssl=true') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true, ...(ca && { ca }) } : undefined,
    enableKeepAlive: true,
  });

  const summary = {
    scanned: 0,
    foundLocal: 0,
    migrated: 0,
    skippedAlreadyUploaded: 0,
    missingLocalFiles: 0,
  };

  // 1. Leadership
  console.log('📌 Processing Leadership photos...');
  const [leaders]: any = await pool.query('SELECT id, name, photo_path, cloudinary_public_id, cloudinary_secure_url FROM leadership;');
  for (const leader of leaders) {
    summary.scanned++;
    if (leader.cloudinary_secure_url) {
      summary.skippedAlreadyUploaded++;
      continue;
    }
    if (!leader.photo_path) continue;

    const localPath = resolveLocalFile(leader.photo_path);
    if (localPath) {
      summary.foundLocal++;
      console.log(`  [Leadership ${leader.id}] Found local image: ${leader.photo_path}`);
      if (!isDryRun) {
        try {
          const res = await cloudinary.uploader.upload(localPath, { folder: 'tumsda/leadership' });
          await pool.query(
            'UPDATE leadership SET cloudinary_public_id = ?, cloudinary_secure_url = ? WHERE id = ?;',
            [res.public_id, res.secure_url, leader.id]
          );
          console.log(`   ✅ Migrated to: ${res.secure_url}`);
          summary.migrated++;
        } catch (e: any) {
          console.error(`   ❌ Failed to upload for Leadership ${leader.id}:`, e.message);
        }
      }
    } else {
      summary.missingLocalFiles++;
      console.log(`  ⚠️ [Leadership ${leader.id}] Local file not found: ${leader.photo_path}`);
    }
  }

  // 2. Resources
  console.log('\n📌 Processing Resource icons...');
  const [resList]: any = await pool.query('SELECT id, title, icon_path, cloudinary_public_id, cloudinary_secure_url FROM resources;');
  for (const item of resList) {
    summary.scanned++;
    if (item.cloudinary_secure_url) {
      summary.skippedAlreadyUploaded++;
      continue;
    }
    if (!item.icon_path) continue;

    const localPath = resolveLocalFile(item.icon_path);
    if (localPath) {
      summary.foundLocal++;
      console.log(`  [Resource ${item.id}] Found local icon: ${item.icon_path}`);
      if (!isDryRun) {
        try {
          const res = await cloudinary.uploader.upload(localPath, { folder: 'tumsda/resources' });
          await pool.query(
            'UPDATE resources SET cloudinary_public_id = ?, cloudinary_secure_url = ? WHERE id = ?;',
            [res.public_id, res.secure_url, item.id]
          );
          console.log(`   ✅ Migrated to: ${res.secure_url}`);
          summary.migrated++;
        } catch (e: any) {
          console.error(`   ❌ Failed to upload for Resource ${item.id}:`, e.message);
        }
      }
    } else {
      summary.missingLocalFiles++;
      console.log(`  ⚠️ [Resource ${item.id}] Local file not found: ${item.icon_path}`);
    }
  }

  console.log('\n====================================================');
  console.log(' Migration Summary');
  console.log('====================================================');
  console.log(` Total DB rows scanned         : ${summary.scanned}`);
  console.log(` Already on Cloudinary         : ${summary.skippedAlreadyUploaded}`);
  console.log(` Local image files found       : ${summary.foundLocal}`);
  console.log(` Missing local files           : ${summary.missingLocalFiles}`);
  console.log(` Total Migrated to Cloudinary  : ${isDryRun ? 0 : summary.migrated} ${isDryRun ? '(Dry Run)' : ''}`);
  console.log('====================================================\n');

  await pool.end();
}

function resolveLocalFile(relPath: string): string | null {
  const clean = relPath.replace(/^\/?(public\/)?/, '');
  const candidate1 = path.resolve(process.cwd(), 'public', clean);
  if (fs.existsSync(candidate1)) return candidate1;

  const candidate2 = path.resolve(process.cwd(), 'public/assets/img', clean);
  if (fs.existsSync(candidate2)) return candidate2;

  const candidate3 = path.resolve(process.cwd(), clean);
  if (fs.existsSync(candidate3)) return candidate3;

  return null;
}

runMigration().catch((err) => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
