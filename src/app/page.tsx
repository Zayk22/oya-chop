import { Logo } from '@/components/Logo'

/* ============================================================
   TEMPORARY HOME PAGE
   ------------------------------------------------------------
   Just here so we can see components as we build them.
   Replaced in Phase 3 with the real home (vendor grid).
   ============================================================ */

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <Logo />

      <p className="text-sm text-ink-muted">
        Logo test — resize the browser to confirm it renders at all widths.
      </p>
    </main>
  )
}