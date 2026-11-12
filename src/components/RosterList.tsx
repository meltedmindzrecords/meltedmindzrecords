import Image from "next/image";
import Link from "next/link";

import type { Artist } from "@/lib/content";
import { isOptimizable } from "@/lib/content";
import Tall from "@/components/Tall";

/**
 * Atlantic-style roster: every artist name stacked in huge type, one per line.
 * A small photo sits at the end of each line.
 */
export default function RosterList({ artists }: { artists: Artist[] }) {
  return (
    <ul className="border-t border-white/15">
      {artists.map((artist, i) => (
        <li key={artist.slug} className="reveal border-b border-white/15" style={{ ["--d" as string]: `${(i % 6) * 70}ms` }}>
          <Link
            href={`/artists/${artist.slug}`}
            className="group relative flex items-center justify-between gap-4 py-4 sm:py-5"
          >
            {/* Molten wash that slides in behind the row on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-molten/20 to-transparent transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
            <div className="relative min-w-0">
              <p className="caps mb-1 text-[11px] text-white/50 transition group-hover:text-molten" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display break-words text-[15vw] text-white/90 transition duration-300 group-hover:translate-x-2 group-hover:text-molten sm:text-[10vw] lg:text-[8.5rem]">
                <Tall>{artist.name}</Tall>
              </h3>
              {artist.genre && (
                <p className="caps mt-2 text-[11px] text-white/60 sm:text-[12px]">{artist.genre}</p>
              )}
            </div>

            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-900 transition duration-500 group-hover:rotate-6 group-hover:rounded-none sm:h-28 sm:w-28 lg:h-40 lg:w-40">
              <Image
                src={artist.image}
                alt=""
                fill
                sizes="(max-width: 640px) 80px, 160px"
                className="object-cover object-[50%_25%] transition duration-500 group-hover:scale-110"
                unoptimized={!isOptimizable(artist.image)}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
