import Image from "next/image";
import Link from "next/link";

type Artist = {
  name: string;
  slug: string;
  image: string;
};

const artists: Artist[] = [
  {
    name: "GutZombie",
    slug: "gutzombie",
    image: "/artists/gutzombie.jpg",
  },
  {
    name: "Lil Rappy",
    slug: "lil-rappy",
    image: "/artists/lil-rappy.jpg",
  },
  {
    name: "Okay Boomhauer",
    slug: "okay-boomhauer",
    image: "/artists/okay-boomhauer.jpg",
  },
  {
    name: "Rachel Ann",
    slug: "rachel-ann",
    image: "/artists/rachel-ann.jpg",
  },
  {
    name: "Yxng Dreezy",
    slug: "yxng-dreezy",
    image: "/artists/yxng-dreezy.jpg",
  },
];

export default function ArtistsPage() {
  const sortedArtists = [...artists].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className="min-h-screen bg-black text-white">

      {/* PAGE HEADER */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Melted Mindz Records
        </p>

        <h1 className="mt-4 text-6xl font-black uppercase tracking-tight md:text-8xl">
          Artists
        </h1>
      </section>

      {/* ARTIST GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sortedArtists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="group block"
            >
              {/* ARTIST CARD */}
              <div
                className="
                  relative
                  aspect-square
                  overflow-hidden
                  bg-zinc-900
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:-rotate-3
                "
              >
                {/* ARTIST IMAGE */}
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 768px) 33vw,
                    (max-width: 1024px) 25vw,
                    20vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* DARK OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/35
                    transition-opacity
                    duration-500
                    group-hover:bg-black/20
                  "
                />

                {/* CENTERED ARTIST NAME */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4">
                  <h2
                    className="
                      relative
                      text-center
                      text-lg
                      font-black
                      uppercase
                      tracking-tight
                      text-white
                      transition-all
                      duration-500
                      ease-out
                      group-hover:-translate-x-full
                      group-hover:opacity-0
                      sm:text-xl
                      md:text-2xl
                    "
                  >
                    {artist.name}

                    {/* SHIMMER */}
                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        -left-full
                        w-1/2
                        skew-x-[-20deg]
                        bg-gradient-to-r
                        from-transparent
                        via-white
                        to-transparent
                        opacity-0
                        transition-all
                        duration-700
                        group-hover:left-[150%]
                        group-hover:opacity-100
                      "
                    />
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}