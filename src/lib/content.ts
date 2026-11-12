import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { releaseInstant } from "@/lib/time";

export { LABEL_TIME_ZONE, releaseInstant } from "@/lib/time";

/*
 * Site content (artists, team, releases) comes from Supabase tables so it can
 * be edited in the Supabase Table Editor without touching code.
 *
 * If Supabase is not configured, unreachable, or a table is empty, the site
 * falls back to the built-in content below, so the site never breaks.
 * Tables and seed rows: see supabase/cms.sql.
 */

export type Artist = {
  slug: string;
  name: string;
  genre: string;
  bio: string;
  image: string;
  spotifyUrl: string | null;
  appleMusicUrl: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  /** Old page addresses that now redirect to this artist. */
  previousSlugs?: string[];
};

export type TeamMember = {
  name: string;
  title: string;
  bio: string;
  image: string | null;
};

export type Release = {
  slug: string;
  title: string;
  artist: string;
  type: string;
  releaseDate: string;
  cover: string;
  description: string;
  shortDescription: string;
  about: string;
  link: string | null;
  spotifyUrl: string | null;
  appleMusicUrl: string | null;
  youtubeUrl: string | null;
  featured: boolean;
  /** Pre-save links for a release that is not out yet (general smart link, Spotify, Apple Music). */
  presaveUrl: string | null;
  presaveSpotifyUrl: string | null;
  presaveAppleMusicUrl: string | null;
  /**
   * The exact moment it comes out (ISO, UTC): release_date at release_time
   * (or midnight) in the label's time zone. Null when the date is not a plain
   * YYYY-MM-DD.
   */
  releaseAt: string | null;
};

/* ------------------------------------------------------------------ */
/* Built-in fallback content (matches the site before the CMS)         */
/* ------------------------------------------------------------------ */

const noLinks = {
  spotifyUrl: null,
  appleMusicUrl: null,
  youtubeUrl: null,
  instagramUrl: null,
  tiktokUrl: null,
};

export const fallbackArtists: Artist[] = [
  {
    slug: "lil-rappy",
    name: "B1AK3",
    genre: "Melodic Rap / Hip-Hop",
    image: "/artists/lil-rappy.jpg",
    bio: "B1AK3 delivers melodic energy, creative songwriting, and a unique voice within modern hip-hop.",
    spotifyUrl: "https://open.spotify.com/artist/6thRj8cKZfWpkslddej5qx",
    appleMusicUrl: "https://music.apple.com/us/artist/lil-rappy/1715891963",
    youtubeUrl: "https://www.youtube.com/@theofficiallilrappy",
    instagramUrl: "https://www.instagram.com/lil_rappy_official/",
    tiktokUrl: "https://www.tiktok.com/@lilrappy",
  },
  {
    slug: "rachel-ann",
    name: "Rachel Ann",
    genre: "Alternative / Pop-Punk",
    image: "/artists/rachel-ann.jpg",
    bio: "Rachel Ann brings powerful emotion, alternative influences, and a distinctive sound to the Melted Mindz roster.",
    ...noLinks,
  },
  {
    slug: "okay-boomhauer",
    name: "Okay Boomhauer",
    genre: "Rock / Alternative (Band)",
    image: "/artists/okay-boomhauer.jpg",
    bio: "Okay Boomhauer delivers a rock-driven sound with alternative influences and a unique band identity.",
    spotifyUrl: "https://open.spotify.com/artist/799cPO1eCIgjzX6qvHtXxT",
    appleMusicUrl: "https://music.apple.com/us/artist/okay-boomhauer/1587341062",
    youtubeUrl: "https://www.youtube.com/@okayboomhauer",
    instagramUrl: "https://www.instagram.com/okayboomhauer/",
    tiktokUrl: "https://www.tiktok.com/@okayboomhauer",
  },
  {
    slug: "everstatic",
    name: "Everstatic",
    genre: "Alternative / Rock",
    image: "/artists/everstatic.jpg",
    bio: "Everstatic is an alternative rock artist bringing a distinctive sound, creative energy, and a modern approach to the Melted Mindz Records roster.",
    spotifyUrl: "https://open.spotify.com/artist/5lfGHhWeePLymISzdE3CGL",
    appleMusicUrl: "https://music.apple.com/us/artist/everstatic/6828028984",
    youtubeUrl: "https://www.youtube.com/@everstatic-official",
    instagramUrl: "https://www.instagram.com/everstatic.official/",
    tiktokUrl: "https://www.tiktok.com/@everstatic.official",
  },
];

export const fallbackTeam: TeamMember[] = [
  {
    name: "Theodore Pirkle",
    title: "Founder & CEO",
    image: null,
    bio: "Founder and CEO of Melted Mindz Records, leading the label's vision, artist development, business strategy, and future growth.",
  },
  {
    name: "Alexandra Elizabeth",
    title: "Head of Business Affairs & Head of A&R",
    image: null,
    bio: "Head of Business Affairs and Head of A&R at Melted Mindz Records, focused on discovering talent, developing artists, creative direction, and supporting the long-term growth of the label's roster.",
  },
];

export const fallbackReleases: Release[] = [
  {
    slug: "still-with-me",
    title: "Still With Me",
    artist: "B1AK3",
    type: "Single",
    releaseDate: "July 28, 2026",
    cover: "/release%20covers/Still-With-Me.jpg",
    description:
      "Still With Me is a heartfelt release exploring perseverance, loyalty, and growth. Released through Melted Mindz Records, the song showcases emotional lyricism paired with cinematic production.",
    shortDescription:
      "An emotional release exploring loyalty, perseverance, and personal growth through melodic storytelling.",
    about:
      'Melted Mindz Records presents "Still With Me" by B1AK3. The release delivers melodic storytelling, emotional depth, and a unique sound that represents the next generation of independent music.',
    link: "https://too.fm/stillwithme",
    spotifyUrl: null,
    appleMusicUrl: null,
    youtubeUrl: null,
    featured: true,
    presaveUrl: null,
    presaveSpotifyUrl: null,
    presaveAppleMusicUrl: null,
    releaseAt: null,
  },
];

/* ------------------------------------------------------------------ */
/* Supabase                                                            */
/* ------------------------------------------------------------------ */

let client: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  return getClient();
}

function getClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;
  return client;
}

type Row = Record<string, unknown>;

async function fetchRows(table: string): Promise<Row[] | null> {
  const supabase = getClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn(`[cms] ${table}: ${error.message} (using built-in content)`);
      return null;
    }
    return data && data.length > 0 ? (data as Row[]) : null;
  } catch (err) {
    console.warn(`[cms] ${table}: unreachable (using built-in content)`, err);
    return null;
  }
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-04-24" (or an ISO timestamp) -> "April 24, 2026". Anything else is shown as typed. */
export function formatReleaseDate(v: unknown): string {
  const raw = str(v);
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ].*)?$/.exec(raw);
  if (!m) return raw;
  const month = MONTHS[Number(m[2]) - 1];
  const day = Number(m[3]);
  if (!month || day < 1 || day > 31) return raw;
  return `${month} ${day}, ${m[1]}`;
}

function opt(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getArtists(): Promise<Artist[]> {
  const rows = await fetchRows("artists");
  if (!rows) return fallbackArtists;
  const artists = rows
    .map((r) => {
      const name = str(r.name);
      return {
        slug: str(r.slug, slugify(name)),
        name,
        genre: str(r.genre),
        bio: str(r.bio),
        image: str(r.image_url, "/logo/Melted.Mindz.Records-Logo.jpg"),
        spotifyUrl: opt(r.spotify_url),
        appleMusicUrl: opt(r.apple_music_url),
        youtubeUrl: opt(r.youtube_url),
        instagramUrl: opt(r.instagram_url),
        tiktokUrl: opt(r.tiktok_url),
        previousSlugs: Array.isArray(r.previous_slugs)
          ? (r.previous_slugs as unknown[]).filter((s): s is string => typeof s === "string" && s !== "")
          : [],
      };
    })
    .filter((a) => a.name && a.slug);
  return artists.length > 0 ? artists : fallbackArtists;
}

export async function getArtist(slug: string): Promise<Artist | null> {
  const artists = await getArtists();
  return artists.find((a) => a.slug === slug) ?? null;
}

/** The artist whose OLD page address this was (their page moved), if any. */
export async function findMovedArtist(slug: string): Promise<Artist | null> {
  const artists = await getArtists();
  if (artists.some((a) => a.slug === slug)) return null;
  return artists.find((a) => a.previousSlugs?.includes(slug)) ?? null;
}

/** Scheduled rows (publish_at in the future) stay off the site until their time. */
function isLive(r: Row): boolean {
  const at = typeof r.publish_at === "string" ? Date.parse(r.publish_at) : NaN;
  return Number.isNaN(at) || at <= Date.now();
}

export async function getTeam(): Promise<TeamMember[]> {
  const rows = await fetchRows("team");
  if (!rows) return fallbackTeam;
  const team = rows
    .map((r) => ({
      name: str(r.name),
      title: str(r.title),
      bio: str(r.bio),
      image: opt(r.image_url),
    }))
    .filter((m) => m.name);
  return team.length > 0 ? team : fallbackTeam;
}

export async function getReleases(order: "date" | "manual" = "date"): Promise<Release[]> {
  const fetched = await fetchRows("releases");
  const rows = fetched?.filter(isLive) ?? null;
  if (!rows || rows.length === 0) return fallbackReleases;
  // Newest first by release date (undated ones go last, keeping CMS order),
  // or the admin's own drag order when "My order" is chosen.
  const dated =
    order === "manual"
      ? rows
      : rows
          .map((r, i) => ({ r, i, t: Date.parse(str(r.release_date)) || 0 }))
          .sort((a, b) => b.t - a.t || a.i - b.i)
          .map((x) => x.r);
  const releases = dated
    .map((r) => {
      const title = str(r.title);
      const description = str(r.description);
      return {
        slug: str(r.slug, slugify(title)),
        title,
        artist: str(r.artist),
        type: str(r.type, "Single"),
        releaseDate: formatReleaseDate(r.release_date),
        cover: str(r.cover_url, "/logo/Melted.Mindz.Records-Logo.jpg"),
        description,
        shortDescription: str(r.short_description, description),
        about: str(r.about),
        link: opt(r.link_url),
        spotifyUrl: opt(r.spotify_url),
        appleMusicUrl: opt(r.apple_music_url),
        youtubeUrl: opt(r.youtube_url),
        featured: r.featured === true,
        presaveUrl: opt(r.presave_url),
        presaveSpotifyUrl: opt(r.presave_spotify_url),
        presaveAppleMusicUrl: opt(r.presave_apple_music_url),
        releaseAt: releaseInstant(r.release_date, r.release_time),
      };
    })
    .filter((r) => r.title);
  return releases.length > 0 ? releases : fallbackReleases;
}

/** Not out yet: its release moment is still ahead. */
export function isUpcoming(release: Release, now = Date.now()): boolean {
  if (!release.releaseAt) return false;
  return Date.parse(release.releaseAt) > now;
}

/** Releases that are not out yet, soonest first. */
export function upcomingReleases(releases: Release[], now = Date.now()): Release[] {
  return releases
    .filter((r) => isUpcoming(r, now))
    .sort((a, b) => Date.parse(a.releaseAt!) - Date.parse(b.releaseAt!));
}

/** Releases that are already out (or have no exact date), in the order given. */
export function outReleases(releases: Release[], now = Date.now()): Release[] {
  return releases.filter((r) => !isUpcoming(r, now));
}

/**
 * The featured release: the one picked in /admin/homepage, else the first row
 * marked featured, else the newest release that is already out. A release
 * that is still coming soon only takes the spot when it was picked.
 */
export function pickFeatured(releases: Release[], choice = "auto", now = Date.now()): Release {
  const picked = choice && choice !== "auto" ? releases.find((r) => r.slug === choice) : undefined;
  if (picked) return picked;
  const marked = releases.find((r) => r.featured);
  if (marked) return marked;
  const out = outReleases(releases, now);
  const pool = out.length > 0 ? out : releases;
  const newest = [...pool].sort(
    (a, b) => (Date.parse(b.releaseDate) || 0) - (Date.parse(a.releaseDate) || 0)
  );
  return newest[0] ?? releases[0];
}

/**
 * next/image optimizes local files and Supabase Storage images.
 * Any other web address (pasted from elsewhere) is shown as-is.
 */
export function isOptimizable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}


function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Releases credited to an artist (matches the release's `artist` text to the artist's name). */
export function releasesFor(artist: Artist, releases: Release[]): Release[] {
  return releases.filter((r) =>
    r.artist
      .split(/,|&| x | feat\.? | ft\.? /i)
      .some((part) => sameName(part, artist.name))
  );
}

/** The roster artist a release belongs to, if any. */
export function artistFor(release: Release, artists: Artist[]): Artist | null {
  return artists.find((a) => releasesFor(a, [release]).length > 0) ?? null;
}

/** Pre-save buttons: one per filled platform; just "Pre-save" when only the general link is set. */
export function presaveLinks(release: Release): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = [];
  if (release.presaveSpotifyUrl) out.push({ label: "Pre-save on Spotify", href: release.presaveSpotifyUrl });
  if (release.presaveAppleMusicUrl) out.push({ label: "Pre-save on Apple Music", href: release.presaveAppleMusicUrl });
  if (release.presaveUrl) out.push({ label: out.length > 0 ? "Pre-save (all platforms)" : "Pre-save", href: release.presaveUrl });
  return out;
}

/** The normal streaming buttons for a release. */
export function streamLinks(release: Release): { label: string; href: string | null }[] {
  return [
    { label: "Listen now", href: release.link },
    { label: "Spotify", href: release.spotifyUrl },
    { label: "Apple Music", href: release.appleMusicUrl },
    { label: "YouTube", href: release.youtubeUrl },
  ];
}

/** First available listen link for a release. */
export function listenLink(release: Release): string | null {
  return release.link ?? release.spotifyUrl ?? release.appleMusicUrl ?? release.youtubeUrl;
}


/* ------------------------------------------------------------------ */
/* News (table: public.news, edited at /admin)                         */
/* ------------------------------------------------------------------ */

export type NewsItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  description: string;
  link: string | null;
  image: string | null;
};

export const fallbackNews: NewsItem[] = [
  {
    slug: "the-next-chapter-welcoming-lil-rappy",
    title: "The Next Chapter of Melted Mindz Records: Welcoming B1AK3",
    date: "Mar 29, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records announces the next chapter of the label with the welcoming of B1AK3, highlighting the artist's journey and the continued growth of the Melted Mindz Records roster.",
    link: "https://meltedmindzrecords.substack.com/p/the-next-chapter-of-melted-mindz",
    image: null,
  },
  {
    slug: "the-sonic-architect-welcoming-lucius",
    title: "The Sonic Architect: Welcoming Lucius",
    date: "Mar 29, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records welcomes Lucius and introduces a new creative force to the label family.",
    link: "https://meltedmindzrecords.substack.com/p/the-sonic-architect-welcoming-lucius",
    image: null,
  },
  {
    slug: "from-the-swamp-to-the-world-okay-boomhauer",
    title: "From The Swamp To The World: Okay Boomhauer",
    date: "Jul 8, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records highlights Okay Boomhauer and the creative vision behind the artist.",
    link: "https://open.substack.com/pub/meltedmindzrecords/p/from-the-swamp-to-the-world-okay",
    image: null,
  },
  {
    slug: "in-the-grip-of-the-undead-gutzombie",
    title: "In The Grip Of The Undead: GutZombie",
    date: "Jul 8, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records showcases GutZombie and their unique artistic identity.",
    link: "https://open.substack.com/pub/meltedmindzrecords/p/in-the-grip-of-the-undead-gutzombie",
    image: null,
  },
];

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-03-29" -> "Mar 29, 2026". */
function formatShortDate(v: unknown): string {
  const raw = str(v);
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) return raw;
  const month = SHORT_MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${Number(m[3])}, ${m[1]}` : raw;
}

export async function getNews(): Promise<NewsItem[]> {
  const fetched = await fetchRows("news");
  const rows = fetched?.filter(isLive) ?? null;
  if (!rows || rows.length === 0) return fallbackNews;
  const items = rows
    .map((r) => {
      const title = str(r.title);
      return {
        slug: str(r.slug, slugify(title)),
        title,
        category: str(r.category, "News"),
        date: formatShortDate(r.published_on),
        description: str(r.description),
        link: opt(r.link_url),
        image: opt(r.image_url),
      };
    })
    .filter((n) => n.title);
  return items.length > 0 ? items : fallbackNews;
}


/* ------------------------------------------------------------------ */
/* Careers + internship listings (table: public.listings)              */
/* ------------------------------------------------------------------ */

export type Listing = {
  id: number;
  title: string;
  description: string;
  details: string;
  applyUrl: string | null;
};

/** Visible listings of one kind, in admin order. null = the table couldn't be read (use the built-in text). */
export async function getListings(kind: "career" | "internship"): Promise<Listing[] | null> {
  const supabase = getClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("kind", kind)
      .eq("visible", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) {
      console.warn(`[cms] listings: ${error.message} (using built-in content)`);
      return null;
    }
    return (data as Row[])
      .map((r) => ({
        id: Number(r.id),
        title: str(r.title),
        description: str(r.description),
        details: str(r.details),
        applyUrl: opt(r.apply_url),
      }))
      .filter((l) => l.title);
  } catch (err) {
    console.warn("[cms] listings unreachable (using built-in content)", err);
    return null;
  }
}
