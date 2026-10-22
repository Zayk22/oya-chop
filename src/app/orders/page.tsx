import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { getMyOrders } from '@/db/queries'
import { EmptyState } from '@/components/EmptyState'
import { OrderHistoryRow } from '@/components/OrderHistoryRow'

/* ============================================================
   ORDERS HISTORY PAGE
   ------------------------------------------------------------
   Lists all orders placed by the signed-in customer, newest
   first. Redirects to /sign-in if not authenticated.
   ============================================================ */

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const { userId } = await auth()

  /* If not signed in, redirect to sign-in with a return path */
  if (!userId) {
    redirect('/sign-in')
  }

  const orders = await getMyOrders()

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Your orders
        </h1>
        <p className="text-ink-muted mt-1">
          Everything you&apos;ve ordered so far.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface rounded-panel border border-border">
          <EmptyState
            title="No orders yet"
            description="Oya, find something nice. Your first order will land here."
            action={{ label: 'Browse restaurants', href: '/' }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderHistoryRow key={order.id} order={order} />
          ))}
        </div>
      )}

    </main>
  )
}