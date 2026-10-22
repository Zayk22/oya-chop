'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/* ============================================================
   ORDER POLLER
   ------------------------------------------------------------
   Refreshes the server-rendered order page every 10 seconds
   while the order is in a "live" state (placed, accepted,
   preparing, ready).

   Stops polling when:
   - status becomes delivered or cancelled (terminal states)
   - component unmounts
   - tab is hidden (paused via document.visibilityState)

   Uses router.refresh() — NOT window.location.reload(). Refresh
   re-runs the server component's data fetch and patches the HTML
   without a full page reload, so scroll position and client
   state are preserved.
   ============================================================ */

type OrderPollerProps = {
  /** The order's current status. Polling stops at terminal states. */
  status: 'pending_payment' | 'placed' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  /** Milliseconds between refreshes. Default 10_000. */
  intervalMs?: number
}

const TERMINAL_STATES = new Set(['delivered', 'cancelled'])

export function OrderPoller({ status, intervalMs = 10_000 }: OrderPollerProps) {
  const router = useRouter()

  useEffect(() => {
    /* Don't poll at all if we're already in a terminal state */
    if (TERMINAL_STATES.has(status)) return

    let intervalId: ReturnType<typeof setInterval> | null = null

    function tick() {
      /* Pause while the tab is hidden — saves Neon queries and battery */
      if (document.visibilityState === 'visible') {
        router.refresh()
      }
    }

    intervalId = setInterval(tick, intervalMs)

    /* Clean up on unmount OR when the status prop changes.
       React will tear down this effect and re-run it with the
       new status, so a delivered order stops polling. */
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [router, status, intervalMs])

  /* This component renders nothing — it's just a hook container */
  return null
}