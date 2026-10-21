'use client'

import { useCart } from './CartProvider'
import type { CartLine, MenuItem, Vendor } from '@/types'

/* ============================================================
   ADD TO CART BUTTON
   ------------------------------------------------------------
   Client component. Reads the cart context, adds the item,
   handles the single-vendor rule with a confirm dialog.

   Kept small so the parent MenuItemCard can stay a server
   component. Only this button ships JavaScript to the browser.
   ============================================================ */

type AddToCartButtonProps = {
  vendor: Pick<Vendor, 'id' | 'slug' | 'name'>
  item: MenuItem
}

export function AddToCartButton({ vendor, item }: AddToCartButtonProps) {
  const { addItem, vendorId, vendorName, hydrated } = useCart()

  function handleClick() {
    /* Single-vendor rule: if cart belongs to another vendor,
       ask before clearing it. */
    const cartHasOtherVendor = vendorId && vendorId !== vendor.id

    if (cartHasOtherVendor) {
      const confirmed = window.confirm(
        `Your cart has items from ${vendorName}. Clear it and add this instead?`
      )
      if (!confirmed) return
    }

    const cartLine: CartLine = {
      menuItemId: item.id,
      name: item.name,
      priceKobo: item.priceKobo,
      quantity: 1,
      imageUrl: item.imageUrl,
    }

    addItem(
      { id: vendor.id, slug: vendor.slug, name: vendor.name },
      cartLine
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!hydrated || !item.isAvailable}
      className="text-sm font-medium px-3 py-1.5 rounded-input border border-border text-ink-muted transition-colors hover:border-chili hover:text-chili disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-ink-muted"
    >
      {!item.isAvailable ? 'Unavailable' : 'Add'}
    </button>
  )
}