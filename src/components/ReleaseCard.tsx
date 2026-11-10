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
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          unoptimized={!isOptimizable(release.cover)}
        />
      </div>
      <p className="caps mt-4 text-[11px] text-white/50">
        {[release.type, release.releaseDate].filter(Boolean).join(" · ")}
      </p>
      <h3 className="display mt-2 text-[2.1rem] sm:text-[2.5rem]">{release.title}</h3>
      {showArtist && release.artist && (
        <p className="caps mt-1.5 text-[13px] text-white/75">{release.artist}</p>
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
