import type { Metadata, Viewport } from "next";
import { ivarDisplay } from "@/lib/fonts";
import { site } from "@/content/site";
import { getSiteSettings } from "@/lib/cms";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = s.seo.defaultTitle;
  const description = s.seo.defaultDescription;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: s.seo.titleTemplate },
    description,
    applicationName: s.siteName,
    openGraph: {
      type: "website",
      siteName: s.siteName,
      title,
      description,
      url: site.url,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSiteSettings();

  return (
    <html lang="en" className={`${ivarDisplay.variable} h-full`}>
      <body className="text-cream min-h-full bg-black relative">
        {/* Global stage layers (TASK.md §6): red light UNDER grain UNDER content */}
        <CursorGlow className="fixed inset-0" style={{ zIndex: 9999 }} />

        <SmoothScroll />
        <Nav
          menuItems={s.menuItems}
          letsChatLabel={s.letsChatLabel}
          letsChatHref={s.letsChatTarget}
          tagline={s.ideaTagline}
          shortName={s.shortName}
        />

        <div
          className="relative flex min-h-screen flex-col"
          style={{ zIndex: "var(--z-content, 10)" }}
        >
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer socials={s.socials} footerCredit={s.footerCredit} />
        </div>
        <Analytics />
      </body>
    </html>
  );
}