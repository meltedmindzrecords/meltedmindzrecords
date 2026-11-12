"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ARTIST_TOOLS_URL, GET_SIGNED_URL, labelSocials } from "@/lib/site";
import type { SiteChrome } from "@/lib/settingsSchema";
import { LinkIcon } from "@/components/Icons";

// Shown in the bar on desktop (Atlantic keeps the bar to a few words).
const bar = [
  { href: "/artists", label: "Artists" },
  { href: "/releases", label: "Releases" },
  { href: "/about", label: "About" },
];

// Everything, in the full-screen menu.
const primary = [
  { href: "/artists", label: "Artists" },
  { href: "/releases", label: "Releases" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const secondary = [
  { href: "/careers", label: "Careers" },
  { href: "/internships", label: "Internships" },
];

export default function Navbar({ chrome }: { chrome?: SiteChrome }) {
  const socials = chrome?.socials ?? labelSocials;
  const demoUrl = chrome?.demoUrl ?? GET_SIGNED_URL;
  const toolsUrl = chrome?.artistToolsUrl ?? ARTIST_TOOLS_URL;
  const pathname = usePathname();
  // The menu remembers the page it was opened on, so it closes itself on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const solid = scrolled || open;

  // The website editor (/admin) has its own header.
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? "bg-black" : "bg-gradient-to-b from-black/60 to-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-10">
          <Link href="/" aria-label="Melted Mindz Records home" className="flex items-center gap-3">
            <Image
              src="/logo/Melted.Mindz.Records-Logo.jpg"
              alt="Melted Mindz Records"
              width={150}
              height={150}
              priority
              className="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11"
            />
            <span className="caps hidden text-[13px] tracking-[0.18em] sm:block">Melted Mindz Records</span>
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-8 lg:flex">
              {bar.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`caps text-[14px] transition hover:text-white ${
                    isActive(l.href) ? "text-white" : "text-white/70"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setOpenOn(open ? null : pathname)}
              className="relative -mr-2 flex h-11 w-11 items-center justify-center"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span
                className={`absolute h-[2px] w-7 bg-white transition duration-300 ${
                  open ? "rotate-45" : "-translate-y-[7px]"
                }`}
              />
              <span className={`absolute h-[2px] w-7 bg-white transition duration-300 ${open ? "opacity-0" : ""}`} />
              <span
                className={`absolute h-[2px] w-7 bg-white transition duration-300 ${
                  open ? "-rotate-45" : "translate-y-[7px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu: centered, huge stacked type */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center overflow-y-auto bg-black px-5 pb-10 pt-24 text-center transition-opacity duration-300 sm:px-10 sm:pt-32 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col items-center gap-1 sm:gap-2">
          {primary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              className={`display text-[4.2rem] leading-[1] transition sm:text-[6.5rem] ${
                isActive(l.href) ? "text-white" : "text-white hover:text-white/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {secondary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              className="caps text-[13px] text-white/60 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={toolsUrl}
            tabIndex={open ? 0 : -1}
            className="caps text-[13px] text-white/60 hover:text-white"
          >
            For Artists
          </a>
        </div>

        <div className="mt-auto flex w-full max-w-sm flex-col items-center pt-12">
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="caps block w-full bg-white py-4 text-center text-[14px] text-black"
          >
            Get Signed
          </a>
          <div className="mt-7 flex gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                tabIndex={open ? 0 : -1}
                className="text-xl text-white/70 hover:text-white"
              >
                <LinkIcon label={s.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
