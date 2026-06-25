import type { Metadata, Viewport } from "next";
import { fraunces, inter } from "@/lib/fonts";
import { site } from "@/content/site";
import Grain from "@/components/Grain";
import RedLight from "@/components/RedLight";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.idea}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.idea}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.idea}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="text-cream min-h-full">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/* Global stage layers (TASK.md §6): red light UNDER grain UNDER content */}
        <RedLight intensity="ember" />
        <Grain />

        <SmoothScroll />
        <Nav />

        <div
          className="relative flex min-h-screen flex-col"
          style={{ zIndex: "var(--z-content)" }}
        >
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
