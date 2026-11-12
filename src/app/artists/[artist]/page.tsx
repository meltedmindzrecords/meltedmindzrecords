import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import ArtistCard from "@/components/ArtistCard";
import Marquee from "@/components/Marquee";
import Countdown from "@/components/Countdown";
import ReleaseCard from "@/components/ReleaseCard";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import VinylCover from "@/components/VinylCover";
import { SocialIcons, StreamButtons, present } from "@/components/LinkButtons";
import {
  findMovedArtist,
  getArtist,
  getArtists,
  getReleases,
  outReleases,
  upcomingReleases,
  isUpcoming,
  presaveLinks,
  streamLinks,
  isOptimizable,
  releasesFor,
} from "@/lib/content";
import Tall from "@/components/Tall";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

type Props = { params: Promise<{ artist: string }> };

export async function generateStaticParams() {
  const artists = await getArtists();
  return artists.map((a) => ({ artist: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artist } = await params;
  const info = await getArtist(artist);
  if (!info) return { title: "Artist not found" };
  return {
    title: info.name,
    description: info.bio || `${info.name} on Melted Mindz Records.`,
    openGraph: { images: [info.image] },
  };
}

export default async function ArtistProfile({ params }: Props) {
  const { artist } = await params;
  const [info, artists, releases] = await Promise.all([
    getArtist(artist),
    getArtists(),
    getReleases(),
  ]);

  if (!info) {
    // The artist's page address changed in /admin: send old links to the new page.
    const moved = await findMovedArtist(artist);
    if (moved) permanentRedirect(`/artists/${moved.slug}`);
    notFound();
  }

  // Streaming + social links share one row of small round icons; empty links are hidden.
  const links = [
    { label: "Spotify", href: info.spotifyUrl },
    { label: "Apple Music", href: info.appleMusicUrl },
    { label: "YouTube", href: info.youtubeUrl },
    { label: "Instagram", href: info.instagramUrl },
    { label: "TikTok", href: info.tiktokUrl },
  ];
  const hasLinks = present(links).length > 0;
  // Out first (newest first), then anything still coming soon (soonest first).
  const now = Date.now();
  const mine = releasesFor(info, releases);
  const soon = upcomingReleases(mine, now);
  const theirReleases = soon.length > 0 ? [...outReleases(mine, now), ...soon] : mine;
  const others = artists.filter((a) => a.slug !== info.slug);

  const [latest, ...moreMusic] = theirReleases;
  const ticker = [info.name, ...theirReleases.map((r) => r.title)];

  return (
    <>
      {/* HERO: full-bleed photo with a slow push-in, name huge across the bottom */}
      <section className="relative flex h-[118vw] max-h-[94svh] min-h-[520px] items-end overflow-hidden bg-zinc-900 sm:h-[94svh]">
        <div className="kenburns absolute inset-0">
          <Image
            src={info.image}
            alt={info.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_20%]"
            unoptimized={!isOptimizable(info.image)}
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgba(255,61,46,0.45),transparent_60%)]" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 text-center sm:px-10 sm:pb-16">
          <p className="rise caps text-[12px] text-molten sm:text-[13px]">Melted Mindz Records</p>
          <h1 className="display mt-3 overflow-hidden break-words pb-[0.04em] text-[23vw] sm:text-[15vw] lg:text-[14rem]">
            <span className="rise block" style={{ ["--d" as string]: "120ms" }}>
              <Tall>{info.name}</Tall>
            </span>
          </h1>
          {info.genre && (
            <p
              className="rise caps mt-5 inline-block rounded-full border border-white/40 bg-black/40 px-4 py-1.5 text-[12px] text-white backdrop-blur sm:text-[13px]"
              style={{ ["--d" as string]: "260ms" }}
            >
              {info.genre}
            </p>
          )}
        </div>
      </section>

      {/* TICKER: their name and their releases */}
      <Marquee items={ticker} label={`${info.name} and releases`} speed={32} />

      {/* LISTEN + FOLLOW: one centered row of small round icons */}
      {hasLinks && (
        <section className="border-b border-white/15">
          <Reveal className="mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-5 py-10 sm:px-10">
            <p className="caps text-[12px] text-white/70">Listen &amp; follow</p>
            <SocialIcons links={links} labelPrefix={info.name} />
          </Reveal>
        </section>
      )}

      {/* ABOUT */}
      {info.bio && (
        <section className="mx-auto max-w-[1600px] px-5 py-24 text-center sm:px-10 lg:py-32">
          <Reveal>
            <p className="caps text-[13px] text-molten">About</p>
            <p className="mx-auto mt-6 max-w-3xl text-[22px] font-medium leading-[1.45] text-white/90 sm:text-3xl">
              {info.bio}
            </p>
          </Reveal>
        </section>
      )}

      {/* MUSIC (only when this artist has any): newest as a record, the rest as cards */}
      {latest && (
        <section aria-labelledby="music-title" className="overflow-x-clip border-t border-white/15">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:py-32">
            <SectionHead eyebrow={theirReleases.length === 1 ? "Latest release" : "Music"} title="Music" id="music-title" />
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <Reveal className="group">
                <VinylCover release={latest} sizes="(max-width: 1024px) 78vw, 45vw" />
              </Reveal>
              <Reveal delay={120}>
                <p className="caps text-[12px] text-white/70">
                  {[latest.type, latest.releaseDate].filter(Boolean).join(" · ")}
                </p>
                <h3 className="display mt-3 text-[4.4rem] sm:text-[6rem] lg:text-[7.5rem]">{latest.title}</h3>
                {latest.shortDescription && (
                  <p className="mt-6 max-w-lg text-[17px] leading-8 text-white/75">{latest.shortDescription}</p>
                )}
                {isUpcoming(latest, now) && latest.releaseAt ? (
                  <Countdown
                    to={latest.releaseAt}
                    serverNow={now}
                    className="mt-8 max-w-[640px]"
                    before={presaveLinks(latest)}
                    after={streamLinks(latest)}
                    name={latest.title}
                  />
                ) : (
                <div className="mt-8">
                  <StreamButtons
                    links={[
                      { label: "Listen now", href: latest.link },
                      { label: "Spotify", href: latest.spotifyUrl },
                      { label: "Apple Music", href: latest.appleMusicUrl },
                      { label: "YouTube", href: latest.youtubeUrl },
                    ]}
                  />
                </div>
                )}
              </Reveal>
            </div>
            {moreMusic.length > 0 && (
              <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {moreMusic.map((r, i) => (
                  <Reveal key={r.slug} delay={(i % 4) * 90}>
                    <ReleaseCard
                      release={r}
                      showArtist={false}
                      {...(isUpcoming(r, now) && r.releaseAt
                        ? {
                            href: presaveLinks(r)[0]?.href ?? r.link,
                            below: (
                              <Countdown
                                to={r.releaseAt}
                                serverNow={now}
                                size="sm"
                                className="mt-4"
                                before={presaveLinks(r)}
                                after={streamLinks(r)}
                                name={r.title}
                              />
                            ),
                          }
                        : {})}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* MORE ARTISTS */}
      {others.length > 0 && (
        <section className="border-t border-white/15">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10">
            <SectionHead eyebrow="The roster" title="More artists" link={{ href: "/artists", label: "View all" }} />
            <Reveal className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {others.slice(0, 4).map((a) => (
                <div key={a.slug} className="w-[64vw] shrink-0 snap-start sm:w-auto">
                  <ArtistCard artist={a} compact sizes="(max-width: 640px) 64vw, (max-width: 1024px) 33vw, 25vw" />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
