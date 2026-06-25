import Link from "next/link";
import { legalNav } from "@/content/nav";
import AccentBlocks from "./AccentBlocks";

type Social = { label: string; href: string };

/**
 * Global footer chrome (TASK.md §4):
 *  - bottom-left "Contact us here" → /contact
 *  - bottom-right © credit (exact storyboard credit; year dynamic)
 *  - legal row (Privacy / Terms) + socials. Data fed from the CMS via props.
 */
export default function Footer({
  socials,
  footerCredit,
}: {
  socials: Social[];
  footerCredit: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-auto px-5 pb-7 pt-12 sm:px-8"
      style={{ zIndex: "var(--z-content)" }}
    >
      <div className="hairline mb-6" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <Link
            href="/contact"
            className="font-display hover:text-rebel-red w-fit text-2xl italic transition-colors sm:text-3xl"
          >
            Contact us here
          </Link>
          <div className="font-body text-cream-dim flex flex-wrap items-center gap-4 text-xs">
            <AccentBlocks size={8} />
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="font-body text-cream-dim flex gap-4 text-xs">
            {legalNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-cream transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="font-body text-cream-dim text-xs">
            © {year} {footerCredit}
          </p>
        </div>
      </div>
    </footer>
  );
}
