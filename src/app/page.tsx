import { Logo } from '@/components/Logo'
import { Button } from '@/components/Button'

/* ============================================================
   TEMPORARY HOME PAGE
   ------------------------------------------------------------
   Shows components as we build them. Replaced in Phase 3 with
   the real home page (vendor grid).
   ============================================================ */

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 px-4">
      <Logo />

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

        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted mb-2 text-center">
            As a link
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="#" variant="primary">Link as button</Button>
          </div>
        </div>
      </div>
    </main>
  )
}