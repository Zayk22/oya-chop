import { and, asc, eq, ilike, sql } from 'drizzle-orm'
import { getDb } from './client'
import { vendors, menuCategories, menuItems } from './schema'
import type { Vendor, MenuCategory, MenuItem } from '../types'

// Escape LIKE wildcards so a search for "%" or "_" matches literally
const escapeLike = (s: string) => s.replace(/[\\%_]/g, '\\$&')

// All active vendors, optionally filtered by cuisine (exact) and name search
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

// One vendor by slug, or null
export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const db = getDb()
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.slug, slug))
    .limit(1)

  return vendor ?? null
}

// Categories (sorted by sortOrder) and items for one vendor
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