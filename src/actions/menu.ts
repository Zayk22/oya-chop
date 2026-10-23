'use server'

import { eq, and } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { vendors, menuItems, menuCategories } from '@/db/schema'
import { uploadImage } from '@/lib/cloudinary'
import { auth } from '@clerk/nextjs/server'

/* ============================================================
   MENU ITEM CRUD ACTIONS
   ------------------------------------------------------------
   Vendor-only. Every action checks: signed in, owns a vendor,
   target belongs to that vendor (for update/delete).
   ============================================================ */

type MenuItemActionResult =
  | { success: true; itemId: string }
  | { success: false; error: string }

const MIN_PRICE_KOBO = 10000   // ₦100
const MAX_PRICE_KOBO = 5000000 // ₦50,000
const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 80
const MAX_DESCRIPTION_LENGTH = 300

/* ============================================================
   CREATE
   ============================================================ */

export async function createMenuItem(
  formData: FormData
): Promise<MenuItemActionResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Not signed in.' }
    }

    const db = getDb()

    /* Ownership */
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.ownerClerkUserId, userId))
      .limit(1)

    if (!vendor) {
      return { success: false, error: 'You are not a vendor.' }
    }

    /* Parse fields */
    const name = (formData.get('name') as string | null)?.trim() ?? ''
    const description = (formData.get('description') as string | null)?.trim() ?? ''
    const priceStr = formData.get('priceNaira') as string | null
    const categoryId = formData.get('categoryId') as string | null
    const imageFile = formData.get('image')

    /* Validate name */
    if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
      return {
        success: false,
        error: `Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`,
      }
    }

    /* Validate description */
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return {
        success: false,
        error: `Description must be under ${MAX_DESCRIPTION_LENGTH} characters.`,
      }
    }

    /* Validate price — form sends naira, DB stores kobo */
    const priceNaira = priceStr ? Number(priceStr) : NaN
    if (!Number.isFinite(priceNaira) || priceNaira < 0) {
      return { success: false, error: 'Invalid price.' }
    }
    const priceKobo = Math.round(priceNaira * 100)
    if (priceKobo < MIN_PRICE_KOBO || priceKobo > MAX_PRICE_KOBO) {
      return {
        success: false,
        error: `Price must be between ₦${MIN_PRICE_KOBO / 100} and ₦${MAX_PRICE_KOBO / 100}.`,
      }
    }

    /* Validate category */
    if (!categoryId) {
      return { success: false, error: 'Category is required.' }
    }
    const [category] = await db
      .select()
      .from(menuCategories)
      .where(
        and(
          eq(menuCategories.id, categoryId),
          eq(menuCategories.vendorId, vendor.id)
        )
      )
      .limit(1)

    if (!category) {
      return { success: false, error: 'Category not found.' }
    }

    /* Validate image */
    if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
      return { success: false, error: 'Image is required.' }
    }

    /* Upload to Cloudinary */
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    let imageUrl: string

    try {
      imageUrl = await uploadImage(buffer, imageFile.type, 'oya-chop/menu')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.'
      return { success: false, error: message }
    }

    /* Insert */
    const [inserted] = await db
      .insert(menuItems)
      .values({
        vendorId: vendor.id,
        categoryId: category.id,
        name,
        description,
        priceKobo,
        imageUrl,
        isAvailable: true,
      })
      .returning({ id: menuItems.id })

    return { success: true, itemId: inserted.id }
  } catch (err) {
    console.error('createMenuItem error:', err)
    return { success: false, error: 'Failed to create item.' }
  }
}

/* ============================================================
   UPDATE
   ============================================================ */

export async function updateMenuItem(
  itemId: string,
  formData: FormData
): Promise<MenuItemActionResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Not signed in.' }
    }

    const db = getDb()

    /* Ownership */
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.ownerClerkUserId, userId))
      .limit(1)

    if (!vendor) {
      return { success: false, error: 'You are not a vendor.' }
    }

    /* Load existing item and verify ownership via vendorId */
    const [existing] = await db
      .select()
      .from(menuItems)
      .where(
        and(
          eq(menuItems.id, itemId),
          eq(menuItems.vendorId, vendor.id)
        )
      )
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Item not found.' }
    }

    /* Parse fields */
    const name = (formData.get('name') as string | null)?.trim() ?? ''
    const description = (formData.get('description') as string | null)?.trim() ?? ''
    const priceStr = formData.get('priceNaira') as string | null
    const categoryId = formData.get('categoryId') as string | null
    const imageFile = formData.get('image')

    /* Validate name */
    if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
      return {
        success: false,
        error: `Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`,
      }
    }

    /* Validate description */
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return {
        success: false,
        error: `Description must be under ${MAX_DESCRIPTION_LENGTH} characters.`,
      }
    }

    /* Validate price */
    const priceNaira = priceStr ? Number(priceStr) : NaN
    if (!Number.isFinite(priceNaira) || priceNaira < 0) {
      return { success: false, error: 'Invalid price.' }
    }
    const priceKobo = Math.round(priceNaira * 100)
    if (priceKobo < MIN_PRICE_KOBO || priceKobo > MAX_PRICE_KOBO) {
      return {
        success: false,
        error: `Price must be between ₦${MIN_PRICE_KOBO / 100} and ₦${MAX_PRICE_KOBO / 100}.`,
      }
    }

    /* Validate category */
    if (!categoryId) {
      return { success: false, error: 'Category is required.' }
    }
    const [category] = await db
      .select()
      .from(menuCategories)
      .where(
        and(
          eq(menuCategories.id, categoryId),
          eq(menuCategories.vendorId, vendor.id)
        )
      )
      .limit(1)

    if (!category) {
      return { success: false, error: 'Category not found.' }
    }

    /* Image: only upload if a new file was provided */
    let imageUrl = existing.imageUrl
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      try {
        imageUrl = await uploadImage(buffer, imageFile.type, 'oya-chop/menu')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed.'
        return { success: false, error: message }
      }
    }

    /* Update */
    await db
      .update(menuItems)
      .set({
        name,
        description,
        priceKobo,
        categoryId: category.id,
        imageUrl,
      })
      .where(eq(menuItems.id, itemId))

    return { success: true, itemId }
  } catch (err) {
    console.error('updateMenuItem error:', err)
    return { success: false, error: 'Failed to update item.' }
  }
}