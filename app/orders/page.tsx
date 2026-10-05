import Link from "next/link";

export default function OrdersPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Account</p>
        <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Your orders</h1>
      </div>

      <div className="space-y-4">
        <Link href="/orders/ORD-1001" className="flex items-center justify-between rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Order ID</p>
            <p className="mt-2 text-2xl text-[var(--color-foreground)]">ORD-1001</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--color-muted)]">Miniature Portrait</p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-foreground)]">Preview ready</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
