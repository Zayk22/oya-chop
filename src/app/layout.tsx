import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <CartProvider>
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}