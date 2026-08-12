const mysql = require('mysql2/promise');

async function main() {
  console.log('Connecting to TiDB Cloud database...');
  const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '4GQzvZHyumP3g7X.root',
    password: '78OM7RBNTWaHLTw4',
    database: 'tumsda',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
    connectionLimit: 2,
  });

  console.log('Updating sabbath_gallery table schema...');

  try {
    await pool.query(`ALTER TABLE \`sabbath_gallery\` MODIFY COLUMN \`image_url\` VARCHAR(1000) NULL`);
    console.log('image_url modified to NULLable: OK');
  } catch (e) {
    console.log('image_url modify note:', e.message);
  }

  try {
    await pool.query(`ALTER TABLE \`sabbath_gallery\` ADD COLUMN \`link_url\` VARCHAR(500) NULL`);
    console.log('link_url column added: OK');
  } catch (e) {
    console.log('link_url column note:', e.message);
  }

  try {
    await pool.query(`ALTER TABLE \`sabbath_gallery\` ADD COLUMN \`icon\` VARCHAR(50) NULL`);
    console.log('icon column added: OK');
  } catch (e) {
    console.log('icon column note:', e.message);
  }

  await pool.end();
  console.log('Migration complete!');
}

main().catch((e) => {
  console.error('Migration error:', e.message);
  process.exit(1);
});
