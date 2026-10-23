'use client'

/* ============================================================
   GLOBAL ERROR BOUNDARY
   ------------------------------------------------------------
   Catches errors thrown in the root layout itself. Must
   provide its own <html> and <body> because the layout is
   what crashed.

   Intentionally minimal — no imported components, no Tailwind
   utilities that might depend on the layout's font/theme
   setup. Uses inline styles for guaranteed rendering even if
   the Tailwind bundle failed to load.
   ============================================================ */

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: '#fdf5f7',
          color: '#2a1520',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '420px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: '#d9381e',
              margin: '0 0 1rem',
              lineHeight: 1,
            }}
          >
            !
          </p>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '0 0 0.75rem',
            }}
          >
            Something broke
          </h1>

          <p
            style={{
              color: '#6b5f55',
              margin: '0 0 1.5rem',
              lineHeight: 1.6,
            }}
          >
            The app hit an unexpected error. Try reloading.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#d9381e',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Reload
          </button>

          {error.digest && (
            <p
              style={{
                fontSize: '0.75rem',
                color: '#7a5c6b',
                marginTop: '2rem',
                fontFamily: 'monospace',
              }}
            >
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}