'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateOrderStatus } from '@/actions/vendor'
import { formatNaira, formatRelativeTime } from '@/lib/format'
import type { OrderWithItems, OrderStatus } from '@/types'

/* ============================================================
   VENDOR ORDER CARD
   ------------------------------------------------------------
   Client component. Shows one order with an action button
   matching its current status. Clicking advances the order via
   updateOrderStatus server action, then refreshes the page.
   ============================================================ */

type VendorOrderCardProps = {
  order: OrderWithItems
}

type ActionConfig = {
  label: string
  nextStatus: OrderStatus
  variant: 'primary' | 'secondary'
}

/* The primary action for each non-terminal status */
const PRIMARY_ACTION: Partial<Record<OrderStatus, ActionConfig>> = {
  placed: { label: 'Accept order', nextStatus: 'accepted', variant: 'primary' },
  accepted: { label: 'Start preparing', nextStatus: 'preparing', variant: 'primary' },
  preparing: { label: 'Mark ready', nextStatus: 'ready', variant: 'primary' },
  ready: { label: 'Mark delivered', nextStatus: 'delivered', variant: 'primary' },
}

/* The action's button label to show while that action is loading.
   Uses nextStatus as the key so we know which one is running. */
const LOADING_LABEL: Partial<Record<OrderStatus, string>> = {
  accepted: 'Accepting…',
  preparing: 'Starting…',
  ready: 'Marking ready…',
  delivered: 'Delivering…',
  cancelled: 'Cancelling…',
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
  if (status === 'delivered') return 'bg-green/10 text-green border-green/30'
  if (status === 'cancelled') return 'bg-chili/10 text-chili border-chili/30'
  if (status === 'pending_payment') return 'bg-surface-alt text-ink-muted border-border'
  return 'bg-chili/10 text-chili border-chili/30'
}

export function VendorOrderCard({ order }: VendorOrderCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null)

  const primaryAction = PRIMARY_ACTION[order.status]
  const canCancel = order.status !== 'delivered' && order.status !== 'cancelled'
  const isTerminal = order.status === 'delivered' || order.status === 'cancelled'

  function handleAction(nextStatus: OrderStatus) {
    setError(null)
    setPendingStatus(nextStatus)

    startTransition(async () => {
      const result = await updateOrderStatus(order.id, nextStatus)
      setPendingStatus(null)

      if (!result.success) {
        setError(result.error)
        return
      }

      router.refresh()
    })
  }

  function handleCancel() {
    const confirmed = window.confirm(
      `Cancel this order? The customer will be notified. This cannot be undone.`
    )
    if (!confirmed) return
    handleAction('cancelled')
  }

  return (
    <article className="bg-surface rounded-panel border border-border p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-xs text-ink-muted font-mono">
            #{order.id.slice(0, 8)}
          </p>
          <p className="text-sm text-ink-muted mt-0.5">
            {formatRelativeTime(order.createdAt)}
          </p>
        </div>

        <span
          className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-chip border ${statusBadgeClasses(order.status)}`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Items */}
      <ul className="space-y-2 mb-3 text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3">
            <span className="text-ink">
              {item.quantity}× {item.nameSnapshot}
            </span>
            <span className="price text-ink-muted whitespace-nowrap">
              {formatNaira(item.priceKoboSnapshot * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {/* Delivery + total */}
      <div className="pt-3 border-t border-border text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-ink-muted">Delivery to</span>
          <span className="text-ink text-right">
            {order.deliveryStreet}, {order.deliveryArea}
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-ink-muted">Phone</span>
          <span className="text-ink">{order.phone}</span>
        </div>
        <div className="flex justify-between pt-2 mt-2 border-t border-border">
          <span className="font-heading font-bold text-ink">Total</span>
          <span className="price font-heading font-bold text-ink">
            {formatNaira(order.totalKobo)}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 p-2.5 rounded-input bg-chili/10 border border-chili/30 text-xs text-ink">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {primaryAction && (
          <button
            type="button"
            onClick={() => handleAction(primaryAction.nextStatus)}
            disabled={isPending}
            className="inline-flex items-center justify-center px-4 py-2 rounded-input bg-chili text-white text-sm font-medium transition-colors hover:bg-chili-dark disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && pendingStatus === primaryAction.nextStatus
              ? (LOADING_LABEL[primaryAction.nextStatus] ?? primaryAction.label)
              : primaryAction.label}
          </button>
        )}

        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="inline-flex items-center justify-center px-3 py-2 rounded-input border border-border text-ink-muted text-sm font-medium transition-colors hover:border-chili hover:text-chili disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && pendingStatus === 'cancelled'
              ? LOADING_LABEL.cancelled
              : 'Cancel'}
          </button>
        )}

        <Link
          href={`/orders/${order.id}`}
          className="ml-auto text-xs text-ink-muted hover:text-ink transition-colors"
        >
          View details
        </Link>
      </div>

      {isTerminal && (
        <p className="mt-3 text-xs text-ink-muted italic">
          This order is {STATUS_LABELS[order.status].toLowerCase()}. No further actions.
        </p>
      )}
    </article>
  )
}