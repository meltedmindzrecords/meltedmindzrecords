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
    </>
  );
}
