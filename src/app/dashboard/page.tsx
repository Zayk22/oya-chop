import { getVendorOrders } from '@/db/queries'
import { OrderHistoryRow } from '@/components/OrderHistoryRow'
import { EmptyState } from '@/components/EmptyState'

/* ============================================================
   DASHBOARD — Orders
   ------------------------------------------------------------
   Placeholder for Batch 6.4. Currently renders order history
   using the customer-side OrderHistoryRow component. Batch 6.4
   replaces this with the proper vendor-specific UI (accept,
   prepare, ready, deliver buttons).
   ============================================================ */

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const orders = await getVendorOrders()

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Incoming orders
        </h1>
        <p className="text-ink-muted mt-1">
          Orders for your vendor, newest first.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface rounded-panel border border-border">
          <EmptyState
            title="No orders yet"
            description="When customers place orders, they'll show up here."
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