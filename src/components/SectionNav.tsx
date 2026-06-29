import Link from "next/link";
import Logo from "./Logo";

/**
 * SectionNav — the repeated, per-section sticky nav used on the restructured
 * About page (sections 4–9). Logo left, a pill of nav links + hamburger right.
 * Transparent background, sticky to the top of its section, z-10.
 *
 * NB: the site's global chrome nav (Menu / Let's chat) still renders from the
 * root layout above this; this is the design-reference nav for the About page.
 */
const LINKS = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Career", href: "/careers" },
];

export default function SectionNav() {
  return (
    <nav className="sticky top-0 z-10 flex w-full items-center justify-between px-6 py-4">
      <Logo className="w-[80px]" />
      <div className="flex items-center gap-6 rounded-full border border-white/25 px-5 py-2 backdrop-blur-sm sm:gap-8 sm:px-6">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-body text-[13px] transition-opacity hover:opacity-70"
            style={{ color: "#f5f0e8" }}
          >
            {l.label}
          </Link>
        ))}
        <span aria-hidden="true" className="text-lg leading-none">
          ≡
        </span>
      </div>
    </nav>
  );
}
