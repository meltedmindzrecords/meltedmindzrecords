import Link from "next/link";

import { getListings, type Listing } from "@/lib/content";
import { getSettings } from "@/lib/settings";

// Programs are edited at /admin/internships; refresh at most once a minute.
export const revalidate = 60;

// The programs as first written into this page (shown if the database can't be read).
const builtInPrograms: Listing[] = [
  { id: 1, title: "Music Business Internship", description: "Learn about artist relations, releases, distribution, publishing, contracts, and record label operations.", details: "", applyUrl: null },
  { id: 2, title: "Marketing & Social Media Internship", description: "Assist with campaigns, content creation, branding, social media strategy, and digital marketing.", details: "", applyUrl: null },
  { id: 3, title: "Graphic Design Internship", description: "Create artwork, promotional materials, merchandise designs, and visual branding for artists and projects.", details: "", applyUrl: null },
  { id: 4, title: "Technology & Web Internship", description: "Help develop websites, digital platforms, artist tools, and technology solutions for the company.", details: "", applyUrl: null },
];

export default async function InternshipsPage() {
  const [s, listed] = await Promise.all([getSettings(), getListings("internship")]);
  const programs = listed ?? builtInPrograms;
  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-32 text-white">

      {/* Hero */}
      <section className="mx-auto max-w-5xl text-center">

        <h1 className="display text-6xl sm:text-8xl">
          Internships & Externships
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          {s.internships_intro}
        </p>

      </section>


      {/* Programs */}
      <section className="mx-auto mt-20 max-w-6xl">

        <h2 className="text-3xl font-bold">
          Available Programs
        </h2>


        {programs.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {programs.map((p) => (
              <div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
                <h3 className="text-xl font-semibold">
                  {p.title}
                </h3>
                {p.details && <p className="mt-2 text-sm text-zinc-400">{p.details}</p>}
                {p.description && (
                  <p className="mt-3 whitespace-pre-line text-zinc-400">
                    {p.description}
                  </p>
                )}
                {p.applyUrl && (
                  <a
                    href={p.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block rounded-lg border border-white px-6 py-2.5 font-semibold transition hover:bg-white hover:text-black"
                  >
                    Apply<span className="sr-only">: {p.title}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-400">
            No programs are open right now. Check back soon.
          </p>
        )}

      </section>


      {/* What You'll Learn */}
      <section className="mx-auto mt-20 max-w-6xl">

        <h2 className="text-3xl font-bold">
          What You Will Gain
        </h2>

        <ul className="mt-8 space-y-3 text-zinc-300">
          <li>• Experience working with an independent record label</li>
          <li>• Understanding of music industry operations</li>
          <li>• Portfolio-building opportunities</li>
          <li>• Professional networking experience</li>
          <li>• Real-world creative projects</li>
        </ul>

      </section>


      {/* Application CTA */}
      <section className="mx-auto mt-20 max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">

        <h2 className="text-3xl font-bold">
          Apply Today
        </h2>

        <p className="mt-4 text-zinc-400">
          Submit your application, resume, portfolio, and area of interest to
          be considered for a Melted Mindz Records Internship or Externship
          opportunity.
        </p>


        <Link
          href="/internships/apply"
          className="mt-8 inline-block rounded-lg border border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-black"
        >
          Apply Now
        </Link>

      </section>


    </main>
  );
}