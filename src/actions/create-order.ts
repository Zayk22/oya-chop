'use server'

import { and, eq, inArray } from 'drizzle-orm'
import { getDb, getDbTx } from '@/db/client'
import { vendors, menuItems, orders, orderItems } from '@/db/schema'
import { createOrderSchema, type CreateOrderInput } from '@/lib/validation'
import { initializePayment } from '@/lib/paystack'
import { auth } from '@clerk/nextjs/server'
import { randomUUID } from 'crypto'

/* ============================================================
   CREATE ORDER — Server Action
   ------------------------------------------------------------
   1. Authenticate (Clerk)
   2. Validate input (Zod)
   3. Load vendor (must exist, active)
   4. Load menu items (real prices from DB)
   5. Verify ownership + availability
   6. Recalculate totals server-side
   7. Insert order + items in a transaction
   8. Initialize Paystack transaction
   9. Return authorization URL
   ============================================================ */

export type CreateOrderResult =
  | { success: true; authorizationUrl: string; orderId: string }
  | { success: false; error: string }

export async function createOrder(
  rawInput: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    /* ---- 1. Auth ---- */
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return { success: false, error: 'You must be signed in to place an order.' }
    }

    const email =
      (sessionClaims?.email as string | undefined) ??
      undefined

    if (!email) {
      return {
        success: false,
        error: 'Your account has no email address. Please update it in your account settings.',
      }
    }

    /* ---- 2. Validate ---- */
    const parsed = createOrderSchema.safeParse(rawInput)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid input.'
      return { success: false, error: firstError }
    }
    const input = parsed.data

    const db = getDb()

    /* ---- 3. Vendor lookup ---- */
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(and(eq(vendors.id, input.vendorId), eq(vendors.isActive, true)))
      .limit(1)

    if (!vendor) {
      return { success: false, error: 'Vendor not found or unavailable.' }
    }

    /* ---- 4. Menu items lookup ---- */
    const itemIds = input.lines.map((l) => l.menuItemId)
    const dbItems = await db
      .select()
      .from(menuItems)
      .where(inArray(menuItems.id, itemIds))

    if (dbItems.length !== itemIds.length) {
      return {
        success: false,
        error: 'Some items in your cart are no longer available.',
      }
    }

    /* ---- 5. Verify ownership + availability ---- */
    const itemMap = new Map(dbItems.map((i) => [i.id, i]))

    for (const line of input.lines) {
      const item = itemMap.get(line.menuItemId)
      if (!item) {
        return { success: false, error: 'Item not found.' }
      }
      if (item.vendorId !== vendor.id) {
        return {
          success: false,
          error: 'Your cart has items from multiple vendors. Please start over.',
        }
      }
      if (!item.isAvailable) {
        return {
          success: false,
          error: `"${item.name}" is sold out. Please remove it and try again.`,
        }
      }
    }

    /* ---- 6. Recalculate totals server-side ---- */
    let subtotalKobo = 0
    const orderItemRows = input.lines.map((line) => {
      const item = itemMap.get(line.menuItemId)!
      const lineTotal = item.priceKobo * line.quantity
      subtotalKobo += lineTotal

      return {
        menuItemId: item.id,
        nameSnapshot: item.name,
        priceKoboSnapshot: item.priceKobo,
        quantity: line.quantity,
      }
    })

    const totalKobo = subtotalKobo + vendor.deliveryFeeKobo
    const paystackReference = `oya_${randomUUID()}`

    /* ---- 7. Insert in a transaction ---- */
    const dbTx = getDbTx()
    const order = await dbTx.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values({
          customerId: userId,
          vendorId: vendor.id,
          status: 'pending_payment',
          subtotalKobo,
          deliveryFeeKobo: vendor.deliveryFeeKobo,
          totalKobo,
          deliveryArea: input.deliveryArea,
          deliveryStreet: input.deliveryStreet,
          phone: input.phone,
          paystackReference,
        })
        .returning()

      await tx.insert(orderItems).values(
        orderItemRows.map((row) => ({
          ...row,
          orderId: newOrder.id,
        }))
      )

      return newOrder
    })

    /* ---- 8. Initialize Paystack ---- */
    const paystack = await initializePayment({
      email,
      amountKobo: totalKobo,
      reference: paystackReference,
      callbackUrl: 'https://oya-chop.vercel.app/api/paystack/callback',
      metadata: {
        orderId: order.id,
        vendorId: vendor.id,
        customerId: userId,
      },
    })

    /* ---- 9. Return redirect URL ---- */
    return {
      success: true,
      authorizationUrl: paystack.authorizationUrl,
      orderId: order.id,
    }
  } catch (err) {
    console.error('createOrder error:', err)
    const message =
      err instanceof Error ? err.message : 'Something went wrong. Please try again.'
    return { success: false, error: message }
  }
}