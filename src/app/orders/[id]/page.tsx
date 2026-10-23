import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getOrder } from '@/db/queries'
import { formatNaira, formatRelativeTime } from '@/lib/format'
import { OrderTimeline } from '@/components/OrderTimeline'
import { OrderPoller } from '@/components/OrderPoller'
import { OrderStatusAnnouncer } from '@/components/OrderStatusAnnouncer'

export const dynamic = 'force-dynamic'

type OrderPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment?: string }>
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params
  const { payment } = await searchParams

  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const paymentMessages: Record<string, string> = {
    success: 'Payment successful. Your order has been placed.',
    failed: 'Payment was not completed. Try again when ready.',
    amount_mismatch: 'Payment amount did not match. Please contact support.',
    error: 'Something went wrong confirming your payment.',
  }

  const isPending = order.status === 'pending_payment'
  const isCancelled = order.status === 'cancelled'
  const showTimeline = !isPending && !isCancelled

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      <OrderPoller status={order.status} />
      <OrderStatusAnnouncer status={order.status} />

      <div className="mb-6">
        <Link
          href="/orders"
          className="text-sm text-ink-muted hover:text-ink transition-colors"
        >
          ← Back to orders
        </Link>
        <h1 className="font-heading text-3xl font-bold text-ink mt-2">
          Order details
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Placed {formatRelativeTime(order.createdAt)}
        </p>
      </div>

      {payment && paymentMessages[payment] && (
        <div
          className={`mb-6 p-4 rounded-panel border text-sm ${
            payment === 'success'
              ? 'bg-green/10 border-green/30 text-ink'
              : 'bg-chili/10 border-chili/30 text-ink'
          }`}
        >
          {paymentMessages[payment]}
        </div>
      )}

      {isPending && (
        <div className="mb-6 p-4 rounded-panel border bg-surface-alt border-border text-sm text-ink">
          This order is awaiting payment confirmation. If you just paid, it may take a moment to update.
        </div>
      )}

      {isCancelled && (
        <div className="mb-6 p-4 rounded-panel border bg-chili/10 border-chili/30 text-sm text-ink">
          This order was cancelled.
        </div>
      )}

      {showTimeline && (
        <div className="bg-surface rounded-panel border border-border p-5 sm:p-6 mb-6">
          <OrderTimeline currentStatus={order.status} />
        </div>
      )}

      <Link
        href={`/vendors/${order.vendor.slug}`}
        className="flex items-center gap-4 bg-surface rounded-panel border border-border p-4 mb-6 hover:border-pink-soft transition-colors"
      >
        <div className="relative w-14 h-14 rounded-card overflow-hidden bg-surface-alt shrink-0">
          {order.vendor.imageUrl ? (
            <Image
              src={order.vendor.imageUrl}
              alt={order.vendor.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            From
          </p>
          <p className="font-heading font-bold text-ink truncate">
            {order.vendor.name}
          </p>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink-muted shrink-0"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>

      <div className="bg-surface rounded-panel border border-border p-5 sm:p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-ink mb-4">
          Items
        </h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between gap-3 text-sm border-b border-border last:border-b-0 pb-3 last:pb-0"
            >
              <span className="text-ink">
                {item.quantity}× {item.nameSnapshot}
              </span>
              <span className="price text-ink whitespace-nowrap">
                {formatNaira(item.priceKoboSnapshot * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 border-t border-border space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Subtotal</span>
            <span className="price text-ink">{formatNaira(order.subtotalKobo)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Delivery</span>
            <span className="price text-ink">{formatNaira(order.deliveryFeeKobo)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-heading font-bold text-ink">Total</span>
            <span className="price font-heading font-bold text-ink">
              {formatNaira(order.totalKobo)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-panel border border-border p-5 sm:p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-ink mb-4">
          Delivery
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">Address</dt>
            <dd className="text-ink text-right">
              {order.deliveryStreet}, {order.deliveryArea}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">Phone</dt>
            <dd className="text-ink">{order.phone}</dd>
          </div>
        </dl>
      </div>

      <div className="text-xs text-ink-muted text-center">
        Reference: <span className="font-mono">{order.paystackReference}</span>
      </div>

    </main>
  )
}