"use client";

import { useEffect, useState } from "react";

import { useAdmin } from "../AdminShell";
import { describe, when, who, type Activity } from "../activityLabels";
import { PageHead } from "../Toast";

const filters = [
  { v: "", label: "Everything" },
  { v: "site_settings", label: "Settings" },
  { v: "artists", label: "Artists" },
  { v: "releases", label: "Releases" },
  { v: "news", label: "News" },
  { v: "team", label: "Team" },
  { v: "listings", label: "Careers/Internships" },
  { v: "media", label: "Media" },
  { v: "newsletter_subscribers", label: "Newsletter" },
];

export default function ActivityPage() {
  const { supabase } = useAdmin();
  const [rows, setRows] = useState<Activity[] | null>(null);
  const [error, setError] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    let q = supabase.from("admin_activity").select("*").order("at", { ascending: false }).limit(300);
    if (area) q = q.eq("area", area);
    q.then(({ data, error: e }) => {
      setError(e?.message ?? "");
      setRows((data ?? []) as Activity[]);
    });
  }, [supabase, area]);

  return (
    <section>
      <PageHead title="Activity" intro="Every change made in this admin: who, what and when. Newest first." />
      <div className="mt-6">
        <label htmlFor="area" className="mr-3 text-[14px] text-white/70">Show</label>
        <select id="area" value={area} onChange={(e) => setArea(e.target.value)} className="admin-input inline-block w-auto">
          {filters.map((f) => (
            <option key={f.v} value={f.v}>{f.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-6 text-red-300" role="alert">Couldn&apos;t load: {error}</p>}
      {rows === null ? (
        <p className="mt-10 text-white/70" role="status">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/70">No changes yet. Edits show up here as soon as they&apos;re saved.</p>
      ) : (
        <ol className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {rows.map((a) => (
            <li key={a.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-4">
              <time dateTime={a.at} title={new Date(a.at).toLocaleString()} className="shrink-0 text-[13px] text-white/55 sm:w-36">
                {when(a.at)}
              </time>
              <p className="text-[15px] leading-6">
                <span className="font-semibold">{who(a.actor)}</span> {describe(a)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
