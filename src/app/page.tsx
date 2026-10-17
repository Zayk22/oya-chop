import { Button } from '@/components/Button'
import { VendorGrid } from '@/components/VendorGrid'
import { VendorSearch } from '@/components/VendorSearch'
import { EmptyState } from '@/components/EmptyState'
import { mockVendors } from '@/lib/mock-data'

/* ============================================================
   HOME PAGE — vendor grid with search
   ------------------------------------------------------------
   Reads searchParams from the URL. Filters mock vendors
   locally for now. Task 3.7 replaces this with getVendors()
   from src/db/queries.ts.

   Server component. The only client part is <VendorSearch />.
   ============================================================ */

type HomePageProps = {
  searchParams: Promise<{ q?: string; cuisine?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const q = (params.q ?? '').toLowerCase().trim()
  const cuisine = params.cuisine ?? ''

  let vendors = mockVendors.filter((v) => v.isActive)

  if (q) {
    vendors = vendors.filter((v) => v.name.toLowerCase().includes(q))
  }

  if (cuisine) {
    vendors = vendors.filter((v) => v.cuisines.includes(cuisine))
  }

  return (
    <main>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">

          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-chip bg-surface-alt text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
              <span
                className="w-1.5 h-1.5 rounded-full bg-mustard"
                aria-hidden="true"
              />
              Coming soon to Lagos
            </span>

            <h1 className="mt-6 font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-ink">
              Oya, let&apos;s chop.
            </h1>

            <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-prose">
              Order from your favourite Lagos restaurants. Jollof, suya,
              shawarma, and everything in between — delivered to your door.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#vendors" variant="primary">
                Find food
              </Button>
              <Button href="/sign-up" variant="ghost">
                Create account
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-surface rounded-panel shadow-lift overflow-hidden max-w-sm ml-auto">
              <div
                className="h-48 bg-surface-alt"
                aria-hidden="true"
              />
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Preview
                </p>
                <h3 className="font-heading text-lg font-bold text-ink mt-1">
                  Party Jollof Rice
                </h3>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                  Smoky jollof with chicken, plantain, and coleslaw.
                </p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                  <span className="price font-heading text-lg font-bold text-ink">
                    ₦2,500
                  </span>
                  <span className="text-xs text-ink-muted">~30 min</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VENDORS */}
      <section id="vendors" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Restaurants
          </h2>
          <p className="text-ink-muted mt-1">
            Handpicked kitchens across Lagos.
          </p>
        </div>

        <div className="mb-6">
          <VendorSearch />
        </div>

        {vendors.length === 0 ? (
          <div className="bg-surface rounded-panel border border-border">
            <EmptyState
              title="Nothing here yet"
              description={
                q || cuisine
                  ? 'No kitchens match those filters. Oya, try something else.'
                  : 'Kitchens are loading. Check back shortly.'
              }
            />
          </div>
        ) : (
          <VendorGrid vendors={vendors} />
        )}
      </section>

    </main>
  )
}