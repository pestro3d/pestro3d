"use client";

import { useState } from "react";

export default function CorporateEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4 rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.48)] p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Company name</label>
          <input id="company" className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none" />
        </div>
        <div>
          <label htmlFor="contact" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Contact name</label>
          <input id="contact" className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Email</label>
          <input id="email" type="email" className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none" />
        </div>
        <div>
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Estimated quantity</label>
          <input id="quantity" className="w-full rounded-[0.9rem] border border-[var(--color-border)] bg-white/40 px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none" />
        </div>
      </div>

      <div>
        <label htmlFor="details" className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Project details</label>
        <textarea id="details" rows={5} className="w-full rounded-[1rem] border border-[var(--color-border)] bg-white/40 px-3 py-3 text-sm text-[var(--color-foreground)] outline-none" />
      </div>

      <button type="submit" className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#874e35]">
        {submitted ? "Enquiry sent" : "Send enquiry"}
      </button>
    </form>
  );
}
