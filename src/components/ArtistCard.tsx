import Image from "next/image";
import Link from "next/link";

import type { Artist } from "@/lib/content";
import { isOptimizable } from "@/lib/content";

/** Atlantic-style roster tile: black-and-white portrait, name in big type. */
export default function ArtistCard({ artist, priority = false }: { artist: Artist; priority?: boolean }) {
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
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
        unoptimized={!isOptimizable(artist.image)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
        <h3 className="display text-[1.65rem] sm:text-4xl lg:text-5xl">{artist.name}</h3>
        {artist.genre && (
          <p className="mt-1.5 hidden text-[11px] uppercase tracking-[0.2em] text-white/60 sm:block">
            {artist.genre}
          </p>
        )}
      </div>
    </Link>
  );
}
