import {
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";


export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">


      {/* HERO */}

      <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-zinc-900 to-black px-6">

        <div className="text-center">

          <p className="uppercase tracking-[0.5em] text-red-500">
            Melted Mindz Records
          </p>


          <h1 className="mt-6 text-6xl font-black sm:text-8xl">
            Contact
          </h1>


          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Get in touch with Melted Mindz Records for business inquiries,
            artist opportunities, press, and partnerships.
          </p>


        </div>

      </section>






      {/* CONTACT OPTIONS */}

      <section className="mx-auto max-w-7xl px-6 py-24">


        <div className="grid gap-8 md:grid-cols-3">


          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <h2 className="text-2xl font-bold">
              General Inquiries
            </h2>


            <p className="mt-4 text-zinc-400">
              Questions about Melted Mindz Records, artists, releases,
              or partnerships.
            </p>


            <p className="mt-6 text-red-500">
              info@meltedmindzrecords.com
            </p>

          </div>





          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <h2 className="text-2xl font-bold">
              Demo Submissions
            </h2>


            <p className="mt-4 text-zinc-400">
              Interested in submitting music for consideration?
              Send your best work to our A&R team.
            </p>


            <p className="mt-6 text-red-500">
              demos@meltedmindzrecords.com
            </p>


          </div>





          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">


            <h2 className="text-2xl font-bold">
              Business
            </h2>


            <p className="mt-4 text-zinc-400">
              For licensing, partnerships, media, and business opportunities.
            </p>


            <p className="mt-6 text-red-500">
              business@meltedmindzrecords.com
            </p>


          </div>


        </div>


      </section>






      {/* CONTACT FORM */}

      <section className="bg-zinc-950 px-6 py-24">


        <div className="mx-auto max-w-3xl">


          <h2 className="text-center text-5xl font-black">
            Send A Message
          </h2>



          <form className="mt-12 space-y-6">


            <input
              type="text"
              placeholder="Name"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-black
                px-5
                py-4
                text-white
                outline-none
              "
            />



            <input
              type="email"
              placeholder="Email Address"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-black
                px-5
                py-4
                text-white
                outline-none
              "
            />



            <select
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-black
                px-5
                py-4
                text-white
              "
            >

              <option>
                Select Inquiry Type
              </option>

              <option>
                General Inquiry
              </option>

              <option>
                Demo Submission
              </option>

              <option>
                Business Partnership
              </option>

              <option>
                Press Inquiry
              </option>

            </select>




            <textarea
              placeholder="Message"
              rows={6}
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-black
                px-5
                py-4
                text-white
                outline-none
              "
            />




            <button
              type="submit"
              className="
                w-full
                rounded-full
                bg-red-600
                px-8
                py-4
                font-bold
                hover:bg-red-500
              "
            >
              Submit Message
            </button>


          </form>


        </div>


      </section>







      {/* SOCIALS */}

      <section className="px-6 py-20 text-center">


        <h2 className="text-4xl font-black">
          Follow Melted Mindz Records
        </h2>



        <div className="mt-8 flex justify-center gap-8 text-3xl">


          <a
            href="https://www.instagram.com/meltedmindzrecords"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400"
          >
            <FaInstagram />
          </a>



          <a
            href="https://x.com/mindzlabel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400"
          >
            <FaXTwitter />
          </a>



          <a
            href="https://www.youtube.com/@meltedmindzrecords"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400"
          >
            <FaYoutube />
          </a>



          <a
            href="https://www.tiktok.com/@meltedmindzrecords"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400"
          >
            <FaTiktok />
          </a>


        </div>


      </section>


    </main>
  );
}