import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ReleaseCard from "@/components/ReleaseCard";
import { StreamButtons } from "@/components/LinkButtons";
import {
  artistFor,
  getArtists,
  getReleases,
  isOptimizable,
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
      <section className="mx-auto max-w-[1600px] px-5 pt-28 text-center sm:px-10 sm:pt-36">
        <h1 className="display text-[24vw] sm:text-[11rem]">Releases</h1>
      </section>

      {release && (
        <section className="mx-auto max-w-[1600px] px-5 py-14 sm:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
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
              <p className="caps text-[12px] text-white/50">
                {[release.featured ? "Featured" : "Latest", release.type, release.releaseDate]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <h2 className="display mt-3 text-[4.5rem] sm:text-[7rem]">{release.title}</h2>
              <p className="caps mt-3 text-[16px] text-white/85">
                {artist ? (
                  <Link href={`/artists/${artist.slug}`} className="hover:underline">
                    {release.artist}
                  </Link>
                ) : (
                  release.artist
                )}
              </p>
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
            <div className="mx-auto mt-20 max-w-3xl border-t border-white/15 pt-12 text-center">
              <p className="caps text-[13px] text-white/60">About the release</p>
              <p className="mt-6 text-xl leading-relaxed text-white/80">{release.about}</p>
            </div>
          )}
        </section>
      )}

      {/* CATALOG: image cards (only when there is more than one release) */}
      {otherReleases.length > 0 && (
        <section className="border-t border-white/15">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-10">
            <h2 className="display text-[3.6rem] sm:text-[5rem]">Catalog</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {otherReleases.map((r) => (
                <ReleaseCard key={r.slug} release={r} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
