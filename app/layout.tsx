import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pestro3D | Custom 3D Miniature Keepsakes",
  description:
    "Turn a cherished photo into a premium hand-painted 3D miniature gift.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)]">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md px-6 py-4">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Pestro3D
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[var(--color-muted)]">
            <Link href="/shop" className="hover:text-[var(--color-foreground)]">
              Shop
            </Link>
            <Link href="/about" className="hover:text-[var(--color-foreground)]">
              About
            </Link>
            <Link href="/corporate" className="hover:text-[var(--color-foreground)]">
              Corporate
            </Link>
            <Link href="/cart" className="hover:text-[var(--color-foreground)]">
              Cart
            </Link>
            <Link href="/contact" className="hover:text-[var(--color-foreground)]">
              Contact
            </Link>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      </body>
    </html>
  );
}
