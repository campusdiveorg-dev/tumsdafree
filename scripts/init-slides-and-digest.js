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

  console.log('Creating hero_slides table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`hero_slides\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`title\` VARCHAR(200) NOT NULL,
      \`subtitle\` TEXT NULL,
      \`image_url\` VARCHAR(1000) NOT NULL,
      \`button_text\` VARCHAR(100) NULL,
      \`button_link\` VARCHAR(500) NULL,
      \`page\` VARCHAR(100) NOT NULL DEFAULT 'home',
      \`sort_order\` INT NOT NULL DEFAULT 0,
      \`is_active\` TINYINT NOT NULL DEFAULT 1,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('hero_slides table: OK');

  console.log('Creating tumsda_digest table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`tumsda_digest\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`title\` VARCHAR(200) NOT NULL DEFAULT 'TUMSDA Digest',
      \`edition\` VARCHAR(150) NULL,
      \`description\` TEXT NULL,
      \`cover_image_url\` VARCHAR(1000) NULL,
      \`file_url\` VARCHAR(1000) NOT NULL,
      \`file_name\` VARCHAR(255) NULL,
      \`is_active\` TINYINT NOT NULL DEFAULT 1,
      \`sort_order\` INT NOT NULL DEFAULT 0,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('tumsda_digest table: OK');

  // Check if hero_slides has rows; if empty, seed the existing homepage slides so site keeps working flawlessly!
  const [existingSlides] = await pool.query('SELECT COUNT(*) as cnt FROM hero_slides');
  if (existingSlides[0].cnt === 0) {
    console.log('Seeding default homepage slides...');
    const defaultSlides = [
      [
        'WELCOME TO TUMSDA',
        'The Church We Love The Most!',
        '/assets/img/Sabbath.png',
        'Welcome and Worship With Us',
        '#',
        'home',
        1,
        1,
      ],
      [
        'Listen to the Heavenly Music',
        'Experience sacred music with the TUMSDA Church Choir',
        '/assets/img/ChurchChoir.png',
        'Listen Now',
        'https://www.youtube.com/@tumsdachurchchoir',
        'home',
        2,
        1,
      ],
      [
        'Strong to Serve',
        'Fellowship and discipleship across all departments',
        '/assets/img/ALO.png',
        'Explore Departments',
        '/departments',
        'home',
        3,
        1,
      ],
      [
        'The Bible and the Bible Alone',
        'Guided by sacred Scripture and the Spirit of Prophecy',
        '/assets/img/jpg/church.jpeg',
        'Our Beliefs',
        '/about',
        'home',
        4,
        1,
      ],
      // Seed subpage hero backgrounds
      [
        'Sermons & Spiritual Resources',
        'Watch past messages on YouTube and download study materials',
        '/assets/img/jpg/Sermons.jpg',
        null,
        null,
        'sermons',
        1,
        1,
      ],
      [
        'Evangelism & Missions',
        'Carrying the everlasting gospel to every nation, kindred, and tongue',
        '/assets/img/jpg/Mission.jpg',
        null,
        null,
        'evangelism',
        1,
        1,
      ],
    ];

    for (const slide of defaultSlides) {
      await pool.query(
        'INSERT INTO hero_slides (title, subtitle, image_url, button_text, button_link, page, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        slide
      );
    }
    console.log('Default slides seeded: OK');
  }

  await pool.end();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Migration error:', err.message);
  process.exit(1);
});
