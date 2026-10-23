import { getMyVendor, getMenu } from '@/db/queries'
import { MenuAvailabilityRow } from '@/components/MenuAvailabilityRow'
import { EmptyState } from '@/components/EmptyState'

/* ============================================================
   DASHBOARD — Menu Management
   ------------------------------------------------------------
   Lists all menu items grouped by category. Each item has a
   toggle to mark available / sold out.
   ============================================================ */

export const dynamic = 'force-dynamic'

export default async function DashboardMenuPage() {
  const vendor = await getMyVendor()

  /* Layout already guarantees vendor exists, but TypeScript
     doesn't know that — defensive check. */
  if (!vendor) {
    return null
  }

  const { categories, items } = await getMenu(vendor.id)

  const itemsByCategory = new Map<string, typeof items>()
  for (const item of items) {
    const existing = itemsByCategory.get(item.categoryId) ?? []
    existing.push(item)
    itemsByCategory.set(item.categoryId, existing)
  }

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Menu availability
        </h1>
        <p className="text-ink-muted mt-1">
          Toggle items off when they&apos;re sold out. Customers see the change immediately.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface rounded-panel border border-border">
          <EmptyState
            title="No menu items yet"
            description="Your menu is empty. Add items to start selling."
          />
        </div>
      ) : (
        <div className="space-y-8">
          {sortedCategories.map((category) => {
            const categoryItems = itemsByCategory.get(category.id) ?? []
            if (categoryItems.length === 0) return null

            return (
              <section key={category.id}>
                <h2 className="font-heading text-lg font-bold text-ink mb-3">
                  {category.name}
                </h2>
                <div className="bg-surface rounded-panel border border-border px-5">
                  {categoryItems.map((item) => (
                    <MenuAvailabilityRow key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}