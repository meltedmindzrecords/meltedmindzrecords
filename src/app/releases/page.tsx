import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { StreamButtons } from "@/components/LinkButtons";
import {
  artistFor,
  getArtists,
  getReleases,
  isOptimizable,
  listenLink,
  pickFeatured,
} from "@/lib/content";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Releases",
  description: "Singles, EPs and albums from Melted Mindz Records.",
};

export default async function ReleasesPage() {
  const [releases, artists] = await Promise.all([getReleases(), getArtists()]);
  const release = pickFeatured(releases);
  const otherReleases = releases.filter((r) => r !== release);
  const artist = release ? artistFor(release, artists) : null;

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pt-28 sm:px-8 sm:pt-36">
        <p className="eyebrow text-white/50">Melted Mindz Records</p>
        <h1 className="display mt-4 text-[22vw] sm:text-[11rem]">Releases</h1>
      </section>

      {release && (
        <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
              <Image
                src={release.cover}
                alt={`${release.title} cover art`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized={!isOptimizable(release.cover)}
              />
            </div>
            <div>
              <p className="eyebrow text-white/50">
                {[release.featured ? "Featured" : null, release.type].filter(Boolean).join(" · ")}
              </p>
              <h2 className="display mt-4 text-6xl sm:text-8xl">{release.title}</h2>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/80">
                {artist ? (
                  <Link href={`/artists/${artist.slug}`} className="hover:underline">
                    {release.artist}
                  </Link>
                ) : (
                  release.artist
                )}
              </p>
              {release.releaseDate && (
                <p className="mt-2 text-sm text-white/50">Released {release.releaseDate}</p>
              )}
              {release.description && (
                <p className="mt-8 max-w-lg text-[17px] leading-8 text-white/70">{release.description}</p>
              )}
              <div className="mt-10">
                <StreamButtons
                  links={[
                    { label: "Listen now", href: release.link },
                    { label: "Spotify", href: release.spotifyUrl },
                    { label: "Apple Music", href: release.appleMusicUrl },
                    { label: "YouTube", href: release.youtubeUrl },
                  ]}
                />
              </div>
            </div>
          </div>

          {release.about && release.about !== release.description && (
            <div className="mt-20 grid gap-8 border-t border-white/10 pt-12 lg:grid-cols-12">
              <p className="eyebrow text-white/50 lg:col-span-3">About the release</p>
              <p className="text-xl leading-relaxed text-white/80 lg:col-span-8">{release.about}</p>
            </div>
          )}
        </section>
      )}

      {/* MORE RELEASES (only when there is more than one) */}
      {otherReleases.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8">
            <h2 className="display text-5xl sm:text-7xl">Catalog</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {otherReleases.map((r) => {
                const href = listenLink(r);
                const inner = (
                  <>
                    <div className="relative aspect-square overflow-hidden bg-zinc-900">
                      <Image
                        src={r.cover}
                        alt={`${r.title} cover art`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        unoptimized={!isOptimizable(r.cover)}
                      />
                    </div>
                    <p className="mt-4 text-base font-semibold">{r.title}</p>
                    <p className="mt-1 text-sm text-white/60">{r.artist}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
                      {[r.type, r.releaseDate].filter(Boolean).join(" · ")}
                    </p>
                  </>
                );
                return href ? (
                  <a key={r.slug} href={href} target="_blank" rel="noopener noreferrer" className="group block">
                    {inner}
                  </a>
                ) : (
                  <div key={r.slug} className="group">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
