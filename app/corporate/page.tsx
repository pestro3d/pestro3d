import Link from "next/link";
import CorporateEnquiryForm from "@/components/CorporateEnquiryForm";
import { corporateHighlights } from "@/lib/company-data";

export default function CorporatePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Corporate gifting</p>
          <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Thoughtful gifting for teams and events</h1>
        </div>
        <Link href="/" className="rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-sm font-medium text-[var(--color-foreground)]">
          Back home
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5 rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.38)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Why teams choose us</p>
          <ul className="space-y-4 text-[var(--color-muted)]">
            {corporateHighlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <CorporateEnquiryForm />
      </section>
    </main>
  );
}
