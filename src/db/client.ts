import { neon, Pool } from '@neondatabase/serverless'
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http'
import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless'

/* ============================================================
   DATABASE CLIENTS
   ------------------------------------------------------------
   Two clients, two purposes:

   1. `db` — HTTP driver. Fast for reads. Used by getVendors,
      getVendorBySlug, getMenu. No transactions supported.

   2. `dbTx` — WebSocket driver. Slower per-query but supports
      interactive transactions (BEGIN/COMMIT/ROLLBACK). Used
      ONLY when we need multiple statements to succeed or fail
      together — like creating an order + its items.

   Same DATABASE_URL, different drivers.
   ============================================================ */

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Check your .env.local file.')
}

/* Reads — HTTP (fast, stateless) */
const sql = neon(databaseUrl)
export const db = drizzleHttp(sql)

/* Writes with transactions — WebSocket (stateful) */
const pool = new Pool({ connectionString: databaseUrl })
export const dbTx = drizzleWs(pool)