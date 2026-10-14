import Link from 'next/link'

/* ============================================================
   OYA CHOP — Footer
   ------------------------------------------------------------
   Minimal site footer. Brand on the left, a few links on the
   right, copyright line at the bottom.

   Copyright year is computed at module load (not during render)
   to satisfy React 19's purity rule.
   ============================================================ */

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="font-heading text-lg font-bold text-chili">
              Oya Chop
            </p>
            <p className="text-sm text-ink-muted mt-1">
              Oya, let&apos;s chop.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              Home
            </Link>
            <Link
              href="/orders"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              Orders
            </Link>
            <Link
              href="/cart"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              Cart
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <p className="text-xs text-ink-subtle mt-8 pt-6 border-t border-border">
          © {CURRENT_YEAR} Oya Chop. Built in Lagos.
        </p>

      </div>
    </footer>
  )
}