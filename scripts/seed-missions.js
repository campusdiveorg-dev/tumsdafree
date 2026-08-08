const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com', port: 4000,
    user: '4GQzvZHyumP3g7X.root', password: '78OM7RBNTWaHLTw4', database: 'tumsda',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false }, connectionLimit: 2
  });

  // Check if missions already has data
  const [existing] = await pool.query('SELECT COUNT(*) as c FROM missions');
  if (existing[0].c > 0) {
    console.log('Missions already has data — skipping seed.');
    await pool.end();
    return;
  }

  await pool.query(`
    INSERT INTO missions (title, theme_text, theme_verse, theme_song, start_date, end_date, description, is_upcoming, sort_order)
    VALUES
    ('Challa Mission 2025', 'Reaching the Unreached', 'Matthew 28:19-20', 'To God Be the Glory', '2025-08-14', '2025-08-24',
     'Our upcoming mission to Challa will focus on community outreach, medical ministry, Bible studies, and public evangelism. Every member is invited to participate — physically, financially, or through prayer.', 1, 1),
    ('Rabai Mission 2024', 'Go Ye Therefore', 'Mark 16:15', 'Send Me Lord', '2024-08-08', '2024-08-18',
     'A successful mission to Rabai that saw over 50 baptisms, free medical camp serving 300+ people, and lasting community connections established.', 0, 2),
    ('Mariakani Mission 2023', 'Light to the Nations', 'Isaiah 60:1', 'Shine Jesus Shine', '2023-07-20', '2023-07-30',
     'A powerful week of evangelism in Mariakani resulting in 38 souls baptized and several Bible study groups established.', 0, 3)
  `);

  console.log('Seeded 3 missions successfully!');
  await pool.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
