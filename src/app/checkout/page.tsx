'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/components/CartProvider'
import { createOrder } from '@/actions/create-order'
import { LAGOS_AREAS, type LagosArea } from '@/lib/constants'
import { formatNaira } from '@/lib/format'

/* ============================================================
   CHECKOUT PAGE
   ------------------------------------------------------------
   Client component. Form for delivery details + order summary.
   Submitting calls createOrder, which:
   - creates the order in the DB (pending_payment)
   - initializes a Paystack transaction
   - returns an authorization URL
   We redirect to that URL. After payment, Paystack sends the
   user back to /api/paystack/callback (Batch 4.10).
   ============================================================ */

export default function CheckoutPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const { items, vendorId, vendorName, itemCount, subtotalKobo, hydrated } = useCart()

  const [area, setArea] = useState<LagosArea | ''>('')
  const [street, setStreet] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* Redirect to cart if empty (after hydration) */
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace('/cart')
    }
  }, [hydrated, items.length, router])

  /* Redirect to sign-in if not authenticated */
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!hydrated || !isLoaded) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-3xl font-bold text-ink">Checkout</h1>
        <p className="text-ink-muted mt-2">Loading…</p>
      </main>
    )
  }

  if (items.length === 0 || !isSignedIn) {
    return null
  }

  const formValid =
    area !== '' &&
    street.trim().length >= 5 &&
    phone.trim().length >= 10 &&
    !submitting

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formValid || !vendorId) return

    setError(null)
    setSubmitting(true)

    try {
      const result = await createOrder({
        vendorId,
        lines: items.map((line) => ({
          menuItemId: line.menuItemId,
          quantity: line.quantity,
        })),
        deliveryArea: area,
        deliveryStreet: street.trim(),
        phone: phone.trim(),
      })

      if (!result.success) {
        setError(result.error)
        setSubmitting(false)
        return
      }

      /* Redirect to Paystack's hosted checkout page */
      console.log('Redirecting to Paystack:', result.authorizationUrl)
      window.location.href = result.authorizationUrl
    } catch (err) {
      console.error('Checkout submit error:', err)
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_320px] gap-6">

        {/* Form */}
        <div className="bg-surface rounded-panel border border-border p-5 sm:p-6 space-y-5">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-ink mb-1.5">
              Delivery area
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value as LagosArea | '')}
              disabled={submitting}
              className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm focus:outline-none focus:border-chili disabled:opacity-60"
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
              disabled={submitting}
              placeholder="12 Admiralty Way"
              className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili disabled:opacity-60"
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
              disabled={submitting}
              placeholder="08012345678"
              className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili disabled:opacity-60"
            />
          </div>

          {error && (
            <div className="p-3 rounded-input bg-chili/10 border border-chili/30 text-sm text-ink">
              {error}
            </div>
          )}

          <div className="pt-3 border-t border-border text-sm text-ink-muted">
            <Link
              href="/cart"
              className="inline-block text-chili hover:underline"
            >
              ← Back to cart
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-surface rounded-panel border border-border p-5 h-fit">
          <h2 className="font-heading text-lg font-bold text-ink mb-2">
            Your order
          </h2>
          {vendorName && (
            <p className="text-sm text-ink-muted mb-4">From {vendorName}</p>
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
              <dd className="text-ink-muted text-xs">At vendor rate</dd>
            </div>
          </dl>

          <div className="mt-4 pt-4 border-t border-border flex justify-between">
            <span className="font-heading font-bold text-ink">Total</span>
            <span className="price font-heading font-bold text-ink">
              {formatNaira(subtotalKobo)}
            </span>
          </div>

          <button
            type="submit"
            disabled={!formValid}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-input bg-chili text-white font-medium text-base transition-colors hover:bg-chili-dark disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Redirecting…
              </>
            ) : (
              <>Pay {formatNaira(subtotalKobo)}</>
            )}
          </button>
          <p className="text-xs text-ink-muted mt-3 text-center leading-relaxed">
            You&apos;ll be redirected to Paystack to complete payment.
          </p>
        </aside>

      </form>
    </main>
  )
}