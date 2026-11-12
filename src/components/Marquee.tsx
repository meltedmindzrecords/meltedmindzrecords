"use client";

import { useState } from "react";
import Tall from "@/components/Tall";

/**
 * A ticker band of real names (artists, release titles).
 * Moves only when motion is allowed; has a pause button (WCAG 2.2.2) and pauses on hover.
 * The second copy is hidden from screen readers.
 */
export default function Marquee({
  items,
  label,
  tone = "molten",
  reverse = false,
  speed = 40,
}: {
  items: string[];
  /** What the band is, for screen readers ("Artists and releases"). */
  label: string;
  tone?: "molten" | "outline";
  reverse?: boolean;
  /** Seconds per loop. */
  speed?: number;
}) {
  const [paused, setPaused] = useState(false);
  if (items.length === 0) return null;

  // Repeat short lists so one copy is always wider than the screen.
  const minItems = 8;
  const row: string[] = [];
  while (row.length < minItems) row.push(...items);

  const band =
    tone === "molten"
      ? "bg-molten text-black"
      : "border-y border-white/15 bg-black text-white";
  const sep = tone === "molten" ? "text-black/70" : "text-molten";
  const text = tone === "molten" ? "display" : "display text-outline";

  const copy = (hidden: boolean) => (
    <ul
      className={`flex shrink-0 items-center ${hidden ? "marquee-copy" : ""}`}
      aria-hidden={hidden || undefined}
    >
      {row.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className={`flex items-center ${i >= items.length ? "marquee-copy" : ""}`}
          aria-hidden={i >= items.length || undefined}
        >
          <span className={`${text} whitespace-nowrap px-5 text-[3.2rem] sm:px-8 sm:text-[4.6rem] lg:text-[5.6rem]`}>
            <Tall>{item}</Tall>
          </span>
          <span className={`${sep} text-[1.6rem] sm:text-[2.2rem]`} aria-hidden="true">
            ✺
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className={`relative ${band}`}>
      <div
        className="marquee py-4 sm:py-5"
        data-paused={paused}
        data-reverse={reverse}
        style={{ ["--speed" as string]: `${speed}s` }}
      >
        <div className="marquee-track">
          {copy(false)}
          {copy(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play scrolling names" : "Pause scrolling names"}
        className={`absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full opacity-60 transition hover:opacity-100 focus-visible:opacity-100 ${
          tone === "molten" ? "bg-black/70 text-white" : "bg-white/80 text-black"
        }`}
      >
        {paused ? (
          <span aria-hidden="true" className="ml-0.5 h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-current" />
        ) : (
          <span aria-hidden="true" className="flex gap-[2px]">
            <span className="h-2 w-[2.5px] bg-current" />
            <span className="h-2 w-[2.5px] bg-current" />
          </span>
        )}
      </button>
    </section>
  );
}
