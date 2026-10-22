import Link from 'next/link'
import Image from 'next/image'
import { formatNaira, formatRelativeTime } from '@/lib/format'
import type { OrderWithItems, OrderStatus } from '@/types'

/* ============================================================
   ORDER HISTORY ROW
   ------------------------------------------------------------
   One order in the history list. Clickable — navigates to
   /orders/[id].

   Status badge colors:
   - pending_payment → muted
   - placed, accepted, preparing, ready → chili (in progress)
   - delivered → green (done)
   - cancelled → muted red
   ============================================================ */

type OrderHistoryRowProps = {
  order: OrderWithItems
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting payment',
  placed: 'Placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function statusBadgeClasses(status: OrderStatus): string {
  if (status === 'delivered') {
    return 'bg-green/10 text-green border-green/30'
  }
  if (status === 'cancelled') {
    return 'bg-chili/10 text-chili border-chili/30'
  }
  if (status === 'pending_payment') {
    return 'bg-surface-alt text-ink-muted border-border'
  }
  /* placed, accepted, preparing, ready */
  return 'bg-chili/10 text-chili border-chili/30'
}

export function OrderHistoryRow({ order }: OrderHistoryRowProps) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center gap-4 bg-surface rounded-panel border border-border p-4 transition-colors hover:border-pink-soft"
    >
      {/* Vendor thumbnail */}
      <div className="relative w-16 h-16 rounded-card overflow-hidden bg-surface-alt shrink-0">
        {order.vendor.imageUrl ? (
          <Image
            src={order.vendor.imageUrl}
            alt={order.vendor.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : null}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="font-heading font-bold text-ink truncate">
              {order.vendor.name}
            </p>
            <p className="text-sm text-ink-muted mt-0.5">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} · {formatRelativeTime(order.createdAt)}
            </p>
          </div>

          <span
            className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-chip border ${statusBadgeClasses(order.status)}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3">
          <span className="text-xs text-ink-muted font-mono">
            #{order.id.slice(0, 8)}
          </span>
          <span className="price font-bold text-ink">
            {formatNaira(order.totalKobo)}
          </span>
        </div>
      </div>

      {/* Chevron */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink-muted shrink-0 hidden sm:block"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  )
}