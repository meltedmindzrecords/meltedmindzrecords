"use client";

import type { MouseEvent } from "react";

import { letterId } from "@/lib/letters";

/**
 * A–Z jump bar for the artists page. Each letter links to its group
 * (#letter-X); letters with no artists are shown greyed out and are not
 * links. Smooth scrolling unless the visitor prefers reduced motion.
 */
export default function AlphabetBar({
  letters,
  active,
}: {
  /** Every letter shown, in order (A–Z then "#"). */
  letters: string[];
  /** Letters that have at least one artist. */
  active: string[];
}) {
  const on = new Set(active);

  function jump(e: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav aria-label="Artists A to Z" className="w-full max-w-[1200px]">
      <ul className="grid grid-cols-9 gap-1 sm:flex sm:flex-wrap sm:justify-center">
        {letters.map((letter) => {
          const id = letterId(letter);
          const label = letter === "#" ? "Artists starting with a number" : `Artists starting with ${letter}`;
          return (
            <li key={letter}>
              {on.has(letter) ? (
                <a
                  href={`#${id}`}
                  onClick={(e) => jump(e, id)}
                  aria-label={label}
                  className="caps flex h-11 w-full items-center justify-center border border-white/40 text-[15px] text-white transition hover:border-molten hover:bg-molten hover:text-black focus-visible:border-molten focus-visible:bg-molten focus-visible:text-black sm:w-11"
                >
                  {letter}
                </a>
              ) : (
                <a
                  role="link"
                  aria-disabled="true"
                  aria-label={`${label} (none)`}
                  className="caps flex h-11 w-full cursor-default select-none items-center justify-center border border-white/10 text-[15px] text-white/25 sm:w-11"
                >
                  {letter}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
