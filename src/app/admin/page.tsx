"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAdmin } from "./AdminShell";
import { allConfigs } from "./cms";

export default function AdminHome() {
  const { supabase, email } = useAdmin();
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    allConfigs.forEach(async (c) => {
      const { count } = await supabase.from(c.table).select("id", { count: "exact", head: true });
      setCounts((prev) => ({ ...prev, [c.table]: count ?? null }));
    });
  }, [supabase]);

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Edit the website</h1>
      <p className="mt-1 text-[15px] text-white/70">Signed in as {email}. Changes go live on meltedmindzrecords.com as soon as you save.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {allConfigs.map((c) => (
          <li key={c.table}>
            <Link
              href={`/admin/${c.table}`}
              className="group block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#ff5a1f] hover:bg-white/[0.06]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold">{c.plural}</h2>
                <span className="text-[14px] text-white/60">{counts[c.table] ?? "…"}</span>
              </div>
              <p className="mt-2 text-[14px] leading-6 text-white/70">{c.intro}</p>
              <span className="mt-4 inline-block text-[14px] font-medium text-[#ff8a5c] group-hover:underline">
                Add, edit or remove →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
