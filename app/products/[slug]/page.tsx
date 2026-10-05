import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCustomizer from "@/components/ProductCustomizer";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { products } from "@/lib/store-data";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((entry) => entry.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/shop" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]">
          ← Back to shop
        </Link>
        <span className="rounded-full border border-[var(--color-border)] bg-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {product.category}
        </span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#f4eae1_0%,#e7d4c0_100%)] p-4">
          <div className="grid h-[34rem] grid-cols-2 gap-4 rounded-[1.5rem] bg-[rgba(255,255,255,0.35)] p-4">
            <ProductImagePlaceholder variant="detail" label="Reference photo" />
            <ProductImagePlaceholder variant="detail" label="3D proof" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Gift-ready custom piece
            </p>
            <h1 className="mt-3 text-5xl text-[var(--color-accent)]">{product.name}</h1>
            <p className="mt-4 text-lg text-[var(--color-muted)]">{product.tagline}</p>
            <div className="mt-5 flex items-center gap-4">
              <span className="font-display text-4xl text-[var(--color-foreground)]">₹{product.basePrice}</span>
              <span className="rounded-full bg-[var(--color-accent-light)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Premium resin
              </span>
            </div>
          </div>

          <p className="text-[var(--color-muted)]">{product.description}</p>

          <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-white/35 p-4 text-sm text-[var(--color-muted)]">
            {product.featuredNote}
          </div>

          <ProductCustomizer product={product} />
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.38)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Reviews</p>
          <div className="mt-5 space-y-5">
            {product.reviews.map((review: { name: string; title: string; quote: string }) => (
              <div key={review.name} className="rounded-[1.1rem] border border-[var(--color-border)] bg-white/35 p-4">
                <div className="mb-2 flex items-center justify-between gap-5">
                  <span className="font-semibold text-[var(--color-accent)]">{review.name}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">{review.title}</span>
                </div>
                <p className="text-[var(--color-muted)]">“{review.quote}”</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.38)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">FAQ</p>
          <div className="mt-5 space-y-4">
            {product.faqs.map((item: { question: string; answer: string }) => (
              <div key={item.question} className="rounded-[1rem] border border-[var(--color-border)] bg-white/30 p-4">
                <h3 className="text-lg text-[var(--color-accent)]">{item.question}</h3>
                <p className="mt-2 text-[var(--color-muted)]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
