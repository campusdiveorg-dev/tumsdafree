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

  await pool.query('DELETE FROM leadership');
  await pool.query(`
    INSERT INTO leadership (name, position, photo_path, statement, sort_order) VALUES
    ('Elder Cephas Mukaria',  'Chairperson, 1st Elder',                              'assets/img/Cephas.jpg',          'This is a faithful saying that in TUMSDA, hearts are transformed, edified, and lives forever changed by Christ\\'s radiant light.',  1),
    ('Elder Gibson Kiprono',  'Assistant Chairperson, Personal Ministries, 2nd Elder','assets/img/jpg/Gibson.jpg',      'Just as Jesus\\'s gentle arms, TUMSDA is a sweet haven of rest!',                                                                   2),
    ('Elder Daniel Muchoge',  'Assistant Chairperson, Planning, 3rd Elder',           'assets/img/jpg/Daniel.jpg',      'TUMSDA, a home of watchmen and light bearers!',                                                                                    3)
  `);
  console.log('Seeded 3 leaders into TiDB');

  const [annCount] = await pool.query('SELECT COUNT(*) as c FROM announcements');
  if (annCount[0].c === 0) {
    await pool.query(`
      INSERT INTO announcements (title, content, sort_order) VALUES
      ('Weekly Meetings Invitation', 'All members are warmly invited to join our weekly meetings which take place at the church office during the scheduled times as provided in our weekly program.', 1),
      ('Lunch Hour Prayer', 'Join us for daily lunch hour prayer at the church office starting at 1:00 PM. This is a special time for corporate prayer, seeking God\\'s guidance, and intercession.', 2),
      ('Stewardship of Time', 'Members are encouraged to be good stewards of time by arriving punctually for services and meetings, respecting others\\' time, and using our time wisely for God\\'s glory.', 3),
      ('Brotherhood Among Members', 'Let brotherly love and unity prevail among all members. We encourage mutual support, encouragement, and care for one another as we grow together in faith.', 4)
    `);
    console.log('Seeded announcements');
  }

  const [wordCount] = await pool.query('SELECT COUNT(*) as c FROM word_of_the_day');
  if (wordCount[0].c === 0) {
    await pool.query(`
      INSERT INTO word_of_the_day (content, reference) VALUES
      ('My soul yearns for you in the night; in the morning my spirit longs for you. When your judgments come upon the earth, the people of the world learn righteousness.', 'Isaiah 26:9')
    `);
    console.log('Seeded word_of_the_day');
  }

  await pool.end();
  console.log('Done seeding data!');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
