import { LinkIcon } from "@/components/Icons";

export type NamedLink = { label: string; href: string | null | undefined };

/** Only links that exist are shown. Nothing renders when there are none. */
export function present(links: NamedLink[]) {
  return links.filter((l): l is { label: string; href: string } => !!l.href);
}

/** Streaming buttons: solid white first, outlined after. */
export function StreamButtons({ links }: { links: NamedLink[] }) {
  const shown = present(links);
  if (shown.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {shown.map(({ label, href }, i) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            i === 0
              ? "inline-flex items-center gap-2.5 bg-white px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-zinc-200"
              : "inline-flex items-center gap-2.5 border border-white/40 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white hover:text-black"
          }
        >
          <LinkIcon label={label} className="text-base" />
          {label}
        </a>
      ))}
    </div>
  );
}

/** Round social icons. */
export function SocialIcons({ links, size = "md" }: { links: NamedLink[]; size?: "sm" | "md" }) {
  const shown = present(links);
  if (shown.length === 0) return null;
  const box = size === "sm" ? "h-10 w-10 text-base" : "h-12 w-12 text-lg";
  return (
    <div className="flex flex-wrap gap-3">
      {shown.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`flex ${box} items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-black`}
        >
          <LinkIcon label={label} />
        </a>
      ))}
    </div>
  );
}
