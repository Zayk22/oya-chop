import { getMyVendor, getMenu } from '@/db/queries'
import { MenuAvailabilityRow } from '@/components/MenuAvailabilityRow'
import { AddMenuItemModal } from '@/components/AddMenuItemModal'
import { EmptyState } from '@/components/EmptyState'

export const dynamic = 'force-dynamic'

export default async function DashboardMenuPage() {
  const vendor = await getMyVendor()
  if (!vendor) return null

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
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">
            Menu availability
          </h1>
          <p className="text-ink-muted mt-1">
            Toggle items off when sold out. Add or edit anytime.
          </p>
        </div>
        <AddMenuItemModal categories={sortedCategories} />
      </div>

      {items.length === 0 ? (
        <div className="bg-surface rounded-panel border border-border">
          <EmptyState
            title="No menu items yet"
            description="Tap 'Add item' above to add your first dish."
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
                    <MenuAvailabilityRow
                      key={item.id}
                      item={item}
                      categories={sortedCategories}
                    />
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