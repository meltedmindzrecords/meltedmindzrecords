import type { Metadata } from "next";

import ArtistCard from "@/components/ArtistCard";
import ArtistSelect from "@/components/ArtistSelect";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import { getArtists } from "@/lib/content";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Artists",
  description: "The Melted Mindz Records roster.",
};

export default async function ArtistsPage() {
  const artists = await getArtists();
  const sortedArtists = [...artists].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-28 sm:px-10 sm:pt-36">
      <header className="flex flex-col items-center text-center">
        <p className="rise caps text-[12px] text-molten sm:text-[13px]">The roster</p>
        <h1 className="display mt-3 overflow-hidden pb-[0.04em] text-[26vw] sm:text-[11rem]">
          <span className="rise block" style={{ ["--d" as string]: "100ms" }}>Artists</span>
        </h1>
        <div className="mt-8 flex w-full justify-center">
          <ArtistSelect artists={sortedArtists.map(({ slug, name }) => ({ slug, name }))} />
        </div>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {sortedArtists.map((artist, i) => (
          <Reveal key={artist.slug} delay={(i % 4) * 90}>
            <ArtistCard artist={artist} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </div>
    <Marquee items={sortedArtists.map((a) => a.name)} label="Our artists" tone="outline" speed={50} />
    </>
  );
}
