import { getVendorOrders } from '@/db/queries'
import { VendorOrderCard } from '@/components/VendorOrderCard'
import { EmptyState } from '@/components/EmptyState'

/* ============================================================
   DASHBOARD — Orders
   ------------------------------------------------------------
   Lists the vendor's orders with action buttons per status.
   ============================================================ */

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const orders = await getVendorOrders()

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Incoming orders
        </h1>
        <p className="text-ink-muted mt-1">
          {orders.length === 0
            ? 'Orders will appear here as they come in.'
            : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} total.`}
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
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <VendorOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  )
}