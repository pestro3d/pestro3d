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
  const [paymentStatus, setPaymentStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (totals.total <= 0) return;

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      const response = await submitPayment({ amount: totals.total, orderId: "ORD-1001" });
      setPaymentStatus({ success: response.status === "pending", message: response.message });
      setSubmitted(true);
    } catch {
      setPaymentStatus({ success: false, message: "Payment failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
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

          <div className="mt-5 rounded-[1.2rem] border border-[var(--color-border)] bg-white/35 p-4">
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

        <aside className="rounded-[1.7rem] border border-[#d4c4e8] bg-[rgba(244,236,250,0.48)] p-5">
          <h2 className="text-2xl text-[#4c1c5c]">Summary</h2>

          <div className="mt-5 space-y-4 rounded-[1.2rem] border border-[#d4c4e8] bg-white/30 p-4">
            <div className="flex items-center gap-4 rounded-[1rem] border border-[#d4c4e8] bg-white/50 p-3">
              <div className="h-16 w-12 rounded-[1.1rem] bg-[linear-gradient(180deg,#f4ecfa_0%,#d4c4e8_38%,#4c1c5c_100%)] p-2 flex items-center justify-center">
                <div className="h-8 w-6 rounded-[40%_60%_45%_55%/45%_45%_55%_55%] bg-[linear-gradient(180deg,#f4ecfa_0%,#d4c4e8_58%,#4c1c5c_100%)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#4c1c5c]">Miniature Portrait</p>
                <p className="text-xs text-[var(--color-muted)]">12 cm • hand-painted finish</p>
              </div>
              <span className="text-lg font-semibold text-[#4c1c5c]">₹4700</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">Welcome offer</span>
              <span className="text-[#4c1c5c]">-₹{totals.welcomeDiscountValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">Wallet credit</span>
              <span className="text-[#4c1c5c]">-₹{totals.walletValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">Shipping</span>
              <span className="text-[#4c1c5c]">₹{totals.shipping}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#d4c4e8] pt-4">
            <span className="text-lg font-semibold text-[#4c1c5c]">Due today</span>
            <span className="text-2xl font-semibold text-[#4c1c5c]">₹{totals.total}</span>
          </div>

          <button
            type="button"
            disabled={totals.total <= 0 || isProcessing}
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-[#4c1c5c] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(76,28,92,0.2)] hover:-translate-y-0.5 hover:bg-[#6a2c8c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : submitted ? "Order placed" : "Pay now"}
          </button>

          {paymentStatus && (
            <div
              className={`mt-4 rounded-[0.9rem] border p-3 text-sm ${
                paymentStatus.success
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-red-500 bg-red-50 text-red-700"
              }`}
            >
              {paymentStatus.message}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
