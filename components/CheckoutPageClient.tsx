"use client";

import { useMemo, useState } from "react";
import { calculateTotals, DEFAULT_WALLET_BALANCE, submitPayment, type CartItem } from "@/lib/checkout";

const items: CartItem[] = [
  { id: "miniature-portrait-12cm", title: "Miniature Portrait", variant: "12 cm", price: 4700, quantity: 1 },
];

export default function CheckoutPageClient() {
  const [giftMessage, setGiftMessage] = useState("For our anniversary");
  const [walletApplied, setWalletApplied] = useState(true);
  const [discountCode, setDiscountCode] = useState("WELCOME10");
  const [submitted, setSubmitted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const totals = useMemo(
    () =>
      calculateTotals({
        items,
        walletBalance: DEFAULT_WALLET_BALANCE,
        walletApplied,
        welcomeDiscount: discountCode.trim().toUpperCase() === "WELCOME10",
      }),
    [walletApplied, discountCode]
  );

  const handleCheckout = async () => {
    const response = await submitPayment({ amount: totals.total, orderId: "ORD-1001" });
    setPaymentStatus(response.message);
    setSubmitted(true);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Checkout</p>
        <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Complete your custom order</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6 rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Full name</label>
              <input id="name" defaultValue="Ritika Sharma" className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/50 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none" />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Email</label>
              <input id="email" defaultValue="ritika@example.com" className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/50 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none" />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Shipping address</label>
            <textarea id="address" rows={4} defaultValue="24 Rosewood Lane, Bengaluru, Karnataka 560001" className="w-full rounded-[1rem] border border-[var(--color-border)] bg-white/50 px-3 py-3 text-sm text-[var(--color-foreground)] outline-none" />
          </div>

          <div>
            <label htmlFor="gift-message" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Gift message</label>
            <input id="gift-message" value={giftMessage} onChange={(event) => setGiftMessage(event.target.value)} className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/50 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none" />
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-white/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[var(--color-muted)]">Discount code</span>
              <input value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} className="w-32 rounded-[0.8rem] border border-[var(--color-border)] bg-white/50 px-2 py-2 text-sm text-[var(--color-foreground)] outline-none" />
            </div>
            <label className="mt-4 flex items-center justify-between gap-3 text-sm text-[var(--color-foreground)]">
              <span>Use wallet credit</span>
              <input type="checkbox" checked={walletApplied} onChange={(event) => setWalletApplied(event.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
            </label>
          </div>
        </section>

        <aside className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.48)] p-5">
          <h2 className="text-2xl text-[var(--color-foreground)]">Summary</h2>

          <div className="mt-5 space-y-3 text-sm text-[var(--color-muted)]">
            <div className="flex items-center justify-between">
              <span>Miniature Portrait</span>
              <span className="text-[var(--color-foreground)]">₹4700</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Welcome offer</span>
              <span className="text-[var(--color-foreground)]">-₹{totals.welcomeDiscountValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Wallet credit</span>
              <span className="text-[var(--color-foreground)]">-₹{totals.walletValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="text-[var(--color-foreground)]">₹{totals.shipping}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <span className="text-lg font-semibold text-[var(--color-foreground)]">Due today</span>
            <span className="text-2xl font-semibold text-[var(--color-foreground)]">₹{totals.total}</span>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(157,95,63,0.2)] hover:-translate-y-0.5 hover:bg-[#874e35]"
          >
            {submitted ? "Order placed" : "Pay now"}
          </button>

          {paymentStatus && (
            <p className="mt-4 rounded-[0.9rem] border border-[var(--color-border)] bg-white/35 p-3 text-sm text-[var(--color-muted)]">
              {paymentStatus}
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
