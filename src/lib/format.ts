/* ============================================================
   OYA CHOP — Formatting helpers
   ------------------------------------------------------------
   All prices in the app are integers in kobo (1 naira = 100 kobo).
   These helpers convert them to display-ready strings.
   ============================================================ */

/* ============================================================
   formatNaira
   ------------------------------------------------------------
   Takes a number in KOBO and returns a formatted naira string.

     formatNaira(350000)   → "₦3,500"
     formatNaira(50000)    → "₦500"
     formatNaira(0)        → "₦0"

   No decimals are shown unless the amount isn't a whole naira.
   Nigerian food prices are always whole naira, so decimals only
   appear by accident — and when they do, we want to see them.
   ============================================================ */
export function formatNaira(kobo: number): string {
  const naira = kobo / 100

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    /* Show decimals only when there are actual kobo to show */
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(naira)
    /* Intl formats NGN as "₦" in most browsers, but some show "NGN".
       Force the ₦ symbol to keep it consistent. */
    .replace('NGN', '₦')
    .replace(/\s/g, '')
}

/* ============================================================
   koboToNaira / nairaToKobo
   ------------------------------------------------------------
   Convert between the two units when we need the raw number
   (e.g. for a form input where the user types "2500" meaning
   ₦2,500 and we store 250000).
   ============================================================ */
export function koboToNaira(kobo: number): number {
  return kobo / 100
}

export function nairaToKobo(naira: number): number {
  /* Use Math.round to avoid float precision issues.
     e.g. 25.1 * 100 = 2510.0000000000002 without rounding */
  return Math.round(naira * 100)
}

/* ============================================================
   formatRelativeTime
   ------------------------------------------------------------
   Turns an ISO timestamp into a short human phrase for the
   order-tracking and order-history pages.

     "2026-10-14T18:30:00Z" (5 min ago)  → "5 min ago"
     "2026-10-14T18:30:00Z" (2 hours ago) → "2 hours ago"
     "2026-10-13T18:30:00Z" (1 day ago)   → "Yesterday"
   ============================================================ */
export function formatRelativeTime(isoString: string): string {
  const then = new Date(isoString).getTime()
  const now = Date.now()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return 'Just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return minutes === 1 ? '1 min ago' : `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  }

  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  /* Older than a week — show the date */
  return new Date(isoString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}