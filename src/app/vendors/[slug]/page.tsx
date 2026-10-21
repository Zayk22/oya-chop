import { notFound } from 'next/navigation'
import { VendorHeader } from '@/components/VendorHeader'
import { MenuList } from '@/components/MenuList'
import { EmptyState } from '@/components/EmptyState'
import { getVendorBySlug, getMenu } from '@/db/queries'

export const dynamic = 'force-dynamic'

type VendorPageProps = {
  params: Promise<{ slug: string }>
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params

  const vendor = await getVendorBySlug(slug)

  if (!vendor) {
    notFound()
  }

  const { categories, items } = await getMenu(vendor.id)

  return (
    <main>
      <VendorHeader vendor={vendor} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {items.length === 0 ? (
          <div className="bg-surface rounded-panel border border-border">
            <EmptyState
              title="No dishes yet"
              description="This kitchen hasn't added anything to the menu. Check back soon."
            />
          </div>
        ) : (
          <MenuList categories={categories} items={items} vendor={vendor} />
        )}
      </section>
    </main>
  )
}