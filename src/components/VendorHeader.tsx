import Image from 'next/image'
import { formatNaira } from '@/lib/format'
import type { Vendor } from '@/types'

/* ============================================================
   VENDOR HEADER
   ------------------------------------------------------------
   Hero banner for a vendor page. Large photo, name, description,
   cuisines, delivery estimate and fee.

   Server component — no interactivity.
   ============================================================ */

type VendorHeaderProps = {
  vendor: Vendor
}

export function VendorHeader({ vendor }: VendorHeaderProps) {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-10 items-center">

          {/* Photo */}
          <div className="relative aspect-[4/3] rounded-panel overflow-hidden bg-surface-alt">
            <Image
              src={vendor.imageUrl}
              alt={vendor.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-ink">
                {vendor.name}
              </h1>
              {!vendor.isActive && (
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-chip bg-surface-alt text-ink-muted mt-2">
                  Closed
                </span>
              )}
            </div>

            <p className="mt-3 text-ink-muted leading-relaxed">
              {vendor.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {vendor.cuisines.map((c) => (
                <span
                  key={c}
                  className="text-[11px] font-medium px-2 py-1 rounded-chip bg-surface-alt text-ink-muted"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                ~{vendor.deliveryEstimateMin} min
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                {vendor.deliveryFeeKobo === 0
                  ? 'Free delivery'
                  : `${formatNaira(vendor.deliveryFeeKobo)} delivery`}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}