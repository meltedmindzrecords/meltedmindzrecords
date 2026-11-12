export type FieldType =
  | "text" | "textarea" | "url" | "image" | "video" | "date" | "time" | "datetime" | "bool" | "number" | "select" | "artist";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: string[];
  full?: boolean;
  placeholder?: string;
};

export type CmsConfig = {
  table: "artists" | "releases" | "news" | "team" | "listings";
  /** Admin URL segment (defaults to the table name). */
  path?: string;
  /** Rows this page manages (e.g. listings of one kind); also set on new rows. */
  filter?: Record<string, string>;
  /** Where the item shows on the public site. */
  viewUrl?: (row: Row) => string;
  /** Note under the list about how order is used. */
  orderNote?: string;
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
  help: "Lower numbers show first. Easier: drag the rows (or use the arrows) in the list.",
};
const publishAt: Field = {
  key: "publish_at",
  label: "Publish on (optional)",
  type: "datetime",
  help: "Leave empty to show it now. Pick a date and time to keep it hidden until then; it goes live on its own (within a minute or two).",
};

export const artistsConfig: CmsConfig = {
  table: "artists",
  singular: "artist",
  plural: "Artists",
  intro: "The roster on the Artists page, the spotlight on the home page and each artist's own page.",
  viewUrl: (r) => `/artists/${String(r.slug ?? "")}`,
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
    {
      key: "slug",
      label: "Page address",
      type: "text",
      help: "meltedmindzrecords.com/artists/… (made from the name if left empty). If you change it, the old address keeps working and forwards to the new one.",
    },
    order,
    visible,
  ],
};

export const releasesConfig: CmsConfig = {
  table: "releases",
  singular: "release",
  plural: "Releases",
  intro: "Music on the Releases page and the home page. The newest one is featured on the home page unless you pick another under Homepage.",
  viewUrl: () => "/releases",
  orderNote: "The Releases page lists newest first. To use this order instead, choose “My order” under Homepage.",
  titleKey: "title",
  subtitle: (r) => [r.artist, r.type, r.release_date].filter(Boolean).join(" · "),
  imageKey: "cover_url",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "artist", label: "Artist", type: "artist", required: true, help: "Pick a roster artist so the release shows on their page." },
    { key: "type", label: "Type", type: "select", options: ["Single", "EP", "Album", "Mixtape", "Music Video"] },
    { key: "release_date", label: "Release date", type: "date", help: "Set a future release date to show a countdown on the site." },
    { key: "release_time", label: "Release time (optional)", type: "time", help: "Central time. Leave empty for midnight at the start of release day." },
    { key: "cover_url", label: "Cover art", type: "image", full: true },
    { key: "short_description", label: "Short description", type: "textarea", full: true, help: "One or two lines for cards." },
    { key: "description", label: "Description", type: "textarea", full: true },
    { key: "about", label: "About", type: "textarea", full: true },
    { key: "presave_url", label: "Pre-save link (all platforms)", type: "url", full: true, help: "Get this from your distributor (e.g. Too Lost’s pre-save / smart link) or a pre-save page like Hypeddit or Feature.fm. The Pre-save buttons show next to the countdown, then switch to the listen links on release day." },
    { key: "presave_spotify_url", label: "Spotify pre-save link (optional)", type: "url" },
    { key: "presave_apple_music_url", label: "Apple Music pre-add link (optional)", type: "url" },
    { key: "link_url", label: "Listen link (smart link)", type: "url" },
    { key: "spotify_url", label: "Spotify link", type: "url" },
    { key: "apple_music_url", label: "Apple Music link", type: "url" },
    { key: "youtube_url", label: "YouTube link", type: "url" },
    { key: "slug", label: "Short name", type: "text", help: "Made from the title if left empty." },
    publishAt,
    order,
    visible,
  ],
};

export const newsConfig: CmsConfig = {
  table: "news",
  singular: "news post",
  plural: "News",
  intro: "Press releases and announcements on the News page. The first one shows largest.",
  viewUrl: () => "/news",
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
    publishAt,
    order,
    visible,
  ],
};

export const teamConfig: CmsConfig = {
  table: "team",
  singular: "team member",
  plural: "Team",
  intro: "The people on the About page.",
  viewUrl: () => "/about",
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

const listingFields = (what: string): Field[] => [
  { key: "title", label: "Title", type: "text", required: true, full: true },
  { key: "details", label: "Details line (optional)", type: "text", full: true, help: "For example: Remote · Part-time · Paid" },
  { key: "description", label: "Description", type: "textarea", full: true },
  { key: "apply_url", label: "Apply link (optional)", type: "url", full: true, help: `Adds an Apply button to the ${what}.` },
  order,
  visible,
];

export const careersConfig: CmsConfig = {
  table: "listings",
  path: "careers",
  filter: { kind: "career" },
  singular: "opening",
  plural: "Careers",
  intro: "Open jobs on the Careers page. While there are none, the page shows “No Current Open Positions” (its text is under Settings → Careers).",
  titleKey: "title",
  subtitle: (r) => String(r.details ?? ""),
  viewUrl: () => "/careers",
  fields: listingFields("opening"),
};

export const internshipsConfig: CmsConfig = {
  table: "listings",
  path: "internships",
  filter: { kind: "internship" },
  singular: "program",
  plural: "Internships",
  intro: "The programs on the Internships page.",
  titleKey: "title",
  subtitle: (r) => String(r.details ?? ""),
  viewUrl: () => "/internships",
  fields: listingFields("program"),
};

export const allConfigs = [artistsConfig, releasesConfig, newsConfig, teamConfig, careersConfig, internshipsConfig];

export const adminPath = (c: CmsConfig) => `/admin/${c.path ?? c.table}`;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
