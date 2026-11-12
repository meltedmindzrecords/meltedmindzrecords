"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SETTINGS_DEFAULTS, type SettingKey } from "@/lib/settingsSchema";

import { useAdmin } from "../AdminShell";
import { FieldInput } from "../CmsManager";
import type { Field } from "../cms";
import { effective, loadStored, saveSettings, type StoredSettings } from "../siteSettings";
import { PageHead, Toast, type ToastMsg } from "../Toast";

type SettingField = Field & { key: SettingKey; view?: string };
type Group = { id: string; title: string; intro?: string; view: string; fields: SettingField[] };

const groups: Group[] = [
  {
    id: "hero",
    title: "Home page: top section",
    intro: "Leave the text boxes empty to show the featured release (its title, artist and date). Pick which release is featured under Homepage.",
    view: "/",
    fields: [
      { key: "hero_eyebrow", label: "Small line above the headline", type: "text", placeholder: "Empty = “Out now · Single · date”", full: true },
      { key: "hero_headline", label: "Headline", type: "text", placeholder: "Empty = the featured release’s title", full: true },
      { key: "hero_subtext", label: "Line under the headline", type: "text", placeholder: "Empty = the release’s artist", full: true },
      { key: "hero_video", label: "Background video", type: "video", placeholder: "original", full: true, help: "An MP4 under 50 MB. It plays muted on a loop. 720p looks great and loads fast." },
      { key: "hero_poster", label: "Video cover image", type: "image", placeholder: "original", full: true, help: "Shows while the video loads, and for visitors who turned off motion." },
    ],
  },
  {
    id: "label",
    title: "Home page: “The label” section",
    view: "/",
    fields: [
      { key: "label_eyebrow", label: "Small heading", type: "text" },
      { key: "label_text", label: "Big text", type: "textarea" },
      { key: "tagline", label: "Tagline (shown in color after the big text)", type: "text", full: true },
    ],
  },
  {
    id: "about",
    title: "About page",
    view: "/about",
    fields: [
      { key: "about_intro", label: "Intro", type: "textarea" },
      { key: "about_photo", label: "Photo (optional)", type: "image", full: true, help: "Shows under the intro. Leave empty for no photo." },
      { key: "about_founded", label: "Founded", type: "text" },
      { key: "about_based_in", label: "Based in", type: "text" },
      { key: "about_model", label: "Model", type: "text", full: true },
      { key: "about_story_1", label: "Story, paragraph 1", type: "textarea" },
      { key: "about_story_2", label: "Story, paragraph 2", type: "textarea" },
      { key: "about_mission", label: "Mission", type: "textarea" },
      { key: "about_vision", label: "Vision", type: "textarea" },
      { key: "about_cta", label: "Closing line", type: "text", full: true },
    ],
  },
  {
    id: "contact",
    title: "Contact info",
    intro: "The email also shows in the footer and on the About page. Phone and address show on the Contact page only when filled in.",
    view: "/contact",
    fields: [
      { key: "contact_email", label: "Email", type: "text" },
      { key: "contact_phone", label: "Phone (optional)", type: "text" },
      { key: "contact_address", label: "Address (optional)", type: "textarea" },
      { key: "contact_intro", label: "Contact page intro", type: "textarea" },
      { key: "contact_submissions", label: "“Artist Submissions” text", type: "textarea" },
      { key: "contact_response", label: "“Response Time” text", type: "textarea" },
    ],
  },
  {
    id: "links",
    title: "Social and label links",
    intro: "Used in the menu, the footer and the Contact page. Clear a box to hide that icon. Spotify and Facebook appear once you add them.",
    view: "/contact",
    fields: [
      { key: "social_instagram", label: "Instagram", type: "url" },
      { key: "social_tiktok", label: "TikTok", type: "url" },
      { key: "social_youtube", label: "YouTube", type: "url" },
      { key: "social_spotify", label: "Spotify", type: "url" },
      { key: "social_x", label: "X (Twitter)", type: "url" },
      { key: "social_facebook", label: "Facebook", type: "url" },
      { key: "demo_url", label: "“Get signed” / demo submission link", type: "url", full: true, help: "Every “Get signed” button on the site goes here." },
      { key: "artist_tools_url", label: "“For Artists” link", type: "url", full: true },
    ],
  },
  {
    id: "footer",
    title: "Footer",
    view: "/",
    fields: [{ key: "footer_text", label: "Bottom line (after “© year”)", type: "text", full: true }],
  },
  {
    id: "careers",
    title: "Careers and Internships pages",
    intro: "Job openings and internship programs themselves are under Careers and Internships in the menu.",
    view: "/careers",
    fields: [
      { key: "careers_intro", label: "Careers intro", type: "textarea" },
      { key: "internships_intro", label: "Internships intro", type: "textarea" },
      { key: "careers_none_title", label: "Heading when no jobs are open", type: "text" },
      { key: "careers_none_text", label: "Text when no jobs are open", type: "textarea" },
      { key: "careers_future_roles", label: "“Future opportunities” list (one per line)", type: "textarea", full: true },
    ],
  },
  {
    id: "seo",
    title: "Search and sharing",
    intro: "How the site appears in Google and when a link is shared in a text or post.",
    view: "/",
    fields: [
      { key: "seo_title", label: "Site title", type: "text", full: true },
      { key: "seo_description", label: "Description", type: "textarea" },
      { key: "seo_image", label: "Share image (optional)", type: "image", full: true, help: "1200 × 630 works best." },
    ],
  },
];

export default function SettingsPage() {
  const { supabase, refreshSite } = useAdmin();
  const [stored, setStored] = useState<StoredSettings | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMsg>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const load = useCallback(async () => {
    try {
      const s = await loadStored(supabase);
      setStored(s);
      const v: Record<string, string> = {};
      for (const g of groups) for (const f of g.fields) v[f.key] = String(effective(s, f.key));
      setValues(v);
    } catch (e) {
      setToast({ kind: "error", text: `Couldn't load settings: ${(e as Error).message}` });
      setStored({});
    }
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const changed = useMemo(() => {
    if (!stored) return [] as SettingKey[];
    return groups
      .flatMap((g) => g.fields)
      .filter((f) => (values[f.key] ?? "").trim() !== String(effective(stored, f.key)).trim())
      .map((f) => f.key);
  }, [values, stored]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const patch: Record<string, string | null> = {};
      for (const k of changed) patch[k] = values[k] ?? "";
      await saveSettings(supabase, patch);
      const live = await refreshSite();
      setToast({ kind: "ok", text: live ? "Saved. It's live on the website now." : "Saved. The website will show it within a minute." });
      await load();
    } catch (err) {
      setToast({ kind: "error", text: `Couldn't save: ${(err as Error).message}` });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={save} aria-labelledby="settings-title">
      <PageHead
        title="Site settings"
        intro="Text, photos and links used across the website. Each box shows what the site says right now."
      />
      <Toast toast={toast} onDone={clearToast} />

      <nav aria-label="Settings sections" className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto pb-1">
        {groups.map((g) => (
          <a key={g.id} href={`#s-${g.id}`} className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-white/80 hover:bg-white/10">
            {g.title.replace("Home page: ", "Home: ")}
          </a>
        ))}
      </nav>

      {stored === null ? (
        <p className="mt-10 text-white/70" role="status">Loading…</p>
      ) : (
        groups.map((g) => (
          <fieldset key={g.id} id={`s-${g.id}`} className="mt-8 scroll-mt-40 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <legend className="contents">
                <h2 className="text-xl font-semibold">{g.title}</h2>
              </legend>
              <a href={g.view} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#ff8a5c] underline-offset-4 hover:underline">
                View on site ↗<span className="sr-only"> ({g.title})</span>
              </a>
            </div>
            {g.intro && <p className="mt-2 text-[14px] leading-6 text-white/65">{g.intro}</p>}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {g.fields.map((f) => {
                const def = String(SETTINGS_DEFAULTS[f.key]);
                const isChanged = changed.includes(f.key);
                const custom = (values[f.key] ?? "") !== def;
                return (
                  <div key={f.key} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
                    <FieldInput
                      field={f}
                      value={values[f.key] ?? ""}
                      onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v === null || v === undefined ? def : String(v) }))}
                      table="settings"
                      artistNames={[]}
                      onError={(text) => setToast({ kind: "error", text })}
                      nameHint={f.key.replace(/_/g, "-")}
                      supabase={supabase}
                    />
                    <div className="mt-1 flex flex-wrap gap-3 text-[12px]">
                      {isChanged && <span className="text-amber-200">Not saved yet</span>}
                      {custom && def !== "" && f.type !== "image" && f.type !== "video" && (
                        <button
                          type="button"
                          onClick={() => setValues((prev) => ({ ...prev, [f.key]: def }))}
                          className="text-white/60 underline hover:text-white"
                        >
                          Use the original text
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))
      )}

      <div className="sticky bottom-0 z-30 -mx-4 mt-8 flex items-center justify-end gap-3 border-t border-white/10 bg-zinc-950/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <p className="mr-auto text-[14px] text-white/70" role="status">
          {changed.length === 0 ? "No unsaved changes" : `${changed.length} unsaved change${changed.length === 1 ? "" : "s"}`}
        </p>
        <button type="button" className="admin-btn" disabled={changed.length === 0 || saving} onClick={load}>
          Undo
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={changed.length === 0 || saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
