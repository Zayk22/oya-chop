'use server'

import { and, eq } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { vendors, orders, menuItems } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import type { OrderStatus } from '@/types'

/* ============================================================
   VENDOR ACTIONS
   ------------------------------------------------------------
   Server Actions for the vendor dashboard. Every action
   checks:
     1. User is signed in
     2. User owns the vendor that owns the target entity
     3. The requested transition is valid (for status changes)
   ============================================================ */

/* Valid status transitions (vendor moves order forward only).
   pending_payment is handled by the Paystack callback, not the
   vendor. delivered and cancelled are terminal. */
const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  placed: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered', 'cancelled'],
}

/* ---------- Update order status ---------- */

export type UpdateOrderStatusResult =
  | { success: true }
  | { success: false; error: string }

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<UpdateOrderStatusResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: 'Not signed in.' }
  }

  const db = getDb()

  /* Ownership: does this user own any vendor? */
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.ownerClerkUserId, userId))
    .limit(1)

  if (!vendor) {
    return { success: false, error: 'You are not a vendor.' }
  }

  /* Load the order and verify it belongs to this vendor */
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.vendorId, vendor.id)))
    .limit(1)

  if (!order) {
    return { success: false, error: 'Order not found.' }
  }

  /* Validate the transition */
  const allowed = VALID_TRANSITIONS[order.status] ?? []
  if (!allowed.includes(newStatus)) {
    return {
      success: false,
      error: `Cannot move order from "${order.status}" to "${newStatus}".`,
    }
  }

  /* Apply */
  await db
    .update(orders)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(orders.id, orderId))

  return { success: true }
}

/* ---------- Toggle menu item availability ---------- */

export type ToggleItemResult =
  | { success: true; isAvailable: boolean }
  | { success: false; error: string }

export async function toggleMenuItemAvailability(
  itemId: string
): Promise<ToggleItemResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: 'Not signed in.' }
  }

  const db = getDb()

  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.ownerClerkUserId, userId))
    .limit(1)

  if (!vendor) {
    return { success: false, error: 'You are not a vendor.' }
  }

  /* Load item and verify ownership via vendorId */
  const [item] = await db
    .select()
    .from(menuItems)
    .where(and(eq(menuItems.id, itemId), eq(menuItems.vendorId, vendor.id)))
    .limit(1)

  if (!item) {
    return { success: false, error: 'Item not found.' }
  }

  const nextAvailable = !item.isAvailable

  await db
    .update(menuItems)
    .set({ isAvailable: nextAvailable })
    .where(eq(menuItems.id, itemId))

  return { success: true, isAvailable: nextAvailable }
}