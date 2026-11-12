"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useAdmin } from "../AdminShell";
import { effective, loadStored, saveSettings, type StoredSettings } from "../siteSettings";
import { PageHead, Toast, type ToastMsg } from "../Toast";

type Opt = { slug: string; label: string; date?: number };

const sections = [
  { key: "show_ticker", label: "Scrolling ticker", help: "The red band of artist names and release titles under the top section." },
  { key: "show_latest", label: "Latest release", help: "The spinning-vinyl section with the featured release." },
  { key: "show_spotlight", label: "Artist spotlight", help: "One artist, big photo and bio." },
  { key: "show_all_artists", label: "“See all artists” button", help: "" },
  { key: "show_label", label: "“The label” section", help: "The closing text with the Get signed button." },
] as const;

export default function HomepageControls() {
  const { supabase, refreshSite } = useAdmin();
  const [stored, setStored] = useState<StoredSettings | null>(null);
  const [releases, setReleases] = useState<Opt[]>([]);
  const [artists, setArtists] = useState<Opt[]>([]);
  const [featured, setFeatured] = useState("auto");
  const [spotlight, setSpotlight] = useState("auto");
  const [order, setOrder] = useState("date");
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMsg>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const load = useCallback(async () => {
    try {
      const [s, rel, art] = await Promise.all([
        loadStored(supabase),
        supabase.from("releases").select("slug,title,artist,release_date,visible,publish_at").order("sort_order"),
        supabase.from("artists").select("slug,name,visible").order("sort_order"),
      ]);
      setStored(s);
      setFeatured(String(effective(s, "featured_release")));
      setSpotlight(String(effective(s, "spotlight_artist")));
      setOrder(String(effective(s, "releases_order")));
      setShow(Object.fromEntries(sections.map((x) => [x.key, effective(s, x.key) === true])));
      const now = Date.now();
      setReleases(
        (rel.data ?? [])
          .filter((r) => r.visible !== false && (!r.publish_at || Date.parse(r.publish_at) <= now))
          .map((r) => ({ slug: r.slug, label: `${r.title}${r.artist ? ` (${r.artist})` : ""}`, date: Date.parse(r.release_date ?? "") || 0 }))
      );
      setArtists((art.data ?? []).filter((a) => a.visible !== false).map((a) => ({ slug: a.slug, label: a.name })));
    } catch (e) {
      setToast({ kind: "error", text: `Couldn't load: ${(e as Error).message}` });
    }
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const newest = [...releases].sort((a, b) => (b.date ?? 0) - (a.date ?? 0))[0];

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(supabase, {
        featured_release: featured,
        spotlight_artist: spotlight,
        releases_order: order,
        ...Object.fromEntries(sections.map((x) => [x.key, show[x.key] !== false])),
      });
      const live = await refreshSite();
      setToast({ kind: "ok", text: live ? "Saved. The home page is updated now." : "Saved. The home page will update within a minute." });
      await load();
    } catch (err) {
      setToast({ kind: "error", text: `Couldn't save: ${(err as Error).message}` });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={save}>
      <PageHead
        title="Homepage"
        intro={
          <>
            Choose what the home page features and which sections show. To change the top text or the video, go to{" "}
            <Link href="/admin/settings#s-hero" className="text-[#ff8a5c] underline">Settings</Link>.
          </>
        }
      >
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn">View home page ↗</a>
      </PageHead>
      <Toast toast={toast} onDone={clearToast} />

      {stored === null ? (
        <p className="mt-10 text-white/70" role="status">Loading…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <label htmlFor="featured" className="block text-[16px] font-semibold">Featured release</label>
              <p id="featured-help" className="mt-1 text-[13px] text-white/60">The big one at the top and in “Latest release”.</p>
              <select id="featured" aria-describedby="featured-help" value={featured} onChange={(e) => setFeatured(e.target.value)} className="admin-input mt-3">
                <option value="auto">Automatic (the newest)</option>
                {releases.map((r) => (
                  <option key={r.slug} value={r.slug}>{r.label}</option>
                ))}
              </select>
              {featured === "auto" && newest && <p className="mt-2 text-[13px] text-white/60">Right now: {newest.label}</p>}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <label htmlFor="spotlight" className="block text-[16px] font-semibold">Artist spotlight</label>
              <p id="spotlight-help" className="mt-1 text-[13px] text-white/60">The artist shown big in the spotlight section.</p>
              <select id="spotlight" aria-describedby="spotlight-help" value={spotlight} onChange={(e) => setSpotlight(e.target.value)} className="admin-input mt-3">
                <option value="auto">Automatic (featured release’s artist)</option>
                {artists.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <legend className="sr-only">Home page sections</legend>
            <h2 className="text-[16px] font-semibold">Sections on the home page</h2>
            <p className="mt-1 text-[13px] text-white/60">The top section (video and headline) always shows. Untick a section to hide it.</p>
            <ul className="mt-4 divide-y divide-white/10">
              {sections.map((x) => (
                <li key={x.key} className="flex items-start gap-3 py-3">
                  <input
                    id={x.key}
                    type="checkbox"
                    checked={show[x.key] !== false}
                    onChange={(e) => setShow((p) => ({ ...p, [x.key]: e.target.checked }))}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#ff5a1f]"
                    aria-describedby={x.help ? `${x.key}-help` : undefined}
                  />
                  <div>
                    <label htmlFor={x.key} className="text-[15px] font-medium">{x.label}</label>
                    {x.help && <p id={`${x.key}-help`} className="text-[13px] text-white/60">{x.help}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <legend className="sr-only">Releases page order</legend>
            <h2 className="text-[16px] font-semibold">Order on the Releases page</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-8">
              {[
                { v: "date", label: "Newest first (automatic)" },
                { v: "manual", label: "My order (drag them under Releases)" },
              ].map((o) => (
                <label key={o.v} className="flex items-center gap-3 text-[15px]">
                  <input type="radio" name="order" value={o.v} checked={order === o.v} onChange={() => setOrder(o.v)} className="h-5 w-5 accent-[#ff5a1f]" />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="sticky bottom-0 z-30 -mx-4 mt-8 flex justify-end gap-3 border-t border-white/10 bg-zinc-950/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save homepage"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
