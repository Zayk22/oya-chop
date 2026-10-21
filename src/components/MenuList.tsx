import { MenuItemCard } from './MenuItemCard'
import type { MenuCategory, MenuItem, Vendor } from '@/types'

type MenuListProps = {
  categories: MenuCategory[]
  items: MenuItem[]
  vendor: Pick<Vendor, 'id' | 'slug' | 'name'>
}

export function MenuList({ categories, items, vendor }: MenuListProps) {
  const itemsByCategory = new Map<string, MenuItem[]>()
  for (const item of items) {
    const existing = itemsByCategory.get(item.categoryId) ?? []
    existing.push(item)
    itemsByCategory.set(item.categoryId, existing)
  }

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="space-y-10">
      {sortedCategories.map((category) => {
        const categoryItems = (itemsByCategory.get(category.id) ?? []).sort(
          (a, b) => a.name.localeCompare(b.name)
        )

        if (categoryItems.length === 0) return null

        return (
          <section key={category.id}>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink mb-2">
              {category.name}
            </h2>
            <div>
              {categoryItems.map((item) => (
                <MenuItemCard key={item.id} item={item} vendor={vendor} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}