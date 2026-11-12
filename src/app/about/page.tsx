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
      {/* INTRO: centered, big type, room to breathe */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 text-center sm:px-10 sm:pt-36 lg:pb-28">
        <p className="caps text-[13px] text-white/60">About</p>
        <h1 className="display mx-auto mt-5 max-w-6xl text-[19vw] sm:text-[9rem] lg:text-[11rem]">
          Melted Mindz Records
        </h1>
        <p className="mx-auto mt-10 max-w-3xl text-[22px] font-medium leading-[1.45] text-white/90 sm:text-3xl">
          Melted Mindz Records is an independent record label dedicated to developing artists,
          creating opportunities, and pushing creative boundaries across multiple genres.
        </p>
      </section>

      {/* FACTS */}
      <section className="border-y border-white/15">
        <dl className="mx-auto grid max-w-[1600px] text-center sm:grid-cols-3">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={`px-5 py-10 sm:px-10 sm:py-14 ${i > 0 ? "border-t border-white/15 sm:border-l sm:border-t-0" : ""}`}
            >
              <dt className="caps text-[12px] text-white/50">{f.label}</dt>
              <dd className="display mt-4 text-[2.4rem] sm:text-[2.8rem]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* STORY + MISSION */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-10 lg:py-28">
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
              <p className="caps text-[13px] text-white/60">Mission</p>
              <p className="mt-4 text-xl leading-snug">
                To amplify unique voices, develop meaningful artists, and create a global
                community built around music and creativity.
              </p>
            </div>
            <div>
              <p className="caps text-[13px] text-white/60">Vision</p>
              <p className="mt-4 text-xl leading-snug">
                To become a leading independent entertainment company known for artist-first
                development and innovative approaches to the music industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      {team.length > 0 && (
        <section className="border-t border-white/15">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-10 lg:py-28">
            <h2 className="display text-center text-[3.6rem] sm:text-[5.5rem]">Leadership</h2>
            <ul className="mx-auto mt-12 grid max-w-5xl gap-12 sm:grid-cols-2 sm:gap-8">
              {team.map((m) => (
                <li key={m.name} className="text-center">
                  <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-zinc-900 sm:h-40 sm:w-40">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                        unoptimized={!isOptimizable(m.image)}
                      />
                    ) : (
                      <span className="display absolute inset-0 flex items-center justify-center text-5xl text-white/50">
                        {initials(m.name)}
                      </span>
                    )}
                  </div>
                  <h3 className="display mt-6 text-[2.6rem]">{m.name}</h3>
                  {m.title && <p className="caps mt-2 text-[12px] leading-relaxed text-white/60">{m.title}</p>}
                  {m.bio && <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-white/60">{m.bio}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-white/15">
        <div className="mx-auto max-w-[1600px] px-5 py-20 text-center sm:px-10 lg:py-28">
          <p className="display mx-auto max-w-4xl text-[3.4rem] sm:text-[5.5rem]">
            Making music? We want to hear it.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={GET_SIGNED_URL} target="_blank" rel="noopener noreferrer" className="caps inline-block bg-white px-8 py-4 text-[14px] text-black transition hover:bg-zinc-200">
              Get signed
            </a>
            <Link href="/contact" className="caps inline-block border border-white px-8 py-4 text-[14px] text-white transition hover:bg-white hover:text-black">
              Contact
            </Link>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-8 inline-block text-sm text-white/50 hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </>
  );
}
