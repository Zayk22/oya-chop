'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { LAGOS_AREAS, type LagosArea } from '@/lib/constants'
import { formatNaira } from '@/lib/format'

/* ============================================================
   CHECKOUT PAGE
   ------------------------------------------------------------
   Client component. Form for delivery details + order summary.
   The actual order creation (server action) comes in Batch 4.9.
   For now: submit button is disabled with a "coming soon" note.
   ============================================================ */

export default function CheckoutPage() {
  const router = useRouter()
  const { items, vendorName, itemCount, subtotalKobo, hydrated } = useCart()

  const [area, setArea] = useState<LagosArea | ''>('')
  const [street, setStreet] = useState('')
  const [phone, setPhone] = useState('')

  /* Redirect to cart if empty (after hydration) */
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace('/cart')
    }
  }, [hydrated, items.length, router])

  if (!hydrated) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-3xl font-bold text-ink">Checkout</h1>
        <p className="text-ink-muted mt-2">Loading…</p>
      </main>
    )
  }

  if (items.length === 0) {
    /* Redirect is in progress — render nothing */
    return null
  }

  const formValid = area !== '' && street.trim() !== '' && phone.trim() !== ''

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">

        {/* Form */}
        <form className="bg-surface rounded-panel border border-border p-5 sm:p-6 space-y-5">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-ink mb-1.5">
              Delivery area
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value as LagosArea | '')}
              className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm focus:outline-none focus:border-chili"
            >
              <option value="">Select your area</option>
              {LAGOS_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-ink mb-1.5">
              Street address
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="12 Admiralty Way"
              className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0801 234 5678"
              className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili"
            />
          </div>

          <div className="pt-3 border-t border-border text-sm text-ink-muted">
            <p className="leading-relaxed">
              Cash on delivery and card payment will be available in a future update. For now, you can review your order but not submit it.
            </p>
            <Link
              href="/cart"
              className="inline-block mt-3 text-chili hover:underline"
            >
              ← Back to cart
            </Link>
          </div>
        </form>

        {/* Summary */}
        <aside className="bg-surface rounded-panel border border-border p-5 h-fit">
          <h2 className="font-heading text-lg font-bold text-ink mb-2">
            Your order
          </h2>
          {vendorName && (
            <p className="text-sm text-ink-muted mb-4">
              From {vendorName}
            </p>
          )}

          <ul className="space-y-3 mb-4">
            {items.map((line) => (
              <li key={line.menuItemId} className="flex justify-between text-sm gap-3">
                <span className="text-ink">
                  {line.quantity}× {line.name}
                </span>
                <span className="price text-ink whitespace-nowrap">
                  {formatNaira(line.priceKobo * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 text-sm pt-4 border-t border-border">
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
              <dd className="text-ink-muted text-xs">Calculated next</dd>
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
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-input bg-chili text-white font-medium text-base transition-colors hover:bg-chili-dark disabled:opacity-60 disabled:cursor-not-allowed"
            title={formValid ? 'Payment coming soon' : 'Fill in your details first'}
          >
            Pay {formatNaira(subtotalKobo)}
          </button>
          <p className="text-xs text-ink-muted mt-3 text-center leading-relaxed">
            Payment is coming soon.
          </p>
        </aside>

      </div>
    </main>
  )
}