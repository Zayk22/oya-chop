import { Skeleton } from '@/components/Skeleton'

/* ============================================================
   VENDOR PAGE — LOADING SKELETON
   ------------------------------------------------------------
   Next.js shows this instantly while the page data loads.
   Matches the shape of the real page so there's no jarring
   layout shift when the real content appears.
   ============================================================ */

export default function Loading() {
  return (
    <main>
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-10 items-center">
            <Skeleton shape="rect" height="h-72" className="!rounded-panel" />
            <div className="space-y-3">
              <Skeleton width="w-2/3" height="h-10" />
              <Skeleton width="w-full" height="h-4" />
              <Skeleton width="w-5/6" height="h-4" />
              <div className="flex gap-2 pt-2">
                <Skeleton width="w-16" height="h-6" className="!rounded-chip" />
                <Skeleton width="w-20" height="h-6" className="!rounded-chip" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-4">
          <Skeleton width="w-1/3" height="h-8" />
          <Skeleton width="w-full" height="h-24" />
          <Skeleton width="w-full" height="h-24" />
        </div>
      </section>
    </main>
  )
}