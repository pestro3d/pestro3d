"use client";

import { useState } from "react";
import { adminDiscounts } from "@/lib/admin-data";
import type { AdminOrder, OrderStatus } from "@/lib/admin-data";

interface AdminDashboardClientProps {
  initialOrders: AdminOrder[];
}

export default function AdminDashboardClient({ initialOrders }: AdminDashboardClientProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders ?? []);
  const [walletCredit, setWalletCredit] = useState(350);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const creditWallet = () => {
    setWalletCredit((current: number) => current + 250);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Admin</p>
          <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Orders dashboard</h1>
        </div>
        <button
          type="button"
          onClick={creditWallet}
          className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[#874e35]"
        >
          Credit wallet +₹250
        </button>
      </div>

      <section className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Open orders</p>
          <div className="mt-3 font-display text-4xl text-[var(--color-foreground)]">{orders.length}</div>
        </div>
        <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Awaiting preview</p>
          <div className="mt-3 font-display text-4xl text-[var(--color-foreground)]">{orders.filter((order) => order.previewStatus === "pending").length}</div>
        </div>
        <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Wallet balance</p>
          <div className="mt-3 font-display text-4xl text-[var(--color-foreground)]">₹{walletCredit}</div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)]">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-4 border-b border-[var(--color-border)] bg-white/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            <span>Customer</span>
            <span>Item</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {orders.map((order) => (
            <div key={order.id} className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-4 border-b border-[var(--color-border)] px-5 py-4 text-sm last:border-b-0">
              <div>
                <p className="font-semibold text-[var(--color-foreground)]">{order.customer}</p>
                <p className="text-[var(--color-muted)]">{order.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-[0.65rem] bg-[linear-gradient(180deg,#efe0ce_0%,#d6b18f_38%,#7e4b39_100%)] p-2">
                  <div className="mx-auto mt-2 h-5 w-6 rounded-[40%_60%_50%_50%/45%_45%_55%_55%] bg-[linear-gradient(180deg,#f4d8b3_0%,#bf7a50_58%,#4d2d28_100%)]" />
                </div>
                <span className="text-[var(--color-foreground)]">{order.item}</span>
              </div>
              <div className="text-[var(--color-foreground)]">{order.status}</div>
              <div>
                <select
                  value={order.status}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => updateStatus(order.id, event.target.value as OrderStatus)}
                  className="w-full rounded-[0.75rem] border border-[var(--color-border)] bg-white/45 px-2 py-2 text-sm text-[var(--color-foreground)] outline-none"
                >
                  <option value="placed">Placed</option>
                  <option value="preview_in_progress">Preview in progress</option>
                  <option value="preview_ready">Preview ready</option>
                  <option value="approved">Approved</option>
                  <option value="changes_requested">Changes requested</option>
                  <option value="in_production">In production</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6 rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Discount codes</p>
            <div className="mt-4 space-y-3">
              {adminDiscounts.map((discount) => (
                <div key={discount.code} className="flex items-center justify-between rounded-[1rem] border border-[var(--color-border)] bg-white/35 px-3 py-2">
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)]">{discount.code}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">{discount.value}%</p>
                  </div>
                  <span className={discount.active ? "text-green-700" : "text-[var(--color-muted)]"}>
                    {discount.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Preview upload</p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[1rem] border border-dashed border-[var(--color-border)] bg-white/30 px-4 py-6 text-center text-sm text-[var(--color-muted)]">
              <span className="mb-2 text-base font-semibold text-[var(--color-foreground)]">Upload preview image</span>
              JPG or PNG file
              <input type="file" className="hidden" />
            </label>
          </div>
        </aside>
      </section>
    </main>
  );
}
