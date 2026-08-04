"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artistMenuOpen, setArtistMenuOpen] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setArtistMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Hover Reveal Area */}
      <div
        className="fixed left-0 right-0 top-0 z-[60] hidden h-6 lg:block"
        onMouseEnter={() => setShowNavbar(true)}
      />

      {/* Navbar */}
      <nav
        onMouseEnter={() => setShowNavbar(true)}
        onMouseLeave={() => {
          setShowNavbar(false);
          setArtistMenuOpen(false);
        }}
        className={`fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 bg-black transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <Link href="/" aria-label="Melted Mindz Records Home">
            <Image
              src="/logo/Melted.Mindz.Records-Logo.jpg"
              alt="Melted Mindz Records"
              width={220}
              height={70}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-sm font-medium text-white lg:flex">

            <Link
              className="transition hover:text-zinc-300"
              href="/"
            >
              Home
            </Link>

            <Link
              className="transition hover:text-zinc-300"
              href="/artists"
            >
              Artists
            </Link>

            <Link
              className="transition hover:text-zinc-300"
              href="/releases"
            >
              Releases
            </Link>

            <Link
              className="transition hover:text-zinc-300"
              href="/news"
            >
              News
            </Link>

            <Link
              className="transition hover:text-zinc-300"
              href="/about"
            >
              About
            </Link>

            <Link
              className="transition hover:text-zinc-300"
              href="/careers"
            >
              Careers
            </Link>

            <Link
              className="transition hover:text-zinc-300"
              href="/internships"
            >
              Internships
            </Link>

            <Link
              className="transition hover:text-zinc-300"
              href="/contact"
            >
              Contact
            </Link>

            {/* For Artists Dropdown */}
            <div className="relative">

              <button
                type="button"
                onClick={() => setArtistMenuOpen(!artistMenuOpen)}
                className="flex items-center gap-2 transition hover:text-zinc-300"
                aria-expanded={artistMenuOpen}
                aria-haspopup="menu"
              >
                For Artists

                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    artistMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {/* For Artists Dropdown */}
              {artistMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-4 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-[#050505] shadow-2xl"
                  role="menu"
                >
                  <a
                    href="https://artisttools.meltedmindzrecords.com"
                    className="block px-5 py-4 text-white transition hover:bg-white hover:text-black"
                    role="menuitem"
                  >
                    Artist Portal
                  </a>
                </div>
              )}

            </div>

            {/* Get Signed */}
            <a
              href="https://meltedmindzrecords.zite.so"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white px-5 py-2 transition hover:bg-white hover:text-black"
            >
              Get Signed
            </a>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-md p-2 text-white transition hover:bg-zinc-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-80 border-l border-zinc-800 bg-[#050505] text-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >

        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">

          <Image
            src="/logo/Melted.Mindz.Records-Logo.jpg"
            alt="Melted Mindz Records"
            width={160}
            height={50}
            className="h-10 w-auto object-contain"
          />

          <button
            onClick={closeMenu}
            className="rounded-md p-2 text-3xl text-white transition hover:bg-zinc-900"
            aria-label="Close navigation menu"
          >
            ×
          </button>

        </div>

        {/* Mobile Links */}
        <div className="flex flex-col gap-6 p-8 text-lg font-medium text-white">

          <Link
            href="/"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            Home
          </Link>

          <Link
            href="/artists"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            Artists
          </Link>

          <Link
            href="/releases"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            Releases
          </Link>

          <Link
            href="/news"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            News
          </Link>

          <Link
            href="/about"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            About
          </Link>

          <Link
            href="/careers"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            Careers
          </Link>

          <Link
            href="/internships"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            Internships
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            className="transition hover:text-zinc-300"
          >
            Contact
          </Link>

          {/* Mobile For Artists */}
          <div className="border-t border-zinc-800 pt-6">

            <button
              type="button"
              onClick={() => setArtistMenuOpen(!artistMenuOpen)}
              className="flex w-full items-center justify-between text-left transition hover:text-zinc-300"
              aria-expanded={artistMenuOpen}
            >
              <span>For Artists</span>

              <svg
                className={`h-5 w-5 transition-transform duration-200 ${
                  artistMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>

            {artistMenuOpen && (
              <div className="mt-4 border-l border-zinc-700 pl-5">

                <a
                  href="https://artisttools.meltedmindzrecords.com"
                  onClick={closeMenu}
                  className="block py-2 text-base text-zinc-300 transition hover:text-white"
                >
                  Artist Portal
                </a>

              </div>
            )}

          </div>

          {/* Get Signed */}
          <a
            href="https://meltedmindzrecords.zite.so"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-lg border border-white px-6 py-3 text-center transition hover:bg-white hover:text-black"
          >
            Get Signed
          </a>

        </div>

      </aside>

      {/* Navbar Spacer */}
      <div className="h-20" />

    </>
  );
}