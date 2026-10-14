/* ============================================================
   OYA CHOP — Skeleton
   ------------------------------------------------------------
   A gray placeholder that occupies the space content will fill.
   Used while data is loading. Prevents layout shift by taking
   the same dimensions as the real content.

   Variants:
     - <Skeleton />              : single line of text
     - <Skeleton width="60%" />  : custom width
     - <Skeleton shape="circle" /> : round avatar placeholder
     - <Skeleton shape="rect" h="200px" /> : big block

   Pulse animation is CSS-only — no JS.
   ============================================================ */

type SkeletonShape = 'line' | 'rect' | 'circle'

type SkeletonProps = {
  shape?: SkeletonShape
  /** Tailwind width classes, e.g. "w-full" or "w-32". Ignored for circle. */
  width?: string
  /** Tailwind height classes. Ignored for line (defaults to 1em) */
  height?: string
  className?: string
}

export function Skeleton({
  shape = 'line',
  width,
  height,
  className = '',
}: SkeletonProps) {
  /* Base look shared by every shape */
  const base =
    'animate-pulse bg-border/60 ' +
    /* Slightly rounded ends read more naturally than sharp corners */
    'rounded-md'

  /* Shape-specific classes */
  let shapeClasses = ''
  if (shape === 'line') {
    shapeClasses = `${width ?? 'w-full'} ${height ?? 'h-4'}`
  } else if (shape === 'rect') {
    shapeClasses = `${width ?? 'w-full'} ${height ?? 'h-24'}`
  } else if (shape === 'circle') {
    /* Circle uses aspect-square so a single size value controls both axes */
    const size = height ?? 'h-12'
    shapeClasses = `${size} ${size} !rounded-full`
  }

  return (
    <div
      aria-hidden="true"
      className={`${base} ${shapeClasses} ${className}`}
    />
  )
}