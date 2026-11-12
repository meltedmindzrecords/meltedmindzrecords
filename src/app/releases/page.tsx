import type { Metadata } from "next";

import ReleaseCard from "@/components/ReleaseCard";
import Reveal from "@/components/Reveal";
import { getReleases } from "@/lib/content";
import { getSettings } from "@/lib/settings";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Releases",
  description: "Singles, EPs and albums from Melted Mindz Records.",
};

export default async function ReleasesPage() {
  const settings = await getSettings();
  const releases = await getReleases(settings.releases_order === "manual" ? "manual" : "date");

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-28 text-center sm:px-10 sm:pt-36">
        <p className="rise caps text-[12px] text-molten sm:text-[13px]">The catalog</p>
        <h1 className="display mt-3 overflow-hidden pb-[0.04em] text-[24vw] sm:text-[11rem]">
          <span className="rise block" style={{ ["--d" as string]: "100ms" }}>Releases</span>
        </h1>
      </section>

      {releases.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-14 sm:px-10 lg:pt-20">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6">
            {releases.map((r, i) => (
              <Reveal
                key={r.slug}
                delay={Math.min(i, 6) * 60}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
              >
                <ReleaseCard release={r} sizes="(max-width: 1024px) 50vw, 25vw" />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
