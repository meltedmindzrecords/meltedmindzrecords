import Link from "next/link";

import Reveal from "@/components/Reveal";
import Tall from "@/components/Tall";

/** Numbered section heading: "01 — Latest releases", then big type. */
export default function SectionHead({
  index,
  eyebrow,
  title,
  link,
  id,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
  id?: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 sm:mb-14">
      <div>
        <p className="caps flex items-center gap-3 text-[12px] text-molten sm:text-[13px]">
          {index && <span>{index}</span>}
          <span aria-hidden="true" className="h-px w-8 bg-molten" />
          <span>{eyebrow}</span>
        </p>
        <h2 id={id} className="display mt-4 text-[3.8rem] sm:text-[5.5rem] lg:text-[7rem]">
          <Tall>{title}</Tall>
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="caps group inline-flex items-center gap-2 pb-2 text-[13px] text-white/75 transition hover:text-white"
        >
          <span className="wipe pb-1">{link.label}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </Reveal>
  );
}
