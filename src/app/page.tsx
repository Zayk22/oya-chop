import { Logo } from '@/components/Logo'
import { Button } from '@/components/Button'
import { Skeleton } from '@/components/Skeleton'
import { formatNaira, formatRelativeTime } from '@/lib/format'

/* ============================================================
   TEMPORARY HOME PAGE
   ------------------------------------------------------------
   Shows components as we build them. Replaced in Phase 3.
   ============================================================ */

export default function HomePage() {
  const testPrices = [0, 50000, 200000, 250000, 350000, 2500000]
  const testTimes = [
    new Date(Date.now() - 30 * 1000).toISOString(),        // just now
    new Date(Date.now() - 5 * 60 * 1000).toISOString(),    // 5 min
    new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours
    new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // yesterday
    new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 py-12">
      <Logo />

      {/* Buttons */}
      <div className="flex flex-col items-center gap-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted mb-2 text-center">
            Primary
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="primary">Place order</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted mb-2 text-center">
            Secondary
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="secondary">Save for later</Button>
            <Button variant="secondary" size="sm">Small</Button>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted mb-2 text-center">
            Ghost
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="ghost">Cancel</Button>
            <Button variant="ghost" size="sm">Small</Button>
          </div>
        </div>
      </div>

      {/* Skeletons */}
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-wider text-ink-muted mb-3 text-center">
          Skeleton — a vendor card loading
        </p>
        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          <Skeleton shape="rect" height="h-40" className="!rounded-none" />
          <div className="p-4 flex flex-col gap-3">
            <Skeleton width="w-3/5" height="h-5" />
            <Skeleton width="w-full" height="h-3" />
            <Skeleton width="w-4/5" height="h-3" />
            <div className="flex gap-2 pt-1">
              <Skeleton width="w-16" height="h-5" className="!rounded-full" />
              <Skeleton width="w-20" height="h-5" className="!rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Naira formatter */}
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-wider text-ink-muted mb-3 text-center">
          Naira formatter
        </p>
        <div className="bg-surface rounded-card shadow-card p-4">
          <ul className="flex flex-col gap-2 text-sm">
            {testPrices.map((kobo) => (
              <li key={kobo} className="flex justify-between border-b border-border last:border-0 pb-2 last:pb-0">
                <span className="text-ink-muted">{kobo} kobo</span>
                <span className="font-medium text-ink price">{formatNaira(kobo)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relative time */}
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-wider text-ink-muted mb-3 text-center">
          Relative time
        </p>
        <div className="bg-surface rounded-card shadow-card p-4">
          <ul className="flex flex-col gap-2 text-sm">
            {testTimes.map((iso) => (
              <li key={iso} className="flex justify-between border-b border-border last:border-0 pb-2 last:pb-0">
                <span className="text-ink-muted">{new Date(iso).toLocaleString()}</span>
                <span className="font-medium text-ink">{formatRelativeTime(iso)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}