'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/* ============================================================
   ERROR BOUNDARY
   ------------------------------------------------------------
   Catches errors thrown inside any page below /app.
   Must be a client component — React error boundaries require
   componentDidCatch, which only works client-side.
   ============================================================ */

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    /* Log to console for debugging. In production this could
       go to Sentry, Axiom, or similar — we don't have one yet. */
    console.error('Page error:', error)
  }, [error])

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chili/10 mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-chili"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-bold text-ink mb-3">
          Something went wrong
        </h1>

        <p className="text-ink-muted leading-relaxed mb-8">
          We hit a snag loading this page. Try again, or head back home.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-input bg-chili text-white text-sm font-medium transition-colors hover:bg-chili-dark"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-input border border-border text-ink-muted text-sm font-medium transition-colors hover:text-ink hover:border-pink-soft"
          >
            Back to home
          </Link>
        </div>

        {/* Show the error digest (short hash) to help with debugging.
           Full message is intentionally hidden from users. */}
        {error.digest && (
          <p className="text-xs text-ink-muted mt-8 font-mono">
            Ref: {error.digest}
          </p>
        )}

      </div>
    </main>
  )
}