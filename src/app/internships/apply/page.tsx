import Link from "next/link";

export default function InternshipApplicationPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">

      {/* Hero */}
      <section className="mx-auto max-w-5xl text-center">

        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Internship & Externship Application
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          Apply to join Melted Mindz Records and gain hands-on experience
          working in the music industry.
        </p>

      </section>


      {/* Application Form */}
      <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8">

        <form className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Your full name"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>


          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>


          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>


          {/* Application Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Application Type
            </label>

            <select
              name="applicationType"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            >
              <option value="">
                Select one
              </option>

              <option value="internship">
                Internship
              </option>

              <option value="externship">
                Externship
              </option>

            </select>
          </div>


          {/* Area of Interest */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Area of Interest
            </label>

            <select
              name="department"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            >
              <option>
                Music Business
              </option>

              <option>
                A&R
              </option>

              <option>
                Artist Management
              </option>

              <option>
                Marketing
              </option>

              <option>
                Social Media
              </option>

              <option>
                Graphic Design
              </option>

              <option>
                Video Production
              </option>

              <option>
                Web Development
              </option>

            </select>
          </div>


          {/* School */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              School / Organization
            </label>

            <input
              type="text"
              name="school"
              placeholder="College, university, or organization"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            />
          </div>


          {/* Portfolio */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Portfolio / Website / LinkedIn
            </label>

            <input
              type="url"
              name="portfolio"
              placeholder="https://"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            />
          </div>


          {/* Resume */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Resume Link
            </label>

            <input
              type="url"
              name="resume"
              placeholder="Google Drive, Dropbox, or website link"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            />
          </div>


          {/* Experience */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Relevant Experience
            </label>

            <textarea
              name="experience"
              rows={5}
              placeholder="Tell us about your skills, experience, and interests..."
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            />
          </div>


          {/* Availability */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Availability
            </label>

            <textarea
              name="availability"
              rows={3}
              placeholder="Hours available per week and preferred dates"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            />
          </div>


          {/* Motivation */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Why do you want to work with Melted Mindz Records?
            </label>

            <textarea
              name="message"
              rows={5}
              placeholder="Tell us why you are interested in this opportunity..."
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
            />
          </div>


          {/* Agreement */}
          <div className="flex items-start gap-3">

            <input
              type="checkbox"
              required
              className="mt-1"
            />

            <p className="text-sm text-zinc-400">
              I certify that the information provided is accurate and understand
              that submitting this application does not guarantee acceptance into
              the Melted Mindz Records Internship or Externship Program.
            </p>

          </div>


          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg border border-white py-3 font-semibold transition hover:bg-white hover:text-black"
          >
            Submit Application
          </button>


        </form>

      </section>


      {/* Back */}
      <div className="mt-10 text-center">

        <Link
          href="/internships"
          className="text-zinc-400 transition hover:text-white"
        >
          ← Back to Internships & Externships
        </Link>

      </div>


    </main>
  );
}