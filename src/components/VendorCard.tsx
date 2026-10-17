import Image from 'next/image'
import Link from 'next/link'
import { formatNaira } from '@/lib/format'
import type { Vendor } from '@/types'

/* ============================================================
   VENDOR CARD
   ------------------------------------------------------------
   One vendor tile in the home grid. Server component — no
   interactivity, so no 'use client'.

   Uses next/image for automatic resizing and lazy loading.
   The image is local (in /public), so no remotePatterns config
   needed.
   ============================================================ */

type VendorCardProps = {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="group block bg-surface rounded-card overflow-hidden border border-border transition-shadow hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] bg-surface-alt overflow-hidden">
        <Image
          src={vendor.imageUrl}
          alt={vendor.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-bold text-ink leading-tight">
            {vendor.name}
          </h3>
          {!vendor.isActive && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-chip bg-surface-alt text-ink-muted">
              Closed
            </span>
          )}
        </div>

        <p className="text-sm text-ink-muted mt-1 leading-relaxed line-clamp-2">
          {vendor.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {vendor.cuisines.map((c) => (
            <span
              key={c}
              className="text-[11px] font-medium px-2 py-1 rounded-chip bg-surface-alt text-ink-muted"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-sm">
          <span className="text-ink-muted">
            ~{vendor.deliveryEstimateMin} min
          </span>
          <span className="text-ink-muted">
            {vendor.deliveryFeeKobo === 0
              ? 'Free delivery'
              : `${formatNaira(vendor.deliveryFeeKobo)} delivery`}
          </span>
        </div>
      </div>
    </Link>
  )
}