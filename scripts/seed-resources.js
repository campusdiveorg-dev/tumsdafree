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

  const [rows] = await pool.query('SELECT id, title, link_url, sort_order FROM resources ORDER BY sort_order, id');
  console.log('Existing resources:');
  console.table(rows);

  // Resources to ensure exist (identified by title)
  const toSeed = [
    { title: 'Sabbath School Lessons',    description: 'Weekly Bible study lessons and materials',                   icon_path: '/assets/SS.png',  link_url: 'https://absg.sspmadventist.org/en/2025-03/11/videos',                            category: 'Bible Study', sort_order: 1 },
    { title: 'Bible Study Guides',        description: 'Comprehensive Bible study resources',                         icon_path: '/assets/BS.jpeg', link_url: 'https://adventist.org/beliefs/bible/study',                                       category: 'Bible Study', sort_order: 2 },
    { title: 'Bible Study & Prayer',      description: 'Interactive Bible study and prayer resources',               icon_path: '/assets/PY.jpg',  link_url: 'https://sspmadventist.org/sabbathschool/alive/biblestudyandprayer',               category: 'Prayer',      sort_order: 3 },
    { title: 'Adventist Beliefs',         description: 'Official Adventist beliefs and doctrines',                   icon_path: '/assets/AB.png',  link_url: 'https://adventist.org/beliefs',                                                   category: 'Doctrine',    sort_order: 4 },
    { title: 'Music Philosophy',          description: 'Seventh-day Adventist philosophy of music and worship',      icon_path: '/assets/MP.png',  link_url: 'https://gc.adventist.org/guidelines/a-seventh-day-adventist-philosophy-of-music/', category: 'Music',       sort_order: 5 },
    { title: 'Young Adults',              description: 'Resources and studies for young adults',                     icon_path: '/assets/YA.jpg',  link_url: 'https://inverse.sspmadventist.org/',                                              category: 'Youth',       sort_order: 6 },
    { title: 'Adventist Pioneer Library', description: 'Historical writings and pioneer literature',                 icon_path: '/assets/AP.png',  link_url: 'https://m.egwwritings.org/en/folders/15',                                         category: 'History',     sort_order: 7 },
    { title: 'EGW Writings',              description: 'Complete collection of Ellen G. White writings',             icon_path: '/assets/EGW.png', link_url: 'https://m.egwwritings.org/en/folders/2',                                          category: 'EGW',         sort_order: 8 },
    { title: 'Adventist Archives',        description: 'Historical documents and research materials',                icon_path: '/assets/AA.jpeg', link_url: 'https://www.adventistarchives.org/',                                              category: 'History',     sort_order: 9 },
  ];

  const existingTitles = new Set(rows.map((r) => r.title));
  const missing = toSeed.filter((r) => !existingTitles.has(r.title));

  if (missing.length === 0) {
    console.log('\n✅  All 9 resources already present — nothing to insert.');
  } else {
    for (const r of missing) {
      await pool.query(
        'INSERT INTO resources (title, description, icon_path, link_url, category, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [r.title, r.description, r.icon_path, r.link_url, r.category, r.sort_order]
      );
      console.log(`  ➕  Inserted: ${r.title}`);
    }
    console.log(`\n✅  Inserted ${missing.length} missing resource(s).`);
  }

  await pool.end();
}

main().catch((e) => {
  console.error('❌  Failed:', e.message);
  process.exit(1);
});
