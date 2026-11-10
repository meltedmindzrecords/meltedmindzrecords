import Image from "next/image";

import { getArtist, getArtists, isOptimizable } from "@/lib/content";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export async function generateStaticParams() {
  const artists = await getArtists();
  return artists.map((a) => ({ artist: a.slug }));
}

export default async function ArtistProfile({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist } = await params;

  const artistInfo = await getArtist(artist);

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
            className="h-auto w-full object-contain"
            priority
            unoptimized={!isOptimizable(artistInfo.image)}
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

          {[
            { label: "Spotify", href: artistInfo.spotifyUrl },
            { label: "Apple Music", href: artistInfo.appleMusicUrl },
            { label: "YouTube", href: artistInfo.youtubeUrl },
          ].map(({ label, href }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-3 font-semibold text-black"
              >
                {label}
              </a>
            ) : (
              <button
                key={label}
                className="rounded-full bg-white px-6 py-3 font-semibold text-black"
              >
                {label}
              </button>
            )
          )}

        </div>

      </section>

      {/* Follow */}
      <section className="mx-auto mt-12 max-w-3xl">

        <h2 className="text-3xl font-bold">
          Follow
        </h2>

        {artistInfo.instagramUrl || artistInfo.tiktokUrl ? (
          <div className="mt-6 flex flex-wrap gap-4">
            {[
              { label: "Instagram", href: artistInfo.instagramUrl },
              { label: "TikTok", href: artistInfo.tiktokUrl },
            ]
              .filter((l) => l.href)
              .map(({ label, href }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white px-6 py-3 font-semibold"
                >
                  {label}
                </a>
              ))}
          </div>
        ) : (
          <p className="mt-4 text-zinc-400">
            Social links and artist updates coming soon.
          </p>
        )}

      </section>

    </main>
  );
}