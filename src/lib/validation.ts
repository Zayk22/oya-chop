import { z } from 'zod'
import { LAGOS_AREAS } from './constants'

/* ============================================================
   ZOD SCHEMAS
   ------------------------------------------------------------
   Runtime validation for anything that crosses a trust
   boundary — form inputs, Server Action arguments, webhook
   payloads. Never trust what the client sends.
   ============================================================ */

/* Single item in the cart being submitted to createOrder.
   priceKobo is included for display, but the server will
   re-read real prices from the DB. Never trust the price. */
export const cartLineSchema = z.object({
  menuItemId: z.string().uuid('Invalid item ID'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(20, 'Maximum 20 per item'),
})

/* Order creation input */
export const createOrderSchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID'),
  lines: z
    .array(cartLineSchema)
    .min(1, 'Cart is empty')
    .max(50, 'Too many items in one order'),
  deliveryArea: z.enum(LAGOS_AREAS, {
    message: 'Select a valid Lagos area',
  }),
  deliveryStreet: z
    .string()
    .trim()
    .min(5, 'Street address is too short')
    .max(200, 'Street address is too long'),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+?234|0)[789][01]\d{8}$/,
      'Enter a valid Nigerian phone number (e.g. 08012345678)'
    ),
})

/* Types derived from the schemas */
export type CartLineInput = z.infer<typeof cartLineSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>