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
    if (reduce) {
      v.pause();
      return;
    }
    const tryPlay = () => {
      v.muted = true;
      v.play().catch(() => setPlaying(false));
    };
    tryPlay();
    // Some phones (e.g. iPhone Low Power Mode) block autoplay until the first touch or scroll.
    const kick = () => {
      if (v.paused) tryPlay();
      window.removeEventListener("touchstart", kick);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("click", kick);
    };
    window.addEventListener("touchstart", kick, { passive: true });
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("click", kick);
    return () => {
      window.removeEventListener("touchstart", kick);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("click", kick);
    };
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
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
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
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute bottom-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 opacity-70 transition hover:opacity-100 focus-visible:opacity-100 sm:bottom-6 sm:right-6"
      >
        {playing ? (
          <span aria-hidden="true" className="flex gap-[3px]">
            <span className="h-2.5 w-[3px] bg-current" />
            <span className="h-2.5 w-[3px] bg-current" />
          </span>
        ) : (
          <span aria-hidden="true" className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
        )}
      </button>
    </>
  );
}
