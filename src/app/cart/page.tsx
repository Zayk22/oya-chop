'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { EmptyState } from '@/components/EmptyState'
import { formatNaira } from '@/lib/format'

/* ============================================================
   CART PAGE
   ------------------------------------------------------------
   Client component — reads from CartProvider. Shows all items,
   quantity controls, and subtotal. Checkout is disabled until
   Paystack is wired in Batch 4.9.
   ============================================================ */

export default function CartPage() {
  const {
    items,
    vendorName,
    vendorSlug,
    itemCount,
    subtotalKobo,
    hydrated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()

  /* Loading state — cart hasn't hydrated from localStorage yet */
  if (!hydrated) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-3xl font-bold text-ink">Your cart</h1>
        <p className="text-ink-muted mt-2">Loading…</p>
      </main>
    )
  }

  /* Empty state */
  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-3xl font-bold text-ink mb-6">Your cart</h1>
        <div className="bg-surface rounded-panel border border-border">
          <EmptyState
            title="Your cart is empty"
            description="Nothing here yet. Oya, go find something nice."
            action={{ label: 'Browse restaurants', href: '/' }}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold text-ink">Your cart</h1>
        {vendorName && vendorSlug && (
          <Link
            href={`/vendors/${vendorSlug}`}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            From <span className="font-medium">{vendorName}</span>
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">

        {/* Items */}
        <div className="bg-surface rounded-panel border border-border p-5">
          {items.map((line) => (
            <div
              key={line.menuItemId}
              className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-border last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-bold text-ink leading-tight">
                  {line.name}
                </h3>
                <p className="text-sm text-ink-muted mt-1">
                  {formatNaira(line.priceKobo)} each
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-border rounded-input overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.menuItemId, line.quantity - 1)}
                    disabled={line.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-ink-muted hover:bg-surface-alt disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    aria-label={`Decrease quantity of ${line.name}`}
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-ink">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.menuItemId, line.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-ink-muted hover:bg-surface-alt transition-colors"
                    aria-label={`Increase quantity of ${line.name}`}
                  >
                    +
                  </button>
                </div>

                <span className="price font-bold text-ink w-24 text-right">
                  {formatNaira(line.priceKobo * line.quantity)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeItem(line.menuItemId)}
                className="text-xs text-ink-muted hover:text-chili transition-colors self-start sm:self-auto"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-border flex justify-between">
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-ink-muted hover:text-chili transition-colors"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-surface rounded-panel border border-border p-5 h-fit">
          <h2 className="font-heading text-lg font-bold text-ink mb-4">
            Order summary
          </h2>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">
                Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </dt>
              <dd className="price font-medium text-ink">
                {formatNaira(subtotalKobo)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="text-ink-muted text-xs">
                Calculated at checkout
              </dd>
            </div>
          </dl>

          <div className="mt-4 pt-4 border-t border-border flex justify-between">
            <span className="font-heading font-bold text-ink">Total</span>
            <span className="price font-heading font-bold text-ink">
              {formatNaira(subtotalKobo)}
            </span>
          </div>

          <button
            type="button"
            disabled
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-input bg-chili text-white font-medium text-base transition-colors hover:bg-chili-dark disabled:opacity-60 disabled:cursor-not-allowed"
            title="Checkout will be enabled in a future update"
          >
            Checkout
          </button>

          <p className="text-xs text-ink-muted mt-3 text-center leading-relaxed">
            Delivery fee and payment will be handled at checkout. Coming soon.
          </p>
        </aside>

      </div>
    </main>
  )
}
