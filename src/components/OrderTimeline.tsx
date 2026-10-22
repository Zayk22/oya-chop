import type { OrderStatus } from '@/types'

/* ============================================================
   ORDER TIMELINE
   ------------------------------------------------------------
   Visual progression through the order lifecycle. Highlights
   each step reached, mutes the ones still to come.

   pending_payment and cancelled are handled separately by the
   caller — this component is only for orders in the forward
   flow: placed → accepted → preparing → ready → delivered.
   ============================================================ */

type TimelineStep = {
  status: OrderStatus
  label: string
}

const STEPS: TimelineStep[] = [
  { status: 'placed', label: 'Placed' },
  { status: 'accepted', label: 'Accepted' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'ready', label: 'Ready' },
  { status: 'delivered', label: 'Delivered' },
]

type OrderTimelineProps = {
  currentStatus: OrderStatus
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus)

  return (
    <ol className="flex items-start justify-between gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const reached = currentIndex >= index
        const isCurrent = index === currentIndex

        return (
          <li key={step.status} className="flex-1 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center w-full">
              {/* Connector line to previous step */}
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 ${
                    reached ? 'bg-chili' : 'bg-border'
                  }`}
                />
              )}
              {/* Connector line to next step */}
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 ${
                    currentIndex > index ? 'bg-chili' : 'bg-border'
                  }`}
                />
              )}

              {/* Step dot */}
              <span
                className={`relative z-10 inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 font-bold text-xs transition-colors ${
                  reached
                    ? 'bg-chili border-chili text-white'
                    : 'bg-surface border-border text-ink-muted'
                } ${isCurrent ? 'ring-4 ring-chili/20' : ''}`}
              >
                {reached ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm font-medium ${
                reached ? 'text-ink' : 'text-ink-muted'
              }`}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}