'use client'

import { useEffect, RefObject } from 'react'

/* ============================================================
   USE FOCUS TRAP
   ------------------------------------------------------------
   Hook that traps keyboard focus inside a container while
   active. Combines four standard modal behaviors:

   1. Auto-focus the first focusable element when opened
   2. Trap Tab/Shift+Tab within the container
   3. Close on Escape (calls onClose if provided)
   4. Return focus to the trigger element when closed

   Usage:
     const containerRef = useRef<HTMLDivElement>(null)
     useFocusTrap(containerRef, isOpen, () => setIsOpen(false))
   ============================================================ */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape?: () => void
) {
  useEffect(() => {
    if (!isActive) return

    /* Assign to a const so TypeScript narrows it once and keeps
       the narrowing across the nested closures below. */
    const container = containerRef.current
    if (!container) return

    /* Remember what had focus before the modal opened */
    const previousFocus = document.activeElement as HTMLElement | null

    /* Collect all focusable elements inside the modal */
    function getFocusable(): HTMLElement[] {
      const nodes = container!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      return Array.from(nodes).filter((el) => el.offsetParent !== null)
    }

    /* Auto-focus the first focusable element */
    const focusable = getFocusable()
    if (focusable.length > 0) {
      requestAnimationFrame(() => focusable[0].focus())
    } else {
      container.focus()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey) {
        if (active === first || !container!.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last || !container!.contains(active)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus()
      }
    }
  }, [containerRef, isActive, onEscape])
}