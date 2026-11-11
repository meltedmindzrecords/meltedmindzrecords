import Image from "next/image";
import Link from "next/link";

import type { Artist } from "@/lib/content";
import { isOptimizable } from "@/lib/content";

/** Atlantic-style roster tile: a big photo with the name set over it. */
export default function ArtistCard({
  artist,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  compact = false,
}: {
  artist: Artist;
  priority?: boolean;
  sizes?: string;
  /** Smaller name, for rows of small tiles. */
  compact?: boolean;
}) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group relative block aspect-square overflow-hidden bg-zinc-900"
    >
      <Image
        src={artist.image}
        alt={artist.name}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-[50%_25%] grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
        unoptimized={!isOptimizable(artist.image)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <h3
          className={`display ${
            compact ? "text-[2rem] sm:text-[2.6rem]" : "text-[3.4rem] sm:text-[3.6rem] lg:text-[4.2rem]"
          }`}
        >
          {artist.name}
        </h3>
        {artist.genre && !compact && (
          <p className="caps mt-2 text-[11px] text-white/70">{artist.genre}</p>
        )}
      </div>
    </Link>
  );
}
