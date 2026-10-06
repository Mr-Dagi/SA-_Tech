-- Allow admins to manage files in the public `image` bucket
drop policy if exists "Image files are public" on storage.objects;
drop policy if exists "Admins upload image files" on storage.objects;
drop policy if exists "Admins update image files" on storage.objects;
drop policy if exists "Admins delete image files" on storage.objects;

create policy "Image files are public"
  on storage.objects for select
  using (bucket_id = 'image');

create policy "Admins upload image files"
  on storage.objects for insert
  with check (bucket_id = 'image' and has_role('admin'::app_role));

create policy "Admins update image files"
  on storage.objects for update
  using (bucket_id = 'image' and has_role('admin'::app_role))
  with check (bucket_id = 'image' and has_role('admin'::app_role));

create policy "Admins delete image files"
  on storage.objects for delete
  using (bucket_id = 'image' and has_role('admin'::app_role));
