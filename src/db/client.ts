import { neon, Pool } from '@neondatabase/serverless'
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http'
import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless'

/* ============================================================
   DATABASE CLIENTS
   ------------------------------------------------------------
   Two clients, two purposes:

   1. `db`  — HTTP driver. Fast for reads. No transactions.
   2. `dbTx` — WebSocket driver. Supports transactions.

   Both are LAZY: the client is only created when you actually
   call a function, not at module load. This lets the build
   succeed on CI where DATABASE_URL isn't defined (builds
   don't need DB credentials; only runtime queries do).
   ============================================================ */

let _db: ReturnType<typeof drizzleHttp> | null = null
let _dbTx: ReturnType<typeof drizzleWs> | null = null

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Check your .env.local (or Vercel env vars).'
    )
  }
  return url
}

export function getDb() {
  if (!_db) {
    const sql = neon(getDatabaseUrl())
    _db = drizzleHttp(sql)
  }
  return _db
}

export function getDbTx() {
  if (!_dbTx) {
    const pool = new Pool({ connectionString: getDatabaseUrl() })
    _dbTx = drizzleWs(pool)
  }
  return _dbTx
}

/* Convenience proxies that behave like the old `db` and `dbTx`
   exports — calls like `db.select()...` still work because
   they delegate to the lazy getter on first access. */
export const db = new Proxy({} as ReturnType<typeof drizzleHttp>, {
  get(_target, prop) {
    const client = getDb()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export const dbTx = new Proxy({} as ReturnType<typeof drizzleWs>, {
  get(_target, prop) {
    const client = getDbTx()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})