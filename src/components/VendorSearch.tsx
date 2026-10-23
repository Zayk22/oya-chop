'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const CUISINES = ['Nigerian', 'Rice', 'Soups', 'Grill', 'Suya', 'Snacks', 'Bakery']

export function VendorSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialQ = searchParams.get('q') ?? ''
  const initialCuisine = searchParams.get('cuisine') ?? ''

  const [q, setQ] = useState(initialQ)
  const [cuisine, setCuisine] = useState(initialCuisine)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set('q', q)
      } else {
        params.delete('q')
      }

      const next = params.toString()
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    }, 400)

    return () => clearTimeout(timer)
  }, [q, pathname, router, searchParams])

  function handleCuisineChange(next: string) {
    setCuisine(next)

    const params = new URLSearchParams(searchParams.toString())
    if (next) {
      params.set('cuisine', next)
    } else {
      params.delete('cuisine')
    }

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(url, { scroll: false })
  }

  const hasFilters = q || cuisine

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search kitchens…"
          aria-label="Search kitchens by name"
          className="w-full pl-9 pr-3 py-2.5 rounded-input bg-surface border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
        />
      </div>

      <select
        value={cuisine}
        onChange={(e) => handleCuisineChange(e.target.value)}
        aria-label="Filter by cuisine"
        className="px-3 py-2.5 rounded-input bg-surface border border-border text-ink text-sm focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
      >
        <option value="">All cuisines</option>
        {CUISINES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {hasFilters ? (
        <button
          onClick={() => {
            setQ('')
            setCuisine('')
            router.replace(pathname, { scroll: false })
          }}
          className="px-3 py-2.5 rounded-input text-sm text-ink-muted transition-colors hover:text-ink hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
        >
          Clear
        </button>
      ) : null}
    </div>
  )
}