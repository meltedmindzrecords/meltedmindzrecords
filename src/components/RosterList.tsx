import Image from "next/image";
import Link from "next/link";

import type { Artist } from "@/lib/content";
import { isOptimizable } from "@/lib/content";

/**
 * Atlantic-style roster: every artist name stacked in huge type, one per line.
 * A small photo sits at the end of each line.
 */
export default function RosterList({ artists }: { artists: Artist[] }) {
  return (
    <ul className="border-t border-white/15">
      {artists.map((artist) => (
        <li key={artist.slug} className="border-b border-white/15">
          <Link
            href={`/artists/${artist.slug}`}
            className="group relative flex items-center justify-between gap-4 py-4 sm:py-5"
          >
            <div className="min-w-0">
              <h3 className="display break-words text-[15vw] text-white/90 transition group-hover:text-white sm:text-[10vw] lg:text-[8.5rem]">
                {artist.name}
              </h3>
              {artist.genre && (
                <p className="caps mt-2 text-[11px] text-white/50 sm:text-[12px]">{artist.genre}</p>
              )}
            </div>

            <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-zinc-900 sm:h-28 sm:w-28 lg:h-40 lg:w-40">
              <Image
                src={artist.image}
                alt=""
                fill
                sizes="(max-width: 640px) 80px, 160px"
                className="object-cover object-[50%_25%] grayscale transition duration-500 group-hover:grayscale-0"
                unoptimized={!isOptimizable(artist.image)}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
