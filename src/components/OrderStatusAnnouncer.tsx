'use client'

import { useEffect, useRef } from 'react'
import type { OrderStatus } from '@/types'

/* ============================================================
   ORDER STATUS ANNOUNCER
   ------------------------------------------------------------
   Visually hidden aria-live region that announces order status
   changes to screen readers. Renders nothing visible.

   The region is always in the DOM (required for aria-live to
   work reliably). Its text updates only when the status actually
   changes, so screen readers don't get spammed every poll cycle.
   ============================================================ */

type OrderStatusAnnouncerProps = {
  status: OrderStatus
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'awaiting payment',
  placed: 'placed',
  accepted: 'accepted',
  preparing: 'being prepared',
  ready: 'ready for delivery',
  delivered: 'delivered',
  cancelled: 'cancelled',
}

export function OrderStatusAnnouncer({ status }: OrderStatusAnnouncerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const previousStatus = useRef<OrderStatus | null>(null)

  useEffect(() => {
    /* Skip the first render — announcing the current state on
       page load isn't a "change," it's just where we started. */
    if (previousStatus.current === null) {
      previousStatus.current = status
      return
    }

    /* Only update the live region if the status actually changed */
    if (previousStatus.current !== status && ref.current) {
      ref.current.textContent = `Order status updated to ${STATUS_LABEL[status]}.`
      previousStatus.current = status
    }
  }, [status])

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )
}