"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/store-data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.35)]"
    >
      <div className="relative h-64 overflow-hidden rounded-[1.3rem] bg-[linear-gradient(180deg,#f1e4d9,#e7d1b7)]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="border-t border-[var(--color-border)] px-4 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[var(--color-accent-light)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {product.category}
          </span>
          <span className="text-sm font-medium text-[var(--color-muted)]">₹{product.basePrice}</span>
        </div>

        <h3 className="text-2xl text-[var(--color-accent)]">{product.name}</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{product.tagline}</p>
      </div>
    </Link>
  );
}
