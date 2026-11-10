-- Melted Mindz Records: website content tables
-- ------------------------------------------------------------------
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query ->
-- paste this whole file -> Run. Safe to run again (it won't duplicate rows).
--
-- After that, edit content in Table Editor:
--   artists   -> artist cards, artist pages, homepage "Featured Artists"
--   team      -> About page "Executive Team"
--   releases  -> Releases page + homepage "Featured Release"
-- Changes show on the site within about a minute.
--
-- Tips:
--   * visible = false hides a row without deleting it.
--   * sort_order controls order (lower numbers first).
--   * image_url / cover_url can be a site path like /artists/name.jpg or a
--     public image link (e.g. from the "site-images" Storage bucket below).
--   * Exactly one release should have featured = true (the big one shown).
-- ------------------------------------------------------------------

-- Keep updated_at current on every edit
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ARTISTS ---------------------------------------------------------
create table if not exists public.artists (
  id              bigint generated always as identity primary key,
  slug            text not null unique,      -- used in the page address: /artists/<slug>
  name            text not null,
  genre           text,
  bio             text,
  image_url       text,
  spotify_url     text,
  apple_music_url text,
  youtube_url     text,
  instagram_url   text,
  tiktok_url      text,
  sort_order      integer not null default 100,
  visible         boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- TEAM ------------------------------------------------------------
create table if not exists public.team (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  title       text,
  bio         text,
  image_url   text,                          -- leave empty to show initials
  sort_order  integer not null default 100,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RELEASES --------------------------------------------------------
create table if not exists public.releases (
  id                bigint generated always as identity primary key,
  slug              text not null unique,
  title             text not null,
  artist            text,
  type              text default 'Single',   -- Single, EP, Album...
  release_date      text,                     -- shown as written, e.g. "July 28, 2026"
  cover_url         text,
  description       text,                     -- Releases page text
  short_description text,                     -- homepage blurb (falls back to description)
  about             text,                     -- "About This Release" paragraph
  link_url          text,                     -- main link (e.g. too.fm smart link)
  spotify_url       text,                     -- optional; buttons use link_url if empty
  apple_music_url   text,
  youtube_url       text,
  featured          boolean not null default false,
  sort_order        integer not null default 100,
  visible           boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists artists_updated_at on public.artists;
create trigger artists_updated_at before update on public.artists
  for each row execute function public.set_updated_at();
drop trigger if exists team_updated_at on public.team;
create trigger team_updated_at before update on public.team
  for each row execute function public.set_updated_at();
drop trigger if exists releases_updated_at on public.releases;
create trigger releases_updated_at before update on public.releases
  for each row execute function public.set_updated_at();

-- SECURITY: the public website can only READ visible rows.
-- Editing happens only in the Supabase dashboard (or with the secret key).
alter table public.artists  enable row level security;
alter table public.team     enable row level security;
alter table public.releases enable row level security;

drop policy if exists "Public can read visible artists" on public.artists;
create policy "Public can read visible artists" on public.artists
  for select to anon, authenticated using (visible = true);
drop policy if exists "Public can read visible team" on public.team;
create policy "Public can read visible team" on public.team
  for select to anon, authenticated using (visible = true);
drop policy if exists "Public can read visible releases" on public.releases;
create policy "Public can read visible releases" on public.releases
  for select to anon, authenticated using (visible = true);

grant select on public.artists, public.team, public.releases to anon, authenticated;

-- PHOTO STORAGE: a public bucket for artist / team / cover photos.
-- Upload in Storage -> site-images, click the file -> "Get URL", paste into image_url.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- SEED ROWS (current site content) ---------------------------------
insert into public.artists (slug, name, genre, bio, image_url, sort_order) values
  ('lil-rappy', 'Lil Rappy', 'Melodic Rap / Hip-Hop',
   'Lil Rappy delivers melodic energy, creative songwriting, and a unique voice within modern hip-hop.',
   '/artists/lil-rappy.jpg', 20),
  ('rachel-ann', 'Rachel Ann', 'Alternative / Pop-Punk',
   'Rachel Ann brings powerful emotion, alternative influences, and a distinctive sound to the Melted Mindz roster.',
   '/artists/rachel-ann.jpg', 30),
  ('okay-boomhauer', 'Okay Boomhauer', 'Rock / Alternative (Band)',
   'Okay Boomhauer delivers a rock-driven sound with alternative influences and a unique band identity.',
   '/artists/okay-boomhauer.jpg', 40),
  ('everstatic', 'Everstatic', 'Alternative / Rock',
   'Everstatic is an alternative rock artist bringing a distinctive sound, creative energy, and a modern approach to the Melted Mindz Records roster.',
   '/artists/everstatic.jpg', 50)
on conflict (slug) do nothing;

insert into public.team (name, title, bio, image_url, sort_order) values
  ('Theodore Pirkle', 'Founder & CEO',
   'Founder and CEO of Melted Mindz Records, leading the label''s vision, artist development, business strategy, and future growth.',
   null, 10),
  ('Alexandra Elizabeth', 'Head of Business Affairs & Head of A&R',
   'Head of Business Affairs and Head of A&R at Melted Mindz Records, focused on discovering talent, developing artists, creative direction, and supporting the long-term growth of the label''s roster.',
   null, 20)
on conflict (name) do nothing;

insert into public.releases
  (slug, title, artist, type, release_date, cover_url, description, short_description, about, link_url, featured, sort_order)
values
  ('still-with-me', 'Still With Me', 'Lil Rappy', 'Single', 'July 28, 2026',
   '/release%20covers/Still-With-Me.jpg',
   'Still With Me is a heartfelt release exploring perseverance, loyalty, and growth. Released through Melted Mindz Records, the song showcases emotional lyricism paired with cinematic production.',
   'An emotional release exploring loyalty, perseverance, and personal growth through melodic storytelling.',
   'Melted Mindz Records presents "Still With Me" by Lil Rappy. The release delivers melodic storytelling, emotional depth, and a unique sound that represents the next generation of independent music.',
   'https://too.fm/stillwithme', true, 10)
on conflict (slug) do nothing;
