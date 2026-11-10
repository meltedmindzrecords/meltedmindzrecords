import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getTeam, initials, isOptimizable } from "@/lib/content";
import { CONTACT_EMAIL, GET_SIGNED_URL } from "@/lib/site";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description:
    "Melted Mindz Records is an independent distribution label from Birmingham, Alabama, founded in 2024. Artists keep their rights.",
};

const facts = [
  { label: "Founded", value: "2024" },
  { label: "Based in", value: "Birmingham, Alabama" },
  { label: "Model", value: "Independent distribution. Artists keep their rights." },
];

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      {/* INTRO */}
      <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:pb-28">
        <p className="eyebrow text-white/50">About</p>
        <h1 className="display mt-4 text-[17vw] sm:text-[9rem]">Melted Mindz Records</h1>
        <p className="mt-10 max-w-4xl text-2xl font-medium leading-[1.35] tracking-tight text-white/90 sm:text-4xl">
          Melted Mindz Records is an independent record label dedicated to developing artists,
          creating opportunities, and pushing creative boundaries across multiple genres.
        </p>
      </section>

      {/* FACTS */}
      <section className="border-y border-white/10">
        <dl className="mx-auto grid max-w-[1440px] sm:grid-cols-3">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={`px-5 py-8 sm:px-8 sm:py-12 ${i > 0 ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}
            >
              <dt className="eyebrow text-white/50">{f.label}</dt>
              <dd className="mt-3 text-lg font-medium leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* STORY + MISSION */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 text-[17px] leading-8 text-white/70 lg:col-span-6">
            <p>
              Founded with a vision to support the next generation of musicians, Melted Mindz
              Records focuses on artist development, music releases, branding, creative
              direction, and long-term careers.
            </p>
            <p>
              From emerging talent to established creators, the label works to provide the
              resources, support, and platform artists need to bring their vision to the world.
            </p>
          </div>
          <div className="space-y-12 lg:col-span-5 lg:col-start-8">
            <div>
              <p className="eyebrow text-white/50">Mission</p>
              <p className="mt-4 text-xl leading-snug">
                To amplify unique voices, develop meaningful artists, and create a global
                community built around music and creativity.
              </p>
            </div>
            <div>
              <p className="eyebrow text-white/50">Vision</p>
              <p className="mt-4 text-xl leading-snug">
                To become a leading independent entertainment company known for artist-first
                development and innovative approaches to the music industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM (Columbia: short, clean) */}
      {team.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
            <h2 className="display text-6xl sm:text-8xl">Leadership</h2>
            <ul className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2">
              {team.map((m) => (
                <li key={m.name} className="flex gap-5 bg-black py-8 sm:p-8">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-900 sm:h-24 sm:w-24">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="96px"
                        className="object-cover grayscale"
                        unoptimized={!isOptimizable(m.image)}
                      />
                    ) : (
                      <span className="display absolute inset-0 flex items-center justify-center text-3xl text-white/50">
                        {initials(m.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{m.name}</h3>
                    {m.title && (
                      <p className="mt-1 text-[11px] uppercase leading-relaxed tracking-[0.2em] text-white/60">
                        {m.title}
                      </p>
                    )}
                    {m.bio && <p className="mt-4 text-[15px] leading-7 text-white/60">{m.bio}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
          <p className="max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
            Making music? We want to hear it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={GET_SIGNED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-zinc-200"
            >
              Get signed
            </a>
            <Link
              href="/contact"
              className="border border-white/50 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] transition hover:border-white hover:bg-white hover:text-black"
            >
              Contact
            </Link>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-8 block text-sm text-white/50 hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </>
  );
}
