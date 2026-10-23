import { SignUp } from '@clerk/nextjs'

/* ============================================================
   SIGN-UP PAGE
   ------------------------------------------------------------
   Same treatment as sign-in.
   ============================================================ */

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#d9381e',
            colorBackground: '#ffffff',
            colorForeground: '#1f1a17',
            colorMutedForeground: '#6b5f55',
            colorInput: '#ffffff',
            colorInputForeground: '#1f1a17',
            colorBorder: '#e8dfd2',
            colorRing: '#d9381e',
            borderRadius: '0.75rem',
            fontFamily: 'inherit',
          },
          options: {
            socialButtonsVariant: 'blockButton',
          },
        }}
      />
    </div>
  )
}