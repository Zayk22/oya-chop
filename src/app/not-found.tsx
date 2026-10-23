import Link from 'next/link'

/* ============================================================
   404 — NOT FOUND
   ------------------------------------------------------------
   Rendered when notFound() is called anywhere in the app, or
   when a route doesn't match. Matches the app's visual language.
   ============================================================ */

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">

        <p className="font-heading text-7xl font-bold text-chili mb-4">
          404
        </p>

        <h1 className="font-heading text-2xl font-bold text-ink mb-3">
          Nothing here
        </h1>

        <p className="text-ink-muted leading-relaxed mb-8">
          This page doesn&apos;t exist. Maybe it moved, or maybe you typed
          the URL wrong.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-input bg-chili text-white text-sm font-medium transition-colors hover:bg-chili-dark"
        >
          Back to home
        </Link>

      </div>
    </main>
  )
}