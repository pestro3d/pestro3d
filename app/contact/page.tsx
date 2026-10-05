import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Contact</p>
          <h1 className="mt-2 text-5xl text-[var(--color-foreground)]">Say hello.</h1>
        </div>
        <Link href="/" className="rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-sm font-medium text-[var(--color-foreground)]">
          Back home
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.42)] p-6 text-[var(--color-muted)]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground)]">Email</p>
          <p>hello@pestro3d.com</p>
        </div>
        <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.42)] p-6 text-[var(--color-muted)]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground)]">Instagram</p>
          <p>@pestro3d</p>
        </div>
      </div>
    </main>
  );
}
