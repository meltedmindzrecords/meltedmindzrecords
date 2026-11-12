import type { Metadata, Viewport } from "next";
import { Inter_Tight, Roboto_Flex } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { getSettings } from "@/lib/settings";
import { chromeFrom } from "@/lib/settingsSchema";

// Atlantic-style display face: a variable grotesk, set tall and condensed.
const display = Roboto_Flex({
  variable: "--font-display-face",
  subsets: ["latin"],
  axes: ["wdth", "YTUC", "opsz"],
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
});

// Title, description and share image are edited at /admin/settings.
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL("https://www.meltedmindzrecords.com"),
    title: {
      default: s.seo_title,
      template: "%s | Melted Mindz Records",
    },
    description: s.seo_description,
    ...(s.seo_image
      ? {
          openGraph: { title: s.seo_title, description: s.seo_description, images: [s.seo_image] },
          twitter: { card: "summary_large_image", images: [s.seo_image] },
        }
      : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chrome = chromeFrom(await getSettings());
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Lets CSS hide scroll-reveal content only when JS will reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/3dac0f597e71b5f38db3e5b32dac4dee/script.js"
        />
      </head>

      <body className="relative flex min-h-screen flex-col bg-black text-white">
        <Navbar chrome={chrome} />

        <main className="flex-1">{children}</main>

        <Footer chrome={chrome} />

        <RevealObserver />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
