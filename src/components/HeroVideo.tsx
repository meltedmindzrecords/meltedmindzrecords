"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed background video (muted, looped, no sound).
 * Starts only when the visitor allows motion; a Pause/Play button is always there (WCAG 2.2.2).
 * The poster frame shows until it plays, and stays when reduced motion is on.
 */
export default function HeroVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    v.play().catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <>
      <video
        ref={ref}
        className={className}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        className="caps absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-full border border-white/40 bg-black/50 px-3.5 py-2 text-[11px] text-white backdrop-blur transition hover:border-white hover:bg-black/80 sm:bottom-8 sm:right-10"
      >
        <span aria-hidden="true" className="inline-flex h-2.5 w-2.5 items-center justify-center">
          {playing ? (
            <span className="flex gap-[3px]">
              <span className="h-2.5 w-[3px] bg-white" />
              <span className="h-2.5 w-[3px] bg-white" />
            </span>
          ) : (
            <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
          )}
        </span>
        {playing ? "Pause video" : "Play video"}
      </button>
    </>
  );
}
