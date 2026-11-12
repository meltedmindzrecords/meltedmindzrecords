import Image from "next/image";

import type { Release } from "@/lib/content";
import { isOptimizable, listenLink } from "@/lib/content";

/** Release as an image card: cover first, then a few words under it. */
export default function ReleaseCard({
  release,
  sizes = "(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw",
  showArtist = true,
  priority = false,
}: {
  release: Release;
  sizes?: string;
  showArtist?: boolean;
  priority?: boolean;
}) {
  const href = listenLink(release);
  const inner = (
    <>
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <Image
          src={release.cover}
          alt={`${release.title} cover art`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-[1.06]"
          unoptimized={!isOptimizable(release.cover)}
        />
        {href && (
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-molten text-black opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-black" />
          </span>
        )}
      </div>
      <p className="caps mt-4 min-h-[2.8em] text-[11px] leading-[1.4] text-white/60 sm:min-h-0">
        {[release.type, release.releaseDate].filter(Boolean).join(" · ")}
      </p>
      <h3 className="display mt-2 line-clamp-2 break-words text-[1.6rem] leading-[1] transition group-hover:text-molten sm:text-[2.2rem]">{release.title}</h3>
      {showArtist && release.artist && (
        <p className="caps mt-1.5 truncate text-[13px] text-white/75">{release.artist}</p>
      )}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <div className="group">{inner}</div>
  );
}
