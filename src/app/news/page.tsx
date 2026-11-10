import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "Press releases and announcements from Melted Mindz Records.",
};

const pressReleases = [
  {
    title:
      "The Next Chapter of Melted Mindz Records: Welcoming Lil Rappy",
    date: "Mar 29, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records announces the next chapter of the label with the welcoming of Lil Rappy, highlighting the artist's journey and the continued growth of the Melted Mindz Records roster.",
    link:
      "https://meltedmindzrecords.substack.com/p/the-next-chapter-of-melted-mindz",
  },

  {
    title: "The Sonic Architect: Welcoming Lucius",
    date: "Mar 29, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records welcomes Lucius and introduces a new creative force to the label family.",
    link:
      "https://meltedmindzrecords.substack.com/p/the-sonic-architect-welcoming-lucius",
  },

  {
    title: "From The Swamp To The World: Okay Boomhauer",
    date: "Jul 8, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records highlights Okay Boomhauer and the creative vision behind the artist.",
    link:
      "https://open.substack.com/pub/meltedmindzrecords/p/from-the-swamp-to-the-world-okay",
  },

  {
    title: "In The Grip Of The Undead: GutZombie",
    date: "Jul 8, 2026",
    category: "Press Release",
    description:
      "Melted Mindz Records showcases GutZombie and their unique artistic identity.",
    link:
      "https://open.substack.com/pub/meltedmindzrecords/p/in-the-grip-of-the-undead-gutzombie",
  },
];


export default function NewsPage() {
  const [lead, ...rest] = pressReleases;

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <p className="eyebrow text-white/50">Melted Mindz Records</p>
      <h1 className="display mt-4 text-[22vw] sm:text-[11rem]">News</h1>

      {lead && (
        <a
          href={lead.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-14 block border-t border-white pt-8"
        >
          <p className="eyebrow text-white/50">
            {lead.category} · {lead.date}
          </p>
          <h2 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.1] tracking-tight group-hover:underline sm:text-6xl">
            {lead.title}
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-8 text-white/60">{lead.description}</p>
          <span className="mt-8 inline-block text-[12px] font-semibold uppercase tracking-[0.2em]">
            Read the release →
          </span>
        </a>
      )}

      {rest.length > 0 && (
        <ul className="mt-20 border-t border-white/10">
          {rest.map((item) => (
            <li key={item.title} className="border-b border-white/10">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-3 py-8 lg:grid-cols-12 lg:gap-8"
              >
                <p className="eyebrow text-white/50 lg:col-span-3">
                  {item.category} · {item.date}
                </p>
                <div className="lg:col-span-8">
                  <h3 className="text-2xl font-semibold leading-snug tracking-tight group-hover:underline sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-white/60">{item.description}</p>
                </div>
                <span className="hidden text-right text-xl lg:col-span-1 lg:block">→</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
