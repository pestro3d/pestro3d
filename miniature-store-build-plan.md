# Miniature Store: Website Build Plan

> Instructions for the coding agent. Read this whole file before writing code. Build in the phases listed at the end. Ask before making big decisions that are not covered here.

## 1. What we are building

An online store that turns a customer's photo (wedding photo, parents, couple, pet) into a custom 3D printed, hand-painted miniature figurine, sold as a gift. Target customers: personal gifting (weddings, anniversaries, birthdays, parents) and corporate gifting.

The site must feel premium, emotional and distinctive, not like a generic e-commerce template, while staying lightweight and fast.

## 2. Tech stack

- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS
- Database / Auth / Storage: Supabase (customer photos go to Supabase Storage)
- Hosting: Vercel
- Source control: GitHub
- Animation: 2D only, see section 5. The agent may install any lightweight motion library it prefers (for example Motion / Framer Motion, or GSAP). Keep the bundle small, lazy-load animation-heavy sections, and do not add any 3D / WebGL / Three.js.
- Payments: payment gateway is not decided yet. Build checkout behind a small payment abstraction so the provider can be plugged in later.
- Shipping: a shipping aggregator will be added later. Keep the order model ready for it, but do not integrate yet.

Everything (accounts, keys, env vars) is a fresh setup, separate from any other project. Never hardcode secrets. Use .env.local and document every variable in .env.example.

## 3. Product and business rules the site must support

- Core product: one product line only, the 3D miniature (approx. 4 inch). Do not add mugs, T-shirts or other customised products to the catalogue for now.
- Order workflow (important):
  1. Customer uploads photo(s) and fills requirements (size, notes, occasion).
  2. Team creates a 3D preview and shares it with the customer.
  3. Customer approves the preview in their order page.
  4. Only after approval does production start.
  The order status model must reflect this: placed → preview_in_progress → preview_ready → approved (or changes_requested) → in_production → shipped → delivered.
- Pricing: planned selling price is around ₹4,000 per piece. Keep prices in the database, not hardcoded.
- Welcome offer: 10% discount for a first-time customer.
- UGC cashback: if a customer posts a video of their miniature on Facebook and shares it, they receive 15 to 20% cashback as site wallet credit, usable only on their next order (not a cash payout). Build a simple wallet balance per customer plus an admin action to credit it.
- Corporate gifting: a separate enquiry page / form for bulk and corporate orders.
- Single production source for now. No multi-vendor quotation flow.

## 4. Pages and structure

Keep it a standard, easy-to-understand store, just with great design.

1. Home
   - Hero: strong visual of a real photo turning into its miniature, with one clear call to action ("Send us a photo").
   - "How it works" in 3 steps: Upload photo → Approve your 3D preview → Receive your hand-painted miniature.
   - Featured examples / gallery (before and after).
   - Trust section: preview-before-production promise, hand-painted finish, durable material, real customer reviews.
   - Corporate gifting teaser, FAQ, footer.
2. Shop / Collection: simple grid (can be only a few product variants such as size or number of figures).
3. Product page: large imagery, size options, photo upload and requirement form, price, delivery time, FAQ, reviews.
4. Cart and Checkout: short, mobile-friendly, one page if possible, with gift message and discount / wallet field.
5. Order tracking page: status timeline, 3D preview viewing (images or short video of the preview) with Approve / Request changes buttons.
6. Account: orders, wallet balance, saved addresses.
7. Corporate gifting enquiry page.
8. Static pages: About, Contact, Shipping and Returns, Privacy, Terms.
9. Admin area (simple, protected): list of orders, change status, upload preview files, view customer photos, credit wallet, manage discount codes.

## 5. Design direction

Research summary. I looked at direct competitors (3D Portrait Me, Figuro, My3dSelfie, STATU3D, CanvasChamp, and Etsy sellers) and at 2026 e-commerce design trend write-ups. Patterns that repeat:

- Big close-up hero of the figurine and a dead-simple "send one photo" call to action.
- A digital 3D preview with revisions before production, which is Figuro's main trust message and also our workflow.
- Material and craft trust signals: premium resin, hand-painted, size options (competitors show roughly 9 to 18 cm).
- Gifting occasions called out: birthdays, anniversaries, weddings, graduations, pets.
- 2026 trends: dark or minimal aesthetic, "scrollytelling" (scroll-triggered animation that tells a story), mobile-first feel like a native app, editorial and text-forward premium brands, one-page checkout with gift message and gift wrap.

What we do with it:

- Look: minimal and premium. Either a deep dark theme with a warm accent colour, or a soft warm-neutral theme with one rich accent. Pick one and stay consistent. Elegant serif for headings paired with a clean sans-serif for body. Lots of whitespace, large product images.
- Be different from templates: avoid the usual boxed grid-and-banner look. Use full-bleed imagery, editorial layouts, and a distinctive signature element: the photo → miniature transformation shown as a 2D scroll animation (for example the photo slides, softens and is replaced by the miniature, with a subtle "being crafted" moment).
- Motion (2D only, lightweight): scroll-triggered reveals, smooth section transitions, hover micro-interactions, a before/after slider, a subtle animated progress timeline on the order page. Respect prefers-reduced-motion.
- Performance targets: fast first load, optimised images (next/image, WebP/AVIF), lazy-load below-the-fold sections, minimal client-side JavaScript. Aim for a Lighthouse performance score of 90+ on mobile.
- Mobile first. Most customers will arrive from Instagram / Facebook ads on a phone.
- Emotional copy: short, warm, gift-focused lines. Placeholder copy is fine, but keep the tone.

## 6. Database (Supabase) outline

Tables, with Row Level Security on all of them: profiles, products, product_variants, orders, order_items, order_photos, order_previews, order_status_history, wallet_transactions, discount_codes, corporate_enquiries, reviews.

Customers can only read and write their own rows. Admin role can access all. Photo uploads go to a private storage bucket with signed URLs.

## 7. Analytics and tracking

Add a basic analytics hook (provider to be decided) and track: page views, photo upload started and completed, add to cart, checkout started, order placed, preview approved. Keep it optional behind an env variable.

## 8. Build phases

1. Setup: Next.js + TypeScript + Tailwind project, folder structure, design tokens (colours, fonts, spacing), .env.example, connect to Supabase.
2. Design system and Home page with the signature photo → miniature scroll animation.
3. Shop, product page and photo upload (Supabase Storage).
4. Cart, checkout and payment abstraction (with welcome discount and wallet credit logic).
5. Orders and the preview-approval flow: order tracking page, status model, approve / request-changes actions.
6. Admin area: orders, status updates, preview upload, wallet credit, discount codes.
7. Corporate enquiry page and static pages.
8. Polish: performance pass, accessibility, SEO (metadata, Open Graph, sitemap), error and empty states.

## 9. Working rules for the agent

- Complete one phase at a time and summarise what was done, then wait for confirmation before the next phase.
- Keep components small and reusable. Prefer server components, use client components only where interaction or animation needs them.
- Do not add heavy dependencies. Before installing any package other than a lightweight animation library, say why.
- Never commit secrets. Never invent API keys or placeholder credentials in code.
- When something is unclear (payment provider, shipping aggregator, exact copy), leave a clearly marked TODO and continue instead of guessing.
