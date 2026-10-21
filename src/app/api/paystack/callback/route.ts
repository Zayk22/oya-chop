import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { orders } from '@/db/schema'
import { verifyPayment } from '@/lib/paystack'

/* ============================================================
   PAYSTACK CALLBACK — GET /api/paystack/callback
   ------------------------------------------------------------
   Paystack redirects the browser here after payment with
   ?reference=xxx. We verify with Paystack's API before marking
   the order as placed.

   Handles:
   - success (paid, correct amount) → order → 'placed'
   - failed / abandoned → order stays 'pending_payment'
   - already processed → no-op (idempotent)
   - amount mismatch → log, don't fulfill
   - unknown reference → 404

   Redirects the user to /orders/[id] at the end.
   ============================================================ */

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')

  if (!reference) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const db = getDb()

  /* Look up the order by Paystack reference. If not found, we
     have no idea what this payment is for. */
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.paystackReference, reference))
    .limit(1)

  if (!order) {
    console.error(`Paystack callback: unknown reference ${reference}`)
    return NextResponse.redirect(new URL('/', req.url))
  }

  /* Idempotent: if order is already past pending_payment, we've
     handled this. Don't re-verify. */
  if (order.status !== 'pending_payment') {
    return NextResponse.redirect(
      new URL(`/orders/${order.id}`, req.url)
    )
  }

  /* Verify with Paystack. This is the ONLY thing that proves
     the payment actually happened. */
  try {
    const verification = await verifyPayment(reference)

    if (verification.status !== 'success') {
      /* Payment was not successful — user abandoned, or failed.
         Order stays pending_payment. */
      console.warn(
        `Paystack verify returned non-success for ${reference}: ${verification.status}`
      )
      return NextResponse.redirect(
        new URL(`/orders/${order.id}?payment=failed`, req.url)
      )
    }

    /* Amount check: Paystack's amount (in kobo) must match the
       order total. Prevents underpaid orders from being fulfilled. */
    if (verification.amountKobo !== order.totalKobo) {
      console.error(
        `Paystack amount mismatch for ${reference}: paid ${verification.amountKobo}, expected ${order.totalKobo}`
      )
      return NextResponse.redirect(
        new URL(`/orders/${order.id}?payment=amount_mismatch`, req.url)
      )
    }

    /* All checks pass. Mark the order as placed. */
    await db
      .update(orders)
      .set({
        status: 'placed',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))

    return NextResponse.redirect(
      new URL(`/orders/${order.id}?payment=success`, req.url)
    )
  } catch (err) {
    console.error(`Paystack verify error for ${reference}:`, err)
    return NextResponse.redirect(
      new URL(`/orders/${order.id}?payment=error`, req.url)
    )
  }
}