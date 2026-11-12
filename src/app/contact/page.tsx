import { LinkIcon } from "@/components/Icons";
import { getSettings } from "@/lib/settings";
import { socialLinks } from "@/lib/settingsSchema";

// Contact details are edited at /admin/settings; refresh at most once a minute.
export const revalidate = 60;

export default async function Contact() {
  const s = await getSettings();
  const socials = socialLinks(s, "contact");
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="border-b border-white/10 px-6 pb-20 pt-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
            Melted Mindz Records
          </p>

          <h1 className="display text-6xl sm:text-8xl">
            Contact
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60 sm:text-xl">
            {s.contact_intro}
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
              {s.contact_email && (
              <a
                href={`mailto:${s.contact_email}`}
                className="group inline-flex items-center border-b border-white/30 pb-2 text-lg font-medium transition hover:border-white"
              >
                {s.contact_email}

                <span className="ml-3 text-white/40 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              )}
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
                  href={`mailto:${s.contact_email}`}
                  className="mt-2 block break-all text-base text-white transition hover:text-white/60"
                >
                  {s.contact_email}
                </a>
              </div>

              {s.contact_phone && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    Phone
                  </p>
                  <a
                    href={`tel:${s.contact_phone.replace(/[^\d+]/g, "")}`}
                    className="mt-2 block text-base text-white transition hover:text-white/60"
                  >
                    {s.contact_phone}
                  </a>
                </div>
              )}

              {s.contact_address && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    Address
                  </p>
                  <p className="mt-2 whitespace-pre-line text-base leading-7 text-white">{s.contact_address}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Artist Submissions
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {s.contact_submissions}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Response Time
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {s.contact_response}
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
            {socials.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                className="flex h-12 w-12 items-center justify-center border border-white/10 transition hover:border-white/40 hover:bg-white/5"
              >
                <LinkIcon label={l.label} className="text-lg" />
              </a>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}