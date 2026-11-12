import type { Metadata } from "next";

import { getNews } from "@/lib/content";

// Edited at /admin; refreshed right after a save, or within a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description: "Press releases and announcements from Melted Mindz Records.",
};

export default async function NewsPage() {
  const [lead, ...rest] = await getNews();

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <p className="eyebrow text-white/50">Melted Mindz Records</p>
      <h1 className="display mt-4 text-[22vw] sm:text-[11rem]">News</h1>

      {lead && (
        <a
          href={lead.link ?? undefined}
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
            <li key={item.slug} className="border-b border-white/10">
              <a
                href={item.link ?? undefined}
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
