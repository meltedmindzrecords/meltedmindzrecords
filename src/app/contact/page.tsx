import {
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";

export default function Contact() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="border-b border-white/10 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
            Melted Mindz Records
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl">
            Contact
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60 sm:text-xl">
            For business inquiries, artist-related matters, media inquiries,
            partnerships, and general questions, contact the Melted Mindz
            Records team.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
              Get in Touch
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Let’s talk.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
              Whether you are reaching out regarding an artist, release,
              business opportunity, media request, or another label-related
              matter, our team is available through the contact information
              below.
            </p>

            <div className="mt-10">
              <a
                href="mailto:info@meltedmindzrecords.com"
                className="group inline-flex items-center border-b border-white/30 pb-2 text-lg font-medium transition hover:border-white"
              >
                info@meltedmindzrecords.com

                <span className="ml-3 text-white/40 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
              Contact Information
            </p>

            <div className="mt-8 space-y-8">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  General & Business Inquiries
                </p>

                <a
                  href="mailto:info@meltedmindzrecords.com"
                  className="mt-2 block break-all text-base text-white transition hover:text-white/60"
                >
                  info@meltedmindzrecords.com
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Artist Submissions
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Melted Mindz Records does not accept unsolicited demos.
                  Please use the appropriate submission process when
                  available.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Response Time
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Please allow reasonable time for our team to review and
                  respond to your inquiry.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SOCIALS */}
      <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
            Follow Melted Mindz Records
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-12 w-12 items-center justify-center border border-white/10 transition hover:border-white/40 hover:bg-white/5"
            >
              <FaInstagram className="text-lg" />
            </a>

            <a
              href="#"
              aria-label="X"
              className="flex h-12 w-12 items-center justify-center border border-white/10 transition hover:border-white/40 hover:bg-white/5"
            >
              <FaXTwitter className="text-lg" />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="flex h-12 w-12 items-center justify-center border border-white/10 transition hover:border-white/40 hover:bg-white/5"
            >
              <FaYoutube className="text-lg" />
            </a>

            <a
              href="#"
              aria-label="TikTok"
              className="flex h-12 w-12 items-center justify-center border border-white/10 transition hover:border-white/40 hover:bg-white/5"
            >
              <FaTiktok className="text-lg" />
            </a>

          </div>

        </div>
      </section>

    </main>
  );
}