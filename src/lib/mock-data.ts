/* ============================================================
   MOCK DATA
   ------------------------------------------------------------
   Mirrors the shape and content of the real seed in src/db/seed.ts.
   Used by Dev A to build UI before real queries are wired up.
   Swapped out in task 3.7 (pair) — replaced with getVendors() etc.

   Prices are in KOBO. ₦2,500 → 250000.
   IDs match what the seed generates only conceptually — they're
   placeholders. When the swap happens, real IDs come from Neon.
   ============================================================ */

import type { Vendor, MenuCategory, MenuItem, OrderWithItems } from '@/types'

/* ---------- Vendors (mirror the four seed vendors) ---------- */

export const mockVendors: Vendor[] = [
  {
    id: 'mock-vendor-mama-put',
    name: 'Mama Put Kitchen',
    slug: 'mama-put-kitchen',
    description:
      'Home-style Nigerian soups and swallow, cooked the way mama makes it.',
    cuisines: ['Nigerian', 'Soups'],
    imageUrl: '/images/vendors/mama-put-kitchen.jpg',
    deliveryEstimateMin: 40,
    deliveryFeeKobo: 150000,
    isActive: true,
    ownerClerkUserId: null,
  },
  {
    id: 'mock-vendor-lagos-jollof',
    name: 'Lagos Jollof House',
    slug: 'lagos-jollof-house',
    description: 'Party jollof, fried rice and grilled chicken, all day.',
    cuisines: ['Nigerian', 'Rice'],
    imageUrl: '/images/vendors/lagos-jollof-house.jpg',
    deliveryEstimateMin: 30,
    deliveryFeeKobo: 100000,
    isActive: true,
    ownerClerkUserId: null,
  },
  {
    id: 'mock-vendor-suya-spot',
    name: 'Suya Spot',
    slug: 'suya-spot',
    description: 'Spicy grilled suya, fresh off the fire with yaji.',
    cuisines: ['Grill', 'Suya'],
    imageUrl: '/images/vendors/suya-spot.jpg',
    deliveryEstimateMin: 25,
    deliveryFeeKobo: 120000,
    isActive: true,
    ownerClerkUserId: null,
  },
  {
    id: 'mock-vendor-small-chops',
    name: 'Small Chops Corner',
    slug: 'small-chops-corner',
    description: 'Puff puff, meat pies and party snacks.',
    cuisines: ['Snacks', 'Bakery'],
    imageUrl: '/images/vendors/small-chops-corner.jpg',
    deliveryEstimateMin: 20,
    deliveryFeeKobo: 100000,
    isActive: false,
    ownerClerkUserId: null,
  },
]

/* ---------- Menu categories ---------- */

export const mockCategories: MenuCategory[] = [
  // Mama Put Kitchen
  { id: 'cat-mama-put-1', vendorId: 'mock-vendor-mama-put', name: 'Soups & Swallow', sortOrder: 0 },
  { id: 'cat-mama-put-2', vendorId: 'mock-vendor-mama-put', name: 'Sides', sortOrder: 1 },

  // Lagos Jollof House
  { id: 'cat-jollof-1', vendorId: 'mock-vendor-lagos-jollof', name: 'Rice Meals', sortOrder: 0 },
  { id: 'cat-jollof-2', vendorId: 'mock-vendor-lagos-jollof', name: 'Drinks', sortOrder: 1 },

  // Suya Spot
  { id: 'cat-suya-1', vendorId: 'mock-vendor-suya-spot', name: 'Grill', sortOrder: 0 },

  // Small Chops Corner
  { id: 'cat-chops-1', vendorId: 'mock-vendor-small-chops', name: 'Snacks', sortOrder: 0 },
]

/* ---------- Menu items ---------- */

export const mockItems: MenuItem[] = [
  // Mama Put Kitchen — Soups & Swallow
  {
    id: 'item-mp-1',
    vendorId: 'mock-vendor-mama-put',
    categoryId: 'cat-mama-put-1',
    name: 'Egusi Soup with Pounded Yam',
    description: 'Melon seed soup with assorted meat and stockfish.',
    priceKobo: 450000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-mp-2',
    vendorId: 'mock-vendor-mama-put',
    categoryId: 'cat-mama-put-1',
    name: 'Efo Riro with Eba',
    description: 'Rich spinach stew with ponmo and goat meat.',
    priceKobo: 380000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-mp-3',
    vendorId: 'mock-vendor-mama-put',
    categoryId: 'cat-mama-put-1',
    name: 'Okra Soup with Amala',
    description: 'Draw soup with fish and shaki.',
    priceKobo: 400000,
    imageUrl: '',
    isAvailable: false,   // matches seed
  },
  {
    id: 'item-mp-4',
    vendorId: 'mock-vendor-mama-put',
    categoryId: 'cat-mama-put-2',
    name: 'Fried Plantain (Dodo)',
    description: 'Sweet ripe plantain, fried golden.',
    priceKobo: 100000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-mp-5',
    vendorId: 'mock-vendor-mama-put',
    categoryId: 'cat-mama-put-2',
    name: 'Moi Moi',
    description: 'Steamed bean pudding with egg.',
    priceKobo: 120000,
    imageUrl: '',
    isAvailable: true,
  },

  // Lagos Jollof House — Rice Meals
  {
    id: 'item-lj-1',
    vendorId: 'mock-vendor-lagos-jollof',
    categoryId: 'cat-jollof-1',
    name: 'Party Jollof Rice & Chicken',
    description: 'Smoky jollof with a grilled chicken thigh.',
    priceKobo: 350000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-lj-2',
    vendorId: 'mock-vendor-lagos-jollof',
    categoryId: 'cat-jollof-1',
    name: 'Fried Rice & Turkey',
    description: 'Vegetable fried rice with peppered turkey.',
    priceKobo: 420000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-lj-3',
    vendorId: 'mock-vendor-lagos-jollof',
    categoryId: 'cat-jollof-1',
    name: 'Ofada Rice & Ayamase',
    description: 'Local rice with green pepper stew and assorted meat.',
    priceKobo: 420000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-lj-4',
    vendorId: 'mock-vendor-lagos-jollof',
    categoryId: 'cat-jollof-2',
    name: 'Chapman',
    description: 'Classic Nigerian fruit punch.',
    priceKobo: 180000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-lj-5',
    vendorId: 'mock-vendor-lagos-jollof',
    categoryId: 'cat-jollof-2',
    name: 'Zobo',
    description: 'Chilled hibiscus drink with ginger.',
    priceKobo: 80000,
    imageUrl: '',
    isAvailable: true,
  },

  // Suya Spot — Grill
  {
    id: 'item-ss-1',
    vendorId: 'mock-vendor-suya-spot',
    categoryId: 'cat-suya-1',
    name: 'Beef Suya',
    description: 'Thin-sliced beef, yaji spice, onions and tomatoes.',
    priceKobo: 250000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-ss-2',
    vendorId: 'mock-vendor-suya-spot',
    categoryId: 'cat-suya-1',
    name: 'Chicken Suya',
    description: 'Grilled chicken with yaji and cabbage.',
    priceKobo: 300000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-ss-3',
    vendorId: 'mock-vendor-suya-spot',
    categoryId: 'cat-suya-1',
    name: 'Pepper Soup (Goat Meat)',
    description: 'Hot and peppery broth with tender goat meat.',
    priceKobo: 300000,
    imageUrl: '',
    isAvailable: true,
  },

  // Small Chops Corner — Snacks
  {
    id: 'item-sc-1',
    vendorId: 'mock-vendor-small-chops',
    categoryId: 'cat-chops-1',
    name: 'Puff Puff (10 pcs)',
    description: 'Soft fried dough balls, lightly sweet.',
    priceKobo: 150000,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-sc-2',
    vendorId: 'mock-vendor-small-chops',
    categoryId: 'cat-chops-1',
    name: 'Meat Pie',
    description: 'Flaky pastry with minced beef and potato.',
    priceKobo: 100000,
    imageUrl: '',
    isAvailable: true,
  },
]

/* ---------- Sample order (for order-history UI later) ---------- */

export const mockOrders: OrderWithItems[] = [
  {
    id: 'mock-order-001',
    customerId: 'mock-user',
    vendorId: 'mock-vendor-mama-put',
    status: 'delivered',
    subtotalKobo: 900000,
    deliveryFeeKobo: 150000,
    totalKobo: 1050000,
    deliveryArea: 'Lekki',
    deliveryStreet: '12 Admiralty Way',
    phone: '08012345678',
    paystackReference: 'mock-ref-001',
    createdAt: '2026-10-10T18:30:00Z',
    updatedAt: '2026-10-10T19:15:00Z',
    vendor: {
      id: 'mock-vendor-mama-put',
      name: 'Mama Put Kitchen',
      slug: 'mama-put-kitchen',
      imageUrl: '/images/vendors/mama-put-kitchen.jpg',
    },
    items: [
      {
        id: 'mock-oi-001',
        orderId: 'mock-order-001',
        menuItemId: 'item-mp-1',
        nameSnapshot: 'Egusi Soup with Pounded Yam',
        priceKoboSnapshot: 450000,
        quantity: 2,
      },
    ],
  },
]