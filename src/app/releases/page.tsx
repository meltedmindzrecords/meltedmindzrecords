import Image from "next/image";

const releaseLink = "https://too.fm/stillwithme";

const release = {
  title: "Still With Me",
  artist: "Lil Rappy",
  cover: "/release%20covers/Still-With-Me.jpg",
  type: "Single",
  releaseDate: "July 28, 2026",
  description:
    "Still With Me is a heartfelt release exploring perseverance, loyalty, and growth. Released through Melted Mindz Records, the song showcases emotional lyricism paired with cinematic production.",
};

export default function ReleasesPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative flex h-[55vh] items-center justify-center border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-black">

        <div className="px-6 text-center">

          <p className="mb-4 uppercase tracking-[0.4em] text-red-500">
            Melted Mindz Records
          </p>

          <h1 className="text-5xl font-extrabold sm:text-7xl">
            Releases
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Discover singles, albums, EPs, and music releases from
            Melted Mindz Records.
          </p>

        </div>

      </section>



      {/* FEATURED RELEASE */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <h2 className="mb-10 text-4xl font-bold">
          Featured Release
        </h2>


        <div className="grid gap-12 lg:grid-cols-2">


          {/* COVER */}

          <div className="relative aspect-square overflow-hidden rounded-3xl border border-zinc-800">

            <Image
              src={release.cover}
              alt={`${release.title} cover`}
              fill
              className="object-cover"
            />

          </div>



          {/* DETAILS */}

          <div className="flex flex-col justify-center">


            <span className="text-sm uppercase tracking-[0.3em] text-red-500">
              {release.type}
            </span>


            <h2 className="mt-4 text-5xl font-bold">
              {release.title}
            </h2>


            <p className="mt-2 text-2xl text-zinc-400">
              {release.artist}
            </p>


            <p className="mt-2 text-sm text-zinc-500">
              Released {release.releaseDate}
            </p>


            <p className="mt-8 leading-8 text-zinc-300">
              {release.description}
            </p>



            {/* STREAM BUTTONS */}

            <div className="mt-10 flex flex-wrap gap-4">


              <a
                href={releaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-500 px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                Spotify
              </a>



              <a
                href={releaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                Apple Music
              </a>



              <a
                href={releaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-red-600 px-6 py-3 font-semibold transition hover:scale-105"
              >
                YouTube
              </a>


            </div>




            {/* TOO.FM */}

            <a
              href={releaseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-fit rounded-full border border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-black"
            >
              View Release
            </a>


          </div>


        </div>


      </section>





      {/* RELEASE INFO */}

      <section className="bg-zinc-950 px-6 py-20">

        <div className="mx-auto max-w-7xl">


          <h2 className="text-4xl font-bold">
            About This Release
          </h2>


          <p className="mt-6 max-w-3xl leading-8 text-zinc-400">
            Melted Mindz Records presents "Still With Me" by Lil Rappy.
            The release delivers melodic storytelling, emotional depth,
            and a unique sound that represents the next generation of
            independent music.
          </p>


        </div>

      </section>





      {/* NEWSLETTER */}

      <section className="px-6 py-24 text-center">


        <h2 className="text-4xl font-bold">
          Stay Connected
        </h2>


        <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
          Follow Melted Mindz Records for new releases, artist announcements,
          merchandise drops, and exclusive content.
        </p>



        <div className="mt-10 flex flex-wrap justify-center gap-4">


          <a
            href={releaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Listen Now
          </a>



          <a
            href="#"
            className="rounded-full border border-white px-8 py-3 font-semibold"
          >
            Instagram
          </a>



          <a
            href="#"
            className="rounded-full border border-white px-8 py-3 font-semibold"
          >
            YouTube
          </a>


        </div>


      </section>


    </main>
  );
}