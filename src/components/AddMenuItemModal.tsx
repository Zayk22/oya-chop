'use client'

import { useState, useTransition, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createMenuItem } from '@/actions/menu'
import { useFocusTrap } from '@/lib/useFocusTrap'
import type { MenuCategory } from '@/types'

type AddMenuItemModalProps = {
  categories: MenuCategory[]
}

export function AddMenuItemModal({ categories }: AddMenuItemModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (isPending) return
    setIsOpen(false)
    setError(null)
    formRef.current?.reset()
  }, [isPending])

  /* Focus trap active when modal is open */
  useFocusTrap(modalRef, isOpen, handleClose)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createMenuItem(formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      setIsOpen(false)
      formRef.current?.reset()
      router.refresh()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-input bg-chili text-white text-sm font-medium transition-colors hover:bg-chili-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add item
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-item-title"
            className="bg-surface rounded-panel border border-border shadow-lift w-full max-w-md my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2
                id="add-item-title"
                className="font-heading text-lg font-bold text-ink"
              >
                Add menu item
              </h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                aria-label="Close"
                className="w-8 h-8 rounded-full text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mx-auto"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label htmlFor="item-name" className="block text-sm font-medium text-ink mb-1.5">
                  Name
                </label>
                <input
                  id="item-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  disabled={isPending}
                  placeholder="Egusi Soup with Pounded Yam"
                  className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="item-description" className="block text-sm font-medium text-ink mb-1.5">
                  Description
                </label>
                <textarea
                  id="item-description"
                  name="description"
                  required
                  maxLength={300}
                  rows={2}
                  disabled={isPending}
                  placeholder="Melon seed soup with assorted meat and stockfish."
                  className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="item-price" className="block text-sm font-medium text-ink mb-1.5">
                    Price (₦)
                  </label>
                  <input
                    id="item-price"
                    name="priceNaira"
                    type="number"
                    required
                    min={100}
                    max={50000}
                    step={50}
                    disabled={isPending}
                    placeholder="3500"
                    className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60"
                  />
                </div>
                <div>
                  <label htmlFor="item-category" className="block text-sm font-medium text-ink mb-1.5">
                    Category
                  </label>
                  <select
                    id="item-category"
                    name="categoryId"
                    required
                    disabled={isPending}
                    className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60"
                  >
                    <option value="">Choose…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="item-image" className="block text-sm font-medium text-ink mb-1.5">
                  Image
                </label>
                <input
                  id="item-image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  disabled={isPending}
                  className="w-full text-sm text-ink-muted file:mr-3 file:py-2 file:px-3 file:rounded-input file:border-0 file:text-sm file:font-medium file:bg-surface-alt file:text-ink hover:file:bg-border transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
                />
                <p className="text-xs text-ink-muted mt-1">
                  JPEG, PNG, or WebP. Max 5MB.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-input bg-chili/10 border border-chili/30 text-sm text-ink"
                >
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 rounded-input border border-border text-ink-muted text-sm font-medium transition-colors hover:text-ink disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 rounded-input bg-chili text-white text-sm font-medium transition-colors hover:bg-chili-dark disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
                >
                  {isPending ? 'Saving…' : 'Add item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}