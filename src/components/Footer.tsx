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
  const [doneMessage, setDoneMessage] = useState("");

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
      setDoneMessage(typeof data.message === "string" && /already/i.test(data.message) ? data.message : "");
      setState("done");
      setEmail("");
      setMarketingConsent(false);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const linkRow = [...explore, ...company];

  return (
    <footer className="border-t border-white/15 bg-black text-white">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-5 py-16 text-center sm:px-10 lg:py-20">
        {/* Newsletter */}
        <h2 className="display text-[3.2rem] sm:text-[4.2rem]">Stay up to date</h2>

        {state === "done" ? (
          <p className="mt-6 max-w-md text-white/70">
            {doneMessage || "You’re in. New releases and label news will land in your inbox."}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 w-full max-w-lg">
            <div className="flex border border-white/50 focus-within:border-white">
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
                className="w-full min-w-0 bg-transparent px-4 py-3.5 text-base text-white outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="caps shrink-0 bg-white px-5 py-3.5 text-[13px] text-black transition hover:bg-zinc-200 disabled:opacity-50"
              >
                {state === "loading" ? "Joining…" : "Sign up"}
              </button>
            </div>
            <label className="mt-4 flex items-start gap-3 text-left text-xs leading-relaxed text-white/50">
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

        {/* Follow */}
        <div className="mt-12 flex gap-6">
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

        {/* Links */}
        <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {linkRow.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="caps text-[13px] text-white/75 hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={ARTIST_TOOLS_URL} className="caps text-[13px] text-white/75 hover:text-white">
              For Artists
            </a>
          </li>
          <li>
            <a
              href={GET_SIGNED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="caps text-[13px] text-white/75 hover:text-white"
            >
              Get Signed
            </a>
          </li>
        </ul>

        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 text-sm text-white/60 hover:text-white">
          {CONTACT_EMAIL}
        </a>

        <div className="mt-14 flex w-full flex-col items-center gap-5 border-t border-white/15 pt-8">
          <Image
            src="/logo/Melted.Mindz.Records-Logo.jpg"
            alt="Melted Mindz Records"
            width={150}
            height={150}
            className="h-12 w-12 rounded-full object-cover"
          />
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-white/50 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Melted Mindz Records. Birmingham, Alabama.
          </p>
        </div>
      </div>
    </footer>
  );
}
