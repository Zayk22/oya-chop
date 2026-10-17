import { VendorCard } from './VendorCard'
import type { Vendor } from '@/types'

/* ============================================================
   VENDOR GRID
   ------------------------------------------------------------
   Responsive grid of vendor cards. 1 column on mobile,
   2 on tablet, 3 on desktop.
   ============================================================ */

type VendorGridProps = {
  vendors: Vendor[]
}

export function VendorGrid({ vendors }: VendorGridProps) {
  if (vendors.length === 0) {
    return null   // callers handle empty state separately
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  )
}