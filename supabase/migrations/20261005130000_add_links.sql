alter table public.projects add column if not exists links jsonb default '[]'::jsonb;
alter table public.blogs add column if not exists links jsonb default '[]'::jsonb;
