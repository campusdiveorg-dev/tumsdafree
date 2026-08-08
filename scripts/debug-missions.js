const mysql = require('mysql2/promise');
async function main() {
  const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com', port: 4000,
    user: '4GQzvZHyumP3g7X.root', password: '78OM7RBNTWaHLTw4', database: 'tumsda',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false }, connectionLimit: 2
  });
  console.log('=== missions columns ===');
  const [cols] = await pool.query('DESCRIBE missions');
  console.log(cols.map(c => c.Field).join(', '));

  console.log('\n=== missions data ===');
  const [rows] = await pool.query('SELECT * FROM missions LIMIT 5');
  console.log(JSON.stringify(rows, null, 2));

  await pool.end();
}
main().catch(e => console.error(e.message));
