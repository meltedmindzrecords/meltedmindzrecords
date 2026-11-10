"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ARTIST_TOOLS_URL, GET_SIGNED_URL, labelSocials } from "@/lib/site";
import { LinkIcon } from "@/components/Icons";

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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? "border-b border-white/10 bg-black/90 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Melted Mindz Records home" className="flex items-center gap-3">
            <Image
              src="/logo/Melted.Mindz.Records-Logo.jpg"
              alt="Melted Mindz Records"
              width={150}
              height={150}
              priority
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.3em] sm:block">
              Melted Mindz Records
            </span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {primary.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[12px] font-medium uppercase tracking-[0.22em] transition hover:text-white ${
                  isActive(l.href) ? "text-white" : "text-white/60"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={GET_SIGNED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
            >
              Get Signed
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`absolute h-[1.5px] w-6 bg-white transition duration-300 ${
                open ? "rotate-45" : "-translate-y-[5px]"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-6 bg-white transition duration-300 ${
                open ? "-rotate-45" : "translate-y-[5px]"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu: full screen, big type */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-black px-5 pb-10 pt-24 transition-opacity duration-300 sm:px-8 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1">
          {primary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              className={`display text-[3.4rem] leading-[1.05] transition ${
                isActive(l.href) ? "text-white" : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {secondary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              className="text-[12px] uppercase tracking-[0.22em] text-white/60 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={ARTIST_TOOLS_URL}
            tabIndex={open ? 0 : -1}
            className="text-[12px] uppercase tracking-[0.22em] text-white/60 hover:text-white"
          >
            For Artists
          </a>
        </div>

        <div className="mt-auto">
          <a
            href={GET_SIGNED_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="block bg-white py-4 text-center text-[13px] font-semibold uppercase tracking-[0.2em] text-black"
          >
            Get Signed
          </a>
          <div className="mt-6 flex gap-5">
            {labelSocials.map((s) => (
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
