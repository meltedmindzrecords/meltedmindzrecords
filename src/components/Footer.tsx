"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import {
  FaTiktok,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaSpotify,
  FaSoundcloud,
} from "react-icons/fa6";

export default function Footer() {

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);


  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!email) return;

    setLoading(true);


    try {

      const response = await fetch("/api/newsletter", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          marketingConsent,
        }),

      });


      const data = await response.json();


      if (!response.ok) {

        throw new Error(data.error);

      }


      setSubmitted(true);

      setEmail("");

      setMarketingConsent(false);


      setTimeout(() => {

        setSubmitted(false);

      }, 6000);


    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );


    } finally {

      setLoading(false);

    }

  }



  return (

    <footer className="border-t border-zinc-800 bg-black text-white">


      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-6 py-10 sm:px-10 md:grid-cols-3 md:gap-x-20 lg:gap-x-32">


        {/* SOCIAL + NEWSLETTER */}


        <div className="flex flex-col">


          <div className="mb-5 flex justify-center gap-5 md:justify-start">


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


          <h3 className="mb-3 text-center text-base font-semibold md:text-left">
            Stay Connected
          </h3>


          <AnimatePresence mode="wait">

            {!submitted ? (

              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col gap-2 sm:flex-row">

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-green-500"
                  />


                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Joining..." : "Join"}
                  </button>

                </div>



                <div className="mt-3 flex items-start">

                  <input
                    id="marketing"
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) =>
                      setMarketingConsent(e.target.checked)
                    }
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



                <p className="mt-3 text-center text-xs text-zinc-500 md:text-left">

                  Please read our{" "}

                  <Link
                    href="/privacy-policy"
                    className="underline hover:text-white"
                  >
                    Privacy Policy
                  </Link>

                  {" "}for more information.

                </p>


              </motion.form>


            ) : (


              <motion.div

                key="success"

                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}

                transition={{
                  duration: 0.35,
                }}

                className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center shadow-lg backdrop-blur-sm"

              >


                <motion.div

                  initial={{
                    scale: 0,
                  }}

                  animate={{
                    scale: 1,
                  }}

                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 14,
                  }}

                >

                  <CheckCircle2
                    size={72}
                    className="mx-auto mb-4 text-green-400"
                  />

                </motion.div>



                <h3 className="mb-2 text-3xl font-bold text-green-400">
                  ✓ You're In!
                </h3>



                <p className="mb-5 text-zinc-300">
                  Welcome to the Melted Mindz Records community.
                </p>



                <div className="space-y-2 text-sm text-zinc-400">

                  <p>🎵 New Releases</p>

                  <p>🎤 Artist Announcements</p>

                  <p>🎟 Tour Dates & Events</p>

                  <p>🔥 Exclusive Content</p>

                </div>



                <p className="mt-6 text-sm font-medium text-green-300">
                  A welcome email is on its way.
                </p>


              </motion.div>


            )}

          </AnimatePresence>


        </div>

        {/* COMPANY */}

        <div className="flex flex-col items-center text-center">


          <h3 className="mb-3 text-base font-semibold">
            Company
          </h3>


          <div className="flex flex-col gap-3 text-sm text-zinc-400">


            <Link
              href="/news"
              className="transition hover:text-white"
            >
              News
            </Link>


            <Link
              href="/careers"
              className="transition hover:text-white"
            >
              Careers
            </Link>


            <Link
              href="/internships"
              className="transition hover:text-white"
            >
              Internships
            </Link>


            <Link
              href="/contact"
              className="transition hover:text-white"
            >
              Contact
            </Link>


          </div>


        </div>




        {/* LEGAL */}


        <div className="flex flex-col items-center text-center text-xs text-zinc-400 md:items-end md:text-right">


          <span className="mb-4">
            © 2026 Melted Mindz Records
          </span>



          <div className="flex flex-col gap-3">


            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>


            <Link
              href="/terms-of-use"
              className="transition hover:text-white"
            >
              Terms of Use
            </Link>


            <Link
              href="/cookie-policy"
              className="transition hover:text-white"
            >
              Cookie Policy
            </Link>


            <Link
              href="/dmca"
              className="transition hover:text-white"
            >
              DMCA Policy
            </Link>


            <Link
              href="/accessibility"
              className="transition hover:text-white"
            >
              Accessibility
            </Link>


            <Link
              href="/do-not-sell"
              className="transition hover:text-white"
            >
              Do Not Sell or Share My Personal Information
            </Link>


          </div>


        </div>


      </div>


    </footer>

  );

}