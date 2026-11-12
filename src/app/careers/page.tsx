import Link from "next/link";

import { getListings } from "@/lib/content";
import { getSettings } from "@/lib/settings";

// Openings are edited at /admin/careers; refresh at most once a minute.
export const revalidate = 60;

export default async function CareersPage() {
  const [s, openings] = await Promise.all([getSettings(), getListings("career")]);
  const roles = s.careers_future_roles.split("\n").map((r) => r.trim()).filter(Boolean);
  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-32 text-white">

      {/* Hero */}
      <section className="mx-auto max-w-5xl text-center">
        <h1 className="display text-6xl sm:text-8xl">
          Careers at Melted Mindz Records
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          {s.careers_intro}
        </p>
      </section>


      {/* Why Work With Us */}
      <section className="mx-auto mt-20 max-w-6xl">

        <h2 className="text-3xl font-bold">
          Why Work With Melted Mindz Records?
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-xl font-semibold">
              Creative Environment
            </h3>

            <p className="mt-3 text-zinc-400">
              Work alongside artists, producers, designers, marketers, and
              creative professionals building the next generation of music.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-xl font-semibold">
              Industry Experience
            </h3>

            <p className="mt-3 text-zinc-400">
              Gain hands-on experience in music business, marketing, A&R,
              publishing, and digital media.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-xl font-semibold">
              Grow With Us
            </h3>

            <p className="mt-3 text-zinc-400">
              Be part of an independent company committed to innovation and
              artist development.
            </p>
          </div>

        </div>
      </section>


      {/* Open Positions */}
      <section className="mx-auto mt-20 max-w-6xl">

        <h2 className="text-3xl font-bold">
          Current Opportunities
        </h2>

        {openings && openings.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {openings.map((o) => (
              <div key={o.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
                <h3 className="text-xl font-semibold">{o.title}</h3>
                {o.details && <p className="mt-2 text-sm text-zinc-400">{o.details}</p>}
                {o.description && <p className="mt-3 whitespace-pre-line text-zinc-400">{o.description}</p>}
                {o.applyUrl && (
                  <a
                    href={o.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block rounded-lg border border-white px-6 py-2.5 font-semibold transition hover:bg-white hover:text-black"
                  >
                    Apply<span className="sr-only">: {o.title}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-8">

          <h3 className="text-xl font-semibold">
            {s.careers_none_title}
          </h3>

          <p className="mt-3 text-zinc-400">
            {s.careers_none_text}
          </p>

          {roles.length > 0 && (
            <ul className="mt-5 list-disc space-y-2 pl-5 text-zinc-300">
              {roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}

        </div>
        )}

      </section>


      {/* CTA */}
      <section className="mx-auto mt-20 max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">

        <h2 className="text-3xl font-bold">
          Interested in Joining the Team?
        </h2>

        <p className="mt-4 text-zinc-400">
          Send your resume, portfolio, and a brief introduction about yourself.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-block rounded-lg border border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-black"
        >
          Contact Us
        </Link>

      </section>

    </main>
  );
}