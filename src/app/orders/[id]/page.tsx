import { redirect } from 'next/navigation'
import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { orders } from '@/db/schema'

/* ============================================================
   ORDER PAGE — placeholder
   ------------------------------------------------------------
   Minimal order detail page. Shows status and payment result.
   Full tracking UI (timeline, items, etc.) comes in Phase 5.
   ============================================================ */

export const dynamic = 'force-dynamic'

type OrderPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment?: string }>
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params
  const { payment } = await searchParams

  const db = getDb()
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)

  if (!order) {
    redirect('/')
  }

  const paymentMessages: Record<string, string> = {
    success: 'Payment successful. Your order has been placed.',
    failed: 'Payment was not completed. Try again when ready.',
    amount_mismatch: 'Payment amount did not match. Please contact support.',
    error: 'Something went wrong confirming your payment.',
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">
        Order
      </h1>
      <p className="text-ink-muted mb-8">
        Reference: <span className="font-mono text-sm">{order.paystackReference}</span>
      </p>

      {payment && paymentMessages[payment] && (
        <div
          className={`mb-6 p-4 rounded-panel border ${
            payment === 'success'
              ? 'bg-green/10 border-green/30'
              : 'bg-chili/10 border-chili/30'
          }`}
        >
          <p className="text-sm text-ink">{paymentMessages[payment]}</p>
        </div>
      )}

      <div className="bg-surface rounded-panel border border-border p-6">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Status</dt>
            <dd className="font-medium text-ink capitalize">
              {order.status.replace('_', ' ')}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Total</dt>
            <dd className="price font-medium text-ink">
              ₦{(order.totalKobo / 100).toLocaleString('en-NG')}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Delivery</dt>
            <dd className="text-ink">
              {order.deliveryStreet}, {order.deliveryArea}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Phone</dt>
            <dd className="text-ink">{order.phone}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="text-sm text-chili hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
}