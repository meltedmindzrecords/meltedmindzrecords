# Editing the website (no code)

Artists, the team, and releases now come from Supabase.

## One-time setup
1. Open your Supabase project (the one the site already uses for the newsletter).
2. SQL Editor -> New query -> paste all of `supabase/cms.sql` -> Run.
   This creates the `artists`, `team` and `releases` tables, fills them with
   the current site content, and makes a public `site-images` photo bucket.

## Everyday editing
Supabase -> Table Editor -> pick a table -> double-click a cell -> edit -> Save.
The site picks up changes within about a minute.

- Add an artist: Insert row. `slug` is the page address (e.g. `rachel-ann` -> /artists/rachel-ann).
- Hide something: set `visible` to false (no need to delete).
- Change the order: lower `sort_order` shows first. (The Artists page itself is A-Z.)
- Photos: Storage -> `site-images` -> Upload -> click the file -> Get URL -> paste into `image_url` (or `cover_url`).
  Team members with no photo show their initials.
- Featured release: set `featured` = true on the one you want big on the homepage and Releases page.
- Music/social links: fill `spotify_url`, `apple_music_url`, `youtube_url`, `instagram_url`, `tiktok_url`; empty ones keep the current look.

If Supabase is ever unreachable or a table is empty, the site shows its
built-in content instead of breaking.
