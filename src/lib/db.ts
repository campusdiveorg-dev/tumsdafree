import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

declare global {
  // eslint-disable-next-allow-var
  var _dbPool: mysql.Pool | undefined;
}

function createPool() {
  const connectionString =
    process.env.TIDB_POOLED_URL || process.env.DATABASE_URL || 'mysql://root:@localhost:3306/tumsda';

  const isTidbSsl = process.env.TIDB_SSL === 'true' || connectionString.includes('ssl=true');

  const pool = mysql.createPool({
    uri: connectionString,
    connectionLimit: 2, // Vercel per-invocation pool sizing
    waitForConnections: true,
    queueLimit: 0,
    ssl: isTidbSsl ? { rejectUnauthorized: true } : undefined,
  });

  return pool;
}

const pool = global._dbPool || createPool();
if (process.env.NODE_ENV !== 'production') {
  global._dbPool = pool;
}

export const db = drizzle(pool, { schema, mode: 'default' });
export { pool };
