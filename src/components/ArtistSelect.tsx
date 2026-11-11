"use client";

import { useRouter } from "next/navigation";

/** "Select an artist" jump menu (as on Atlantic's artists page). */
export default function ArtistSelect({ artists }: { artists: { slug: string; name: string }[] }) {
  const router = useRouter();
  return (
    <label className="relative inline-block w-full max-w-xs">
      <span className="sr-only">Select an artist</span>
      <select
        defaultValue=""
        onChange={(e) => e.target.value && router.push(`/artists/${e.target.value}`)}
        className="caps w-full appearance-none border border-white/40 bg-black py-3.5 pl-5 pr-12 text-[13px] text-white outline-none transition hover:border-white focus:border-white"
      >
        <option value="" disabled>
          Select an artist
        </option>
        {artists.map((a) => (
          <option key={a.slug} value={a.slug}>
            {a.name}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-5 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-white"
      >
        <path d="M1 1l5 5 5-5" strokeWidth="1.5" />
      </svg>
    </label>
  );
}
