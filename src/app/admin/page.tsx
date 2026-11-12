"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SITE_IMAGES_BUCKET } from "@/lib/supabaseBrowser";

import { useAdmin } from "./AdminShell";
import { describe, when, who, type Activity } from "./activityLabels";
import { adminPath, allConfigs } from "./cms";

const quick = [
  { href: "/admin/releases?new=1", label: "Add a release" },
  { href: "/admin/news?new=1", label: "Post news" },
  { href: "/admin/homepage", label: "Change the home page" },
  { href: "/admin/settings#s-about", label: "Edit About page" },
  { href: "/admin/settings#s-contact", label: "Edit contact info" },
  { href: "/admin/settings#s-links", label: "Social links" },
];

export default function AdminHome() {
  const { supabase, email } = useAdmin();
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [recent, setRecent] = useState<Activity[] | null>(null);

  useEffect(() => {
    allConfigs.forEach(async (c) => {
      let q = supabase.from(c.table).select("id", { count: "exact", head: true });
      for (const [k, v] of Object.entries(c.filter ?? {})) q = q.eq(k, v);
      const { count } = await q;
      setCounts((prev) => ({ ...prev, [adminPath(c)]: count ?? null }));
    });
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setCounts((prev) => ({ ...prev, "/admin/newsletter": count ?? null })));
    (async () => {
      let n = 0;
      const bucket = supabase.storage.from(SITE_IMAGES_BUCKET);
      const { data } = await bucket.list("", { limit: 1000 });
      for (const o of data ?? []) {
        if (o.id) n++;
        else {
          const { data: inner } = await bucket.list(o.name, { limit: 1000 });
          n += (inner ?? []).filter((x) => x.id && x.name !== ".emptyFolderPlaceholder").length;
        }
      }
      setCounts((prev) => ({ ...prev, "/admin/media": n }));
    })();
    supabase
      .from("admin_activity")
      .select("*")
      .order("at", { ascending: false })
      .limit(6)
      .then(({ data }) => setRecent((data ?? []) as Activity[]));
  }, [supabase]);

  const cards = [
    ...allConfigs.map((c) => ({ href: adminPath(c), title: c.plural, intro: c.intro })),
    { href: "/admin/media", title: "Media", intro: "Every photo and video on the site. Upload, copy a link, delete." },
    { href: "/admin/newsletter", title: "Newsletter", intro: "Footer sign-ups. See the list, export a CSV, remove someone." },
  ];

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-[15px] text-white/70">Signed in as {email}. Changes go live on meltedmindzrecords.com as soon as you save.</p>

      <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.15em] text-white/50">Quick links</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {quick.map((q) => (
          <li key={q.href}>
            <Link href={q.href} className="block rounded-xl bg-[#ff5a1f] px-4 py-3 text-[15px] font-semibold text-black transition hover:bg-white">
              {q.label}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-[13px] font-semibold uppercase tracking-[0.15em] text-white/50">On the site</h2>
      <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#ff5a1f] hover:bg-white/[0.06] sm:p-5"
            >
              <span className="text-3xl font-semibold tabular-nums">{counts[c.href] ?? "…"}</span>
              <span className="mt-1 text-[16px] font-semibold">{c.title}</span>
              <span className="mt-1 hidden text-[13px] leading-5 text-white/60 sm:block">{c.intro}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-white/50">Recent changes</h2>
        <Link href="/admin/activity" className="text-[13px] text-[#ff8a5c] hover:underline">See all →</Link>
      </div>
      {recent === null ? (
        <p className="mt-3 text-white/60" role="status">Loading…</p>
      ) : recent.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-white/20 p-6 text-[14px] text-white/60">No changes yet. Everything you save shows up here.</p>
      ) : (
        <ol className="mt-3 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {recent.map((a) => (
            <li key={a.id} className="p-4 text-[14px] leading-6">
              <span className="font-semibold">{who(a.actor)}</span> {describe(a)}
              <span className="block text-[12px] text-white/50">{when(a.at)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
