'use client'

import Link from 'next/link'
import { Show, UserButton } from '@clerk/nextjs'
import { Logo } from './Logo'
import { useCart } from './CartProvider'

/* ============================================================
   HEADER
   ------------------------------------------------------------
   Client component now because it reads the cart count from
   context. Clerk's <Show> and <UserButton> work fine inside
   client components.
   ============================================================ */

export function Header() {
  const { itemCount, hydrated } = useCart()
  const showCount = hydrated && itemCount > 0

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Logo />

        <div className="flex items-center gap-2">

          <Link
            href="/cart"
            aria-label={showCount ? `Cart, ${itemCount} items` : 'Cart, empty'}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-ink transition-colors hover:bg-surface-alt"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {showCount && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-chili text-white text-[11px] font-bold"
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          <Show
            when="signed-in"
            fallback={
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center px-4 py-2 rounded-input bg-chili text-white text-sm font-medium transition-colors hover:bg-chili-dark"
              >
                Sign in
              </Link>
            }
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </Show>

        </div>
      </div>
    </header>
  )
}