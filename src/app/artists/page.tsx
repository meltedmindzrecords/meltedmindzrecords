import Image from "next/image";
import Link from "next/link";

export default function Artists() {
  const artists = [
    {
      name: "Yxng Dreezy",
      genre: "Melodic Rap / Hip-Hop",
      slug: "yxng-dreezy",
      image: "/artists/yxng-dreezy.jpg",
    },
    {
      name: "Lil Rappy",
      genre: "Melodic Rap / Hip-Hop",
      slug: "lil-rappy",
      image: "/artists/lil-rappy.jpg",
    },
    {
      name: "GutZombie",
      genre: "Alternative / Pop-Punk",
      slug: "gutzombie",
      image: "/artists/gutzombie.jpg",
    },
    {
      name: "Rachel Ann",
      genre: "Alternative / Pop-Punk",
      slug: "rachel-ann",
      image: "/artists/rachel-ann.jpg",
    },
    {
      name: "Okay Boomhauer",
      genre: "Rock / Alternative (Band)",
      slug: "okay-boomhauer",
      image: "/artists/okay-boomhauer.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">

      <h1 className="text-5xl font-bold">
        Artists
      </h1>

      <p className="mt-6 max-w-2xl text-zinc-400">
        Meet the artists of Melted Mindz Records.
        A diverse roster of creators pushing music forward.
      </p>


      <div className="mt-10 grid gap-6 md:grid-cols-3">

        {artists.map((artist) => (
          <div
            key={artist.slug}
            className="overflow-hidden rounded-xl border border-zinc-800 transition hover:border-white"
          >

            <div className="relative aspect-square">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>


            <div className="p-6">

              <h2 className="text-2xl font-bold">
                {artist.name}
              </h2>

              <p className="mt-3 text-zinc-400">
                {artist.genre}
              </p>


              <Link
                href={`/artists/${artist.slug}`}
                className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
              >
                View Artist
              </Link>

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}