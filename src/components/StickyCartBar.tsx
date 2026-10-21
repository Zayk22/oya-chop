'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'
import { formatNaira } from '@/lib/format'

/* ============================================================
   STICKY CART BAR
   ------------------------------------------------------------
   Mobile-only fixed bar at the bottom of the screen. Shows when
   the cart has items. Tapping it takes the user to /cart.

   The parent layout adds bottom padding on mobile to prevent
   this bar from covering page content.
   ============================================================ */

export function StickyCartBar() {
  const { itemCount, subtotalKobo, hydrated } = useCart()

  /* Don't render during hydration (avoids a flash) or when empty */
  if (!hydrated || itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-chili text-white shadow-lg">
      <Link
        href="/cart"
        className="flex items-center justify-between px-5 py-3.5 active:bg-chili-dark transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-white/20 text-xs font-bold">
            {itemCount}
          </span>
          <span className="text-sm font-medium">
            {itemCount === 1 ? '1 item' : `${itemCount} items`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="price text-sm font-bold">
            {formatNaira(subtotalKobo)}
          </span>
          <span className="text-sm font-medium">View cart</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </Link>
    </div>
  )
}