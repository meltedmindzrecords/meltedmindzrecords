import Image from "next/image";
import Link from "next/link";


const executives = [
  {
    name: "Theodore Pirkle",
    title: "Founder & CEO",
    image: "/executives/theodore-pirkle.jpg",
    bio:
      "Founder and CEO of Melted Mindz Records, leading the label's vision, artist development, and future growth.",
  },
  {
    name: "Executive Name",
    title: "President",
    image: "/executives/executive-placeholder.jpg",
    bio:
      "Responsible for overseeing label operations, partnerships, and strategic growth.",
  },
  {
    name: "Executive Name",
    title: "Head of A&R",
    image: "/executives/executive-placeholder.jpg",
    bio:
      "Focused on discovering, developing, and supporting emerging talent.",
  },
];


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">


      {/* HERO */}

      <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-zinc-900 to-black px-6">

        <div className="text-center">

          <p className="uppercase tracking-[0.5em] text-red-500">
            Melted Mindz Records
          </p>


          <h1 className="mt-6 text-6xl font-black sm:text-8xl">
            About Us
          </h1>


          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Building the next generation of artists through creativity,
            innovation, and culture.
          </p>


        </div>

      </section>





      {/* ABOUT LABEL */}

      <section className="mx-auto max-w-7xl px-6 py-24">


        <div className="grid gap-12 lg:grid-cols-2">


          <div>


            <h2 className="text-5xl font-black">
              About Melted Mindz Records
            </h2>


            <p className="mt-8 leading-8 text-zinc-300">

              Melted Mindz Records is an independent record label dedicated
              to developing artists, creating opportunities, and pushing
              creative boundaries across multiple genres.

            </p>


            <p className="mt-6 leading-8 text-zinc-300">

              Founded with a vision to support the next generation of
              musicians, Melted Mindz Records focuses on artist development,
              music releases, branding, and long-term careers.

            </p>


            <p className="mt-6 leading-8 text-zinc-300">

              From emerging talent to established creators, the label works
              to provide the resources, support, and platform artists need
              to bring their vision to the world.

            </p>


          </div>




          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10">


            <h3 className="text-3xl font-bold">
              Our Mission
            </h3>


            <p className="mt-6 leading-8 text-zinc-400">

              To amplify unique voices, develop meaningful artists,
              and create a global community built around music and
              creativity.

            </p>



            <h3 className="mt-10 text-3xl font-bold">
              Our Vision
            </h3>


            <p className="mt-6 leading-8 text-zinc-400">

              To become a leading independent entertainment company
              known for artist-first development and innovative
              approaches to the music industry.

            </p>


          </div>


        </div>


      </section>






      {/* EXECUTIVES */}

      <section className="bg-zinc-950 px-6 py-24">


        <div className="mx-auto max-w-7xl">


          <h2 className="text-5xl font-black">
            Executive Team
          </h2>


          <p className="mt-4 max-w-3xl text-zinc-400">
            Meet the leadership team responsible for guiding Melted Mindz
            Records and supporting our artists.
          </p>




          <div className="mt-12 grid gap-8 md:grid-cols-3">


            {executives.map((executive) => (

              <div
                key={executive.name}
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-zinc-800
                  bg-black
                "
              >


                <div className="relative aspect-square">


                  <Image
                    src={executive.image}
                    alt={executive.name}
                    fill
                    className="object-cover"
                  />


                </div>




                <div className="p-6">


                  <h3 className="text-2xl font-bold">
                    {executive.name}
                  </h3>


                  <p className="mt-2 text-red-500">
                    {executive.title}
                  </p>


                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {executive.bio}
                  </p>


                </div>


              </div>


            ))}


          </div>


        </div>


      </section>







      {/* CTA */}

      <section className="px-6 py-24 text-center">


        <h2 className="text-5xl font-black">
          Join The Movement
        </h2>


        <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
          Discover our artists, explore releases, and follow the future
          of Melted Mindz Records.
        </p>



        <Link
          href="/artists"
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
          Explore Artists
        </Link>


      </section>


    </main>
  );
}