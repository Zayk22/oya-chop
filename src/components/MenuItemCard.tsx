import { formatNaira } from '@/lib/format'
import { AddToCartButton } from './AddToCartButton'
import type { MenuItem, Vendor } from '@/types'

/* ============================================================
   MENU ITEM CARD
   ------------------------------------------------------------
   Server component. Renders the dish info and delegates the
   interactive "Add" button to a small client component.

   Unavailable items: dimmed, "Sold out" badge, disabled button.
   ============================================================ */

type MenuItemCardProps = {
  item: MenuItem
  vendor: Pick<Vendor, 'id' | 'slug' | 'name'>
}

export function MenuItemCard({ item, vendor }: MenuItemCardProps) {
  const unavailable = !item.isAvailable

  return (
    <article
      className={`flex gap-4 py-5 border-b border-border last:border-b-0 ${
        unavailable ? 'opacity-60' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="font-heading text-base font-bold text-ink leading-tight">
            {item.name}
          </h3>
          {unavailable && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-chip bg-surface-alt text-ink-muted">
              Sold out
            </span>
          )}
        </div>

        <p className="text-sm text-ink-muted mt-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="price font-medium text-ink">
            {formatNaira(item.priceKobo)}
          </span>

          <AddToCartButton vendor={vendor} item={item} />
        </div>
      </div>

      {item.imageUrl ? (
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-card overflow-hidden bg-surface-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-card bg-surface-alt"
          aria-hidden="true"
        />
      )}
    </article>
  )
}