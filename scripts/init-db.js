const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let connStr = '';
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('TIDB_POOLED_URL=')) {
    connStr = trimmed.slice('TIDB_POOLED_URL='.length).trim().replace(/^['"]|['"]$/g, '');
  }
});

const cleanConnStr = connStr.replace(/[\?&]ssl=true/i, '');
const caPath = path.resolve('./certs/tidb-ca.pem');
const ca = fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined;

async function main() {
  const pool = mysql.createPool({
    uri: cleanConnStr,
    ssl: { rejectUnauthorized: true, ...(ca && { ca }) },
  });
  const [rows] = await pool.query('SHOW TABLES;');
  console.log('Tables in tumsda:', rows.map((r) => Object.values(r)[0]));
  await pool.end();
}

main().catch((err) => {
  console.error('DB test error:', err);
  process.exit(1);
});
