import { Logo } from '@/components/Logo'
import { Button } from '@/components/Button'
import { Skeleton } from '@/components/Skeleton'

/* ============================================================
   TEMPORARY HOME PAGE
   ------------------------------------------------------------
   Shows components as we build them. Replaced in Phase 3 with
   the real home page (vendor grid).
   ============================================================ */

export default function HomePage() {
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
          {/* Image placeholder */}
          <Skeleton shape="rect" height="h-40" className="!rounded-none" />

          <div className="p-4 flex flex-col gap-3">
            {/* Title line */}
            <Skeleton width="w-3/5" height="h-5" />
            {/* Two description lines */}
            <Skeleton width="w-full" height="h-3" />
            <Skeleton width="w-4/5" height="h-3" />
            {/* A small chip */}
            <div className="flex gap-2 pt-1">
              <Skeleton width="w-16" height="h-5" className="!rounded-full" />
              <Skeleton width="w-20" height="h-5" className="!rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-wider text-ink-muted mb-3 text-center">
          Skeleton — avatar + text
        </p>
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" height="h-12" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton width="w-1/3" height="h-4" />
            <Skeleton width="w-2/3" height="h-3" />
          </div>
        </div>
      </div>
    </main>
  )
}