import type { Metadata } from "next";

import ArtistCard from "@/components/ArtistCard";
import ArtistSelect from "@/components/ArtistSelect";
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
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-28 sm:px-10 sm:pt-36">
      <header className="flex flex-col items-center text-center">
        <h1 className="display text-[26vw] sm:text-[11rem]">Artists</h1>
        <div className="mt-8 flex w-full justify-center">
          <ArtistSelect artists={sortedArtists.map(({ slug, name }) => ({ slug, name }))} />
        </div>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {sortedArtists.map((artist, i) => (
          <ArtistCard key={artist.slug} artist={artist} priority={i < 2} />
        ))}
      </div>
    </div>
  );
}
