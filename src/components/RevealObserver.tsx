"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `is-in` to every `.reveal` element as it scrolls into view.
 * Runs again on every page change and when new content streams in.
 * CSS keeps everything visible when JS is off or reduced motion is on.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = (el: Element) => el.classList.add("is-in");

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const scan = () => document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
