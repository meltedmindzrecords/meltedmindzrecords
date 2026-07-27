export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-black px-6 py-5 text-white">
      <h1 className="text-xl font-bold">
        Melted Mindz Records
      </h1>

      <div className="flex gap-6 text-sm">
        <a href="/" className="hover:text-zinc-400">
          Home
        </a>

        <a href="/artists" className="hover:text-zinc-400">
          Artists
        </a>

        <a href="/releases" className="hover:text-zinc-400">
          Releases
        </a>

        <a href="/news" className="hover:text-zinc-400">
          News
        </a>

        <a href="/about" className="hover:text-zinc-400">
          About
        </a>

        <a href="/contact" className="hover:text-zinc-400">
          Contact
        </a>

        <a href="/signed" className="hover:text-zinc-400">
          Get Signed
        </a>
      </div>
    </nav>
  );
}