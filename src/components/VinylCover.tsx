import Image from "next/image";

import type { Release } from "@/lib/content";
import { isOptimizable } from "@/lib/content";

/**
 * A release cover with a record peeking out from behind it.
 * The record slides further out (and spins) on hover of the parent `.group`.
 */
export default function VinylCover({
  release,
  sizes = "(max-width: 1024px) 80vw, 40vw",
  priority = false,
}: {
  release: Release;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative mr-[22%]">
      {/* The record */}
      <div
        aria-hidden="true"
        className="vinyl absolute inset-y-[6%] left-[10%] aspect-square rounded-full transition-transform duration-700 ease-out translate-x-[22%] group-hover:translate-x-[36%] group-focus-within:translate-x-[36%]"
      >
        <div className="spin absolute inset-0 rounded-full">
          <div className="absolute left-1/2 top-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-4 ring-black">
            <Image
              src={release.cover}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
              unoptimized={!isOptimizable(release.cover)}
            />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[3%] w-[3%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
        </div>
      </div>

      {/* The sleeve */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-out group-hover:-rotate-1 group-hover:scale-[1.02]">
        <Image
          src={release.cover}
          alt={`${release.title} cover art`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          unoptimized={!isOptimizable(release.cover)}
        />
      </div>
    </div>
  );
}
