# Pestro3D: Detailed Build Plan for the Coding Agent

Brand: **Pestro3D**, custom photo-based 3D printed, hand-painted miniature keepsakes (India).
Dev URL: https://pestro3d.vercel.app
Goal: a light, premium, standard e-commerce site where a customer uploads a photo, orders a custom miniature, approves a preview, and pays.

Companion file: **`pestro3d-schema.sql`** (complete database, security rules, storage buckets and seed data). Read both files before starting.

---

## 0. Ground rules

- Stack: **Next.js (App Router, TypeScript)**, **Vercel**, **Supabase** (Postgres, Auth, Storage), **GitHub**. Fresh accounts, nothing shared with any other project.
- Design: **2D animated**, premium, not a template look. **Mobile-first** (most customers are on phones). Keep the existing visual language of the home page and extend it.
- You may install any **lightweight** animation library (e.g. `motion`). No three.js or other heavy 3D libraries.
- Keep the bundle small: `next/image`, lazy-load below the fold, server components by default.
- Never copy images or text from competitor sites. Placeholder images must be free-license or the owner's own. All placeholders are replaced before launch.
- Never commit secrets. Provide `.env.example`. Real values live in `.env.local` and Vercel env vars.
- Work phase by phase. After each phase: build passes, deploy to Vercel, then report what is done and what is left. Do not start the next phase until told.
- Anything that needs an owner decision or owner-written text: mark it `TODO(owner)` and keep going with a sensible default.

## 1. Current state (audited 15 Oct 2026)

Working:
- Pages exist: Home, Shop, About, Corporate, Contact, Orders, Shipping, Privacy, Terms.
- Shop lists **11 products** (Rs 3,400 to Rs 10,500). Home copy and the 3-step process (Share, Approve preview, Unbox) are good; keep the tone.

Broken or missing:
1. `/products/[slug]` returns **404** (confirmed on `miniature-portrait` and `baby-miniature`).
2. No photo upload, cart or checkout.
3. Contact page has only email and Instagram. No form, no WhatsApp.
4. Shipping page is 2 to 3 lines. No refund, delivery-time or custom-order policy.
5. `/orders` shows a sample order (ORD-1001) to everyone, with no login.
6. Home page reuses the same bike images; the "Meera R." testimonial looks like a placeholder.
7. Shipping page mentions "selected international destinations", which may not match the plan.

## 2. Decisions

| Item | Default to build now | Status |
|---|---|---|
| Delivery area | **India only** at launch | Owner to confirm |
| Payment timing | Env var `PAYMENT_MODE` = `advance` (50% at order, balance before shipping) or `full` | Owner to confirm; build it switchable |
| Checkout identity | **Login required** (Supabase email OTP / magic link) before placing an order | Owner to confirm |
| Free revision rounds | 2 preview revisions included (`MAX_FREE_REVISIONS=2`) | Owner to confirm |
| Payment gateway | **Paytm PG**, test mode first | Confirmed |
| Domain / logo | Keep vercel.app URL and a text wordmark until ready | Later |

## 3. Environment variables (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only, never exposed to the browser
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
PAYMENT_MODE=advance                # advance | full
ADVANCE_PERCENT=50
MAX_FREE_REVISIONS=2
SHIPPING_FLAT_INR=                  # TODO(owner)
PAYTM_ENV=test                      # test | live
PAYTM_MID=
PAYTM_MERCHANT_KEY=
PAYTM_WEBSITE=
RESEND_API_KEY=                     # transactional email
EMAIL_FROM=
```

## 4. Phase 0: Foundation and database

The owner creates the Supabase project in the dashboard (free tier) and puts the three Supabase values into `.env.local` and Vercel. You cannot create the project yourself; ask the owner for the values if they are missing.

1. Confirm the Next.js project builds and deploys to Vercel from GitHub.
2. Copy `pestro3d-schema.sql` to `supabase/migrations/0001_init.sql` in the repo (for history).
3. **Create the database:** the owner pastes the full contents of `pestro3d-schema.sql` into Supabase Dashboard > SQL Editor and runs it once. It is safe to re-run. It creates all tables, triggers, Row Level Security policies, three storage buckets, and seeds the 11 products.
4. Verify in Supabase: 11 tables exist, RLS is enabled on every one, buckets `order-photos`, `order-previews` (private) and `product-images` (public) exist, and `products` has 11 rows.
5. Add Supabase clients: browser client (anon key), server client (cookies, anon key), and an **admin client (service-role key) used only in server route handlers**.
6. Generate TypeScript types from the schema for type-safe queries.
7. Make the first admin: after the owner signs up once, they run a one-line SQL (`update profiles set role='admin' ...`) for their own email. Ask the owner for that email; do not guess it.

### Data model (summary of the SQL)

- `profiles` (role: customer or admin), `products`, `product_options` (size, finish, addon with price delta), `coupons`.
- `orders` (status, payment_status, payment_mode, totals, shipping address, courier and tracking), `order_items` (price snapshot, options, occasion, engraving text), `order_photos`, `order_previews` (versioned, customer decision), `order_status_history` (auto-logged by trigger), `payments` (Paytm transactions), `contact_messages`.
- Order numbers look like `PST-1001`.

### Security model (must follow)

- **Prices are always computed on the server** from `products` and `product_options`. Never trust a price sent by the browser.
- Customers have **no insert or update rights** on `orders`, `order_items`, `payments`. A server route (service role) creates them after validating the cart, then records the uploaded photo paths.
- Customers upload photos directly to Storage under `order-photos/<their user id>/...`; the policy enforces that folder. Photos are never public; show them through short-lived signed URLs.
- Admin pages and admin API routes must check `profiles.role = 'admin'` **on the server**, not only in the UI.
- Contact form, coupon validation and payment callbacks are server routes. Add a honeypot field and basic rate limiting to the contact route.

## 5. Phase A: Storefront

1. **Fix `/products/[slug]`**: load from Supabase `products` (fallback to the existing local data only if the query fails). Unknown slug returns a proper not-found page. Add `generateStaticParams` or revalidation so pages are fast.
2. **Shop page**: product grid with category filter chips and price shown as "from Rs X". Keep the existing editorial style.
3. **Product page** contains:
   - Image gallery, name, tagline, description, price from, what's included, the "preview before production" promise, delivery time estimate (`TODO(owner)`).
   - **Order form:** photo upload (1 to 5 images; jpg, png, webp; max 10 MB each; client-side preview and compression; server validation), occasion dropdown, size and finish options (hidden if the product has none), engraving or name text (max 40 chars), notes, quantity. **Live price** updates as options change.
   - Photo guidelines box: clear face, good light, no heavy filters, multiple angles; show do and don't examples (placeholder images are fine).
   - Add to cart and a "Buy now" button.
4. **Cart** (persist in localStorage plus server validation at checkout) and **Checkout**: name, phone (10-digit India), email, address lines, city, state, pincode (6-digit). Apply coupon. Show subtotal, discount, shipping, total, and the amount payable now under the active `PAYMENT_MODE`.
5. **Contact page**: form posting to a server route (saves to `contact_messages`, emails the owner), plus a WhatsApp click-to-chat button using `NEXT_PUBLIC_WHATSAPP_NUMBER`.
6. **Policy pages**: write complete Shipping, Refund and Custom-order policy. Cover delivery time, packaging, that custom items start only after preview approval, damaged-on-arrival process, revision limits, and cancellation window. Put owner-specific numbers as `TODO(owner)`. Check Terms and Privacy for real content (data collected, photo usage, retention, deletion on request).
7. Fix the shipping text to match the delivery decision.
8. Remove the duplicate home images and the placeholder testimonial (or hide the section) until real content exists.

## 6. Phase B: Accounts, orders and tracking

1. **Auth**: email OTP or magic link, a small sign-in modal, profile page to save name, phone and default address.
2. **Place order flow** (server route, service role): validate cart, recompute totals, create `orders`, `order_items`, `order_photos`, apply and count the coupon, then return the order id for payment.
3. **`/orders`** requires login and lists only the user's orders. Remove the public sample order. Each order page shows: status timeline (from `order_status_history`), items and options, uploaded photos, previews, payment status and balance due, tracking link when shipped.
4. Order statuses (matches the SQL):
   `received -> modelling -> preview_sent -> (changes_requested -> modelling ...) -> approved -> printing -> painting -> ready_to_ship -> shipped -> delivered`, plus `cancelled`.
5. Reject invalid status jumps on the server (e.g. cannot go to `printing` before `approved`).

## 7. Phase C: Admin dashboard (`/admin`, admin role only)

1. **Orders list**: search by order number, name or phone; filter by status and payment status; newest first.
2. **Order detail**: customer details, shipping address (copy button), items and options, download all customer photos (zip or individual signed URLs), internal notes, status dropdown with an optional note, courier and tracking fields.
3. **Previews**: upload preview images (bucket `order-previews`, folder = order id), creating a new version and setting status `preview_sent`; see the customer's decision and note.
4. **Products**: edit name, price, description, active flag, upload product images to `product-images`; manage `product_options`.
5. **Coupons**: create, activate and deactivate, see usage.
6. **Messages**: view contact messages and mark as read.
7. Dashboard header with counts: new orders, awaiting preview, awaiting approval, to ship.

## 8. Phase D: Preview approval and payment

**Approval flow**
1. Admin uploads a preview; the customer gets an email and sees it on the order page.
2. Customer taps **Approve** or **Request changes** (with a note). Server route updates `order_previews.customer_decision` and the order status.
3. Approve sets `approved`. Request changes sets `changes_requested`. After `MAX_FREE_REVISIONS` is exceeded, show a message that further revisions may be charged (`TODO(owner)`), and notify the admin.

**Paytm PG** (follow Paytm's current official docs; start in test mode)
1. Server route creates a `payments` row (`initiated`) with a unique `gateway_order_id`, calls Paytm's initiate-transaction API, and returns what the client needs to open checkout.
2. Amount to charge: `PAYMENT_MODE=full` charges the total; `advance` charges `ADVANCE_PERCENT` of the total now, and the balance is collected later with a second `payments` row (`kind=balance`) before shipping.
3. Callback and webhook routes **verify the checksum on the server**, then **confirm the transaction through Paytm's status API** before marking anything as paid. Never trust the browser redirect alone.
4. On success: update `payments.status`, `orders.amount_paid_inr`, `orders.payment_status` (`advance_paid` or `paid`), and send a confirmation email. On failure: allow retry without creating a duplicate order.
5. The callback must be idempotent (the same notification twice must not double count).
6. Admin can see payment history on the order and trigger a balance payment link.
7. Going live: owner completes Paytm KYC, then set `PAYTM_ENV=live` and the live keys in Vercel only.

**Emails** (Resend or similar): order received, preview ready, changes acknowledged, payment received, shipped (with tracking), delivered. Simple branded template, plain-text fallback.

## 9. Phase E: Polish and launch

1. **Motion**: hero "photo to miniature" reveal, scroll reveals, tasteful hover states, smooth page transitions. Respect `prefers-reduced-motion`. No layout shift.
2. **SEO**: unique titles and meta per page, Open Graph images, `sitemap.xml`, `robots.txt`, Product structured data, clean slugs.
3. **Performance**: mobile Lighthouse Performance 85+, optimised images, no unused JS.
4. **Accessibility**: labels on all form fields, focus states, alt text, colour contrast, keyboard use.
5. **Content swap**: replace all placeholders with the owner's real miniature photos; real reviews only; real logo when ready.
6. **Domain**: connect the custom domain, set up the business email, update `NEXT_PUBLIC_SITE_URL`, and update the contact page.
7. Add 404 and error pages in the brand style, and a simple cookie or privacy notice if analytics are added.
8. Optional analytics (Vercel Analytics or Plausible) and an Instagram link in the footer.

## 10. Test checklist (run before launch)

- [ ] Every product page opens; no 404 in nav or footer.
- [ ] Sign up, add product, upload photo, checkout, pay in Paytm test mode, order appears under `/orders`.
- [ ] Admin sees the order, can download the photo, upload a preview, and change status.
- [ ] Customer approves a preview; status moves correctly; invalid status jumps are rejected.
- [ ] A second customer cannot open another customer's order or photo URL.
- [ ] Changing a price in browser dev tools does not change what is charged.
- [ ] Paying twice or refreshing the callback does not double count.
- [ ] Contact form works and spam honeypot blocks bots.
- [ ] Works on a real phone (Android Chrome and iPhone Safari), slow 4G included.
- [ ] No secrets in the repo; `.env.example` is complete.

## 11. Owner will provide (agent must not invent these)

- Final price list, size and finish options, shipping charge, delivery time
- Refund, cancellation and revision rules for custom items
- WhatsApp number, business email, business address for the policy pages
- Supabase project values, Paytm merchant credentials (test first, live later)
- Real photos, real reviews, the logo and the domain name
- The admin email address

## 12. Competitor research

Add the competitor findings from the earlier research here before handing this file to the agent.
