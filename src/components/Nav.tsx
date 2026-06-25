"use client";

import { useState } from "react";
import Link from "next/link";
import MenuOverlay from "./MenuOverlay";

/**
 * Global top chrome (TASK.md §4): ≡ Menu (top-left, italic serif) opens the
 * full-screen overlay; Let's chat (top-right, italic serif) → /contact.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 flex items-center justify-between px-5 py-5 sm:px-8"
        style={{ zIndex: "var(--z-chrome)" }}
      >
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="font-display group hover:text-rebel-red flex cursor-pointer items-center gap-2 text-lg italic transition-colors"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ≡
          </span>
          <span>Menu</span>
        </button>

        <Link
          href="/contact"
          className="font-display hover:text-rebel-red text-lg italic transition-colors"
        >
          Let&rsquo;s chat
        </Link>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
