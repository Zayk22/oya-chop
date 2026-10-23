'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleMenuItemAvailability } from '@/actions/vendor'
import { EditMenuItemModal } from './EditMenuItemModal'
import { formatNaira } from '@/lib/format'
import type { MenuCategory, MenuItem } from '@/types'

type MenuAvailabilityRowProps = {
  item: MenuItem
  categories: MenuCategory[]
}

export function MenuAvailabilityRow({ item, categories }: MenuAvailabilityRowProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const unavailable = !item.isAvailable

  function handleToggle() {
    setError(null)

    startTransition(async () => {
      const result = await toggleMenuItemAvailability(item.id)
      if (!result.success) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div
      className={`flex items-center gap-4 py-4 border-b border-border last:border-b-0 transition-opacity ${
        unavailable ? 'opacity-60' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-heading text-base font-bold text-ink leading-tight">
            {item.name}
          </h3>
          {unavailable && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-chip bg-surface-alt text-ink-muted">
              Sold out
            </span>
          )}
        </div>
        <p className="text-sm text-ink-muted mt-1 line-clamp-1">
          {item.description}
        </p>
        <p className="price text-sm text-ink mt-1.5">
          {formatNaira(item.priceKobo)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <EditMenuItemModal item={item} categories={categories} />

        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          aria-pressed={item.isAvailable}
          aria-label={
            item.isAvailable
              ? `Mark ${item.name} as sold out`
              : `Mark ${item.name} as available`
          }
          className={`relative inline-flex items-center w-12 h-7 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
            item.isAvailable ? 'bg-green' : 'bg-border'
          }`}
        >
          <span
            className={`inline-block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              item.isAvailable ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {error && <p className="text-xs text-chili basis-full">{error}</p>}
    </div>
  )
}