const steps = [
  {
    title: "Upload your photo",
    description: "Share a portrait, couple shot, or pet photo and tell us the occasion.",
  },
  {
    title: "Approve the preview",
    description: "We create a 3D concept and refine it before production begins.",
  },
  {
    title: "Receive the keepsake",
    description: "Your hand-painted miniature arrives as a thoughtful keepsake or gift.",
  },
];

const trustPoints = [
  "Preview before production",
  "Hand-painted finish",
  "Premium resin material",
  "Gift-ready packaging",
];

const galleryItems = [
  { name: "Wedding portrait", badge: "Custom pair" },
  { name: "Parents keepsake", badge: "Gift edition" },
  { name: "Pet memorial", badge: "Hand-painted" },
  { name: "Anniversary duo", badge: "Studio finish" },
];

const faqs = [
  {
    question: "How long does the process take?",
    answer: "Most orders are completed in 2 to 3 weeks, depending on the review cycle and finishing details.",
  },
  {
    question: "Can I request changes to the preview?",
    answer: "Yes. Customers can request adjustments before approving the design, which keeps the process transparent.",
  },
  {
    question: "Is this a good gift?",
    answer: "Absolutely. The product is designed for personal milestones, anniversaries, weddings, birthdays, and corporate gifting.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-20 pt-6 sm:px-8 lg:px-10">
      <header className="mb-10 flex items-center justify-between rounded-full border border-[var(--color-border)] bg-[rgba(255,250,246,0.72)] px-4 py-3 backdrop-blur-sm sm:px-6">
        <div>
          <p className="font-display text-3xl leading-none tracking-tight text-[var(--color-foreground)]">
            Pestro3D
          </p>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[var(--color-muted)] md:flex">
          <a href="#how-it-works">How it works</a>
          <a href="#gallery">Gallery</a>
          <a href="#gifting">Gifting</a>
          <a href="#faq">FAQ</a>
        </nav>

        <a
          href="#order"
          className="rounded-full bg-[var(--color-foreground)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(32,27,24,0.18)] hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
        >
          Send us a photo
        </a>
      </header>

      <section className="grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:pb-20">
        <div className="space-y-7">
          <span className="inline-flex rounded-full border border-[var(--color-border)] bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Personalized keepsakes
          </span>

          <div className="space-y-5">
            <h1 className="max-w-md text-5xl text-[var(--color-foreground)] sm:text-6xl lg:text-7xl">
              Turn a memory into a miniature treasure.
            </h1>
            <p className="max-w-xl text-base text-[var(--color-muted)] sm:text-lg">
              Premium 3D miniature portraits for weddings, anniversaries,
              birthdays, and the moments worth keeping forever.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#order"
              className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_30px_rgba(157,95,63,0.24)] hover:-translate-y-0.5 hover:bg-[#874e35]"
            >
              Start your order
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-[var(--color-border)] bg-white/60 px-6 py-3 text-center text-sm font-semibold text-[var(--color-foreground)] hover:border-transparent hover:bg-white"
            >
              See examples
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-2 text-sm text-[var(--color-muted)]">
            <div>
              <span className="block font-display text-3xl text-[var(--color-foreground)]">4.9/5</span>
              Average rating
            </div>
            <div>
              <span className="block font-display text-3xl text-[var(--color-foreground)]">18 days</span>
              Turnaround time
            </div>
          </div>
        </div>

        <div className="transform-scene rounded-[2rem] bg-[linear-gradient(135deg,#f9f1ea_0%,#f1e5db_100%)] p-4 shadow-[0_24px_60px_rgba(32,27,24,0.09)]">
          <div className="transform-panel">
            <div className="transform-photo">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.38),transparent_22%),linear-gradient(150deg,#f7d9b1_0%,#a56a4d_22%,#4f372f_62%,#271e1c_100%)]" />
              <div className="absolute left-[18%] top-[18%] h-[58%] w-[64%] rounded-[42%_58%_60%_40%/46%_52%_48%_54%] border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent),radial-gradient(circle_at_50%_20%,#e8d0af_0%,#bd7d5a_36%,#412e2b_100%)] opacity-90" />
            </div>
            <div className="transform-miniature" />
            <div className="absolute inset-x-6 bottom-5 flex items-center justify-between rounded-full border border-white/30 bg-white/25 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-foreground)] backdrop-blur-sm">
              <span>Photo</span>
              <span className="text-[var(--color-muted)]">→</span>
              <span>Miniature</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="pb-16 pt-10">
        <div className="mb-8 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            How it works
          </p>
          <h2 className="text-4xl text-[var(--color-foreground)] sm:text-5xl">
            A simple flow, crafted with care.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="story-card"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-semibold text-[var(--color-accent)]">
                0{index + 1}
              </div>
              <h3 className="mb-2 text-2xl text-[var(--color-foreground)]">{step.title}</h3>
              <p className="text-[var(--color-muted)]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" className="pb-16 pt-6">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Featured keepsakes
            </p>
            <h2 className="text-4xl text-[var(--color-foreground)] sm:text-5xl">
              Before and after, beautifully realised.
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)]"
            >
              <div className="grid h-72 grid-cols-2 gap-2 p-3">
                <div className="rounded-[1.25rem] bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.28),transparent_20%),linear-gradient(160deg,#ecb87c_0%,#7d4f3e_45%,#2b2422_100%)]" />
                <div className="rounded-[1.25rem] bg-[linear-gradient(180deg,#e8d2b0_0%,#bd8a60_42%,#65412d_100%)] p-3">
                  <div className="mx-auto mt-8 h-36 w-20 rounded-[48%_52%_44%_56%/43%_47%_53%_57%] bg-[linear-gradient(180deg,#eecaa0_0%,#b57a4d_55%,#5b3830_100%)] shadow-[0_20px_26px_rgba(70,40,28,0.22)]" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-white/35 px-4 py-3">
                <span className="font-medium text-[var(--color-foreground)]">{item.name}</span>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  {item.badge}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-row pb-16 pt-6 lg:grid-cols-[1fr_1fr]" id="gifting">
        <article className="story-card h-full">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Performance promise
          </p>
          <h3 className="mb-4 text-3xl text-[var(--color-foreground)]">Made to feel personal, not mass-produced.</h3>
          <p className="mb-6 text-[var(--color-muted)]">
            Every piece is designed from your photo, reviewed before production, and finished by hand to make the result feel distinctly yours.
          </p>

          <ul className="space-y-3 text-sm text-[var(--color-foreground)]">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </article>

        <article className="story-card h-full">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Trusted by gift-givers
          </p>
          <div className="mb-5 rounded-[1.3rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.5)] p-5">
            <p className="mb-4 text-lg text-[var(--color-foreground)] italic">
              “We wanted something more personal than a standard present. The preview process made it feel thoughtful and exciting from the beginning.”
            </p>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Aisha & Arjun</p>
              <p className="text-sm text-[var(--color-muted)]">Wedding gift order</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-white/35 p-4">
              <div className="font-display text-3xl text-[var(--color-foreground)]">2k+</div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">miniatures made</div>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-white/35 p-4">
              <div className="font-display text-3xl text-[var(--color-foreground)]">97%</div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">approval rate</div>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-white/35 p-4">
              <div className="font-display text-3xl text-[var(--color-foreground)]">₹4k</div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">average gift value</div>
            </div>
          </div>
        </article>
      </section>

      <section id="faq" className="pb-12 pt-4">
        <div className="mb-8 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            FAQ
          </p>
          <h2 className="text-4xl text-[var(--color-foreground)] sm:text-5xl">
            Questions we hear most.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.45)] px-5 py-4"
            >
              <h3 className="text-lg text-[var(--color-foreground)]">{item.question}</h3>
              <p className="mt-2 text-[var(--color-muted)]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
