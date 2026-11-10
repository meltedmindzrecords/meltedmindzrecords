import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArtistCard from "@/components/ArtistCard";
import { SocialIcons, present } from "@/components/LinkButtons";
import {
  getArtist,
  getArtists,
  getReleases,
  isOptimizable,
  listenLink,
  releasesFor,
} from "@/lib/content";

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

  if (!info) notFound();

  // Streaming + social links share one row of small round icons; empty links are hidden.
  const links = [
    { label: "Spotify", href: info.spotifyUrl },
    { label: "Apple Music", href: info.appleMusicUrl },
    { label: "YouTube", href: info.youtubeUrl },
    { label: "Instagram", href: info.instagramUrl },
    { label: "TikTok", href: info.tiktokUrl },
  ];
  const hasLinks = present(links).length > 0;
  const theirReleases = releasesFor(info, releases);
  const others = artists.filter((a) => a.slug !== info.slug);

  return (
    <>
      {/* HERO: big photo, huge name (Atlantic) */}
      <section className="relative flex h-[125vw] max-h-[92svh] min-h-[480px] items-end overflow-hidden bg-zinc-900 sm:h-[92svh]">
        <Image
          src={info.image}
          alt={info.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_15%] grayscale"
          unoptimized={!isOptimizable(info.image)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-10 sm:px-8 sm:pb-16">
          {info.genre && <p className="eyebrow text-white/75">{info.genre}</p>}
          <h1 className="display mt-4 break-words text-[19vw] sm:text-[13vw] lg:text-[12rem]">
            {info.name}
          </h1>
        </div>
      </section>

      {/* LISTEN + FOLLOW: one row of round icons */}
      {hasLinks && (
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
            <SocialIcons links={links} labelPrefix={info.name} />
          </div>
        </section>
      )}

      {/* ABOUT */}
      {info.bio && (
        <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-12">
            <p className="eyebrow text-white/50 lg:col-span-3">About</p>
            <p className="text-2xl font-medium leading-[1.4] tracking-tight text-white/90 sm:text-3xl lg:col-span-8">
              {info.bio}
            </p>
          </div>
        </section>
      )}

      {/* RELEASES (only when this artist has any) */}
      {theirReleases.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
            <h2 className="display text-5xl sm:text-7xl">Music</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {theirReleases.map((r) => {
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
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/50">
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

      {/* MORE ARTISTS */}
      {others.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display text-5xl sm:text-7xl">More artists</h2>
              <Link
                href="/artists"
                className="pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white"
              >
                All →
              </Link>
            </div>
            <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {others.slice(0, 4).map((a) => (
                <div key={a.slug} className="w-[68vw] shrink-0 snap-start sm:w-auto">
                  <ArtistCard artist={a} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
