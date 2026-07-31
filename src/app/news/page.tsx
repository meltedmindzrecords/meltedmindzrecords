import Image from "next/image";
import Link from "next/link";

const newsArticles = [
  {
    title: "Melted Mindz Records Announces New Release 'Still With Me' by Lil Rappy",
    date: "July 28, 2026",
    category: "Release News",
    image: "/news/still-with-me.jpg",
    slug: "still-with-me-release",
    description:
      "Lil Rappy delivers an emotional new release through Melted Mindz Records featuring melodic storytelling and personal experiences.",
  },
  {
    title: "Melted Mindz Records Continues Building The Next Generation Of Artists",
    date: "July 2026",
    category: "Label News",
    image: "/news/label-update.jpg",
    slug: "label-update",
    description:
      "Melted Mindz Records continues expanding its roster and developing independent artists.",
  },
  {
    title: "Behind The Mindz: The Creative Process",
    date: "Coming Soon",
    category: "Behind The Scenes",
    image: "/news/behind-the-scenes.jpg",
    slug: "behind-the-mindz",
    description:
      "A look inside the creativity, collaboration, and vision behind Melted Mindz Records.",
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
            Latest releases, artist announcements, label updates,
            and stories from Melted Mindz Records.
          </p>

        </div>

      </section>




      {/* FEATURED NEWS */}


      <section className="mx-auto max-w-7xl px-6 py-24">


        <h2 className="text-5xl font-black">
          Featured News
        </h2>


        <div className="mt-12 grid gap-12 lg:grid-cols-2">


          <div className="relative aspect-video overflow-hidden rounded-3xl border border-zinc-800">

            <Image
              src="/news/still-with-me.jpg"
              alt="Still With Me Release"
              fill
              className="object-cover"
            />

          </div>



          <div className="flex flex-col justify-center">


            <p className="uppercase tracking-widest text-red-500">
              Release News
            </p>


            <h3 className="mt-4 text-4xl font-bold">
              Still With Me by Lil Rappy
            </h3>


            <p className="mt-6 text-zinc-400 leading-8">
              Melted Mindz Records presents "Still With Me" by Lil Rappy,
              an emotional release showcasing melodic storytelling and
              personal growth.
            </p>



            <Link
              href="/releases/still-with-me"
              className="mt-8 inline-flex w-fit rounded-full bg-red-600 px-8 py-3 font-bold"
            >
              View Release
            </Link>


          </div>


        </div>


      </section>





      {/* NEWS GRID */}


      <section className="bg-zinc-950 px-6 py-24">


        <div className="mx-auto max-w-7xl">


          <h2 className="text-5xl font-black">
            Latest Updates
          </h2>



          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">


            {newsArticles.map((article) => (

              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-black transition hover:border-red-600"
              >


                <div className="relative aspect-video">


                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />


                </div>




                <div className="p-6">


                  <p className="text-sm uppercase tracking-widest text-red-500">
                    {article.category}
                  </p>


                  <h3 className="mt-4 text-2xl font-bold">
                    {article.title}
                  </h3>


                  <p className="mt-3 text-sm text-zinc-500">
                    {article.date}
                  </p>


                  <p className="mt-4 text-zinc-400">
                    {article.description}
                  </p>


                </div>


              </Link>

            ))}


          </div>


        </div>


      </section>





      {/* NEWSLETTER */}


      <section className="px-6 py-24 text-center">


        <h2 className="text-5xl font-black">
          Stay Connected
        </h2>


        <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
          Subscribe for new releases, artist announcements,
          merchandise drops, and exclusive updates.
        </p>



        <button
          className="mt-10 rounded-full bg-red-600 px-10 py-4 font-bold"
        >
          Join Newsletter
        </button>


      </section>


    </main>
  );
}