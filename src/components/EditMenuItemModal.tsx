'use client'

import { useState, useTransition, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateMenuItem } from '@/actions/menu'
import { useFocusTrap } from '@/lib/useFocusTrap'
import type { MenuCategory, MenuItem } from '@/types'

type EditMenuItemModalProps = {
  item: MenuItem
  categories: MenuCategory[]
}

export function EditMenuItemModal({ item, categories }: EditMenuItemModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [newPreview, setNewPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (isPending) return
    setIsOpen(false)
    setError(null)
    setNewPreview(null)
    formRef.current?.reset()
  }, [isPending])

  useFocusTrap(modalRef, isOpen, handleClose)

  function handleOpen() {
    setIsOpen(true)
    setError(null)
    setNewPreview(null)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setNewPreview(url)
    } else {
      setNewPreview(null)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateMenuItem(item.id, formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      setIsOpen(false)
      setNewPreview(null)
      router.refresh()
    })
  }

  const priceNaira = item.priceKobo / 100

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs text-ink-muted hover:text-chili transition-colors font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili rounded"
      >
        Edit
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
            aria-labelledby="edit-item-title"
            className="bg-surface rounded-panel border border-border shadow-lift w-full max-w-md my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2
                id="edit-item-title"
                className="font-heading text-lg font-bold text-ink"
              >
                Edit menu item
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
                <label htmlFor="edit-item-name" className="block text-sm font-medium text-ink mb-1.5">
                  Name
                </label>
                <input
                  id="edit-item-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  defaultValue={item.name}
                  disabled={isPending}
                  className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="edit-item-description" className="block text-sm font-medium text-ink mb-1.5">
                  Description
                </label>
                <textarea
                  id="edit-item-description"
                  name="description"
                  required
                  maxLength={300}
                  rows={2}
                  defaultValue={item.description}
                  disabled={isPending}
                  className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-item-price" className="block text-sm font-medium text-ink mb-1.5">
                    Price (₦)
                  </label>
                  <input
                    id="edit-item-price"
                    name="priceNaira"
                    type="number"
                    required
                    min={100}
                    max={50000}
                    step={50}
                    defaultValue={priceNaira}
                    disabled={isPending}
                    className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60"
                  />
                </div>
                <div>
                  <label htmlFor="edit-item-category" className="block text-sm font-medium text-ink mb-1.5">
                    Category
                  </label>
                  <select
                    id="edit-item-category"
                    name="categoryId"
                    required
                    defaultValue={item.categoryId}
                    disabled={isPending}
                    className="w-full px-3 py-2.5 rounded-input bg-background border border-border text-ink text-sm focus:outline-none focus:border-chili focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili disabled:opacity-60"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-item-image" className="block text-sm font-medium text-ink mb-1.5">
                  Image
                </label>
                {item.imageUrl && !newPreview && (
                  <div className="mb-2 relative w-20 h-20 rounded-input overflow-hidden bg-surface-alt">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                {newPreview && (
                  <div className="mb-2 relative w-20 h-20 rounded-input overflow-hidden bg-surface-alt ring-2 ring-chili">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={newPreview}
                      alt="New image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  id="edit-item-image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isPending}
                  className="w-full text-sm text-ink-muted file:mr-3 file:py-2 file:px-3 file:rounded-input file:border-0 file:text-sm file:font-medium file:bg-surface-alt file:text-ink hover:file:bg-border transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili"
                />
                <p className="text-xs text-ink-muted mt-1">
                  {item.imageUrl
                    ? 'Leave blank to keep the current image.'
                    : 'JPEG, PNG, or WebP. Max 5MB.'}
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
                  {isPending ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}