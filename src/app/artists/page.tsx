import type { Metadata } from "next";

import AlphabetBar from "@/components/AlphabetBar";
import ArtistCard from "@/components/ArtistCard";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import type { Artist } from "@/lib/content";
import { getArtists } from "@/lib/content";
import { LETTERS, letterFor, letterId } from "@/lib/letters";

// Content is edited in Supabase; refresh at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Artists",
  description: "The Melted Mindz Records roster.",
};

export default async function ArtistsPage() {
  const artists = await getArtists();
  const sortedArtists = [...artists].sort((a, b) =>
    a.name.trim().localeCompare(b.name.trim(), "en", { sensitivity: "base", numeric: true }),
  );

  const groups = new Map<string, Artist[]>();
  for (const artist of sortedArtists) {
    const letter = letterFor(artist.name);
    groups.set(letter, [...(groups.get(letter) ?? []), artist]);
  }
  const activeLetters = LETTERS.filter((l) => groups.has(l));

  return (
    <>
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-28 sm:px-10 sm:pt-36">
      <header className="flex flex-col items-center text-center">
        <p className="rise caps text-[12px] text-molten sm:text-[13px]">The roster</p>
        <h1 className="display mt-3 overflow-hidden pb-[0.04em] text-[26vw] sm:text-[11rem]">
          <span className="rise block" style={{ ["--d" as string]: "100ms" }}>Artists</span>
        </h1>
        <div className="mt-8 flex w-full justify-center">
          <AlphabetBar letters={LETTERS} active={activeLetters} />
        </div>
      </header>

      <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
        {activeLetters.map((letter) => {
          const list = groups.get(letter) ?? [];
          return (
            <section key={letter} aria-labelledby={letterId(letter)}>
              <h2
                id={letterId(letter)}
                tabIndex={-1}
                className="display scroll-mt-24 border-b border-white/20 pb-2 text-[18vw] outline-none sm:scroll-mt-28 sm:text-[7rem]"
              >
                <span className="sr-only">Artists starting with </span>
                {letter === "#" ? <><span aria-hidden="true">#</span><span className="sr-only">a number</span></> : letter}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {list.map((artist, i) => (
                  <Reveal key={artist.slug} delay={(i % 4) * 90}>
                    <ArtistCard artist={artist} priority={sortedArtists.indexOf(artist) < 2} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
    <Marquee items={sortedArtists.map((a) => a.name)} label="Our artists" tone="outline" speed={50} />
    </>
  );
}
