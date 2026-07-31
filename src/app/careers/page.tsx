import Link from "next/link";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">

      {/* Hero */}
      <section className="mx-auto max-w-5xl text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Careers at Melted Mindz Records
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          Join a growing independent record label focused on developing artists,
          building creative opportunities, and shaping the future of music.
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

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-8">

          <h3 className="text-xl font-semibold">
            No Current Open Positions
          </h3>

          <p className="mt-3 text-zinc-400">
            We are always interested in connecting with talented individuals.
            Future opportunities may include:
          </p>

          <ul className="mt-5 list-disc space-y-2 pl-5 text-zinc-300">
            <li>A&R Representatives</li>
            <li>Marketing & Social Media Coordinators</li>
            <li>Graphic Designers</li>
            <li>Video Editors</li>
            <li>Music Business Assistants</li>
            <li>Web Development & Technology Roles</li>
          </ul>

        </div>

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