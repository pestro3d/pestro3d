"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/store-data";

export default function ProductCustomizer({ product }: { product: Product }) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0].id);
  const [occasion, setOccasion] = useState("Anniversary");
  const [notes, setNotes] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activeVariant = product.variants.find((variant: { id: string; label: string; size: string; price: number; turnaround: string }) => variant.id === selectedVariant) ?? product.variants[0];

    // TODO: Generate placeholder gradient based on product name for variety
    // const placeholderStyle = `rounded-[1.15rem] bg-[${getProductPlaceholderGradient(product.name)}] p-2`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    router.push("/cart");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.5)] p-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Product details
        </p>
        <h3 className="text-3xl text-[var(--color-foreground)]">{product.name}</h3>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--color-foreground)]">Choose size</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {product.variants.map((variant: { id: string; label: string; size: string; price: number; turnaround: string }) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setSelectedVariant(variant.id)}
              className={[
                "rounded-[1rem] border px-3 py-3 text-left",
                selectedVariant === variant.id
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-foreground)]"
                  : "border-[var(--color-border)] bg-white/40 text-[var(--color-muted)]",
              ].join(" ")}
            >
              <div className="text-sm font-semibold">{variant.label}</div>
              <div className="mt-1 text-xs">₹{variant.price}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--color-foreground)]">Upload photo</label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.1rem] border border-dashed border-[var(--color-border)] bg-white/30 px-4 py-6 text-center text-sm text-[var(--color-muted)]">
          <span className="mb-2 text-base font-semibold text-[var(--color-foreground)]">
            {selectedFile ? selectedFile.name : "Add a photo"}
          </span>
          <span>PNG, JPG, or HEIC up to 10 MB</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="occasion" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Occasion
          </label>
          <select
            id="occasion"
            value={occasion}
            onChange={(event) => setOccasion(event.target.value)}
            className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none"
          >
            <option>Anniversary</option>
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Parents</option>
            <option>Pet memorial</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="gift-message" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Gift message
          </label>
          <input
            id="gift-message"
            value={giftMessage}
            onChange={(event) => setGiftMessage(event.target.value)}
            placeholder="For our anniversary"
            className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
          Special notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Tell us about the look, pose, colors, or any details you want us to capture."
          className="w-full rounded-[1rem] border border-[var(--color-border)] bg-white/40 px-3 py-3 text-sm text-[var(--color-foreground)] outline-none"
        />
      </div>

      <div className="rounded-[1.1rem] border border-[var(--color-border)] bg-white/35 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--color-muted)]">Selected size</span>
          <span className="font-semibold text-[var(--color-foreground)]">{activeVariant.label}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--color-muted)]">Delivery</span>
          <span className="font-semibold text-[var(--color-foreground)]">{activeVariant.turnaround}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          <span className="text-lg font-semibold text-[var(--color-foreground)]">Total</span>
          <span className="text-2xl font-semibold text-[var(--color-foreground)]">₹{activeVariant.price}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(157,95,63,0.2)] hover:-translate-y-0.5 hover:bg-[#874e35]"
      >
        {submitted ? "Order details saved" : "Add to cart"}
      </button>
    </form>
  );
}
