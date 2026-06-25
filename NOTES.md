# NOTES.md — RMZ build log & placeholder register

Running notes on what was tried + the list of every placeholder that needs a
real asset/value from Ahmad before launch.

---

## Placeholders needing Ahmad's real asset/value

| # | Placeholder | Where | Action needed |
|---|-------------|-------|----------------|
| 1 | **Brand hex** (Rebel Red, Cream, 3 accents) | `src/app/globals.css` `:root` | Confirm exact hex from vector source; sampled from PDF (TASK.md §2 warning). |
| 2 | **Logo SVG** (both lockups) | `src/components/Logo.tsx`, `public/brand/rmz-logo.svg` | Replace faithful placeholder `rmz` mark with vector. Swap point marked in code. |
| 3 | **Favicon** | `src/app/icon.svg` | Replace with logo-derived favicon. |
| 4 | **Display font licence** | `src/lib/fonts.ts` | Currently Fraunces (free). Swap to PP Editorial New if licensed — swap point marked. |
| 5 | **Portfolio projects** | `src/content/portfolio.ts` | Invented projects — replace with real case studies. |
| 6 | **Phone number** | `src/content/site.ts`, `src/content/markets.ts` | `+02 01000 45 666` is the storyboard placeholder — confirm/replace. |
| 7 | **Email addresses** | `src/content/site.ts`, `src/content/markets.ts` | Placeholder `@rebelmindzone.com` addresses. |
| 8 | **Social URLs** | `src/content/site.ts` | Instagram/Facebook/LinkedIn point at bare domains. |
| 9 | **Careers roles** | `src/content/careers.ts` | Placeholder roles — replace with real openings. |
| 10 | **Final domain** | `src/content/site.ts` `url` | For canonical URLs / OG tags. |
| 11 | **Contact form endpoint** | `src/app/contact` form handler | Currently `mailto:`/placeholder — wire Resend/Formspree. TODO marked in code. |
| 12 | **Legal copy** | `src/app/privacy`, `src/app/terms` | Boilerplate template text — review with counsel before publishing. |

---

## Build log

### Setup
- Node v24.16.0, npm 11. `create-next-app@latest` pulled **Next 16.2.9** (not 15) —
  current latest, same App Router / Tailwind v4 / React 19 stack. Kept it; flagged to Ahmad.
- Scaffolded into temp `rmz-website/` then moved to repo root (npm rejects capitalised
  dir name "RMZ" as a package name; package renamed to `rmz-website`).
- Installed `motion` (12.x) + `lenis` (1.3.x) per SKILLS.md.
- Fonts self-hosted via `next/font/local`: Fraunces variable (roman + italic) +
  Inter variable, latin-subset woff2 in `public/fonts/`.

### Design (two-pass, via ui-ux-pro-max skill)
- Skill's generic suggestion (brutalism + pink) rejected as off-brief; honoured TASK.md's
  prescribed art direction instead. Kept the a11y checklist.
- Tokens, type pairing, signature element (cursor-dragged red light + reactive grain) per
  the approved design plan.

### Stage / chrome (build order step 2)
- `globals.css`: brand CSS vars, z-index scale, focus-visible ring (red), skip link,
  reduced-motion kill-switch, grain shimmer keyframes.
- `Grain.tsx`: site-wide SVG feTurbulence noise as data-URI bg, overlay blend, ~8.5%,
  stepped shimmer (disabled under reduced-motion). Oversized inset so shimmer never
  reveals edges.
- `RedLight.tsx`: diagonal bottom-right bleed, `ember` (global) vs `strong` (hero/contact).
- `Nav.tsx` + `MenuOverlay.tsx`: Menu/Let's-chat chrome; full-screen overlay with focus
  trap, Esc, scroll-lock, clip-path reveal, numbered italic-serif links, accent trio.
- `Footer.tsx`: contact-us-here + © credit (dynamic year) + legal + socials.
- `SmoothScroll.tsx`: Lenis (off under reduced-motion).
- ✅ Stage screenshot reviewed: black + cream + red + grain reads correctly. Menu overlay
  reviewed: large italic serif, active item red, focus-trapped.

### Hero cursor field (the signature) — build order step 3
- `HeroCursorField.tsx`: (1) eased red focal glow tracks cursor (spring + useMotionTemplate);
  (2) `<canvas>` grain spotlight follows the eased pointer, re-seeded every 3 frames to
  shimmer; (3) accent/hairline/statement parallax on springs at different depths.
- **Learning — blend mode:** first used `mix-blend-mode: overlay`; over pure black, overlay
  math zeroes out → grain & spotlight invisible on the stage (only showed over the red light).
  Switched global grain + hero spotlight to `screen` (grain 0.13, spotlight 0.32) so they read
  on black AND red. This was the key fix to satisfy "grain visible site-wide".
- **Learning — touch parallax clipping:** parallax ran in ambient/touch mode and pushed the
  accent trio off-screen under `overflow-hidden`. Gated parallax to `(pointer: fine)` only;
  touch keeps the ambient glow+grain but no layout-shifting parallax. Trimmed depths.
- Pointer writes to motion values / refs (no React state per move). Touch → ambient autoplay
  (Lissajous drift). reduced-motion → static composition (no canvas/glow/parallax).

### Intro loader + wordmark — step 4
- **Learning — React 19 Strict Mode bug:** writing the `sessionStorage` "seen" flag at effect
  start meant the double-invoked second mount bailed early and never scheduled the dismiss
  timer, stranding the loader. Fixed by writing the flag in `finish()` instead.
- Loader plays once per session, skippable (key/pointer), reduced-motion → never shows.
- `WordmarkMoment.tsx`: scroll-parallax reveal of the big `rmz` signature lockup.

### Pages — steps 5–8
- Services: `ServiceRail.tsx` numbered rail (tab semantics, arrow-key nav, hover/click swap),
  sharp active title + crisp sub-list, blurred large sub-items behind (defocused look).
- Contact: statement + validated form (`ContactForm.tsx`, accessible labels/errors, success
  state in own voice, mailto placeholder) + four markets (Egyptian red, shared `MarketsColumns`).
- About expresses brand personality as TRAITS only — no real public figure named/quoted.
- Portfolio: editorial 2-col grid, CSS group-hover (red underline grow + lift + grain wash).
- Careers: minimal, placeholder roles, open-application CTA.
- Privacy/Terms: calm ~68ch column, prominent "template text — review with counsel" notice,
  `robots: noindex`.

### QA — step 9
- `prefers-reduced-motion`: handled via `useReducedMotion()` guards (loader/hero/reveal/
  wordmark/template/Lenis) + a global CSS kill-switch for animations/transitions.
- Lint: refactored matchMedia reads to a `useSyncExternalStore`-based `useMediaQuery` hook to
  clear React 19's `set-state-in-effect` rule. `npx eslint src` clean.
- `npm run build` ✅ clean — all 8 routes + icon prerendered static, zero TS errors.
- Page transition: `template.tsx` cross-fade (reduced-motion safe).
- Contrast note: Rebel Red `#E12E1C` on pure black ≈ 4.6:1 — passes WCAG AA for normal text;
  red is used for the Egyptian market column + links. Cream/cream-dim pass comfortably.

### Known follow-ups (non-blocking)
- Logo is a faithful HTML/SVG placeholder; tiles sit centered above the wordmark (≈ above the
  `m`). Replace with Ahmad's vector for exact letterforms.
- Lenis intercepts programmatic `scrollTo`, which only affects test tooling, not users.
