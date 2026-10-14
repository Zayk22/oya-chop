import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

// ---------- 2.3 vendors + menu_categories ----------

export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  cuisines: text('cuisines').array().notNull().default([]),
  imageUrl: text('image_url').notNull().default(''),
  deliveryEstimateMin: integer('delivery_estimate_min').notNull(),
  deliveryFeeKobo: integer('delivery_fee_kobo').notNull(), // flat per vendor
  isActive: boolean('is_active').notNull().default(true),
  ownerClerkUserId: text('owner_clerk_user_id'), // links a Clerk user to their vendor
})

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  vendorId: uuid('vendor_id')
    .notNull()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

// ---------- 2.4 menu_items ----------

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  vendorId: uuid('vendor_id')
    .notNull()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => menuCategories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  priceKobo: integer('price_kobo').notNull(), // integer, kobo
  imageUrl: text('image_url').notNull().default(''),
  isAvailable: boolean('is_available').notNull().default(true),
})

// ---------- 2.5 orders + order_items ----------

export const orderStatus = pgEnum('order_status', [
  'pending_payment',
  'placed',
  'accepted',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
])

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: text('customer_id').notNull(), // Clerk user id
  vendorId: uuid('vendor_id')
    .notNull()
    .references(() => vendors.id),
  status: orderStatus('status').notNull().default('pending_payment'),
  subtotalKobo: integer('subtotal_kobo').notNull(),
  deliveryFeeKobo: integer('delivery_fee_kobo').notNull(),
  totalKobo: integer('total_kobo').notNull(),
  deliveryArea: text('delivery_area').notNull(),
  deliveryStreet: text('delivery_street').notNull(),
  phone: text('phone').notNull(),
  paystackReference: text('paystack_reference').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => menuItems.id),
  nameSnapshot: text('name_snapshot').notNull(),
  priceKoboSnapshot: integer('price_kobo_snapshot').notNull(),
  quantity: integer('quantity').notNull(),
})
