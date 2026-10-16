-- =====================================================================
-- Pestro3D database schema (Supabase / Postgres)
-- Run: Supabase Dashboard > SQL Editor > New query > paste ALL > Run.
-- Safe to re-run: uses IF NOT EXISTS / DROP ... IF EXISTS / ON CONFLICT.
-- Money is stored as whole INR rupees (integer).
-- Orders, order items, payments are written ONLY by server routes using
-- the service-role key (so customers can never set their own price).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Helpers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- 2. Profiles (one row per auth user)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer','admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Admin check used by every policy. SECURITY DEFINER avoids RLS recursion.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create a profile when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only an admin (or the SQL editor / service role) can change a role.
create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only an admin can change roles';
  end if;
  return new;
end $$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ---------------------------------------------------------------------
-- 3. Catalogue
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  category        text not null,
  tagline         text,
  description     text,
  base_price_inr  integer not null check (base_price_inr >= 0),
  featured_note   text not null default '',
  images          text[] not null default '{}',
  image_alt       text not null default '',
  is_active       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- Size / finish / add-on choices that change the price.
create table if not exists public.product_options (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  option_type      text not null check (option_type in ('size','finish','addon')),
  label            text not null,
  price_delta_inr  integer not null default 0,
  is_active        boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);
create index if not exists product_options_product_idx on public.product_options(product_id);

-- ---------------------------------------------------------------------
-- 4. Coupons
-- ---------------------------------------------------------------------
create table if not exists public.coupons (
  code            text primary key,
  discount_type   text not null check (discount_type in ('percent','flat')),
  discount_value  integer not null check (discount_value > 0),
  min_order_inr   integer not null default 0,
  max_uses        integer,
  used_count      integer not null default 0,
  expires_at      timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. Orders
-- ---------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text not null unique default ('PST-' || nextval('public.order_number_seq')),
  user_id          uuid not null references public.profiles(id),

  status           text not null default 'received' check (status in (
                     'received','modelling','preview_sent','changes_requested','approved',
                     'printing','painting','ready_to_ship','shipped','delivered','cancelled')),
  payment_status   text not null default 'unpaid' check (payment_status in (
                     'unpaid','advance_paid','paid','failed','refunded')),
  payment_mode     text not null default 'advance' check (payment_mode in ('advance','full')),

  subtotal_inr     integer not null default 0,
  discount_inr     integer not null default 0,
  shipping_inr     integer not null default 0,
  total_inr        integer not null default 0,
  amount_paid_inr  integer not null default 0,
  coupon_code      text references public.coupons(code),

  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text not null,
  ship_line1       text not null,
  ship_line2       text,
  ship_city        text not null,
  ship_state       text not null,
  ship_pincode     text not null check (ship_pincode ~ '^[1-9][0-9]{5}$'),
  customer_notes   text,

  courier          text,
  tracking_number  text,
  tracking_url     text,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists orders_user_idx   on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  product_id        uuid references public.products(id),
  product_name      text not null,          -- snapshot at order time
  unit_price_inr    integer not null,       -- snapshot at order time
  quantity          integer not null default 1 check (quantity > 0),
  selected_options  jsonb not null default '[]'::jsonb,
  occasion          text,
  engraving_text    text,
  item_notes        text,
  created_at        timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.order_photos (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  order_item_id  uuid references public.order_items(id) on delete cascade,
  storage_path   text not null,             -- path inside bucket "order-photos"
  created_at     timestamptz not null default now()
);
create index if not exists order_photos_order_idx on public.order_photos(order_id);

-- Preview images sent to the customer for approval (versioned).
create table if not exists public.order_previews (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  version           integer not null default 1,
  storage_path      text not null,          -- path inside bucket "order-previews"
  customer_decision text not null default 'pending'
                    check (customer_decision in ('pending','approved','changes_requested')),
  customer_note     text,
  decided_at        timestamptz,
  created_by        uuid references public.profiles(id),
  created_at        timestamptz not null default now(),
  unique (order_id, version, storage_path)
);
create index if not exists order_previews_order_idx on public.order_previews(order_id);

create table if not exists public.order_status_history (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  from_status  text,
  to_status    text not null,
  note         text,
  changed_by   uuid,
  created_at   timestamptz not null default now()
);
create index if not exists order_status_history_order_idx on public.order_status_history(order_id);

-- Log every status change automatically.
create or replace function public.log_order_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_status_history(order_id, from_status, to_status, changed_by)
    values (new.id, null, new.status, auth.uid());
  elsif new.status is distinct from old.status then
    insert into public.order_status_history(order_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end $$;

drop trigger if exists orders_log_status on public.orders;
create trigger orders_log_status after insert or update of status on public.orders
  for each row execute function public.log_order_status();

-- ---------------------------------------------------------------------
-- 6. Payments (Paytm PG)
-- ---------------------------------------------------------------------
create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  gateway           text not null default 'paytm',
  gateway_order_id  text not null unique,   -- the ORDERID sent to Paytm
  gateway_txn_id    text,
  amount_inr        integer not null check (amount_inr > 0),
  kind              text not null default 'advance' check (kind in ('advance','balance','full')),
  status            text not null default 'initiated' check (status in ('initiated','success','failed','pending')),
  raw_response      jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists payments_order_idx on public.payments(order_id);

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 7. Contact messages (inserted by a server route, read by admin)
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 8. Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles             enable row level security;
alter table public.products             enable row level security;
alter table public.product_options      enable row level security;
alter table public.coupons              enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.order_photos         enable row level security;
alter table public.order_previews       enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments             enable row level security;
alter table public.contact_messages     enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- products + options: public read of active rows, admin manages
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select using (is_active = true);
drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists product_options_public_read on public.product_options;
create policy product_options_public_read on public.product_options for select using (is_active = true);
drop policy if exists product_options_admin_all on public.product_options;
create policy product_options_admin_all on public.product_options for all
  using (public.is_admin()) with check (public.is_admin());

-- coupons: admin only (customers validate coupons through a server route)
drop policy if exists coupons_admin_all on public.coupons;
create policy coupons_admin_all on public.coupons for all
  using (public.is_admin()) with check (public.is_admin());

-- orders: customer reads own; only admin updates; inserts via service role
drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

-- child tables of orders: read if you own the parent order (or admin)
drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items for select using (
  exists (select 1 from public.orders o
          where o.id = order_items.order_id and (o.user_id = auth.uid() or public.is_admin())));

drop policy if exists order_photos_select on public.order_photos;
create policy order_photos_select on public.order_photos for select using (
  exists (select 1 from public.orders o
          where o.id = order_photos.order_id and (o.user_id = auth.uid() or public.is_admin())));

drop policy if exists order_previews_select on public.order_previews;
create policy order_previews_select on public.order_previews for select using (
  exists (select 1 from public.orders o
          where o.id = order_previews.order_id and (o.user_id = auth.uid() or public.is_admin())));
drop policy if exists order_previews_admin_all on public.order_previews;
create policy order_previews_admin_all on public.order_previews for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists order_status_history_select on public.order_status_history;
create policy order_status_history_select on public.order_status_history for select using (
  exists (select 1 from public.orders o
          where o.id = order_status_history.order_id and (o.user_id = auth.uid() or public.is_admin())));

drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments for select using (
  exists (select 1 from public.orders o
          where o.id = payments.order_id and (o.user_id = auth.uid() or public.is_admin())));

-- Admin full access on the remaining tables
drop policy if exists order_items_admin_all on public.order_items;
create policy order_items_admin_all on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists order_photos_admin_all on public.order_photos;
create policy order_photos_admin_all on public.order_photos for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists payments_admin_all on public.payments;
create policy payments_admin_all on public.payments for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists contact_messages_admin_all on public.contact_messages;
create policy contact_messages_admin_all on public.contact_messages for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 9. Storage buckets + policies
--    order-photos    : private. Customer uploads to  <user_id>/<file>
--    order-previews  : private. Admin uploads to     <order_id>/<file>
--    product-images  : public read, admin write
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('order-photos',   'order-photos',   false, 10485760, array['image/jpeg','image/png','image/webp']),
  ('order-previews', 'order-previews', false, 10485760, array['image/jpeg','image/png','image/webp']),
  ('product-images', 'product-images', true,  5242880,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists order_photos_insert_own on storage.objects;
create policy order_photos_insert_own on storage.objects for insert to authenticated
  with check (bucket_id = 'order-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists order_photos_select_own on storage.objects;
create policy order_photos_select_own on storage.objects for select to authenticated
  using (bucket_id = 'order-photos'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

drop policy if exists order_photos_admin_all on storage.objects;
create policy order_photos_admin_all on storage.objects for all to authenticated
  using (bucket_id = 'order-photos' and public.is_admin())
  with check (bucket_id = 'order-photos' and public.is_admin());

drop policy if exists order_previews_select_own on storage.objects;
create policy order_previews_select_own on storage.objects for select to authenticated
  using (bucket_id = 'order-previews' and exists (
    select 1 from public.orders o
    where o.id::text = (storage.foldername(name))[1] and o.user_id = auth.uid()));

drop policy if exists order_previews_admin_all on storage.objects;
create policy order_previews_admin_all on storage.objects for all to authenticated
  using (bucket_id = 'order-previews' and public.is_admin())
  with check (bucket_id = 'order-previews' and public.is_admin());

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists product_images_admin_write on storage.objects;
create policy product_images_admin_write on storage.objects for all to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- ---------------------------------------------------------------------
-- 10. Seed the 11 products currently on the site
--     (images are left empty; the agent fills them from /public/images)
--     product_options is intentionally empty: owner decides sizes/finishes.
-- ---------------------------------------------------------------------
insert into public.products (slug, name, category, tagline, base_price_inr, sort_order) values
  ('miniature-portrait',        'Miniature Portrait',          'Custom Keepsake',      'Cherished moments, immortalized in miniature.',      4000,  1),
  ('baby-miniature',            'Sleeping Baby Miniature',     'Family Keepsake',      'A tiny guardian, captured in a peaceful moment.',    6500,  2),
  ('pet-miniature',             'Pet Portrait Miniature',      'Pet Memorial',         'Keep their little personality close.',               5800,  3),
  ('full-body-miniature',       'Full-Body Miniature',         'Storytelling Sculptures','A complete character, crafted in miniature.',      8800,  4),
  ('group-miniature',           'Family Group Miniature',      'Family Keepsake',      'The whole story, held in one small moment.',         7200,  5),
  ('solo-character-miniature',  'Solo Character Miniature',    'Character Art',        'One character. One story. Endless detail.',          5900,  6),
  ('couple-miniature',          'Couple Miniature',            'Romantic Keepsake',    'A love story, preserved in two small figures.',      7600,  7),
  ('wedding-miniature',         'Indian Wedding Miniature',    'Wedding Keepsake',     'A celebration of your day, in miniature.',           10500, 8),
  ('sculpture-miniature',       'Sculpted Art Miniature',      'Art & Sculpture',      'A refined sculpture for your collection.',           9400,  9),
  ('desk-nameplate',            'Personalized Desk Nameplate', 'Desk Décor',           'Make your workspace unmistakably yours.',            3400,  10),
  ('car-mounted-miniature',     'Car Mount Miniature',         'Automotive Décor',     'A miniature ride, built for your dashboard.',        5400,  11)
on conflict (slug) do nothing;
