import Image from "next/image";
import Link from "next/link";

import ReleaseCard from "@/components/ReleaseCard";
import RosterList from "@/components/RosterList";
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

const solid = "caps inline-block bg-white px-8 py-4 text-[14px] text-black transition hover:bg-zinc-200";
const line = "caps inline-block border border-white px-8 py-4 text-[14px] text-white transition hover:bg-white hover:text-black";

export default async function Home() {
  const [artists, releases] = await Promise.all([getArtists(), getReleases()]);
  const featured = pickFeatured(releases);
  const featuredArtist = featured ? artistFor(featured, artists) : null;
  const heroImage = featuredArtist?.image ?? featured?.cover ?? null;
  const featuredListen = featured ? listenLink(featured) : null;
  const roster = [...artists].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {/* HERO: full-bleed photo, huge condensed type */}
      {featured && heroImage ? (
        <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-zinc-900">
          <Image
            src={heroImage}
            alt={featuredArtist?.name ?? featured.artist}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_25%] grayscale"
            unoptimized={!isOptimizable(heroImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />

          <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-12 sm:px-10 sm:pb-20">
            <p className="caps text-[12px] text-white/80 sm:text-[13px]">
              New {featured.type || "Release"}
              {featured.releaseDate ? ` · ${featured.releaseDate}` : ""}
            </p>
            <h1 className="display mt-4 text-[22vw] sm:text-[15vw] lg:text-[13rem]">{featured.title}</h1>
            <p className="caps mt-4 text-[17px] text-white sm:text-[22px]">{featured.artist}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {featuredListen && (
                <a href={featuredListen} target="_blank" rel="noopener noreferrer" className={solid}>
                  Listen now
                </a>
              )}
              {featuredArtist && (
                <Link href={`/artists/${featuredArtist.slug}`} className={line}>
                  View artist
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex min-h-[80svh] items-end px-5 pb-16 pt-32 sm:px-10">
          <h1 className="display mx-auto w-full max-w-[1600px] text-[20vw] lg:text-[13rem]">
            Melted Mindz Records
          </h1>
        </section>
      )}

      {/* ARTISTS: every name, stacked big */}
      {roster.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-10 lg:py-28">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="caps text-[13px] text-white/60">Artists</h2>
            <Link href="/artists" className="caps text-[13px] text-white/60 hover:text-white">
              View all
            </Link>
          </div>
          <RosterList artists={roster} />
        </section>
      )}

      {/* NEW MUSIC: image cards */}
      {releases.length > 1 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-10 lg:pb-28">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="display text-[3.6rem] sm:text-[5rem]">New music</h2>
            <Link href="/releases" className="caps pb-2 text-[13px] text-white/60 hover:text-white">
              All releases
            </Link>
          </div>
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {releases.slice(0, 8).map((r) => (
              <div key={r.slug} className="w-[78vw] shrink-0 snap-start sm:w-auto">
                <ReleaseCard release={r} />
              </div>
            ))}
          </div>
        </section>
      )}

      {releases.length === 1 && featured && (
        <section className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-10 lg:pb-28">
          <h2 className="display mb-8 text-[3.6rem] sm:text-[5rem]">New music</h2>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
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
              <p className="caps text-[12px] text-white/50">
                {[featured.type, featured.releaseDate].filter(Boolean).join(" · ")}
              </p>
              <h3 className="display mt-3 text-[4.5rem] sm:text-[6.5rem]">{featured.title}</h3>
              <p className="caps mt-3 text-[16px] text-white/80">{featured.artist}</p>
              {featured.shortDescription && (
                <p className="mt-6 max-w-lg text-[17px] leading-8 text-white/70">{featured.shortDescription}</p>
              )}
              <div className="mt-8">
                <StreamButtons
                  links={[
                    { label: "Listen now", href: featured.link },
                    { label: "Spotify", href: featured.spotifyUrl },
                    { label: "Apple Music", href: featured.appleMusicUrl },
                    { label: "YouTube", href: featured.youtubeUrl },
                  ]}
                />
              </div>
              <Link href="/releases" className="caps mt-8 inline-block text-[13px] text-white/60 hover:text-white">
                All releases
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* THE LABEL: a few words, lots of room */}
      <section className="border-t border-white/15">
        <div className="mx-auto max-w-[1600px] px-5 py-24 text-center sm:px-10 lg:py-36">
          <p className="caps text-[13px] text-white/60">The label</p>
          <p className="display mx-auto mt-6 max-w-5xl text-[2.9rem] sm:text-[4.6rem] lg:text-[6rem]">
            An independent label from Birmingham, Alabama. Our artists keep their rights.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a href={GET_SIGNED_URL} target="_blank" rel="noopener noreferrer" className={solid}>
              Get signed
            </a>
            <Link href="/about" className={line}>
              About MMR
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
