import Link from "next/link";

import {
  FaTiktok,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaSpotify,
  FaSoundcloud,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black text-white">

      <div
        className="
          mx-auto
          grid
          max-w-screen-2xl
          grid-cols-1
          gap-12
          px-6
          py-10
          sm:px-10
          md:grid-cols-3
          md:gap-x-20
          lg:gap-x-32
        "
      >


        {/* SOCIAL + NEWSLETTER */}

        <div className="flex flex-col">

          <div className="
            mb-5
            flex
            items-center
            justify-center
            gap-5
            md:justify-start
          ">

            <a href="https://www.tiktok.com/@meltedmindzrecords"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400">
              <FaTiktok size={20} />
            </a>

            <a href="https://www.instagram.com/meltedmindzrecords"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400">
              <FaInstagram size={20} />
            </a>

            <a href="https://x.com/mindzlabel"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400">
              <FaXTwitter size={20} />
            </a>

            <a href="https://www.youtube.com/@meltedmindzrecords"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400">
              <FaYoutube size={20} />
            </a>

            <a href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400">
              <FaSpotify size={20} />
            </a>

            <a href="https://soundcloud.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400">
              <FaSoundcloud size={20} />
            </a>

          </div>



          <h3 className="
            mb-3
            text-center
            text-base
            font-semibold
            md:text-left
          ">
            Stay Connected
          </h3>



          <form className="flex flex-col">


            <div className="
              mb-3
              flex
              flex-col
              gap-2
              sm:flex-row
            ">

              <input
                type="email"
                placeholder="Email Address"
                className="
                  w-full
                  rounded
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-3
                  py-2
                  text-sm
                  text-white
                  outline-none
                  sm:rounded-l
                "
              />


              <button
                type="submit"
                className="
                  rounded
                  bg-white
                  px-5
                  py-2
                  text-sm
                  text-black
                  transition
                  hover:bg-zinc-200
                  sm:rounded-r
                "
              >
                Submit
              </button>

            </div>



            <div className="mb-3 flex items-start">

              <input
                type="checkbox"
                id="marketing"
                className="mr-2 mt-1"
              />


              <label
                htmlFor="marketing"
                className="text-xs leading-relaxed text-zinc-400"
              >
                I want Melted Mindz Records to send me marketing
                messages about artists, releases, events, and
                exclusive content.
              </label>

            </div>



            <p className="
              text-center
              text-xs
              leading-relaxed
              text-zinc-500
              md:text-left
            ">
              Please read our{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-white"
              >
                Privacy Policy
              </Link>
              {" "}for more information about how we handle your
              personal information.
            </p>


          </form>

        </div>





        {/* COMPANY */}

        <div className="
          flex
          flex-col
          items-center
          text-center
        ">


          <h3 className="mb-3 text-base font-semibold">
            Company
          </h3>


          <div className="
            flex
            flex-col
            gap-3
            text-sm
            text-zinc-400
          ">

            <Link href="/news" className="hover:text-white">
              News
            </Link>

            <Link href="/careers" className="hover:text-white">
              Careers
            </Link>

            <Link href="/internships" className="hover:text-white">
              Internships
            </Link>

            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>

          </div>

        </div>





        {/* LEGAL */}

        <div className="
          flex
          flex-col
          items-center
          text-center
          text-xs
          text-zinc-400
          md:items-end
          md:text-right
        ">


          <span className="mb-4">
            © 2026 Melted Mindz Records
          </span>



          <div className="
            flex
            flex-col
            gap-3
          ">


            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>


            <Link href="/terms-of-use" className="hover:text-white">
              Terms of Use
            </Link>


            <Link href="/cookie-policy" className="hover:text-white">
              Cookie Policy
            </Link>


            <Link href="/dmca" className="hover:text-white">
              DMCA Policy
            </Link>


            <Link href="/accessibility" className="hover:text-white">
              Accessibility
            </Link>


            <Link href="/do-not-sell" className="hover:text-white">
              Do Not Sell or Share My Personal Information
            </Link>


          </div>


        </div>


      </div>

    </footer>
  );
}