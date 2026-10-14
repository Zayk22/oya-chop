import Link from 'next/link'

/* ============================================================
   OYA CHOP — Logo
   ------------------------------------------------------------
   The wordmark. Text only, no image. Used in the header,
   footer, and any page that needs the brand.

   The "O" in "Oya" gets a mustard underline that sits just
   below the letter's baseline. It's an absolutely-positioned
   span inside a relatively-positioned wrapper.
   ============================================================ */

type LogoProps = {
  /** Optional classes for layout tweaks where the Logo is used */
  className?: string
  /** Render as a link to home (default) or plain text */
  asLink?: boolean
}

export function Logo({ className = '', asLink = true }: LogoProps) {
  const wordmark = (
    <span className="inline-flex items-baseline gap-2 font-heading text-2xl font-bold tracking-tight text-chili">
      <span className="inline-flex items-baseline">
        {/* The emphasised O — mustard underline sits under just this letter */}
        <span className="relative inline-block">
          O
          <span
            aria-hidden="true"
            className="absolute -bottom-[3px] left-0 right-0 h-[3px] rounded-full bg-mustard"
          />
        </span>
        <span>ya</span>
      </span>
      <span>Chop</span>
    </span>
  )

  if (!asLink) {
    return <span className={className}>{wordmark}</span>
  }

  return (
    <Link
      href="/"
      aria-label="Oya Chop — home"
      className={`inline-block transition-opacity hover:opacity-80 ${className}`}
    >
      {wordmark}
    </Link>
  )
}