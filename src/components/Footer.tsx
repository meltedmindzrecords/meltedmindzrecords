"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { LinkIcon } from "@/components/Icons";
import { ARTIST_TOOLS_URL, CONTACT_EMAIL, GET_SIGNED_URL, labelSocials } from "@/lib/site";

const explore = [
  { href: "/artists", label: "Artists" },
  { href: "/releases", label: "Releases" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

const company = [
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/internships", label: "Internships" },
];

const legal = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/dmca", label: "DMCA" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/do-not-sell", label: "Do Not Sell or Share My Personal Information" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, marketingConsent }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      setState("done");
      setEmail("");
      setMarketingConsent(false);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Newsletter */}
          <div className="lg:col-span-5">
            <p className="eyebrow text-white/50">Stay up to date</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl">Join the list</h2>

            {state === "done" ? (
              <p className="mt-6 max-w-md text-white/70">
                You&apos;re in. New releases and label news will land in your inbox.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 max-w-md">
                <div className="flex border-b border-white/40 focus-within:border-white">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-transparent py-3 text-base text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="shrink-0 py-3 pl-4 text-[12px] font-semibold uppercase tracking-[0.2em] disabled:opacity-50"
                  >
                    {state === "loading" ? "Joining…" : "Sign up"}
                  </button>
                </div>
                <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-white/50">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-white"
                  />
                  <span>
                    I want Melted Mindz Records to send me marketing messages about artists,
                    releases, events, and exclusive content. See our{" "}
                    <Link href="/privacy-policy" className="underline hover:text-white">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {state === "error" && <p className="mt-3 text-sm text-white">{error}</p>}
              </form>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow text-white/50">Explore</p>
              <ul className="mt-5 space-y-3">
                {explore.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/80 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-white/50">Company</p>
              <ul className="mt-5 space-y-3">
                {company.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/80 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={ARTIST_TOOLS_URL} className="text-sm text-white/80 hover:text-white">
                    For Artists
                  </a>
                </li>
                <li>
                  <a
                    href={GET_SIGNED_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 hover:text-white"
                  >
                    Get Signed
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow text-white/50">Follow</p>
              <div className="mt-5 flex gap-5">
                {labelSocials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-xl text-white/70 transition hover:text-white"
                  >
                    <LinkIcon label={s.label} />
                  </a>
                ))}
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-6 block break-all text-sm text-white/80 hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/Melted.Mindz.Records-Logo.jpg"
              alt=""
              width={150}
              height={150}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-xs text-white/50">
              © {new Date().getFullYear()} Melted Mindz Records. Birmingham, Alabama.
            </span>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-white/50 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
