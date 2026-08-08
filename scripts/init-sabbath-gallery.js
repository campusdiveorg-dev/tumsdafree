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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`sabbath_gallery\` (
      \`id\`          INT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`title\`       VARCHAR(150)  NULL,
      \`image_url\`   VARCHAR(1000) NOT NULL,
      \`date_taken\`  DATE          NULL,
      \`sort_order\`  INT           NOT NULL DEFAULT 0,
      \`created_at\`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('sabbath_gallery table: OK');
  await pool.end();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
