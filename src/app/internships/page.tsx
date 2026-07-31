import Link from "next/link";

export default function InternshipsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">

      {/* Hero */}
      <section className="mx-auto max-w-5xl text-center">

        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Internships & Externships
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          Gain real-world experience in the music industry while working with
          an independent record label.
        </p>

      </section>


      {/* Programs */}
      <section className="mx-auto mt-20 max-w-6xl">

        <h2 className="text-3xl font-bold">
          Available Programs
        </h2>


        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h3 className="text-xl font-semibold">
              Music Business Internship
            </h3>

            <p className="mt-3 text-zinc-400">
              Learn about artist relations, releases, distribution,
              publishing, contracts, and record label operations.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h3 className="text-xl font-semibold">
              Marketing & Social Media Internship
            </h3>

            <p className="mt-3 text-zinc-400">
              Assist with campaigns, content creation, branding, social media
              strategy, and digital marketing.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h3 className="text-xl font-semibold">
              Graphic Design Internship
            </h3>

            <p className="mt-3 text-zinc-400">
              Create artwork, promotional materials, merchandise designs,
              and visual branding for artists and projects.
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h3 className="text-xl font-semibold">
              Technology & Web Internship
            </h3>

            <p className="mt-3 text-zinc-400">
              Help develop websites, digital platforms, artist tools, and
              technology solutions for the company.
            </p>
          </div>

        </div>

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
}git