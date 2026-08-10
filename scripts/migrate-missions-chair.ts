import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

async function migrate() {
  const { pool } = await import('../src/lib/db');
  console.log('Migrating missions table on TiDB Cloud to add Mission Chair columns...');
  try {
    const [existingCols]: any = await pool.query('SHOW COLUMNS FROM missions');
    const existingFieldNames = existingCols.map((c: any) => c.Field);
    console.log('Existing columns in missions:', existingFieldNames);

    const colsToAdd = [
      { name: 'chair_name', def: 'VARCHAR(150) NULL' },
      { name: 'chair_title', def: "VARCHAR(150) NULL DEFAULT 'Mission Chair'" },
      { name: 'chair_message', def: 'TEXT NULL' },
      { name: 'chair_cloudinary_public_id', def: 'VARCHAR(255) NULL' },
      { name: 'chair_cloudinary_secure_url', def: 'VARCHAR(500) NULL' },
    ];

    for (const col of colsToAdd) {
      if (!existingFieldNames.includes(col.name)) {
        const sql = `ALTER TABLE missions ADD COLUMN \`${col.name}\` ${col.def}`;
        await pool.query(sql);
        console.log(`Successfully added column: ${col.name}`);
      } else {
        console.log(`Column ${col.name} already exists.`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (err: any) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
