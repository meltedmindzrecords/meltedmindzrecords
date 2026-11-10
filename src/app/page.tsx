import Image from "next/image";
import Link from "next/link";

import ArtistCard from "@/components/ArtistCard";
import { StreamButtons } from "@/components/LinkButtons";
import {
  artistFor,
  getArtists,
  getReleases,
  isOptimizable,
  listenLink,
  pickFeatured,
} from "@/lib/content";
import { GET_SIGNED_URL } from "@/lib/site";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export default async function Home() {
  const [artists, releases] = await Promise.all([getArtists(), getReleases()]);
  const featured = pickFeatured(releases);
  const featuredArtist = featured ? artistFor(featured, artists) : null;
  const heroImage = featuredArtist?.image ?? featured?.cover ?? null;
  const featuredListen = featured ? listenLink(featured) : null;

  return (
    <>
      {/* HERO: featured artist, newest release (Interscope) */}
      {featured && heroImage ? (
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <Image
            src={heroImage}
            alt={featuredArtist?.name ?? featured.artist}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_30%]"
            unoptimized={!isOptimizable(heroImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-20">
            <p className="eyebrow text-white/80">
              New {featured.type || "Release"}
              {featured.releaseDate ? ` · ${featured.releaseDate}` : ""}
            </p>
            <h1 className="display mt-4 text-[17vw] sm:text-[12vw] lg:text-[10rem]">
              {featured.title}
            </h1>
            <p className="mt-3 text-lg font-medium uppercase tracking-[0.2em] text-white/90 sm:text-xl">
              {featured.artist}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {featuredListen && (
                <a
                  href={featuredListen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-zinc-200"
                >
                  Listen now
                </a>
              )}
              {featuredArtist && (
                <Link
                  href={`/artists/${featuredArtist.slug}`}
                  className="border border-white/50 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] transition hover:border-white hover:bg-white hover:text-black"
                >
                  View artist
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex min-h-[80svh] items-end px-5 pb-16 pt-32 sm:px-8">
          <h1 className="display mx-auto w-full max-w-[1440px] text-[17vw] lg:text-[10rem]">
            Melted Mindz Records
          </h1>
        </section>
      )}

      {/* LATEST RELEASE */}
      {featured && (
        <section className="border-t border-white/10">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-28">
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
              <Image
                src={featured.cover}
                alt={`${featured.title} cover art`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized={!isOptimizable(featured.cover)}
              />
            </div>
            <div>
              <p className="eyebrow text-white/50">Latest release</p>
              <h2 className="display mt-4 text-6xl sm:text-7xl lg:text-8xl">{featured.title}</h2>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/70">
                {featured.artist}
                {featured.type ? ` · ${featured.type}` : ""}
              </p>
              {featured.shortDescription && (
                <p className="mt-8 max-w-lg text-[17px] leading-8 text-white/70">
                  {featured.shortDescription}
                </p>
              )}
              <div className="mt-10">
                <StreamButtons
                  links={[
                    { label: "Listen now", href: featured.link },
                    { label: "Spotify", href: featured.spotifyUrl },
                    { label: "Apple Music", href: featured.appleMusicUrl },
                    { label: "YouTube", href: featured.youtubeUrl },
                  ]}
                />
              </div>
              <Link
                href="/releases"
                className="mt-8 inline-block text-[12px] font-semibold uppercase tracking-[0.2em] text-white/60 underline-offset-8 hover:text-white hover:underline"
              >
                All releases →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ROSTER (Atlantic) */}
      {artists.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display text-6xl sm:text-8xl">Artists</h2>
              <Link
                href="/artists"
                className="pb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white"
              >
                View all →
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
              {artists.map((artist) => (
                <ArtistCard key={artist.slug} artist={artist} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* THE LABEL (Columbia: whitespace, few words) */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-36">
          <p className="eyebrow text-white/50">The label</p>
          <p className="mt-8 max-w-4xl text-3xl font-medium leading-[1.2] tracking-tight sm:text-5xl">
            An independent label from Birmingham, Alabama. Our artists keep their rights.
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href={GET_SIGNED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-zinc-200"
            >
              Get signed
            </a>
            <Link
              href="/about"
              className="border border-white/50 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] transition hover:border-white hover:bg-white hover:text-black"
            >
              About MMR
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
