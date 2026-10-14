import Link from 'next/link'
import type { ReactNode } from 'react'

/* ============================================================
   OYA CHOP — EmptyState
   ------------------------------------------------------------
   Shown when a list or page has nothing to display yet.
   Combines an icon, a headline, a description, and an optional
   call to action — so the user knows why it's empty and what
   to do about it.

   Used in:
     - Empty cart
     - No orders yet
     - Search with no results
     - Vendor dashboard with no incoming orders
   ============================================================ */

type EmptyStateProps = {
  /** A small SVG or React node. Kept optional. */
  icon?: ReactNode
  /** Main headline. Short and human. */
  title: string
  /** One line of supporting text. Optional. */
  description?: string
  /** Optional call-to-action button */
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 px-6 py-14 max-w-sm mx-auto">
      {icon ? (
        <div
          aria-hidden="true"
          className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-alt text-ink-muted"
        >
          {icon}
        </div>
      ) : null}

      <h2 className="font-heading text-xl font-bold text-ink">
        {title}
      </h2>

      {description ? (
        <p className="text-sm text-ink-muted leading-relaxed">
          {description}
        </p>
      ) : null}

      {action ? (
        <Link
          href={action.href}
          className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-input bg-chili text-white font-medium text-base transition-colors duration-150 hover:bg-chili-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}