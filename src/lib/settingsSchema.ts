/*
 * Site settings edited at /admin/settings and /admin/homepage.
 *
 * The database row (public.site_settings, id = 1) stores ONLY what an admin
 * changed. Every key below has a default that is the site's original text,
 * so an empty row shows the site exactly as it was built.
 * Shared by the public pages (server) and the admin (browser).
 */

export const SETTINGS_DEFAULTS = {
  // Home: hero (empty = use the featured release)
  hero_eyebrow: "",
  hero_headline: "",
  hero_subtext: "",
  hero_video: "/videos/hero-web.mp4",
  hero_poster: "/videos/hero-poster.jpg",
  // Home: "The label" section
  label_eyebrow: "The label",
  label_text: "An independent label from Birmingham, Alabama.",
  tagline: "Our artists keep their rights.",

  // Homepage controls
  featured_release: "auto",
  spotlight_artist: "auto",
  show_ticker: true,
  show_latest: true,
  show_spotlight: true,
  show_all_artists: true,
  show_label: true,
  releases_order: "date",

  // About page
  about_intro:
    "Melted Mindz Records is an independent record label dedicated to developing artists, creating opportunities, and pushing creative boundaries across multiple genres.",
  about_photo: "",
  about_founded: "2024",
  about_based_in: "Birmingham, Alabama",
  about_model: "Independent distribution. Artists keep their rights.",
  about_story_1:
    "Founded with a vision to support the next generation of musicians, Melted Mindz Records focuses on artist development, music releases, branding, creative direction, and long-term careers.",
  about_story_2:
    "From emerging talent to established creators, the label works to provide the resources, support, and platform artists need to bring their vision to the world.",
  about_mission:
    "To amplify unique voices, develop meaningful artists, and create a global community built around music and creativity.",
  about_vision:
    "To become a leading independent entertainment company known for artist-first development and innovative approaches to the music industry.",
  about_cta: "Making music? We want to hear it.",

  // Contact page + site-wide contact
  contact_email: "info@meltedmindzrecords.com",
  contact_phone: "",
  contact_address: "",
  contact_intro:
    "For business inquiries, artist-related matters, media inquiries, partnerships, and general questions, contact the Melted Mindz Records team.",
  contact_submissions:
    "Melted Mindz Records does not accept unsolicited demos. Please use the appropriate submission process when available.",
  contact_response: "Please allow reasonable time for our team to review and respond to your inquiry.",

  // Footer
  footer_text: "Melted Mindz Records. Birmingham, Alabama.",

  // Links
  social_instagram: "https://www.instagram.com/meltedmindzrecords",
  social_tiktok: "https://www.tiktok.com/@meltedmindzrecords",
  social_youtube: "https://www.youtube.com/@meltedmindzrecords",
  social_spotify: "",
  social_x: "https://x.com/mindzlabel",
  social_facebook: "",
  demo_url: "https://meltedmindzrecords.zite.so",
  artist_tools_url: "https://artisttools.meltedmindzrecords.com",

  // Careers / Internships
  careers_intro:
    "Join a growing independent record label focused on developing artists, building creative opportunities, and shaping the future of music.",
  careers_none_title: "No Current Open Positions",
  careers_none_text: "We are always interested in connecting with talented individuals. Future opportunities may include:",
  careers_future_roles:
    "A&R Representatives\nMarketing & Social Media Coordinators\nGraphic Designers\nVideo Editors\nMusic Business Assistants\nWeb Development & Technology Roles",
  internships_intro:
    "Gain real-world experience in the music industry while working with an independent record label.",

  // Search & sharing
  seo_title: "Melted Mindz Records",
  seo_description:
    "Melted Mindz Records is an independent record label from Birmingham, Alabama. Artists keep their rights.",
  seo_image: "",
};

export type SiteSettings = { -readonly [K in keyof typeof SETTINGS_DEFAULTS]: (typeof SETTINGS_DEFAULTS)[K] extends boolean ? boolean : string };
export type SettingKey = keyof SiteSettings;

/** Stored overrides on top of the defaults. Blank text falls back to the default (except fields that may be blank). */
export const BLANK_ALLOWED: SettingKey[] = [
  "hero_eyebrow", "hero_headline", "hero_subtext", "about_photo", "contact_phone", "contact_address",
  "social_instagram", "social_tiktok", "social_youtube", "social_spotify", "social_x", "social_facebook", "seo_image",
  "careers_future_roles",
];

export function mergeSettings(data: unknown): SiteSettings {
  const out = { ...SETTINGS_DEFAULTS } as SiteSettings;
  if (!data || typeof data !== "object") return out;
  const d = data as Record<string, unknown>;
  for (const key of Object.keys(SETTINGS_DEFAULTS) as SettingKey[]) {
    const v = d[key];
    const def = SETTINGS_DEFAULTS[key];
    if (typeof def === "boolean") {
      if (typeof v === "boolean") (out as Record<string, unknown>)[key] = v;
    } else if (typeof v === "string") {
      const t = v.trim();
      if (t !== "" || BLANK_ALLOWED.includes(key)) (out as Record<string, unknown>)[key] = t;
    }
  }
  return out;
}

export type SocialLink = { label: string; href: string };

/** Label socials in the order a given place used before (Spotify and Facebook show only once filled in). */
export function socialLinks(s: SiteSettings, order: "footer" | "contact" = "footer"): SocialLink[] {
  const all: Record<string, string> = {
    Instagram: s.social_instagram,
    TikTok: s.social_tiktok,
    YouTube: s.social_youtube,
    X: s.social_x,
    Spotify: s.social_spotify,
    Facebook: s.social_facebook,
  };
  const keys =
    order === "contact"
      ? ["Instagram", "X", "YouTube", "TikTok", "Spotify", "Facebook"]
      : ["Instagram", "TikTok", "YouTube", "X", "Spotify", "Facebook"];
  return keys.filter((k) => all[k]).map((k) => ({ label: k, href: all[k] }));
}

/** Footer/nav facts the client components need. */
export type SiteChrome = {
  socials: SocialLink[];
  demoUrl: string;
  artistToolsUrl: string;
  contactEmail: string;
  footerText: string;
};

export function chromeFrom(s: SiteSettings): SiteChrome {
  return {
    socials: socialLinks(s, "footer"),
    demoUrl: s.demo_url,
    artistToolsUrl: s.artist_tools_url,
    contactEmail: s.contact_email,
    footerText: s.footer_text,
  };
}
