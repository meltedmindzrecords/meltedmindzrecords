import Image from "next/image";

const artists = {
  "yxng-dreezy": {
    name: "Yxng Dreezy",
    genre: "Melodic Rap / Hip-Hop",
    image: "/artists/yxng-dreezy.jpg",
    bio: "Yxng Dreezy is a melodic rap artist bringing emotional storytelling, memorable melodies, and a modern approach to hip-hop.",
  },

  "lil-rappy": {
    name: "Lil Rappy",
    genre: "Melodic Rap / Hip-Hop",
    image: "/artists/lil-rappy.jpg",
    bio: "Lil Rappy delivers melodic energy, creative songwriting, and a unique voice within modern hip-hop.",
  },

  "gutzombie": {
    name: "GutZombie",
    genre: "Alternative / Pop-Punk",
    image: "/artists/gutzombie.jpg",
    bio: "GutZombie blends alternative influences with pop-punk energy and a unique creative identity.",
  },

  "rachel-ann": {
    name: "Rachel Ann",
    genre: "Alternative / Pop-Punk",
    image: "/artists/rachel-ann.jpg",
    bio: "Rachel Ann brings powerful emotion, alternative influences, and a distinctive sound to the Melted Mindz roster.",
  },

  "okay-boomhauer": {
    name: "Okay Boomhauer",
    genre: "Rock / Alternative (Band)",
    image: "/artists/okay-boomhauer.jpg",
    bio: "Okay Boomhauer delivers a rock-driven sound with alternative influences and a unique band identity.",
  },
};

export default async function ArtistProfile({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist } = await params;

  const artistInfo = artists[artist as keyof typeof artists];

  if (!artistInfo) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <h1 className="text-4xl font-bold">
          Artist Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">

      {/* Artist Image + Header */}
      <section className="mx-auto max-w-5xl">

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <Image
            src={artistInfo.image}
            alt={artistInfo.name}
            width={1200}
            height={1200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <h1 className="mt-8 text-5xl font-bold">
          {artistInfo.name}
        </h1>

        <p className="mt-4 text-xl text-zinc-400">
          {artistInfo.genre}
        </p>

      </section>


      {/* About */}
      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-3xl font-bold">
          About
        </h2>

        <p className="mt-4 text-zinc-400">
          {artistInfo.bio}
        </p>
      </section>


      {/* Music */}
      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-3xl font-bold">
          Music
        </h2>

        <div className="mt-6 rounded-xl border border-zinc-800 p-6">
          <p className="text-zinc-400">
            Latest releases, music videos, and streaming links coming soon.
          </p>
        </div>
      </section>


      {/* Listen */}
      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-3xl font-bold">
          Listen
        </h2>

        <div className="mt-6 flex flex-wrap gap-4">

          <button className="rounded-full bg-white px-6 py-3 font-semibold text-black">
            Spotify
          </button>

          <button className="rounded-full bg-white px-6 py-3 font-semibold text-black">
            Apple Music
          </button>

          <button className="rounded-full bg-white px-6 py-3 font-semibold text-black">
            YouTube
          </button>

        </div>
      </section>


      {/* Follow */}
      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-3xl font-bold">
          Follow
        </h2>

        <p className="mt-4 text-zinc-400">
          Social links and artist updates coming soon.
        </p>
      </section>

    </main>
  );
}