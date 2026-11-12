export type FieldType = "text" | "textarea" | "url" | "image" | "date" | "bool" | "number" | "select" | "artist";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: string[];
  full?: boolean;
};

export type CmsConfig = {
  table: "artists" | "releases" | "news" | "team";
  singular: string;
  plural: string;
  intro: string;
  titleKey: string;
  subtitle: (row: Row) => string;
  imageKey?: string;
  fields: Field[];
};

export type Row = Record<string, unknown> & { id?: number };

const visible: Field = {
  key: "visible",
  label: "Show on the website",
  type: "bool",
  help: "Untick to hide it without deleting it.",
};
const order: Field = {
  key: "sort_order",
  label: "Order",
  type: "number",
  help: "Lower numbers show first.",
};

export const artistsConfig: CmsConfig = {
  table: "artists",
  singular: "artist",
  plural: "Artists",
  intro: "The roster on the home page, the Artists page and each artist's own page.",
  titleKey: "name",
  subtitle: (r) => String(r.genre ?? ""),
  imageKey: "image_url",
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "genre", label: "Genre", type: "text", help: "For example: Alternative / Rock" },
    { key: "image_url", label: "Photo", type: "image", full: true },
    { key: "bio", label: "Bio", type: "textarea", full: true },
    { key: "spotify_url", label: "Spotify link", type: "url" },
    { key: "apple_music_url", label: "Apple Music link", type: "url" },
    { key: "youtube_url", label: "YouTube link", type: "url" },
    { key: "instagram_url", label: "Instagram link", type: "url" },
    { key: "tiktok_url", label: "TikTok link", type: "url" },
    { key: "slug", label: "Page address", type: "text", help: "meltedmindzrecords.com/artists/… (made from the name if left empty)" },
    order,
    visible,
  ],
};

export const releasesConfig: CmsConfig = {
  table: "releases",
  singular: "release",
  plural: "Releases",
  intro: "Music on the home page and the Releases page. The release marked “Homepage hero” is the big one at the top of the home page.",
  titleKey: "title",
  subtitle: (r) => [r.artist, r.type, r.release_date].filter(Boolean).join(" · "),
  imageKey: "cover_url",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "artist", label: "Artist", type: "artist", required: true, help: "Pick a roster artist so the release shows on their page." },
    { key: "type", label: "Type", type: "select", options: ["Single", "EP", "Album", "Mixtape", "Music Video"] },
    { key: "release_date", label: "Release date", type: "date" },
    { key: "cover_url", label: "Cover art", type: "image", full: true },
    { key: "short_description", label: "Short description", type: "textarea", full: true, help: "One or two lines for cards." },
    { key: "description", label: "Description", type: "textarea", full: true },
    { key: "about", label: "About", type: "textarea", full: true },
    { key: "link_url", label: "Listen link (smart link)", type: "url" },
    { key: "spotify_url", label: "Spotify link", type: "url" },
    { key: "apple_music_url", label: "Apple Music link", type: "url" },
    { key: "youtube_url", label: "YouTube link", type: "url" },
    { key: "featured", label: "Homepage hero", type: "bool", help: "Shows this release big at the top of the home page. Only one at a time." },
    { key: "slug", label: "Short name", type: "text", help: "Made from the title if left empty." },
    order,
    visible,
  ],
};

export const newsConfig: CmsConfig = {
  table: "news",
  singular: "news post",
  plural: "News",
  intro: "Press releases and announcements on the News page. The first one shows largest.",
  titleKey: "title",
  subtitle: (r) => [r.category, r.published_on].filter(Boolean).join(" · "),
  imageKey: "image_url",
  fields: [
    { key: "title", label: "Headline", type: "text", required: true, full: true },
    { key: "category", label: "Category", type: "select", options: ["Press Release", "News", "Announcement", "Feature"] },
    { key: "published_on", label: "Date", type: "date" },
    { key: "description", label: "Summary", type: "textarea", full: true },
    { key: "link_url", label: "Link to the full story", type: "url", full: true, help: "For example your Substack post." },
    { key: "image_url", label: "Image (optional)", type: "image", full: true },
    { key: "slug", label: "Short name", type: "text", help: "Made from the headline if left empty." },
    order,
    visible,
  ],
};

export const teamConfig: CmsConfig = {
  table: "team",
  singular: "team member",
  plural: "Team",
  intro: "The people on the About page.",
  titleKey: "name",
  subtitle: (r) => String(r.title ?? ""),
  imageKey: "image_url",
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "title", label: "Role", type: "text" },
    { key: "image_url", label: "Photo", type: "image", full: true },
    { key: "bio", label: "Bio", type: "textarea", full: true },
    order,
    visible,
  ],
};

export const allConfigs = [artistsConfig, releasesConfig, newsConfig, teamConfig];

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
