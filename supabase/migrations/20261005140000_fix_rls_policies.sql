-- Fix auth_rls_initplan + multiple_permissive_policies
-- Wrap auth.jwt() in (select ...) and split ALL policies into per-command ones.

-- projects
drop policy if exists "admins can manage projects" on public.projects;
drop policy if exists "public can read visible projects" on public.projects;
create policy "Projects selectable by public and admins" on public.projects
  for select using (
    visible = true
    or (select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin'
  );
create policy "Admins insert projects" on public.projects
  for insert with check ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');
create policy "Admins update projects" on public.projects
  for update using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');
create policy "Admins delete projects" on public.projects
  for delete using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');

-- blogs
drop policy if exists "admins can manage blogs" on public.blogs;
drop policy if exists "public can read published blogs" on public.blogs;
create policy "Blogs selectable by public and admins" on public.blogs
  for select using (
    published = true
    or (select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin'
  );
create policy "Admins insert blogs" on public.blogs
  for insert with check ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');
create policy "Admins update blogs" on public.blogs
  for update using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');
create policy "Admins delete blogs" on public.blogs
  for delete using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');

-- site_settings
drop policy if exists "admins can manage site settings" on public.site_settings;
drop policy if exists "public can read site settings" on public.site_settings;
create policy "Site settings readable by public and admins" on public.site_settings
  for select using (
    true
    or (select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin'
  );
create policy "Admins insert site settings" on public.site_settings
  for insert with check ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');
create policy "Admins update site settings" on public.site_settings
  for update using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');
create policy "Admins delete site settings" on public.site_settings
  for delete using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');

-- contacts
drop policy if exists "admins can manage contacts" on public.contacts;
create policy "Admins update contacts" on public.contacts
  for update using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');
create policy "Admins delete contacts" on public.contacts
  for delete using ((select coalesce((((select auth.jwt()) -> 'app_metadata') ->> 'role'), '')) = 'admin');

-- broadcasts
drop policy if exists "Admins manage broadcasts" on public.broadcasts;
create policy "Admins insert broadcasts" on public.broadcasts
  for insert with check (has_role('admin'::app_role));
create policy "Admins update broadcasts" on public.broadcasts
  for update using (has_role('admin'::app_role));
create policy "Admins delete broadcasts" on public.broadcasts
  for delete using (has_role('admin'::app_role));

-- menu_items
drop policy if exists "Admins manage menu items" on public.menu_items;
create policy "Admins insert menu items" on public.menu_items
  for insert with check (has_role('admin'::app_role));
create policy "Admins update menu items" on public.menu_items
  for update using (has_role('admin'::app_role));
create policy "Admins delete menu items" on public.menu_items
  for delete using (has_role('admin'::app_role));
