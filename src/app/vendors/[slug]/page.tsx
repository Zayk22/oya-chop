import { notFound } from 'next/navigation'
import { VendorHeader } from '@/components/VendorHeader'
import { mockVendors } from '@/lib/mock-data'

/* ============================================================
   VENDOR PAGE
   ------------------------------------------------------------
   Dynamic route: /vendors/<slug>
   Uses mock data in batch 3.3a. Batch 3.7 swaps to
   getVendorBySlug() and getMenu() from src/db/queries.ts.
   ============================================================ */

type VendorPageProps = {
  params: Promise<{ slug: string }>
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params

  const vendor = mockVendors.find((v) => v.slug === slug)

  if (!vendor) {
    notFound()
  }

  return (
    <main>
      <VendorHeader vendor={vendor} />
      {/* Menu section goes here in batch 3.3b */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-ink-muted">Menu loading…</p>
      </section>
    </main>
  )
}