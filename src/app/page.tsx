import Image from "next/image";
import Link from "next/link";

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
    genre: "Rock / Alternative",
    image: "/artists/okay-boomhauer.jpg",
    slug: "okay-boomhauer",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 px-6 text-center">

          <p className="uppercase tracking-[0.5em] text-red-500">
            Independent Record Label
          </p>

          <h1 className="mt-6 text-6xl font-black sm:text-8xl">
            Melted Mindz Records
          </h1>

          <h2 className="mt-8 text-4xl font-bold sm:text-6xl">
            Innovate.
            <br />
            Inspire.
            <br />
            Amplify.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-red-100/80">
            Building the next generation of artists through creativity,
            collaboration, and culture.
          </p>


          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <Link
              href="/artists"
              className="rounded-full bg-red-600 px-8 py-4 font-bold hover:bg-red-500"
            >
              Explore Artists
            </Link>


            <Link
              href="/releases"
              className="rounded-full border border-red-600 px-8 py-4 font-bold hover:bg-red-600"
            >
              Listen Now
            </Link>

          </div>

        </div>

      </section>



      {/* FEATURED RELEASE */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-5xl font-black">
          Featured Release
        </h2>


        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">


          <div className="relative aspect-square overflow-hidden rounded-3xl border border-red-900">

            <Image
              src="/release%20covers/Still-With-Me.jpg"
              alt="Still With Me - Lil Rappy"
              fill
              className="object-cover"
            />

          </div>



          <div>

            <p className="uppercase tracking-widest text-red-500">
              New Release
            </p>


            <h3 className="mt-4 text-5xl font-bold">
              Still With Me
            </h3>


            <p className="mt-3 text-2xl text-red-200">
              Lil Rappy
            </p>


            <p className="mt-8 leading-8 text-red-100/80">
              An emotional release exploring loyalty, perseverance,
              and personal growth through melodic storytelling.
            </p>


            <a
              href="https://too.fm/stillwithme"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-red-600 px-8 py-3 font-bold"
            >
              Listen Now
            </a>

          </div>


        </div>

      </section>




      {/* ARTISTS */}

      <section className="bg-red-950/20 px-6 py-24">

        <h2 className="text-5xl font-black">
          Featured Artists
        </h2>


        <div className="mt-12 grid gap-8 md:grid-cols-3">


          {artists.map((artist) => (

            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="overflow-hidden rounded-3xl border border-red-900 bg-black"
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


                <p className="mt-2 text-red-200">
                  {artist.genre}
                </p>


              </div>

            </Link>

          ))}


        </div>

      </section>




      {/* STATS */}

      <section className="bg-red-950/30 px-6 py-20">


        <div className="grid gap-10 text-center md:grid-cols-4">


          <div>
            <h3 className="text-5xl font-black">5+</h3>
            <p>Artists</p>
          </div>


          <div>
            <h3 className="text-5xl font-black">1</h3>
            <p>Featured Release</p>
          </div>


          <div>
            <h3 className="text-5xl font-black">100K+</h3>
            <p>Streams</p>
          </div>


          <div>
            <h3 className="text-5xl font-black">2024</h3>
            <p>Founded</p>
          </div>


        </div>


      </section>




      {/* GET SIGNED */}

      <section className="px-6 py-24 text-center">


        <h2 className="text-5xl font-black">
          Ready To Make Your Mark?
        </h2>


        <p className="mt-6 text-red-100/70">
          Learn more about opportunities with Melted Mindz Records.
        </p>


        <Link
          href="/how-to-get-signed"
          className="mt-10 inline-block rounded-full bg-red-600 px-10 py-4 font-bold"
        >
          Get Signed
        </Link>


      </section>


    </main>
  );
}