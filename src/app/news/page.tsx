import Link from "next/link";

const pressReleases = [
  {
    title:
      "The Next Chapter of Melted Mindz Records: Welcoming Lil Rappy",
    date: "Mar 29, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records announces the next chapter of the label with the welcoming of Lil Rappy, highlighting the artist's journey and the continued growth of the Melted Mindz Records roster.",
    link:
      "https://meltedmindzrecords.substack.com/p/the-next-chapter-of-melted-mindz",
  },

  {
    title: "The Sonic Architect: Welcoming Lucius",
    date: "Mar 29, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records welcomes Lucius and introduces a new creative force to the label family.",
    link:
      "https://meltedmindzrecords.substack.com/p/the-sonic-architect-welcoming-lucius",
  },

  {
    title: "The Pulse of the Streets: Welcoming Yxng Dreezy",
    date: "Mar 29, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records welcomes Yxng Dreezy and introduces his sound, vision, and creative journey as part of the next generation of artists.",
    link:
      "https://meltedmindzrecords.substack.com/p/the-pulse-of-the-streets-welcoming",
  },

  {
    title: "From The Swamp To The World: Okay Boomhauer",
    date: "Jul 8, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records highlights Okay Boomhauer and the creative vision behind the artist.",
    link:
      "https://open.substack.com/pub/meltedmindzrecords/p/from-the-swamp-to-the-world-okay",
  },

  {
    title: "In The Grip Of The Undead: GutZombie",
    date: "Jul 8, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records showcases GutZombie and their unique artistic identity.",
    link:
      "https://open.substack.com/pub/meltedmindzrecords/p/in-the-grip-of-the-undead-gutzombie",
  },
];


export default function NewsPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-zinc-900 to-black px-6">

        <div className="text-center">

          <p className="uppercase tracking-[0.5em] text-red-500">
            Melted Mindz Records
          </p>

          <h1 className="mt-6 text-6xl font-black sm:text-8xl">
            News
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Official press releases, label announcements, artist updates,
            and stories from Melted Mindz Records.
          </p>

        </div>

      </section>





      {/* FEATURED PRESS RELEASE */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-5xl font-black">
          Featured Press Release
        </h2>


        <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-950 p-10">


          <p className="uppercase tracking-widest text-red-500">
            {pressReleases[0].category}
          </p>


          <h3 className="mt-5 text-4xl font-bold">
            {pressReleases[0].title}
          </h3>


          <p className="mt-4 text-zinc-500">
            {pressReleases[0].date}
          </p>


          <p className="mt-6 max-w-3xl leading-8 text-zinc-400">
            {pressReleases[0].description}
          </p>


          <a
            href={pressReleases[0].link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-8
              inline-flex
              rounded-full
              bg-red-600
              px-8
              py-3
              font-bold
              hover:bg-red-500
            "
          >
            Read Press Release
          </a>


        </div>


      </section>





      {/* PRESS ARCHIVE */}

      <section className="bg-zinc-950 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <h2 className="text-5xl font-black">
            Press Archive
          </h2>


          <p className="mt-4 text-zinc-400">
            Explore official Melted Mindz Records announcements and press releases.
          </p>


          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">


            {pressReleases.map((release) => (

              <article
                key={release.title}
                className="
                  rounded-3xl
                  border
                  border-zinc-800
                  bg-black
                  p-8
                  transition
                  hover:border-red-600
                "
              >

                <p className="text-sm uppercase tracking-widest text-red-500">
                  {release.category}
                </p>


                <h3 className="mt-4 text-2xl font-bold">
                  {release.title}
                </h3>


                <p className="mt-3 text-sm text-zinc-500">
                  {release.date}
                </p>


                <p className="mt-5 leading-7 text-zinc-400">
                  {release.description}
                </p>


                <a
                  href={release.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-6
                    inline-block
                    rounded-full
                    border
                    border-white
                    px-6
                    py-2
                    font-semibold
                    hover:bg-white
                    hover:text-black
                  "
                >
                  Read Release →
                </a>


              </article>

            ))}


          </div>

        </div>

      </section>





      {/* SUBSCRIBE */}

      <section className="px-6 py-24 text-center">

        <h2 className="text-5xl font-black">
          Stay Connected
        </h2>


        <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
          Subscribe to Melted Mindz Records for official announcements,
          artist news, and exclusive updates.
        </p>


        <a
          href="https://meltedmindzrecords.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-10
            inline-block
            rounded-full
            bg-red-600
            px-10
            py-4
            font-bold
            hover:bg-red-500
          "
        >
          Subscribe To Press
        </a>


      </section>


    </main>
  );
}