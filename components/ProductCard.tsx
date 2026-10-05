import Link from "next/link";
import type { Product } from "@/lib/store-data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.35)]"
    >
      <div className="p-3">
        <div className="grid h-64 grid-cols-2 gap-2 rounded-[1.3rem] bg-[linear-gradient(180deg,#f1e4d9,#e7d1b7)] p-2">
          <div className="rounded-[1.15rem] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.32),rgba(0,0,0,0.14)),linear-gradient(160deg,#d8a36d_0%,#7d4d39_55%,#2a2725_100%)]" />
          <div className="rounded-[1.15rem] bg-[linear-gradient(180deg,#efe0ce_0%,#d6b18f_38%,#7e4b39_100%)] p-2">
            <div className="mx-auto mt-8 h-36 w-20 rounded-[48%_52%_46%_54%/43%_47%_53%_57%] bg-[linear-gradient(180deg,#f4d8b3_0%,#bf7a50_58%,#4d2d28_100%)] shadow-[0_22px_26px_rgba(63,35,26,0.2)]" />
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] px-4 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {product.category}
          </span>
          <span className="text-sm font-medium text-[var(--color-muted)]">₹{product.basePrice}</span>
        </div>

        <h3 className="text-2xl text-[var(--color-foreground)]">{product.name}</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{product.tagline}</p>
      </div>
    </Link>
  );
}
