import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { getMyVendor } from '@/db/queries'

/* ============================================================
   DASHBOARD LAYOUT
   ------------------------------------------------------------
   Vendor-only authz gate + slim sub-nav bar. The site header
   (from root layout) already provides logo, cart, avatar.
   This layout adds dashboard-specific navigation only.
   ============================================================ */

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const vendor = await getMyVendor()

  if (!vendor) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-surface rounded-panel border border-border p-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-ink mb-3">
            Vendor access only
          </h1>
          <p className="text-ink-muted leading-relaxed max-w-md mx-auto">
            This area is for restaurants on Oya Chop. If you&apos;re a vendor and you think
            this is a mistake, contact support.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-5 py-2.5 rounded-input bg-chili text-white text-sm font-medium transition-colors hover:bg-chili-dark"
          >
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Slim dashboard sub-nav */}
      <div className="border-b border-border bg-surface/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-ink truncate">
            {vendor.name} dashboard
          </p>

          <nav className="flex items-center gap-1 text-sm shrink-0">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-input text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/dashboard/menu"
              className="px-3 py-1.5 rounded-input text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-input text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
            >
              ← Site
            </Link>
          </nav>
        </div>
      </div>

      {children}
    </>
  )
}