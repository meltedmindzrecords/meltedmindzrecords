"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Hover Reveal Zone */}
      <div
        className="fixed left-0 right-0 top-0 z-[60] hidden h-5 lg:block"
        onMouseEnter={() => setShowNavbar(true)}
      />


      {/* Main Navbar */}
      <nav
        onMouseLeave={() => setShowNavbar(false)}
        className={`fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur-xl transition-transform duration-300 ${
          showNavbar
            ? "translate-y-0"
            : "-translate-y-full lg:block"
        }`}
      >

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">


          {/* Logo */}
          <Link href="/" className="flex items-center">
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
          <div className="hidden items-center gap-8 text-sm font-medium lg:flex">

            <Link
              href="/"
              className="transition hover:text-zinc-400"
            >
              Home
            </Link>


            <Link
              href="/artists"
              className="transition hover:text-zinc-400"
            >
              Artists
            </Link>


            <Link
              href="/releases"
              className="transition hover:text-zinc-400"
            >
              Releases
            </Link>


            <Link
              href="/news"
              className="transition hover:text-zinc-400"
            >
              News
            </Link>


            <Link
              href="/about"
              className="transition hover:text-zinc-400"
            >
              About
            </Link>


            <Link
              href="/careers"
              className="transition hover:text-zinc-400"
            >
              Careers
            </Link>


            <Link
              href="/internships"
              className="transition hover:text-zinc-400"
            >
              Internships
            </Link>


            <Link
              href="/contact"
              className="transition hover:text-zinc-400"
            >
              Contact
            </Link>


            <a
              href="https://meltedmindzrecords.zite.so"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white px-5 py-2 transition hover:bg-white hover:text-black"
            >
              Get Signed
            </a>

          </div>



          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden"
            aria-label="Open menu"
          >

            <svg
              className="h-8 w-8 text-white"
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
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />




      {/* Mobile Menu Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-80 border-l border-zinc-800 bg-zinc-950 transition-transform duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between border-b border-zinc-800 p-6">

          <Image
            src="/logo/Melted.Mindz.Records-Logo.jpg"
            alt="Melted Mindz Records"
            width={160}
            height={50}
            className="h-10 w-auto"
          />


          <button
            onClick={closeMenu}
            className="text-3xl text-white"
            aria-label="Close menu"
          >
            ×
          </button>

        </div>



        <div className="flex flex-col gap-6 p-8 text-lg font-medium">


          <Link href="/" onClick={closeMenu}>
            Home
          </Link>


          <Link href="/artists" onClick={closeMenu}>
            Artists
          </Link>


          <Link href="/releases" onClick={closeMenu}>
            Releases
          </Link>


          <Link href="/news" onClick={closeMenu}>
            News
          </Link>


          <Link href="/about" onClick={closeMenu}>
            About
          </Link>


          <Link href="/careers" onClick={closeMenu}>
            Careers
          </Link>


          <Link href="/internships" onClick={closeMenu}>
            Internships
          </Link>


          <Link href="/contact" onClick={closeMenu}>
            Contact
          </Link>


          <a
            href="https://meltedmindzrecords.zite.so"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 rounded-lg border border-white px-6 py-3 text-center transition hover:bg-white hover:text-black"
          >
            Get Signed
          </a>


        </div>

      </aside>


      {/* Mobile/Desktop spacing */}
      <div className="h-20" />

    </>
  );
}