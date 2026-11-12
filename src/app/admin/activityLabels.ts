export type Activity = {
  id: number;
  at: string;
  actor: string | null;
  action: string;
  area: string;
  item_id: string | null;
  item_label: string | null;
  changes: string[] | null;
};

const areas: Record<string, string> = {
  artists: "artist",
  releases: "release",
  news: "news post",
  team: "team member",
  listings: "careers/internships listing",
  site_settings: "site settings",
  newsletter_subscribers: "newsletter subscriber",
  media: "media file",
};

const fieldNames: Record<string, string> = {
  image_url: "photo",
  cover_url: "cover",
  sort_order: "order",
  visible: "show/hide",
  publish_at: "publish date",
  release_date: "release date",
  published_on: "date",
  link_url: "link",
  short_description: "short description",
  apply_url: "apply link",
  spotify_url: "Spotify",
  apple_music_url: "Apple Music",
  youtube_url: "YouTube",
  instagram_url: "Instagram",
  tiktok_url: "TikTok",
  slug: "page address",
};

export function who(actor: string | null): string {
  if (!actor) return "Someone";
  if (actor === "database") return "Setup";
  const local = actor.split("@")[0] ?? actor;
  if (/^theodore/i.test(local)) return "Theodore";
  if (/^alexandra/i.test(local)) return "Alexandra";
  return actor;
}

export function describe(a: Activity): string {
  const area = areas[a.area] ?? a.area;
  const item = a.item_label ? `“${a.item_label}”` : `a ${area}`;
  const changes = (a.changes ?? []).map((c) => fieldNames[c] ?? c.replace(/_/g, " "));
  switch (a.action) {
    case "create":
      return `added the ${area} ${item}`;
    case "delete":
      return a.area === "newsletter_subscribers" ? `removed ${a.item_label ?? "a subscriber"} from the newsletter` : `deleted the ${area} ${item}`;
    case "reorder":
      return `moved ${item} in the ${area} order`;
    case "upload":
      return `uploaded ${item} to the media library`;
    case "update":
      if (a.area === "site_settings") return `changed site settings${changes.length ? `: ${changes.join(", ")}` : ""}`;
      return `edited ${item}${changes.length ? ` (${changes.join(", ")})` : ""}`;
    default:
      return `${a.action} ${item}`;
  }
}

export function when(iso: string): string {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
