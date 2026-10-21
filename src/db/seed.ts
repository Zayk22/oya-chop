import { getDb } from './client'
import {
  vendors,
  menuCategories,
  menuItems,
  orderItems,
  orders,
} from './schema'

// All prices are in kobo: ₦3,500 = 350000.
// imageUrl points at files in public/images/vendors/<slug>.jpg

type SeedItem = {
  name: string
  description: string
  priceKobo: number
  isAvailable?: boolean
}
type SeedCategory = { name: string; items: SeedItem[] }
type SeedVendor = {
  name: string
  slug: string
  description: string
  cuisines: string[]
  imageUrl: string
  deliveryEstimateMin: number
  deliveryFeeKobo: number
  isActive?: boolean
  categories: SeedCategory[]
}

const data: SeedVendor[] = [
  {
    name: 'Mama Put Kitchen',
    slug: 'mama-put-kitchen',
    description:
      'Home-style Nigerian soups and swallow, cooked the way mama makes it.',
    cuisines: ['Nigerian', 'Soups'],
    imageUrl: '/images/vendors/mama-put-kitchen.jpg',
    deliveryEstimateMin: 40,
    deliveryFeeKobo: 150000,
    categories: [
      {
        name: 'Soups & Swallow',
        items: [
          {
            name: 'Egusi Soup with Pounded Yam',
            description: 'Melon seed soup with assorted meat and stockfish.',
            priceKobo: 450000,
          },
          {
            name: 'Efo Riro with Eba',
            description: 'Rich spinach stew with ponmo and goat meat.',
            priceKobo: 380000,
          },
          {
            name: 'Okra Soup with Amala',
            description: 'Draw soup with fish and shaki.',
            priceKobo: 400000,
            isAvailable: false,
          },
        ],
      },
      {
        name: 'Sides',
        items: [
          {
            name: 'Fried Plantain (Dodo)',
            description: 'Sweet ripe plantain, fried golden.',
            priceKobo: 100000,
          },
          {
            name: 'Moi Moi',
            description: 'Steamed bean pudding with egg.',
            priceKobo: 120000,
          },
        ],
      },
    ],
  },
  {
    name: 'Lagos Jollof House',
    slug: 'lagos-jollof-house',
    description: 'Party jollof, fried rice and grilled chicken, all day.',
    cuisines: ['Nigerian', 'Rice'],
    imageUrl: '/images/vendors/lagos-jollof-house.jpg',
    deliveryEstimateMin: 30,
    deliveryFeeKobo: 100000,
    categories: [
      {
        name: 'Rice Meals',
        items: [
          {
            name: 'Party Jollof Rice & Chicken',
            description: 'Smoky jollof with a grilled chicken thigh.',
            priceKobo: 350000,
          },
          {
            name: 'Fried Rice & Turkey',
            description: 'Vegetable fried rice with peppered turkey.',
            priceKobo: 420000,
          },
          {
            name: 'Ofada Rice & Ayamase',
            description: 'Local rice with green pepper stew and assorted meat.',
            priceKobo: 420000,
          },
        ],
      },
      {
        name: 'Drinks',
        items: [
          {
            name: 'Chapman',
            description: 'Classic Nigerian fruit punch.',
            priceKobo: 180000,
          },
          {
            name: 'Zobo',
            description: 'Chilled hibiscus drink with ginger.',
            priceKobo: 80000,
          },
        ],
      },
    ],
  },
  {
    name: 'Suya Spot',
    slug: 'suya-spot',
    description: 'Spicy grilled suya, fresh off the fire with yaji.',
    cuisines: ['Grill', 'Suya'],
    imageUrl: '/images/vendors/suya-spot.jpg',
    deliveryEstimateMin: 25,
    deliveryFeeKobo: 120000,
    categories: [
      {
        name: 'Grill',
        items: [
          {
            name: 'Beef Suya',
            description: 'Thin-sliced beef, yaji spice, onions and tomatoes.',
            priceKobo: 250000,
          },
          {
            name: 'Chicken Suya',
            description: 'Grilled chicken with yaji and cabbage.',
            priceKobo: 300000,
          },
          {
            name: 'Pepper Soup (Goat Meat)',
            description: 'Hot and peppery broth with tender goat meat.',
            priceKobo: 300000,
          },
        ],
      },
    ],
  },
  {
    name: 'Small Chops Corner',
    slug: 'small-chops-corner',
    description: 'Puff puff, meat pies and party snacks.',
    cuisines: ['Snacks', 'Bakery'],
    imageUrl: '/images/vendors/small-chops-corner.jpg',
    deliveryEstimateMin: 20,
    deliveryFeeKobo: 100000,
    isActive: false,
    categories: [
      {
        name: 'Snacks',
        items: [
          {
            name: 'Puff Puff (10 pcs)',
            description: 'Soft fried dough balls, lightly sweet.',
            priceKobo: 150000,
          },
          {
            name: 'Meat Pie',
            description: 'Flaky pastry with minced beef and potato.',
            priceKobo: 100000,
          },
        ],
      },
    ],
  },
]

async function main() {
  const db = getDb()

  console.log('Clearing old data...')
  await db.delete(orderItems)
  await db.delete(orders)
  await db.delete(menuItems)
  await db.delete(menuCategories)
  await db.delete(vendors)

  for (const v of data) {
    const [vendor] = await db
      .insert(vendors)
      .values({
        name: v.name,
        slug: v.slug,
        description: v.description,
        cuisines: v.cuisines,
        imageUrl: v.imageUrl,
        deliveryEstimateMin: v.deliveryEstimateMin,
        deliveryFeeKobo: v.deliveryFeeKobo,
        isActive: v.isActive ?? true,
      })
      .returning()

    for (const [index, c] of v.categories.entries()) {
      const [category] = await db
        .insert(menuCategories)
        .values({ vendorId: vendor.id, name: c.name, sortOrder: index })
        .returning()

      await db.insert(menuItems).values(
        c.items.map((i) => ({
          vendorId: vendor.id,
          categoryId: category.id,
          name: i.name,
          description: i.description,
          priceKobo: i.priceKobo,
          isAvailable: i.isAvailable ?? true,
        })),
      )
    }
    console.log(`Seeded ${v.name}`)
  }

  const counts = {
    vendors: (await db.select().from(vendors)).length,
    categories: (await db.select().from(menuCategories)).length,
    items: (await db.select().from(menuItems)).length,
  }
  console.log('Done:', counts)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})