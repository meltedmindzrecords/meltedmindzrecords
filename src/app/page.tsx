import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const artists = [
    {
      name: "Yxng Dreezy",
      genre: "Melodic Rap / Hip-Hop",
      image: "/artists/yxng-dreezy.jpg",
      slug: "yxng-dreezy",
    },
    {
      name: "Lil Rappy",
      genre: "Melodic Rap / Hip-Hop",
      image: "/artists/lil-rappy.jpg",
      slug: "lil-rappy",
    },
    {
      name: "GutZombie",
      genre: "Alternative / Pop-Punk",
      image: "/artists/gutzombie.jpg",
      slug: "gutzombie",
    },
    {
      name: "Rachel Ann",
      genre: "Alternative / Pop-Punk",
      image: "/artists/rachel-ann.jpg",
      slug: "rachel-ann",
    },
    {
      name: "Okay Boomhauer",
      genre: "Rock / Alternative (Band)",
      image: "/artists/okay-boomhauer.jpg",
      slug: "okay-boomhauer",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO VIDEO SECTION */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>


        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />


        {/* Hero Content */}
        <div className="relative z-10 px-6">

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Melted Mindz Records
          </h1>

          <h2 className="mt-8 text-4xl font-bold sm:text-6xl">
            Innovate.
            <br />
            Inspire.
            <br />
            Amplify.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-300">
            Building the next generation of artists
            through creativity, collaboration, and culture.
          </p>


          <div className="mt-10 flex justify-center gap-4">

            <Link
              href="/artists"
              className="rounded-full bg-white px-8 py-3 font-semibold text-black hover:bg-zinc-200"
            >
              Explore Artists
            </Link>


            <button
              className="rounded-full border border-white px-8 py-3 font-semibold text-white hover:bg-white hover:text-black"
            >
              Listen Now
            </button>

          </div>

        </div>

      </section>



      {/* FEATURED ARTISTS */}
      <section className="px-6 py-20">

        <h2 className="text-4xl font-bold">
          Featured Artists
        </h2>

        <p className="mt-4 text-zinc-400">
          Meet the artists shaping the future of Melted Mindz Records.
        </p>


        <div className="mt-10 grid gap-8 md:grid-cols-3">

          {artists.map((artist) => (

            <div
              key={artist.slug}
              className="overflow-hidden rounded-2xl border border-zinc-800"
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

                <h3 className="text-2xl font-bold">
                  {artist.name}
                </h3>


                <p className="mt-2 text-zinc-400">
                  {artist.genre}
                </p>


                <Link
                  href={`/artists/${artist.slug}`}
                  className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
                >
                  View Artist
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>



      {/* LATEST RELEASES */}
      <section className="bg-zinc-950 px-6 py-20">

        <h2 className="text-4xl font-bold">
          Latest Releases
        </h2>

        <p className="mt-4 text-zinc-400">
          New music, videos, and projects from the Melted Mindz roster.
        </p>


        <div className="mt-8 rounded-xl border border-zinc-800 p-8">

          <p className="text-zinc-400">
            Releases coming soon.
          </p>

        </div>

      </section>



      {/* ABOUT */}
      <section className="px-6 py-20">

        <h2 className="text-4xl font-bold">
          About Melted Mindz Records
        </h2>


        <p className="mt-6 max-w-3xl text-zinc-400">
          Melted Mindz Records is an independent record label focused on
          developing unique artists, creating original music, and building
          a community around creativity and culture.
        </p>

      </section>



      {/* GET SIGNED */}
      <section className="px-6 py-20 text-center">

        <h2 className="text-4xl font-bold">
          Ready To Make Your Mark?
        </h2>


        <p className="mt-4 text-zinc-400">
          Learn more about opportunities with Melted Mindz Records.
        </p>


        <Link
          href="/how-to-get-signed"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Get Signed
        </Link>

      </section>


    </main>
  );
}