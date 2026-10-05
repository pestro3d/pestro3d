import Link from "next/link";
import { staticPageCopy } from "@/lib/company-data";

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Terms</p>
          <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Terms of service.</h1>
        </div>
        <Link href="/" className="rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-sm font-medium text-[var(--color-foreground)]">
          Back home
        </Link>
      </div>

      <div className="rounded-[1.8rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.42)] p-6 text-[var(--color-muted)]">
        <p>{staticPageCopy.terms}</p>
      </div>
    </main>
  );
}
