import Link from 'next/link'
import type { ReactNode } from 'react'

/* ============================================================
   OYA CHOP — Button
   ------------------------------------------------------------
   One component, three visual variants, two sizes, and a
   loading state. Used everywhere a clickable action appears.

   If `href` is provided, renders as a Next.js <Link>.
   Otherwise renders as a real <button>. That distinction
   matters: a link should be a link, a button should be a button.
   ============================================================ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'sm'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a small spinner and disables the button */
  loading?: boolean
  /** If provided, renders as a link instead of a button */
  href?: string
  /** Only used when rendering as a link */
  target?: string
  rel?: string
  /** Only used when rendering as a button */
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  className?: string
  children: ReactNode
}

/* Shared look applied to every variant */
const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-input ' +
  'transition-colors duration-150 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chili ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

/* Per-variant colors */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-chili text-white hover:bg-chili-dark',
  secondary: 'bg-green text-white hover:opacity-90',
  ghost: 'bg-transparent text-ink border border-border hover:bg-surface-alt',
}

/* Per-size padding + text size */
const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-base',
  sm: 'px-3 py-1.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  children,
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  /* Link version */
  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    )
  }

  /* Button version */
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  )
}

/* Small spinner used during the loading state */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}