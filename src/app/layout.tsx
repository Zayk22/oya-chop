import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

/* ============================================================
   FONTS
   ------------------------------------------------------------
   next/font downloads the font files at build time and serves
   them from our own domain. No request goes to Google at runtime,
   no layout shift, no external dependency.
   ============================================================ */

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ============================================================
   METADATA
   ------------------------------------------------------------
   The template in `title` means any child page that exports
   its own metadata title renders as "Page name | Oya Chop".
   Pages that don't export a title fall back to the default.
   ============================================================ */

export const metadata: Metadata = {
  title: {
    default: "Oya Chop",
    template: "%s | Oya Chop",
  },
  description: "Oya, let's chop. Order food from your favourite Lagos restaurants.",
  applicationName: "Oya Chop",
  keywords: ["food delivery", "Lagos", "Nigerian food", "restaurants", "order online"],
  authors: [{ name: "Oya Chop" }],
  openGraph: {
    type: "website",
    title: "Oya Chop",
    description: "Oya, let's chop. Order food from your favourite Lagos restaurants.",
    siteName: "Oya Chop",
    locale: "en_NG",
  },
};

/* ============================================================
   ROOT LAYOUT
   ------------------------------------------------------------
   Wraps every page. Sets the html class to include our two
   font variables so Tailwind utilities and the base styles in
   globals.css can reference them.
   ============================================================ */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}