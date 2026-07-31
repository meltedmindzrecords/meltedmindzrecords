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
          gap-x-32
          gap-y-10
          px-10
          py-10
          md:grid-cols-3
        "
      >

        {/* SOCIAL + NEWSLETTER */}

        <div className="flex flex-col">


          <div className="mb-5 flex items-center gap-5">

            <a
              href="https://www.tiktok.com/@meltedmindzrecords"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400"
            >
              <FaTiktok size={20} />
            </a>


            <a
              href="https://www.instagram.com/meltedmindzrecords"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400"
            >
              <FaInstagram size={20} />
            </a>


            <a
              href="https://x.com/mindzlabel"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400"
            >
              <FaXTwitter size={20} />
            </a>


            <a
              href="https://www.youtube.com/@meltedmindzrecords"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400"
            >
              <FaYoutube size={20} />
            </a>


            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400"
            >
              <FaSpotify size={20} />
            </a>


            <a
              href="https://soundcloud.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-400"
            >
              <FaSoundcloud size={20} />
            </a>

          </div>



          <h3 className="mb-3 text-base font-semibold">
            Stay Connected
          </h3>


          <form className="flex flex-col">

            <div className="mb-3 flex">

              <input
                type="email"
                placeholder="Email Address"
                className="
                  flex-1
                  rounded-l
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-3
                  py-2
                  text-sm
                  text-white
                  outline-none
                "
              />


              <button
                type="submit"
                className="
                  rounded-r
                  bg-white
                  px-5
                  text-sm
                  text-black
                  transition
                  hover:bg-zinc-200
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



            <p className="text-xs leading-relaxed text-zinc-500">

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





        {/* CAREERS */}

        <div className="flex flex-col items-center text-center">


          <h3 className="mb-3 text-base font-semibold">
            Join Our Team
          </h3>


          <div className="flex items-center gap-3 text-sm text-zinc-400">

            <Link
              href="/careers"
              className="hover:text-white"
            >
              Careers
            </Link>


            <span>|</span>


            <Link
              href="/internships"
              className="hover:text-white"
            >
              Internships
            </Link>

          </div>


        </div>





        {/* LEGAL */}

        <div className="flex flex-col items-end text-xs text-zinc-400">


          <div className="mb-3 flex flex-wrap items-center justify-end gap-3">

            <span>
              © 2026 Melted Mindz Records
            </span>


            <span>|</span>


            <Link
              href="/privacy-policy"
              className="hover:text-white"
            >
              Privacy Policy
            </Link>


            <span>|</span>


            <Link
              href="/terms"
              className="hover:text-white"
            >
              Terms of Use
            </Link>


            <span>|</span>


            <Link
              href="/cookie-policy"
              className="hover:text-white"
            >
              Cookie Policy
            </Link>


            <span>|</span>


            <Link
              href="/press"
              className="hover:text-white"
            >
              Press
            </Link>

          </div>




          <div className="flex flex-wrap items-center justify-end gap-3">

            <Link
              href="/careers"
              className="hover:text-white"
            >
              Careers
            </Link>


            <span>|</span>


            <Link
              href="/contact"
              className="hover:text-white"
            >
              Contact
            </Link>


            <span>|</span>


            <Link
              href="/do-not-sell"
              className="hover:text-white"
            >
              Do Not Sell or Share My Personal Information
            </Link>


          </div>


        </div>


      </div>


    </footer>
  );
}