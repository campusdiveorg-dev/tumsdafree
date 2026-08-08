import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var _dbPool: mysql.Pool | undefined;
}

function loadCaCert(): Buffer | undefined {
  const caPath = process.env.TIDB_CA_PATH || './certs/tidb-ca.pem';
  try {
    const resolved = path.resolve(process.cwd(), caPath);
    if (fs.existsSync(resolved)) {
      return fs.readFileSync(resolved);
    }
  } catch {
    console.warn('[db] Could not load CA cert from', caPath);
  }
  return undefined;
}

function createPool() {
  const rawConnectionString =
    process.env.TIDB_POOLED_URL || process.env.DATABASE_URL || 'mysql://root:@localhost:3306/tumsda';

  const isTidbSsl = process.env.TIDB_SSL === 'true' || rawConnectionString.includes('ssl=true');
  const cleanConnectionString = rawConnectionString.replace(/[\?&]ssl=true/i, '');
  const ca = isTidbSsl ? loadCaCert() : undefined;

  const pool = mysql.createPool({
    uri: cleanConnectionString,
    connectionLimit: 5,          // TiDB serverless has tight limits
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // send keepalive after 10s idle
    connectTimeout: 15000,        // give TiDB 15s to accept connection
    idleTimeout: 60000,           // recycle connections idle > 60s before TiDB drops them
    ssl: isTidbSsl ? { minVersion: 'TLSv1.2', rejectUnauthorized: true, ...(ca && { ca }) } : undefined,
  });

  // Swallow connection-level errors so the pool stays alive
  pool.on('connection', (conn) => {
    conn.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ECONNRESET') {
        console.warn('[db] Connection reset by server – will be replaced by pool.');
      }
    });
  });

  return pool;
}

const pool = global._dbPool || createPool();
if (process.env.NODE_ENV !== 'production') {
  global._dbPool = pool;
}

export const db = drizzle(pool, { schema, mode: 'default' });
export { pool };
