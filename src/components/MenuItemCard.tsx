import { formatNaira } from '@/lib/format'
import type { MenuItem } from '@/types'

/* ============================================================
   MENU ITEM CARD
   ------------------------------------------------------------
   One dish on a vendor menu. Photo, name, description, price,
   and an add-to-cart button.

   The button is a placeholder — Phase 4 wires it to real cart
   state. Kept as a server component so every item doesn't ship
   JS to the browser.

   Unavailable items: dimmed image, "Sold out" badge, disabled
   button.
   ============================================================ */

type MenuItemCardProps = {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const unavailable = !item.isAvailable

  return (
    <article
      className={`flex gap-4 py-5 border-b border-border last:border-b-0 ${
        unavailable ? 'opacity-60' : ''
      }`}
    >
      {/* Info */}
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

          <button
            type="button"
            disabled={unavailable}
            className="text-sm font-medium px-3 py-1.5 rounded-input border border-border text-ink-muted transition-colors hover:border-chili hover:text-chili disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-ink-muted"
          >
            {unavailable ? 'Unavailable' : 'Add'}
          </button>
        </div>
      </div>

      {/* Photo */}
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