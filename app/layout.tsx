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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <header className="site-header">
          <Link href="/" className="logo">Pestro<span>3D</span></Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/about">Our story</Link>
            <Link href="/corporate">Corporate</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <Link href="/orders" className="header-cart" aria-label="View orders">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
              Orders
            </Link>
            <Link href="/shop" className="nav-cta">Start your order</Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div>
            <div className="footer-brand">Pestro3D</div>
            <div className="footer-note">Custom miniature keepsakes made to feel personal.</div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/corporate">Corporate gifting</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/shipping">Shipping & returns</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
