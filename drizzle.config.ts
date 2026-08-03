import type { Config } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvLocal();

const connectionString = process.env.TIDB_POOLED_URL || process.env.DATABASE_URL || '';
const parsed = new URL(connectionString);

function getCaCert() {
  const caPath = process.env.TIDB_CA_PATH || './certs/tidb-ca.pem';
  const resolved = path.resolve(process.cwd(), caPath);
  if (fs.existsSync(resolved)) {
    return fs.readFileSync(resolved).toString();
  }
  return undefined;
}

const ca = getCaCert();

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: parsed.hostname,
    port: parseInt(parsed.port || '4000', 10),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    ssl: ca
      ? { ca, rejectUnauthorized: true }
      : { rejectUnauthorized: true },
  },
} satisfies Config;
