import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-[1440px] flex-col justify-end px-5 pb-20 pt-32 sm:px-8">
      <p className="eyebrow text-white/50">404</p>
      <h1 className="display mt-4 text-[18vw] sm:text-[9rem]">Page not found</h1>
      <p className="mt-6 max-w-md text-white/60">
        This page doesn&apos;t exist or has moved.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-black"
        >
          Home
        </Link>
        <Link
          href="/artists"
          className="border border-white/50 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.2em]"
        >
          Artists
        </Link>
      </div>
    </div>
  );
}
