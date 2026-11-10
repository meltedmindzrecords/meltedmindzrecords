import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
    name: "Lil Rappy",
    genre: "Melodic Rap / Hip-Hop",
    image: "/artists/lil-rappy.jpg",
    bio: "Lil Rappy delivers melodic energy, creative songwriting, and a unique voice within modern hip-hop.",
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
    artist: "Lil Rappy",
    type: "Single",
    releaseDate: "July 28, 2026",
    cover: "/release%20covers/Still-With-Me.jpg",
    description:
      "Still With Me is a heartfelt release exploring perseverance, loyalty, and growth. Released through Melted Mindz Records, the song showcases emotional lyricism paired with cinematic production.",
    shortDescription:
      "An emotional release exploring loyalty, perseverance, and personal growth through melodic storytelling.",
    about:
      'Melted Mindz Records presents "Still With Me" by Lil Rappy. The release delivers melodic storytelling, emotional depth, and a unique sound that represents the next generation of independent music.',
    link: "https://too.fm/stillwithme",
    spotifyUrl: null,
    appleMusicUrl: null,
    youtubeUrl: null,
    featured: true,
  },
];

/* ------------------------------------------------------------------ */
/* Supabase                                                            */
/* ------------------------------------------------------------------ */

let client: SupabaseClient | null | undefined;

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
      };
    })
    .filter((a) => a.name && a.slug);
  return artists.length > 0 ? artists : fallbackArtists;
}

export async function getArtist(slug: string): Promise<Artist | null> {
  const artists = await getArtists();
  return artists.find((a) => a.slug === slug) ?? null;
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

export async function getReleases(): Promise<Release[]> {
  const rows = await fetchRows("releases");
  if (!rows) return fallbackReleases;
  const releases = rows
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
      };
    })
    .filter((r) => r.title);
  return releases.length > 0 ? releases : fallbackReleases;
}

/** The featured release: first row marked featured, else the first row. */
export function pickFeatured(releases: Release[]): Release {
  return releases.find((r) => r.featured) ?? releases[0];
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

/** First available listen link for a release. */
export function listenLink(release: Release): string | null {
  return release.link ?? release.spotifyUrl ?? release.appleMusicUrl ?? release.youtubeUrl;
}
