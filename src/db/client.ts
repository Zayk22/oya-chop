import { neon, Pool } from '@neondatabase/serverless'
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http'
import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless'

/* ============================================================
   DATABASE CLIENTS
   ------------------------------------------------------------
   Lazy initialization. The real client is created on first
   call, not at module load. This lets the build succeed on CI
   without DATABASE_URL (builds don't need DB credentials,
   only runtime queries do).
   ============================================================ */

type HttpDb = ReturnType<typeof drizzleHttp>
type WsDb = ReturnType<typeof drizzleWs>

let _db: HttpDb | null = null
let _dbTx: WsDb | null = null

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Check your .env.local (or Vercel env vars).'
    )
  }
  return url
}

/**
 * HTTP-driver client. Use for reads.
 * Lazy: created on first call, cached for the process lifetime.
 */
export function getDb(): HttpDb {
  if (!_db) {
    const sql = neon(getDatabaseUrl())
    _db = drizzleHttp(sql)
  }
  return _db
}

/**
 * WebSocket-driver client. Use when you need transactions.
 * Lazy: created on first call, cached for the process lifetime.
 */
export function getDbTx(): WsDb {
  if (!_dbTx) {
    const pool = new Pool({ connectionString: getDatabaseUrl() })
    _dbTx = drizzleWs(pool)
  }
  return _dbTx
}