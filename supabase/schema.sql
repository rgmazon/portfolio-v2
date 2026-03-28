-- ─────────────────────────────────────────────────────────────────────────────
-- portfolio-rgmazon  —  Supabase schema
-- Run this once in the Supabase SQL editor to bootstrap all tables.
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── profile ─────────────────────────────────────────────────────────────────
-- Single-row table.  Insert one seed row after running this script.

create table if not exists public.profile (
  id                  uuid primary key default gen_random_uuid(),

  -- Hero section
  hero_headline       text,
  hero_subtext        text,
  hero_cta_primary    text  default 'View Work',
  hero_cta_secondary  text  default 'Download CV',
  available           boolean not null default true,

  -- Social links
  github_url          text,
  linkedin_url        text,
  dribbble_url        text,

  -- Stat strip
  years_experience    integer not null default 0,
  projects_count      integer not null default 0,
  clients_count       integer not null default 0,

  -- About section
  bio_paragraph_1     text,
  bio_paragraph_2     text,
  quote               text,

  -- Contact section
  email               text,
  phone               text,
  location            text,
  timezone            text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Seed one profile row (idempotent)
insert into public.profile (
  hero_headline, hero_subtext, hero_cta_primary, hero_cta_secondary,
  available,
  github_url, linkedin_url, dribbble_url,
  years_experience, projects_count, clients_count,
  bio_paragraph_1, bio_paragraph_2, quote,
  email, phone, location, timezone
)
select
  'I BUILD THINGS',
  'Full-stack developer crafting fast, functional, and brutally honest digital experiences. From concept to deployment — no fluff, just code that works.',
  'View Work', 'Download CV',
  true,
  'https://github.com/rgmazon',
  'https://linkedin.com/in/rgmazon',
  'https://dribbble.com/rgmazon',
  5, 30, 12,
  'I''m RG Mazon, a full-stack developer with a sharp eye for design and an obsession with clean, performant code.',
  'My stack is built around the modern web: Next.js, TypeScript, Tailwind, and Supabase.',
  'I don''t just write code — I build things people actually want to use.',
  'hello@rgmazon.com', '+63 912 345 6789', 'Philippines, Remote — UTC+8', 'UTC+8'
where not exists (select 1 from public.profile);


-- ─── site_settings ───────────────────────────────────────────────────────────
-- Single-row table.

create table if not exists public.site_settings (
  id               uuid primary key default gen_random_uuid(),

  -- SEO
  seo_title        text default 'RG Mazon — Full-Stack Developer',
  seo_description  text default 'Full-stack developer crafting fast, functional, and brutally honest digital experiences.',
  og_image_url     text,

  -- Footer
  footer_tagline   text default 'Full-stack developer crafting fast, functional, and brutally honest digital experiences.',
  footer_copyright text default '© 2026 RG Mazon. All rights reserved.',

  -- Section visibility
  show_hero        boolean not null default true,
  show_about       boolean not null default true,
  show_experience  boolean not null default true,
  show_projects    boolean not null default true,
  show_contact     boolean not null default true,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Seed one settings row (idempotent)
insert into public.site_settings (
  seo_title, seo_description,
  footer_tagline, footer_copyright
)
select
  'RG Mazon — Full-Stack Developer',
  'Full-stack developer crafting fast, functional, and brutally honest digital experiences.',
  'Full-stack developer crafting fast, functional, and brutally honest digital experiences.',
  '© 2026 RG Mazon. All rights reserved.'
where not exists (select 1 from public.site_settings);


-- ─── experiences ─────────────────────────────────────────────────────────────

create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  role        text         not null,
  company     text         not null,
  type        text         not null,   -- 'Full-time' | 'Contract' | 'Internship'
  period      text         not null,   -- e.g. '2022 — Present'
  location    text         not null,
  description text         not null,
  stack       text[]       not null default '{}',
  sort_order  integer      not null default 0,
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);

create index if not exists experiences_sort_order_idx on public.experiences (sort_order asc);


-- ─── projects ────────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  num         text         not null,   -- e.g. '001'
  slug        text         not null unique,
  title       text         not null,
  category    text         not null,
  year        text         not null,
  role        text         not null,
  type        text         not null,
  description text         not null,
  stack       text[]       not null default '{}',
  github      text,
  url         text,
  -- Array of { type: 'image'|'video', src: string, poster?: string }
  media       jsonb        not null default '[]',
  sort_order  integer      not null default 0,
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);

create index if not exists projects_sort_order_idx on public.projects (sort_order asc);
create index if not exists projects_slug_idx on public.projects (slug);


-- ─── updated_at auto-trigger ─────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_profile_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

create or replace trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create or replace trigger trg_experiences_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

create or replace trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();


-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Public read is enabled for all tables (used by the public site).
-- Writes require an authenticated session (admin only).

alter table public.profile       enable row level security;
alter table public.site_settings enable row level security;
alter table public.experiences   enable row level security;
alter table public.projects      enable row level security;

-- Public (anon) can read everything
create policy "public_read_profile"
  on public.profile for select using (true);

create policy "public_read_site_settings"
  on public.site_settings for select using (true);

create policy "public_read_experiences"
  on public.experiences for select using (true);

create policy "public_read_projects"
  on public.projects for select using (true);

-- Authenticated users (admins) can do everything
create policy "auth_all_profile"
  on public.profile for all using (auth.role() = 'authenticated');

create policy "auth_all_site_settings"
  on public.site_settings for all using (auth.role() = 'authenticated');

create policy "auth_all_experiences"
  on public.experiences for all using (auth.role() = 'authenticated');

create policy "auth_all_projects"
  on public.projects for all using (auth.role() = 'authenticated');


-- ─── Storage bucket ──────────────────────────────────────────────────────────
-- Creates the 'media' bucket used by the admin Media Library.
-- Supabase Storage must be enabled in your project first.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload/delete
create policy "auth_upload_media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "auth_delete_media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- Allow anyone to read media files (public bucket)
create policy "public_read_media"
  on storage.objects for select
  using (bucket_id = 'media');
