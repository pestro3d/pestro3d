alter table public.products
  add column if not exists featured_note text not null default '',
  add column if not exists image_alt text not null default '';
