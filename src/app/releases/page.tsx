import type { Metadata } from "next";

import Countdown from "@/components/Countdown";
import ReleaseCard from "@/components/ReleaseCard";
import Reveal from "@/components/Reveal";
import { getReleases, listenLink, outReleases, presaveLinks, streamLinks, upcomingReleases } from "@/lib/content";
import { getSettings } from "@/lib/settings";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Releases",
  description: "Singles, EPs and albums from Melted Mindz Records.",
};

export default async function ReleasesPage() {
  const settings = await getSettings();
  const all = await getReleases(settings.releases_order === "manual" ? "manual" : "date");
  // Not out yet: their own "Coming soon" row first, soonest first, each with a countdown.
  const now = Date.now();
  const upcoming = upcomingReleases(all, now);
  const releases = upcoming.length > 0 ? outReleases(all, now) : all;
  const cardWidth = "w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]";

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-28 text-center sm:px-10 sm:pt-36">
        <p className="rise caps text-[12px] text-molten sm:text-[13px]">The catalog</p>
        <h1 className="display mt-3 overflow-hidden pb-[0.04em] text-[24vw] sm:text-[11rem]">
          <span className="rise block" style={{ ["--d" as string]: "100ms" }}>Releases</span>
        </h1>
      </section>

      {upcoming.length > 0 && (
        <section aria-labelledby="coming-soon" className="mx-auto max-w-[1600px] px-5 pt-14 sm:px-10 lg:pt-20">
          <h2 id="coming-soon" className="caps flex items-center justify-center gap-3 text-[13px] text-molten sm:text-[14px]">
            <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-molten" aria-hidden="true" />
            Coming soon
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6">
            {upcoming.map((r, i) => (
              <Reveal key={r.slug} delay={Math.min(i, 6) * 60} className={cardWidth}>
                <ReleaseCard
                  release={r}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  href={presaveLinks(r)[0]?.href ?? listenLink(r)}
                  below={
                    <Countdown
                      to={r.releaseAt!}
                      serverNow={now}
                      size="sm"
                      className="mt-4"
                      before={presaveLinks(r)}
                      after={streamLinks(r)}
                      name={r.title}
                    />
                  }
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {releases.length > 0 && (
        <section
          aria-labelledby={upcoming.length > 0 ? "out-now" : undefined}
          className={`mx-auto max-w-[1600px] px-5 pb-24 sm:px-10 ${upcoming.length > 0 ? "pt-20 lg:pt-28" : "pt-14 lg:pt-20"}`}
        >
          {upcoming.length > 0 && (
            <h2 id="out-now" className="caps mb-8 text-center text-[13px] text-white/70 sm:text-[14px]">
              Out now
            </h2>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6">
            {releases.map((r, i) => (
              <Reveal
                key={r.slug}
                delay={Math.min(i, 6) * 60}
                className={cardWidth}
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
