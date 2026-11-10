import type { Metadata } from "next";

import ArtistCard from "@/components/ArtistCard";
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
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <p className="eyebrow text-white/50">Melted Mindz Records</p>
      <h1 className="display mt-4 text-[22vw] sm:text-[11rem]">Artists</h1>

      <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {sortedArtists.map((artist, i) => (
          <ArtistCard key={artist.slug} artist={artist} priority={i < 4} />
        ))}
      </div>

    </div>
  );
}
