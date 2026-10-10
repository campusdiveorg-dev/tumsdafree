/**
 * inspect-payment.js
 * Inspects the raw_callback_payload for recent payments to diagnose
 * why mpesa_receipt_number and payer_name are null.
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

  const [rows] = await pool.query(
    `SELECT id, payer_name, mpesa_receipt_number, status, amount, checkout_request_id, raw_callback_payload 
     FROM \`payments\` ORDER BY id DESC LIMIT 5`
  );

  for (const row of rows) {
    console.log(`\n=== Payment #${row.id} | status: ${row.status} | KES ${row.amount} ===`);
    console.log('  payer_name          :', row.payer_name);
    console.log('  mpesa_receipt_number:', row.mpesa_receipt_number);
    console.log('  checkout_request_id :', row.checkout_request_id);
    if (row.raw_callback_payload) {
      let payload = row.raw_callback_payload;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch {}
      }
      console.log('  raw_callback_payload:', JSON.stringify(payload, null, 4));
    } else {
      console.log('  raw_callback_payload: (empty)');
    }
  }

  await pool.end();
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
