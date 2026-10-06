alter table public.site_settings
  add column if not exists fontfamily text,
  add column if not exists fontdisplay text;
