"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateTotals, DEFAULT_WALLET_BALANCE, type CartItem } from "@/lib/checkout";

const defaultItems: CartItem[] = [
  { id: "miniature-portrait-12cm", title: "Miniature Portrait", variant: "12 cm", price: 4700, quantity: 1 },
  { id: "miniature-portrait-15cm", title: "Miniature Portrait", variant: "15 cm", price: 5400, quantity: 1 },
];

export default function CartPageClient() {
  const [items, setItems] = useState<CartItem[]>(defaultItems);
  const [walletApplied, setWalletApplied] = useState(true);
  const [discountCode, setDiscountCode] = useState("WELCOME10");

  const totals = useMemo(
    () =>
      calculateTotals({
        items,
        walletBalance: DEFAULT_WALLET_BALANCE,
        walletApplied,
        welcomeDiscount: discountCode.trim().toUpperCase() === "WELCOME10",
      }),
    [items, walletApplied, discountCode]
  );

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Cart</p>
          <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Your keepsake selection</h1>
        </div>
        <Link href="/shop" className="rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-sm font-medium text-[var(--color-foreground)]">
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-[1.6rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-4 sm:flex-row sm:items-center">
              <div className="h-28 w-full rounded-[1.2rem] bg-[linear-gradient(180deg,#f3e5d9_0%,#d9b08c_38%,#714437_100%)] sm:w-28 flex items-center justify-center sm:min-w-[112px]">
                <div className="h-16 w-10 rounded-[50%_50%_45%_55%/55%_55%_50%_50%] bg-[linear-gradient(180deg,#f4d8b3_0%,#bf7a50_58%,#4d2d28_100%)] shadow-[0_8px_12px_rgba(46,26,18,0.18)]" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl text-[var(--color-foreground)]">{item.title}</h2>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
                    Remove
                  </button>
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{item.variant} • hand-painted finish</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-[var(--color-foreground)]">₹{item.price}</span>
                  <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Preview before production
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.48)] p-5">
          <h2 className="text-2xl text-[var(--color-foreground)]">Order summary</h2>

          <div className="mt-5 rounded-[1.2rem] border border-[var(--color-border)] bg-white/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Items</p>
            <div className="space-y-2 text-sm text-[var(--color-muted)]">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-[0.9rem] border border-[var(--color-border)] bg-white/50 p-2">
                  <div className="h-10 w-10 rounded-[0.85rem] bg-[linear-gradient(180deg,#efe0ce_0%,#d6b18f_38%,#7e4b39_100%)] p-2 flex items-center justify-center flex-shrink-0">
                    <div className="h-5 w-4 rounded-[40%_60%_45%_55%/45%_45%_55%_55%] bg-[linear-gradient(180deg,#f4d8b3_0%,#bf7a50_58%,#4d2d28_100%)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">{item.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">{item.variant} • hand-painted</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-foreground)]">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[1.2rem] border border-[var(--color-border)] bg-white/35 p-4">
            <label htmlFor="discount-code" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Discount code
            </label>
            <input
              id="discount-code"
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value)}
              className="w-full rounded-[0.8rem] border border-[var(--color-border)] bg-white/60 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none"
              placeholder="WELCOME10"
            />
          </div>

          <label className="mt-5 flex items-center justify-between gap-3 rounded-[1.1rem] border border-[var(--color-border)] bg-white/35 p-4 text-sm text-[var(--color-foreground)]">
            <span>Apply wallet credit</span>
            <input
              type="checkbox"
              checked={walletApplied}
              onChange={(event) => setWalletApplied(event.target.checked)}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
          </label>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <span className="text-lg font-semibold text-[var(--color-foreground)]">Total</span>
            <span className="text-2xl font-semibold text-[var(--color-foreground)]">₹{totals.total}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(157,95,63,0.2)] hover:-translate-y-0.5 hover:bg-[#874e35]"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
