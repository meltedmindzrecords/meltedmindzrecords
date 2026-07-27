export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Melted Mindz Records
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Independent music. Original voices. A new generation of artists.
        </p>

        <button className="mt-8 rounded-full bg-white px-8 py-3 font-semibold text-black hover:bg-zinc-200">
          Explore Our Artists
        </button>
      </section>

      <section className="px-6 py-20">
        <h2 className="text-3xl font-bold">Featured Artists</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 p-6">
            <h3 className="text-xl font-semibold">Artist One</h3>
            <p className="mt-2 text-zinc-400">
              Emerging artist from the Melted Mindz roster.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-6">
            <h3 className="text-xl font-semibold">Artist Two</h3>
            <p className="mt-2 text-zinc-400">
              New sounds and creative energy.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-6">
            <h3 className="text-xl font-semibold">Artist Three</h3>
            <p className="mt-2 text-zinc-400">
              Building the future of music.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-20">
        <h2 className="text-3xl font-bold">About Melted Mindz</h2>

        <p className="mt-6 max-w-3xl text-zinc-400">
          Melted Mindz Records is an independent record label focused on
          developing artists, creating innovative music, and building a
          community around unique creative identities.
        </p>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Want To Join The Movement?</h2>

        <p className="mt-4 text-zinc-400">
          Learn more about opportunities with Melted Mindz Records.
        </p>

        <button className="mt-8 rounded-full bg-white px-8 py-3 font-semibold text-black hover:bg-zinc-200">
          Get Signed
        </button>
      </section>
    </main>
  );
}