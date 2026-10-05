import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/store-data";

export default function ShopPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Store</p>
          <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Choose your keepsake.</h1>
        </div>
        <Link
          href="/"
          className="rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-sm font-medium text-[var(--color-foreground)]"
        >
          Back home
        </Link>
      </header>

      <section className="mb-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.38)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            What you can order
          </p>
          <h2 className="mt-3 text-3xl text-[var(--color-foreground)]">One premium product line, tailored to your memory.</h2>
          <p className="mt-4 max-w-xl text-[var(--color-muted)]">
            Our miniature portrait experience is designed for weddings, anniversaries, personal milestones, and heartfelt gifts. Every piece starts with a photo, goes through a preview step, and only begins production after approval.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,#f5e8dd_0%,#eed7c1_100%)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Starting at</p>
          <div className="mt-3 font-display text-5xl text-[var(--color-foreground)]">₹4,000</div>
          <p className="mt-3 text-sm text-[var(--color-muted)]">for the 9 cm portrait keepsake with preview-before-production included.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>
    </main>
  );
}
