/* ============================================================
   CONSTANTS
   ============================================================ */

/* Lagos areas where Oya Chop delivers */
export const LAGOS_AREAS = [
  'Ikeja',
  'Lekki',
  'Yaba',
  'Surulere',
  'Victoria Island',
  'Ajah',
  'Maryland',
  'Gbagada',
  'Ikoyi',
] as const

export type LagosArea = (typeof LAGOS_AREAS)[number]