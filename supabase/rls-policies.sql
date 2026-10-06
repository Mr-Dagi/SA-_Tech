-- SA-TECH RLS policy reference / enforcement
-- Restaurant-era tables (broadcasts, menu_items, orders, order_items, waiter_requests) already have RLS + restricted EXECUTE; do not expose them to the app.

-- Enable RLS everywhere (idempotent)
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.blogs enable row level security;
alter table public.messages enable row level security;
alter table public.comments enable row level security;
alter table public.contacts enable row level security;
alter table public.project_ratings enable row level security;
alter table public.profiles enable row level security;

-- site_settings: public read, admin write
-- (already enforced via 20261005140000_fix_rls_policies.sql)

-- projects/blogs: public read of visible/published, admin write
-- messages: anon insert, owner/admin read
-- comments: anon insert, public read, admin delete
-- contacts: anon insert, admin read/update/delete
-- project_ratings: public read, anon upsert own visitor rating

-- Example hardened pattern used throughout:
-- create policy "Public can read blogs" on public.blogs
--   for select using (published = true);
-- create policy "Admins manage blogs" on public.blogs
--   for all using (select has_role('admin'::app_role))
--   with check (select has_role('admin'::app_role));
-- create policy "Anonymous comments insert" on public.comments
--   for insert with check (true);
