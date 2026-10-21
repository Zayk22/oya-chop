'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartLine } from '@/types'

/* ============================================================
   CART CONTEXT
   ------------------------------------------------------------
   Provides cart state and mutation helpers to any component
   inside the provider. Persists to localStorage.

   Single-vendor rule: adding an item from a different vendor
   clears the cart first (the caller handles the confirm dialog).

   Server-safe: cart is empty on the first render (SSR), then
   hydrated from localStorage after mount. Components that render
   cart-sensitive UI should check `hydrated` to avoid hydration
   mismatches.
   ============================================================ */

const STORAGE_KEY = 'oya-chop:cart'

type CartState = {
  vendorId: string | null
  vendorSlug: string | null
  vendorName: string | null
  lines: CartLine[]
}

type CartContextValue = {
  items: CartLine[]
  vendorId: string | null
  vendorSlug: string | null
  vendorName: string | null
  hydrated: boolean
  itemCount: number
  subtotalKobo: number
  addItem: (
    vendor: { id: string; slug: string; name: string },
    item: CartLine
  ) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  removeItem: (menuItemId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const emptyState: CartState = {
  vendorId: null,
  vendorSlug: null,
  vendorName: null,
  lines: [],
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(emptyState)
  const [hydrated, setHydrated] = useState(false)

  /* Load from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartState
        if (parsed && Array.isArray(parsed.lines)) {
          setCart(parsed)
        }
      }
    } catch {
      /* Corrupt or inaccessible — start fresh */
    }
    setHydrated(true)
  }, [])

  /* Save to localStorage whenever cart changes (after hydration) */
  useEffect(() => {
    if (!hydrated) return
    try {
      if (cart.lines.length === 0) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
      }
    } catch {
      /* Storage full or blocked — cart still works, just doesn't persist */
    }
  }, [cart, hydrated])

  function addItem(
    vendor: { id: string; slug: string; name: string },
    item: CartLine
  ) {
    setCart((prev) => {
      /* Single-vendor rule: if cart belongs to another vendor, reset */
      if (prev.vendorId && prev.vendorId !== vendor.id) {
        return {
          vendorId: vendor.id,
          vendorSlug: vendor.slug,
          vendorName: vendor.name,
          lines: [{ ...item, quantity: item.quantity }],
        }
      }

      const existingIndex = prev.lines.findIndex(
        (l) => l.menuItemId === item.menuItemId
      )

      if (existingIndex >= 0) {
        const next = [...prev.lines]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        }
        return { ...prev, lines: next }
      }

      return {
        vendorId: vendor.id,
        vendorSlug: vendor.slug,
        vendorName: vendor.name,
        lines: [...prev.lines, { ...item, quantity: item.quantity }],
      }
    })
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    setCart((prev) => {
      if (quantity <= 0) {
        return {
          ...prev,
          lines: prev.lines.filter((l) => l.menuItemId !== menuItemId),
        }
      }
      return {
        ...prev,
        lines: prev.lines.map((l) =>
          l.menuItemId === menuItemId ? { ...l, quantity } : l
        ),
      }
    })
  }

  function removeItem(menuItemId: string) {
    setCart((prev) => ({
      ...prev,
      lines: prev.lines.filter((l) => l.menuItemId !== menuItemId),
    }))
  }

  function clearCart() {
    setCart(emptyState)
  }

  /* Derived values */
  const itemCount = cart.lines.reduce((sum, l) => sum + l.quantity, 0)
  const subtotalKobo = cart.lines.reduce(
    (sum, l) => sum + l.priceKobo * l.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items: cart.lines,
        vendorId: cart.vendorId,
        vendorSlug: cart.vendorSlug,
        vendorName: cart.vendorName,
        hydrated,
        itemCount,
        subtotalKobo,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return ctx
}