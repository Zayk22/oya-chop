/* ============================================================
   OYA CHOP — SHARED TYPES

   This file is the CONTRACT between frontend and backend.
   Every shape we pass between them is defined here, once.
   Changing this file requires a PR that both devs approve.
   ============================================================ */

/* ---------- Order lifecycle ----------
   An order moves through these states in order, except for
   cancelled which can happen from any state before delivered. */

export type OrderStatus =
  | 'pending_payment'  // order created, Paystack not yet confirmed
  | 'placed'           // payment confirmed, waiting for the vendor
  | 'accepted'         // vendor accepted the order
  | 'preparing'        // kitchen is cooking
  | 'ready'            // ready for pickup / out for delivery
  | 'delivered'        // done
  | 'cancelled'        // vendor or customer cancelled

/* ---------- Vendor ----------
   A restaurant. One vendor is linked to exactly one Clerk user
   through ownerClerkUserId. That's how we know whose dashboard
   is whose. Null means the vendor is seeded but not yet claimed
   by a real user. */

export type Vendor = {
  id: string
  name: string
  slug: string
  description: string
  cuisines: string[]              // e.g. ["Nigerian", "Grills"]
  imageUrl: string                // e.g. "/images/vendors/mama-nkechi.jpg"
  deliveryEstimateMin: number     // e.g. 30 (minutes)
  deliveryFeeKobo: number         // integer, kobo. ₦500 → 50000
  isActive: boolean
  ownerClerkUserId: string | null // Clerk user id who can manage this vendor
}

/* ---------- Menu ----------
   Categories group items inside one vendor's menu. Items belong
   to exactly one category. */

export type MenuCategory = {
  id: string
  vendorId: string
  name: string                    // e.g. "Rice Dishes"
  sortOrder: number               // ascending; lower numbers first
}

export type MenuItem = {
  id: string
  vendorId: string
  categoryId: string
  name: string                    // e.g. "Jollof Rice"
  description: string
  priceKobo: number               // integer, kobo. ₦2,500 → 250000
  imageUrl: string
  isAvailable: boolean
}

/* ---------- Cart ----------
   A cart line is what lives in the browser. It's a snapshot
   for display only — the server NEVER trusts these prices.
   When the order is created, the server re-reads the real
   prices from the database and recalculates totals.
   The cart is single-vendor: one vendor's items at a time. */

export type CartLine = {
  menuItemId: string
  name: string                    // cached for display
  priceKobo: number               // cached for display only
  quantity: number
  imageUrl: string
}

/* ---------- Orders ----------
   An order is what actually exists in the database. Prices are
   snapshotted on the item rows so that if a vendor changes a
   menu price tomorrow, past orders still show what was paid. */

export type OrderItem = {
  id: string
  orderId: string
  menuItemId: string
  nameSnapshot: string            // item name at time of order
  priceKoboSnapshot: number       // price at time of order
  quantity: number
}

export type Order = {
  id: string
  customerId: string              // Clerk user id
  vendorId: string
  status: OrderStatus
  subtotalKobo: number            // sum of items, computed server-side
  deliveryFeeKobo: number         // snapshot of vendor's fee
  totalKobo: number               // subtotal + deliveryFee, server-side
  deliveryArea: string            // e.g. "Lekki"
  deliveryStreet: string          // e.g. "12 Admiralty Way"
  phone: string
  paystackReference: string | null
  createdAt: string               // ISO string, e.g. "2026-10-14T10:23:00Z"
  updatedAt: string
}

/* ---------- Convenience ----------
   Common compound shapes we'll pass around the UI. */

export type OrderWithItems = Order & {
  items: OrderItem[]
  vendor: Pick<Vendor, 'id' | 'name' | 'slug' | 'imageUrl'>
}