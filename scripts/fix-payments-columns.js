/**
 * fix-payments-columns.js
 * Checks the payments table for missing columns (payer_name, mpesa_receipt_number)
 * and adds them if they don't exist. Also prints a sample of recent payments
 * to diagnose why details aren't showing.
 */

const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '4GQzvZHyumP3g7X.root',
    password: '78OM7RBNTWaHLTw4',
    database: 'tumsda',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
    connectionLimit: 2,
  });

  console.log('=== Checking payments table columns ===');
  const [cols] = await pool.query(`SHOW COLUMNS FROM \`payments\``);
  console.table(cols.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Default: c.Default })));

  const colNames = cols.map(c => c.Field);

  if (!colNames.includes('payer_name')) {
    console.log('\n[!] payer_name column MISSING — adding it...');
    await pool.query(`ALTER TABLE \`payments\` ADD COLUMN \`payer_name\` VARCHAR(150) NULL AFTER \`user_id\``);
    console.log('[✓] payer_name column added.');
  } else {
    console.log('\n[✓] payer_name column already exists.');
  }

  if (!colNames.includes('mpesa_receipt_number')) {
    console.log('[!] mpesa_receipt_number column MISSING — adding it...');
    await pool.query(`ALTER TABLE \`payments\` ADD COLUMN \`mpesa_receipt_number\` VARCHAR(50) NULL`);
    console.log('[✓] mpesa_receipt_number column added.');
  } else {
    console.log('[✓] mpesa_receipt_number column already exists.');
  }

  console.log('\n=== Sample of last 5 payments ===');
  const [rows] = await pool.query(
    `SELECT id, phone_number, payer_name, mpesa_receipt_number, status, amount, purpose, created_at FROM \`payments\` ORDER BY id DESC LIMIT 5`
  );
  console.table(rows);

  await pool.end();
  console.log('\nDone!');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
