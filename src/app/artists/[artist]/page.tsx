import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import { SocialIcons, present } from "@/components/LinkButtons";
import {
  getArtist,
  getArtists,
  getReleases,
  isOptimizable,
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
      {/* HERO: full-bleed photo, name huge across the bottom (Atlantic) */}
      <section className="relative flex h-[118vw] max-h-[94svh] min-h-[480px] items-end overflow-hidden bg-zinc-900 sm:h-[94svh]">
        <Image
          src={info.image}
          alt={info.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_20%] grayscale"
          unoptimized={!isOptimizable(info.image)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 text-center sm:px-10 sm:pb-16">
          <h1 className="display break-words text-[23vw] sm:text-[15vw] lg:text-[14rem]">{info.name}</h1>
          {info.genre && <p className="caps mt-4 text-[12px] text-white/75 sm:text-[13px]">{info.genre}</p>}
        </div>
      </section>

      {/* LISTEN + FOLLOW: one centered row of small round icons */}
      {hasLinks && (
        <section className="border-b border-white/15">
          <div className="mx-auto flex max-w-[1600px] justify-center px-5 py-8 sm:px-10">
            <SocialIcons links={links} labelPrefix={info.name} />
          </div>
        </section>
      )}

      {/* ABOUT */}
      {info.bio && (
        <section className="mx-auto max-w-[1600px] px-5 py-20 text-center sm:px-10 lg:py-28">
          <p className="caps text-[13px] text-white/60">About</p>
          <p className="mx-auto mt-6 max-w-3xl text-[22px] font-medium leading-[1.45] text-white/90 sm:text-3xl">
            {info.bio}
          </p>
        </section>
      )}

      {/* MUSIC (only when this artist has any) */}
      {theirReleases.length > 0 && (
        <section className="border-t border-white/15">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-10 lg:py-28">
            <h2 className="display text-[3.6rem] sm:text-[5rem]">Music</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {theirReleases.map((r) => (
                <ReleaseCard
                  key={r.slug}
                  release={r}
                  showArtist={false}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MORE ARTISTS */}
      {others.length > 0 && (
        <section className="border-t border-white/15">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-10">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display text-[3.6rem] sm:text-[5rem]">More artists</h2>
              <Link href="/artists" className="caps pb-2 text-[13px] text-white/60 hover:text-white">
                View all
              </Link>
            </div>
            <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {others.slice(0, 4).map((a) => (
                <div key={a.slug} className="w-[64vw] shrink-0 snap-start sm:w-auto">
                  <ArtistCard artist={a} compact sizes="(max-width: 640px) 64vw, (max-width: 1024px) 33vw, 25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
