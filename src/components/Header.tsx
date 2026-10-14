import Link from 'next/link'
import { Show, UserButton } from '@clerk/nextjs'
import { Logo } from './Logo'

/* ============================================================
   OYA CHOP — Header
   ------------------------------------------------------------
   Sticky top bar. Logo on the left, cart + auth on the right.

   This is a SERVER component. Clerk's <Show> component wraps the
   auth slot and decides what to render based on session state.
   <UserButton> is a client-side widget Clerk manages internally —
   we don't need 'use client' in this file.

   Clerk Core 3 note: <SignedIn> and <SignedOut> were removed and
   replaced by <Show when="signed-in" | "signed-out">.
   ============================================================ */

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Logo />

        <div className="flex items-center gap-2">

          {/* Cart — count is a placeholder until Phase 4 wires real state */}
          <Link
            href="/cart"
            aria-label="Cart, empty"
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
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-chili text-white text-[11px] font-bold"
            >
              0
            </span>
          </Link>

          {/* Auth — Clerk Core 3: one component, "when" prop decides which side renders */}
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