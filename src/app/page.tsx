import Image from "next/image";
import Link from "next/link";

import HeroVideo from "@/components/HeroVideo";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import VinylCover from "@/components/VinylCover";
import { SocialIcons, StreamButtons } from "@/components/LinkButtons";
import {
  artistFor,
  getArtists,
  getReleases,
  isOptimizable,
  listenLink,
  pickFeatured,
  releasesFor,
} from "@/lib/content";
import { GET_SIGNED_URL } from "@/lib/site";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

const hot =
  "caps inline-flex items-center gap-2 bg-molten px-8 py-4 text-[14px] text-black transition hover:-translate-y-0.5 hover:bg-white";
const line =
  "caps inline-flex items-center gap-2 border border-white px-8 py-4 text-[14px] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-black";

export default async function Home() {
  const [artists, releases] = await Promise.all([getArtists(), getReleases()]);
  const featured = pickFeatured(releases);
  const featuredArtist = featured ? artistFor(featured, artists) : null;
  const featuredListen = featured ? listenLink(featured) : null;
  const roster = [...artists].sort((a, b) => a.name.localeCompare(b.name));

  // Home shows ONE release: the featured one (newest first). The full catalog lives on /releases.
  const lead = featured;
  const leadArtist = lead ? artistFor(lead, artists) : null;

  // Spotlight: the artist behind the featured release, else the first artist in the CMS order.
  const spot = featuredArtist ?? artists[0] ?? null;
  const spotReleases = spot ? releasesFor(spot, releases) : [];
  const spotLinks = spot
    ? [
        { label: "Spotify", href: spot.spotifyUrl },
        { label: "Apple Music", href: spot.appleMusicUrl },
        { label: "YouTube", href: spot.youtubeUrl },
        { label: "Instagram", href: spot.instagramUrl },
        { label: "TikTok", href: spot.tiktokUrl },
      ]
    : [];

  // Ticker: every artist name and every release title, straight from the CMS.
  const ticker = [...roster.map((a) => a.name), ...releases.map((r) => r.title)];

  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <>
      {/* HERO: the crowd video, the newest release in huge type */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-black">
        <HeroVideo
          src="/videos/hero-web.mp4"
          poster="/videos/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(255,61,46,0.35),transparent_55%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-24 pt-28 sm:px-10 sm:pb-24">
          {featured ? (
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <p className="rise caps flex items-center gap-3 text-[12px] text-white sm:text-[13px]">
                  <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-molten" aria-hidden="true" />
                  Out now · {featured.type || "Release"}
                  {featured.releaseDate ? ` · ${featured.releaseDate}` : ""}
                </p>
                <h1 className="display mt-5 overflow-hidden pb-[0.04em] text-[21vw] sm:text-[14vw] lg:text-[12.5rem]">
                  <span className="rise block" style={{ ["--d" as string]: "120ms" }}>
                    {featured.title}
                  </span>
                </h1>
                <p className="rise caps mt-5 text-[18px] text-molten sm:text-[24px]" style={{ ["--d" as string]: "260ms" }}>
                  {featured.artist}
                </p>
                <div className="rise mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: "380ms" }}>
                  {featuredListen && (
                    <a href={featuredListen} target="_blank" rel="noopener noreferrer" className={hot}>
                      Listen now <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {featuredArtist && (
                    <Link href={`/artists/${featuredArtist.slug}`} className={line}>
                      View artist
                    </Link>
                  )}
                </div>
              </div>

              {/* Cover art floating in the corner on big screens */}
              <div className="rise hidden w-[300px] lg:block xl:w-[340px]" style={{ ["--d" as string]: "500ms" }}>
                <div className="relative aspect-square rotate-3 overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.75)] ring-1 ring-white/10 transition duration-500 hover:rotate-0">
                  <Image
                    src={featured.cover}
                    alt={`${featured.title} cover art`}
                    fill
                    priority
                    sizes="340px"
                    className="object-cover"
                    unoptimized={!isOptimizable(featured.cover)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <h1 className="display text-[20vw] lg:text-[13rem]">
              <span className="rise block">Melted Mindz</span>
              <span className="rise block text-melt" style={{ ["--d" as string]: "150ms" }}>
                Records
              </span>
            </h1>
          )}
        </div>
      </section>

      {/* TICKER: artists and releases */}
      <Marquee items={ticker} label="Artists and releases" />

      {/* LATEST RELEASES */}
      {lead && (
        <section aria-labelledby="latest-title" className="overflow-x-clip">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:py-36">
            <SectionHead
              index={idx()}
              eyebrow="Latest release"
              title="New music"
              id="latest-title"
              link={{ href: "/releases", label: "All releases" }}
            />

            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
              <Reveal className="group">
                <VinylCover release={lead} sizes="(max-width: 1024px) 78vw, 45vw" />
              </Reveal>

              <Reveal delay={120}>
                <p className="caps text-[12px] text-white/70">
                  {[lead.type, lead.releaseDate].filter(Boolean).join(" · ")}
                </p>
                <h3 className="display mt-3 text-[4.6rem] sm:text-[6.5rem] lg:text-[8rem]">{lead.title}</h3>
                <p className="caps mt-3 text-[17px] text-molten">
                  {leadArtist ? (
                    <Link href={`/artists/${leadArtist.slug}`} className="wipe pb-0.5">
                      {lead.artist}
                    </Link>
                  ) : (
                    lead.artist
                  )}
                </p>
                {lead.shortDescription && (
                  <p className="mt-7 max-w-lg text-[17px] leading-8 text-white/75">{lead.shortDescription}</p>
                )}
                <div className="mt-9">
                  <StreamButtons
                    links={[
                      { label: "Listen now", href: lead.link },
                      { label: "Spotify", href: lead.spotifyUrl },
                      { label: "Apple Music", href: lead.appleMusicUrl },
                      { label: "YouTube", href: lead.youtubeUrl },
                    ]}
                  />
                </div>
                <Link
                  href="/releases"
                  className="caps group mt-9 inline-flex items-center gap-2 text-[13px] text-white/75 hover:text-white"
                >
                  <span className="wipe pb-1">See all releases</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </Reveal>
            </div>

          </div>
        </section>
      )}

      {/* ARTIST SPOTLIGHT */}
      {spot && (
        <section aria-labelledby="spotlight-title" className="relative overflow-hidden border-y border-white/10 bg-[#0d0504]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_40%,rgba(255,61,46,0.28),transparent_60%)]" />
          <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:py-36">
            <SectionHead index={idx()} eyebrow="Artist spotlight" title="Spotlight" id="spotlight-title" />
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <Reveal color>
                <Link
                  href={`/artists/${spot.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden bg-zinc-900"
                >
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[50%_25%] transition duration-700 group-hover:scale-[1.04]"
                    unoptimized={!isOptimizable(spot.image)}
                  />
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 bg-molten transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              </Reveal>
              <Reveal delay={120} className="min-w-0">
                {spot.genre && <p className="caps text-[12px] text-white/70 sm:text-[13px]">{spot.genre}</p>}
                <h3 className="display mt-3 break-words text-[17vw] sm:text-[8rem] lg:text-[9.5rem]">
                  {spot.name}
                </h3>
                {spot.bio && (
                  <p className="mt-7 max-w-xl text-[19px] leading-[1.6] text-white/80 sm:text-[21px]">{spot.bio}</p>
                )}
                {spotReleases.length > 0 && (
                  <p className="caps mt-7 text-[13px] text-white/70">
                    Latest: <span className="text-molten">{spotReleases[0].title}</span>
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Link href={`/artists/${spot.slug}`} className={hot}>
                    Meet {spot.name} <span aria-hidden="true">→</span>
                  </Link>
                  <SocialIcons links={spotLinks} size="sm" labelPrefix={spot.name} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ARTISTS: link to the full roster */}
      {roster.length > 0 && (
        <section aria-label="Our artists" className="mx-auto max-w-[1600px] px-5 py-16 text-center sm:px-10 lg:py-24">
          <Link href="/artists" className={hot}>
            See all artists <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      {/* THE LABEL */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,61,46,0.3),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-5 py-28 text-center sm:px-10 lg:py-40">
          <Reveal>
            <p className="caps text-[13px] text-molten">The label</p>
            <p className="display mx-auto mt-6 max-w-5xl text-[2.9rem] sm:text-[4.6rem] lg:text-[6.2rem]">
              An independent label from Birmingham, Alabama. <span className="text-melt">Our artists keep their rights.</span>
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-12 flex flex-wrap justify-center gap-3">
            <a href={GET_SIGNED_URL} target="_blank" rel="noopener noreferrer" className={hot}>
              Get signed <span aria-hidden="true">↗</span>
            </a>
            <Link href="/about" className={line}>
              About MMR
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
