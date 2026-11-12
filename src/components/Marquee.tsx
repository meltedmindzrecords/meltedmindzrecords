"use client";

import { useState } from "react";

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
            {item}
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
    </section>
  );
}
