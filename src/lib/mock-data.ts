/* ============================================================
   MOCK DATA
   ------------------------------------------------------------
   Fake data that matches the shapes in src/types/index.ts.
   Used by Dev A to build UI before the real database exists.
   Swapped out for real queries once Dev B's backend is ready.

   Not used in production. Safe to delete at the end of Phase 3.

   Prices are in KOBO. ₦2,500 → 250000.
   ============================================================ */

import type { Vendor, MenuCategory, MenuItem, OrderWithItems } from '@/types'

/* ---------- Vendors ---------- */

export const mockVendors: Vendor[] = [
  {
    id: 'vendor_mama_nkechi',
    name: "Mama Nkechi's Kitchen",
    slug: 'mama-nkechi',
    description: 'Home-style Nigerian cooking, the way your mother would make it.',
    cuisines: ['Nigerian', 'Home Cooked'],
    imageUrl: '/images/vendors/mama-nkechi.jpg',
    deliveryEstimateMin: 35,
    deliveryFeeKobo: 50000,
    isActive: true,
    ownerClerkUserId: null,
  },
  {
    id: 'vendor_suya_republic',
    name: 'Suya Republic',
    slug: 'suya-republic',
    description: 'Charcoal-grilled suya, kilishi, and asun. Real Lagos night flavour.',
    cuisines: ['Grills', 'Suya', 'Nigerian'],
    imageUrl: '/images/vendors/suya-republic.jpg',
    deliveryEstimateMin: 25,
    deliveryFeeKobo: 70000,
    isActive: true,
    ownerClerkUserId: null,
  },
  {
    id: 'vendor_chop_life',
    name: 'Chop Life Shawarma',
    slug: 'chop-life-shawarma',
    description: 'Shawarma, small chops, and Chapman. Fast, fresh, filling.',
    cuisines: ['Fast Food', 'Shawarma', 'Snacks'],
    imageUrl: '/images/vendors/chop-life.jpg',
    deliveryEstimateMin: 20,
    deliveryFeeKobo: 40000,
    isActive: true,
    ownerClerkUserId: null,
  },
  {
    id: 'vendor_ofada_palace',
    name: 'Ofada Palace',
    slug: 'ofada-palace',
    description: 'Ofada rice and ayamase, pounded yam and egusi. Traditional cooking, no shortcuts.',
    cuisines: ['Nigerian', 'Traditional'],
    imageUrl: '/images/vendors/ofada-palace.jpg',
    deliveryEstimateMin: 40,
    deliveryFeeKobo: 60000,
    isActive: true,
    ownerClerkUserId: null,
  },
]

/* ---------- Menu categories ---------- */

export const mockCategories: MenuCategory[] = [
  // Mama Nkechi
  { id: 'cat_mn_rice', vendorId: 'vendor_mama_nkechi', name: 'Rice Dishes', sortOrder: 1 },
  { id: 'cat_mn_sides', vendorId: 'vendor_mama_nkechi', name: 'Sides & Extras', sortOrder: 2 },

  // Suya Republic
  { id: 'cat_sr_grills', vendorId: 'vendor_suya_republic', name: 'From The Grill', sortOrder: 1 },
  { id: 'cat_sr_sides', vendorId: 'vendor_suya_republic', name: 'Sides', sortOrder: 2 },

  // Chop Life
  { id: 'cat_cl_wraps', vendorId: 'vendor_chop_life', name: 'Wraps', sortOrder: 1 },
  { id: 'cat_cl_drinks', vendorId: 'vendor_chop_life', name: 'Drinks', sortOrder: 2 },

  // Ofada Palace
  { id: 'cat_op_trad', vendorId: 'vendor_ofada_palace', name: 'Traditional', sortOrder: 1 },
  { id: 'cat_op_swallow', vendorId: 'vendor_ofada_palace', name: 'Swallow', sortOrder: 2 },
]

/* ---------- Menu items ---------- */

export const mockItems: MenuItem[] = [
  // Mama Nkechi — Rice Dishes
  {
    id: 'item_mn_jollof',
    vendorId: 'vendor_mama_nkechi',
    categoryId: 'cat_mn_rice',
    name: 'Party Jollof Rice',
    description: 'Smoky jollof with chicken, fried plantain, and coleslaw.',
    priceKobo: 250000,
    imageUrl: '/images/items/jollof.jpg',
    isAvailable: true,
  },
  {
    id: 'item_mn_ofada',
    vendorId: 'vendor_mama_nkechi',
    categoryId: 'cat_mn_rice',
    name: 'Ofada Rice & Ayamase',
    description: 'Local ofada rice with rich green pepper stew and assorted meat.',
    priceKobo: 320000,
    imageUrl: '/images/items/ofada.jpg',
    isAvailable: true,
  },
  {
    id: 'item_mn_fried',
    vendorId: 'vendor_mama_nkechi',
    categoryId: 'cat_mn_rice',
    name: 'Fried Rice',
    description: 'Vegetable fried rice with liver and boiled egg.',
    priceKobo: 230000,
    imageUrl: '/images/items/fried-rice.jpg',
    isAvailable: true,
  },
  {
    id: 'item_mn_moi',
    vendorId: 'vendor_mama_nkechi',
    categoryId: 'cat_mn_sides',
    name: 'Moi Moi',
    description: 'Steamed bean pudding, wrapped the old way.',
    priceKobo: 50000,
    imageUrl: '/images/items/moi-moi.jpg',
    isAvailable: true,
  },

  // Suya Republic — Grills
  {
    id: 'item_sr_suya_beef',
    vendorId: 'vendor_suya_republic',
    categoryId: 'cat_sr_grills',
    name: 'Beef Suya',
    description: 'Spicy grilled beef skewers with onions, tomato, and yaji.',
    priceKobo: 350000,
    imageUrl: '/images/items/suya.jpg',
    isAvailable: true,
  },
  {
    id: 'item_sr_kilishi',
    vendorId: 'vendor_suya_republic',
    categoryId: 'cat_sr_grills',
    name: 'Kilishi',
    description: 'Dried spiced beef, Hausa style. Chewy, fiery, perfect.',
    priceKobo: 400000,
    imageUrl: '/images/items/kilishi.jpg',
    isAvailable: true,
  },
  {
    id: 'item_sr_asun',
    vendorId: 'vendor_suya_republic',
    categoryId: 'cat_sr_grills',
    name: 'Asun',
    description: 'Smoky peppered goat meat, chopped and tossed with scotch bonnet.',
    priceKobo: 450000,
    imageUrl: '/images/items/asun.jpg',
    isAvailable: false,  // example of an unavailable item
  },
  {
    id: 'item_sr_plantain',
    vendorId: 'vendor_suya_republic',
    categoryId: 'cat_sr_sides',
    name: 'Grilled Plantain',
    description: 'Ripe plantain grilled over charcoal.',
    priceKobo: 80000,
    imageUrl: '/images/items/plantain.jpg',
    isAvailable: true,
  },

  // Chop Life — Wraps
  {
    id: 'item_cl_chicken',
    vendorId: 'vendor_chop_life',
    categoryId: 'cat_cl_wraps',
    name: 'Chicken Shawarma',
    description: 'Grilled chicken, cabbage, sausage, and their secret sauce.',
    priceKobo: 200000,
    imageUrl: '/images/items/shawarma.jpg',
    isAvailable: true,
  },
  {
    id: 'item_cl_beef',
    vendorId: 'vendor_chop_life',
    categoryId: 'cat_cl_wraps',
    name: 'Beef Shawarma',
    description: 'Same wrap, beef version. Extra sauce on request.',
    priceKobo: 220000,
    imageUrl: '/images/items/beef-shawarma.jpg',
    isAvailable: true,
  },
  {
    id: 'item_cl_smallchops',
    vendorId: 'vendor_chop_life',
    categoryId: 'cat_cl_wraps',
    name: 'Small Chops Platter',
    description: 'Puff puff, samosa, spring roll, and peppered gizzard.',
    priceKobo: 250000,
    imageUrl: '/images/items/small-chops.jpg',
    isAvailable: true,
  },
  {
    id: 'item_cl_chapman',
    vendorId: 'vendor_chop_life',
    categoryId: 'cat_cl_drinks',
    name: 'Chapman',
    description: 'Chilled Chapman with cucumber, orange, and a cherry on top.',
    priceKobo: 150000,
    imageUrl: '/images/items/chapman.jpg',
    isAvailable: true,
  },

  // Ofada Palace — Traditional
  {
    id: 'item_op_ayamase',
    vendorId: 'vendor_ofada_palace',
    categoryId: 'cat_op_trad',
    name: 'Ayamase & Ofada Rice',
    description: 'The full traditional plate. Green pepper stew, assorted meat, ofada rice.',
    priceKobo: 350000,
    imageUrl: '/images/items/ayamase.jpg',
    isAvailable: true,
  },
  {
    id: 'item_op_egusi',
    vendorId: 'vendor_ofada_palace',
    categoryId: 'cat_op_swallow',
    name: 'Pounded Yam & Egusi',
    description: 'Smooth pounded yam with rich egusi soup and goat meat.',
    priceKobo: 300000,
    imageUrl: '/images/items/pounded-yam-egusi.jpg',
    isAvailable: true,
  },
  {
    id: 'item_op_efo',
    vendorId: 'vendor_ofada_palace',
    categoryId: 'cat_op_swallow',
    name: 'Eba & Efo Riro',
    description: 'Eba with spicy spinach stew, locust beans, and ponmo.',
    priceKobo: 280000,
    imageUrl: '/images/items/efo-riro.jpg',
    isAvailable: true,
  },
]

/* ---------- A sample order, for order-history UI ---------- */

export const mockOrders: OrderWithItems[] = [
  {
    id: 'order_mock_001',
    customerId: 'user_mock_customer',
    vendorId: 'vendor_mama_nkechi',
    status: 'delivered',
    subtotalKobo: 500000,
    deliveryFeeKobo: 50000,
    totalKobo: 550000,
    deliveryArea: 'Lekki',
    deliveryStreet: '12 Admiralty Way',
    phone: '08012345678',
    paystackReference: 'mock_ref_001',
    createdAt: '2026-10-10T18:30:00Z',
    updatedAt: '2026-10-10T19:15:00Z',
    vendor: {
      id: 'vendor_mama_nkechi',
      name: "Mama Nkechi's Kitchen",
      slug: 'mama-nkechi',
      imageUrl: '/images/vendors/mama-nkechi.jpg',
    },
    items: [
      {
        id: 'oi_001',
        orderId: 'order_mock_001',
        menuItemId: 'item_mn_jollof',
        nameSnapshot: 'Party Jollof Rice',
        priceKoboSnapshot: 250000,
        quantity: 2,
      },
    ],
  },
]