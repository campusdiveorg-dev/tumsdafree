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
    CREATE TABLE IF NOT EXISTS \`announcements\` (
      \`id\`         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`title\`      VARCHAR(150) NOT NULL,
      \`content\`    TEXT        NOT NULL,
      \`sort_order\` INT         NOT NULL DEFAULT 0,
      \`created_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('announcements table: OK');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`word_of_the_day\` (
      \`id\`         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`content\`    TEXT        NOT NULL,
      \`reference\`  VARCHAR(100) NOT NULL,
      \`created_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('word_of_the_day table: OK');

  await pool.end();
  console.log('Done!');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
