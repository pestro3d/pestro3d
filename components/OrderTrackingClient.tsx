"use client";

import { useState } from "react";
import { orderStatuses, sampleOrder, sampleOrderTimeline, type OrderStatus } from "@/lib/order-data";

export default function OrderTrackingClient() {
  const [status, setStatus] = useState<OrderStatus>(sampleOrder.status);

  const statusSteps = sampleOrderTimeline.map((step) => ({
    ...step,
    active: step.key === status || sampleOrderTimeline.indexOf(step) < sampleOrderTimeline.findIndex((item) => item.key === status),
  }));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Order tracking</p>
          <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">{sampleOrder.id}</h1>
        </div>
        <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {orderStatuses[status]}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6 rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-5">
          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#f2e7de_0%,#e3d0bd_100%)] p-4">
            <div className="grid h-[24rem] grid-cols-2 gap-4 rounded-[1.3rem] bg-[rgba(255,255,255,0.22)] p-4">
              <div className="rounded-[1.1rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_30%),linear-gradient(145deg,#d2a272_0%,#7f563d_52%,#241e1b_100%)]" />
              <div className="rounded-[1.1rem] bg-[linear-gradient(180deg,#efe0d1_0%,#c99162_38%,#623f33_100%)] p-3">
                <div className="mx-auto mt-10 h-36 w-24 rounded-[48%_52%_44%_56%/42%_48%_52%_58%] bg-[linear-gradient(180deg,#efd6ad_0%,#c88459_58%,#4e312e_100%)] shadow-[0_20px_25px_rgba(60,34,27,0.2)]" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStatus("approved")}
              className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#874e35]"
            >
              Approve preview
            </button>
            <button
              type="button"
              onClick={() => setStatus("changes_requested")}
              className="rounded-full border border-[var(--color-border)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] hover:bg-white"
            >
              Request changes
            </button>
          </div>
        </section>

        <aside className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.48)] p-5">
          <h2 className="text-2xl text-[var(--color-foreground)]">Status timeline</h2>
          <div className="mt-6 space-y-5">
            {statusSteps.map((step) => (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                      step.active ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
                    ].join(" ")}
                  >
                    {step.active ? "✓" : ""}
                  </div>
                  {step.key !== sampleOrderTimeline[sampleOrderTimeline.length - 1].key && (
                    <div className="mt-2 h-8 w-px bg-[var(--color-border)]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className={step.active ? "font-semibold text-[var(--color-foreground)]" : "text-[var(--color-muted)]"}>
                      {step.label}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">{step.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
