import { and, asc, desc, eq, ilike, inArray, sql } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { getDb } from './client'
import {
  vendors,
  menuCategories,
  menuItems,
  orders,
  orderItems,
} from './schema'
import type {
  Vendor,
  MenuCategory,
  MenuItem,
  OrderWithItems,
} from '../types'

const escapeLike = (s: string) => s.replace(/[\\%_]/g, '\\$&')

/* ============================================================
   VENDOR READS (customer browsing — no auth required)
   ============================================================ */

export async function getVendors({
  cuisine,
  q,
}: { cuisine?: string; q?: string } = {}): Promise<Vendor[]> {
  const db = getDb()
  const filters = [eq(vendors.isActive, true)]

  if (cuisine) {
    filters.push(sql`${cuisine} = ANY(${vendors.cuisines})`)
  }
  if (q?.trim()) {
    filters.push(ilike(vendors.name, `%${escapeLike(q.trim())}%`))
  }

  return db
    .select()
    .from(vendors)
    .where(and(...filters))
    .orderBy(asc(vendors.name))
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const db = getDb()
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.slug, slug))
    .limit(1)

  return vendor ?? null
}

export async function getMenu(
  vendorId: string
): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const db = getDb()
  const [categories, items] = await Promise.all([
    db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.vendorId, vendorId))
      .orderBy(asc(menuCategories.sortOrder)),
    db
      .select()
      .from(menuItems)
      .where(eq(menuItems.vendorId, vendorId))
      .orderBy(asc(menuItems.name)),
  ])

  return { categories, items }
}

/* ============================================================
   ORDER READS (auth required)
   ------------------------------------------------------------
   The DB stores createdAt/updatedAt as Date. The Order type
   expects ISO strings (serializable across server/client
   boundary). Convert at the query boundary.
   ============================================================ */

export async function getOrder(orderId: string): Promise<OrderWithItems | null> {
  const { userId } = await auth()
  if (!userId) return null

  const db = getDb()

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order) return null

  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.id, order.vendorId))
    .limit(1)

  if (!vendor) return null

  const isCustomer = order.customerId === userId
  const isVendorOwner = vendor.ownerClerkUserId === userId

  if (!isCustomer && !isVendorOwner) return null

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .orderBy(asc(orderItems.nameSnapshot))

  return {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items,
    vendor: {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      imageUrl: vendor.imageUrl,
    },
  }
}

export async function getMyOrders(): Promise<OrderWithItems[]> {
  const { userId } = await auth()
  if (!userId) return []

  const db = getDb()

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, userId))
    .orderBy(desc(orders.createdAt))

  if (rows.length === 0) return []

  const vendorIds = Array.from(new Set(rows.map((r) => r.vendorId)))
  const orderIds = rows.map((r) => r.id)

  const [vendorRows, itemRows] = await Promise.all([
    db.select().from(vendors).where(inArray(vendors.id, vendorIds)),
    db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds)),
  ])

  const vendorMap = new Map(vendorRows.map((v) => [v.id, v]))
  const itemsByOrder = new Map<string, typeof itemRows>()
  for (const item of itemRows) {
    const existing = itemsByOrder.get(item.orderId) ?? []
    existing.push(item)
    itemsByOrder.set(item.orderId, existing)
  }

  return rows.map((order) => {
    const vendor = vendorMap.get(order.vendorId)
    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: itemsByOrder.get(order.id) ?? [],
      vendor: vendor
        ? {
            id: vendor.id,
            name: vendor.name,
            slug: vendor.slug,
            imageUrl: vendor.imageUrl,
          }
        : {
            id: order.vendorId,
            name: 'Unknown vendor',
            slug: '',
            imageUrl: '',
          },
    }
  })
}