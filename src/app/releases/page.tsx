import Image from "next/image";

import { getReleases, isOptimizable, pickFeatured } from "@/lib/content";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export default async function ReleasesPage() {
  const releases = await getReleases();
  const release = pickFeatured(releases);
  const otherReleases = releases.filter((r) => r !== release);
  const releaseLink = release.link ?? "#";

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
              unoptimized={!isOptimizable(release.cover)}
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
                href={release.spotifyUrl ?? releaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-500 px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                Spotify
              </a>



              <a
                href={release.appleMusicUrl ?? releaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                Apple Music
              </a>



              <a
                href={release.youtubeUrl ?? releaseLink}
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
            {release.about ||
              `Melted Mindz Records presents "${release.title}" by ${release.artist}.`}
          </p>


        </div>

      </section>





      {/* MORE RELEASES (only shows when there is more than one release) */}

      {otherReleases.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="mb-10 text-4xl font-bold">More Releases</h2>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {otherReleases.map((r) => {
              const href = r.link ?? r.spotifyUrl ?? r.appleMusicUrl ?? r.youtubeUrl;
              const card = (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-3xl border border-zinc-800">
                    <Image
                      src={r.cover}
                      alt={`${r.title} cover`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={!isOptimizable(r.cover)}
                    />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-red-500">
                    {r.type}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{r.title}</h3>
                  <p className="text-zinc-400">{r.artist}</p>
                  {r.releaseDate && (
                    <p className="mt-1 text-sm text-zinc-500">{r.releaseDate}</p>
                  )}
                </>
              );
              return href ? (
                <a
                  key={r.slug}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {card}
                </a>
              ) : (
                <div key={r.slug} className="group block">
                  {card}
                </div>
              );
            })}
          </div>
        </section>
      )}



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