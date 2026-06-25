# TASK.md — Rebel Mind Zone (RMZ) Website

## 0. What we're building

A small, fast, **grainy editorial** marketing-agency website for **Rebel Mind Zone (RMZ)**.
The brand idea is **"Creative Rebellion is not chaos"** — disciplined, confident, creatively
bold. The visual world is: a near-black stage, a warm cream serif, a single diagonal **red
light** bleeding in from a corner, three small accent blocks (yellow / orange / green), and a
**film-grain texture over everything**. The hero has a **cursor-reactive animation** — this is
the signature moment of the site.

Keep it simple. The site is content-light and typography-led. Resist clutter. Spend the
boldness in the hero and the grain; keep everything else quiet and disciplined.

---

## 1. Tech stack (use exactly this unless you flag a reason)

- **Next.js 15**, App Router, TypeScript, `src/` directory
- **Tailwind CSS v4**
- **Framer Motion** (`motion`) — transitions, scroll reveals, cursor parallax
- **Lenis** (`lenis` / `@studio-freight/lenis`) — smooth scroll
- **next/font** (local) for the two typefaces
- Grain + cursor effect: see §6. Default to **SVG `feTurbulence` overlay** for ambient grain,
  and a **`<canvas>` or lightweight WebGL** layer for the cursor-reactive hero. Only reach for
  `three` / `@react-three/fiber` if the canvas approach can't hit the look — keep the bundle lean.

No CMS, no database, no auth. Content is hardcoded in typed data files (`src/content/*.ts`) so
it's trivial to edit later.

---

## 2. Brand tokens

### Colors

> ⚠️ These hex values are **sampled from the rasterized PDF exports** and are close but not
> guaranteed exact. Ahmad has the vector source — confirm the precise hex for Rebel Red, Cream,
> and the three accents before final, and update `globals.css` if they differ.

| Token            | Hex (approx)  | Role                                                        |
|------------------|---------------|-------------------------------------------------------------|
| `--ink`          | `#000000`     | Primary background / stage                                  |
| `--ink-soft`     | `#0A0A0A`     | Slightly raised surfaces, section seams                     |
| `--cream`        | `#EFE5CC`     | Primary text on dark, the "paper" tone                      |
| `--cream-dim`    | `#C9C0AA`     | Secondary text, captions                                    |
| `--rebel-red`    | `#E12E1C`     | The brand red — the diagonal light, links, active states    |
| `--red-deep`     | `#8E1A10`     | Darker end of the red light gradient                        |
| `--acc-yellow`   | `#FDC82F`     | Accent block                                                |
| `--acc-orange`   | `#E85D1E`     | Accent block                                                |
| `--acc-green`    | `#8DC63F`     | Accent block                                                |

Color philosophy (from the brand deck — honor it):
- **Red** = energy, boldness, the courage to challenge the ordinary. Use it sparingly and with
  intent: the diagonal light, hover/active states, the live "Egyptian market" highlight, the
  ® mark. Red is a punch, not a fill.
- **Cream/Beige** = maturity, balance, sophistication. This is the main text + the calm.
- **Black** = strength, clarity, authority. The stage everything sits on.
- **Yellow / Orange / Green** = "diversity in thinking." Three perspectives in one mind. Always
  appear together as a small trio; never as a rainbow spread.

### The red light

A diagonal radial/linear bleed entering from the **bottom-right** corner, fading into pure black
toward the top-left. On the hero and contact sections it's strong; elsewhere it's a faint ember.
Reference: Website storyboard pages 4–7. Build it as a fixed/absolute gradient layer that sits
**under** the grain and content.

### Typography

Two roles. Match the storyboard's high-contrast editorial feel.

- **Display (headings, statements):** a high-contrast editorial serif used in **italic** for the
  signature lines ("Let's create a new STORY..", "Brand Identity Design", "Content Strategy").
  - First choice if Ahmad licenses it: **PP Editorial New** (matches the storyboard closely).
  - Free, self-hostable alternative that gets very close: **Fraunces** (variable, optical sizing,
    strong italic) or **Instrument Serif**. Default to **Fraunces** so the repo works out of the
    box; leave a clearly marked swap point for PP Editorial New.
- **Utility / nav / body:** a clean neutral **grotesque** for "Menu", "Let`s chat", the numbered
  service nav, body copy, and footer. Use **Inter** or **Geist**. Default **Inter**.

Type behavior:
- Display sizes are **large and editorial** — hero statement should feel like a magazine spread,
  not a SaaS headline. Mix roman + italic + weight within a single statement the way the
  storyboard does (e.g. "COLOR PALETTE *balances* **BOLD** EXPRESSION *with Professional Presence.*").
- Tight, deliberate leading on display; comfortable leading on body.
- Self-host all fonts via `next/font/local` (no FOUT, no external request).

---

## 3. Logo / wordmark

The `rmz` mark (lowercase, custom geometric, with the three accent blocks sitting above the `m`
like little roof tiles, and a ® mark top-left). See logo deck page 5 and storyboard page 4.

- Ask Ahmad for the **SVG** of the logo (preferred — it's a vector brand asset). Place at
  `public/brand/rmz-logo.svg` and a cream-on-transparent variant for dark use.
- If no SVG is provided yet, build a **faithful SVG placeholder** of the lowercase `rmz` with the
  three colored squares above the `m`, so layout/dev isn't blocked. Mark it clearly as a placeholder
  in `NOTES.md` so it gets replaced.
- Two lockups: (a) icon-only `rmz` mark; (b) stacked signature `rmz` + "REBEL / MIND / ZONE".
- The big centered `rmz` wordmark is its own moment on the Home page (storyboard page 4).

---

## 4. Pages & navigation

| Priority   | Route                  | Page              |
|------------|------------------------|-------------------|
| Essential  | `/`                    | Home              |
| Essential  | `/about`               | About Us          |
| Essential  | `/services`            | Services          |
| Essential  | `/portfolio`           | Portfolio         |
| Essential  | `/contact`             | Contact Us        |
| Important  | `/careers`             | Careers           |
| Required   | `/privacy`             | Privacy Policy    |
| Required   | `/terms`               | Terms & Conditions|

**Global chrome (every page):**
- Top-left: `≡ Menu` (italic serif label). Opens a full-screen overlay menu — black + grain,
  large italic-serif links, the accent trio as a small detail. Animate open/close.
- Top-right: `Let`s chat` (italic serif) → links to `/contact`.
- Bottom-left on inner pages: `Contact us here` (italic) → `/contact`.
- Bottom-right: `© 2024 All rights reserved. fromanother.` (keep this exact footer credit from
  storyboard page 5–7, but make the year dynamic).
- The grain overlay and red-light layer are global (in the root layout), not per-page.

**Menu items** (the overlay): Home, About Us, Services, Portfolio, Careers, Contact. Privacy &
Terms live in a small footer row, not the main menu.

---

## 5. Page-by-page spec

### `/` Home  (the showcase — most of the storyboard lives here)
Sequence top to bottom:
1. **Intro loader** (storyboard pages 1–2): on first load, the three accent blocks
   (green / orange / yellow) animate in on black with the red corner light, briefly rearrange,
   then resolve into the site. Keep it short (~1.2–1.8s), skippable, and **only on first visit**
   (don't replay on every client-side navigation). Respect `prefers-reduced-motion` (show final
   state instantly).
2. **Hero statement** (storyboard page 3): the editorial line
   *"COLOR PALETTE balances BOLD EXPRESSION with Professional Presence."* set in mixed
   roman/italic/weight. `Menu` / `Let`s chat` in place. Accent blocks + hairline rules flank the
   text. Scroll cue at bottom-center. **This section carries the cursor-reactive animation (§6).**
3. **rmz wordmark moment** (storyboard page 4): the large cream `rmz` centered on black with the
   red light, accent blocks above the `m`. A held, confident beat. Subtle scroll/parallax reveal.
4. **Services teaser** → links into `/services`. A short list of the six offerings.
5. **Markets / CTA** (storyboard page 7): "Let`s create a new STORY.." with the four market
   columns (Gulf, Levantine, Arab, Egyptian) and socials. This can be the shared footer block
   (see Contact) or a condensed teaser that links to `/contact`.

### `/about` About Us
Built from the brand deck. Sections:
- **Brand idea:** Creative Rebellion — "not rebellion for the sake of rebellion… disciplined
  creativity, guided by experience, curiosity, and innovation."
- **Brand character:** thoughtful, confident, creatively bold; challenges ideas to improve, not
  disrupt; connects people, perspectives, possibilities.
- **Brand as a personality:** calm, confident, curious, a great listener, intelligent without
  being overwhelming, relatable across generations. (The deck references a real public figure as
  a personality archetype — **do not name or quote the real person on the public site**; express
  the *traits* in RMZ's own voice instead.)
- Closing statement: *"A bold creative mind that dares to challenge the ordinary in order to
  create extraordinary ideas."* (logo deck page 9 — use as a full-bleed editorial closer.)

### `/services` Services
From storyboard pages 5–6. Six numbered offerings with the **blurred stacked sub-items** effect
behind a sharp section title (storyboard pages 5–6 show this clearly). Left rail = numbered nav
that highlights the active service; the inactive items dim.
1. **Design** — Brand Identity Design, Packaging Design, Web & App Design, Print Design
2. **Content Creation** — Content Strategy, Copywriting, Blog Writing, Social Media Content
3. **Photography**
4. **Video Production**
5. **Creative Consulting**
6. **Web & App Development**

Active item: sharp cream title + crisp sub-list. Behind/around it, the other sub-items render
**blurred and large** (the storyboard's defocused-text look). Selecting a number swaps the focus.

### `/portfolio` Portfolio
Editorial case-study grid on black with grain. Placeholder projects (clearly marked) until Ahmad
supplies real work. Each card: project name (italic serif), client/market tag, one-line result
("We solved the problems of dozens of clients."), hover micro-interaction (red underline grow,
subtle scale, grain shift). Filter by market or discipline is a nice-to-have, not required.

### `/contact` Contact Us
The storyboard page 7 layout as the real page:
- Left: huge *"Let`s create a new STORY.."* with the accent trio.
- Right: the four market columns — **The Gulf market**, **The Levantine market**,
  **The Arab market**, **The Egyptian market**. Each: "Restaurants / Automotive / Decorations",
  "We solved the problems of dozens of clients.", and a contact line. The **Egyptian market**
  column is rendered in **red** as the "home / active" market (matches storyboard).
- A simple contact form (Name, Email, Message) — client-side validation, accessible labels, a
  clear success/empty/error state in the interface's own voice (no fake apology copy). Wire submit
  to a placeholder handler / `mailto:` for now; leave a clearly marked TODO for a real endpoint.
- Socials: Instagram, Facebook, LinkedIn.
- Use the real phone format from the storyboard as placeholder: `+02 01000 45 666` (flag for Ahmad
  to confirm/replace).

### `/careers` Careers (Important)
Keep it on-brand and minimal. Intro line in the RMZ voice (creative rebels welcome), a short list
of open roles (placeholder roles, clearly marked), and an application CTA pointing at contact /
an email. No applicant-tracking integration.

### `/privacy` & `/terms` (Required)
Standard legal pages, same chrome, calm single-column reading layout (cream on near-black, larger
line-height, constrained measure ~65ch). **Write clearly-labeled placeholder/boilerplate legal
copy** and put a prominent note at the top of each: *"Template text — review with legal counsel
before publishing."* Do not present invented legal text as final.

---

## 6. The grain + the hero cursor animation (the signature)

### Ambient grain (whole site)
- A fixed, full-viewport overlay above background/light but below content, `pointer-events: none`.
- Use an SVG `feTurbulence` + `feColorMatrix` noise, low opacity (~6–12%), `mix-blend-mode`
  tuned so it reads as film grain over both black and the red light.
- Optional very-subtle animation (grain "shimmer") — keep it cheap; disable under reduced-motion.

### Hero cursor-reactive animation (REQUIRED — this is the centerpiece)
On the Home hero, the composition responds to **cursor movement**. Implement a layered effect,
not a gimmick:
- **Cursor-tracked light:** the red diagonal light's focal point (or a soft red glow) eases toward
  the cursor, so moving the mouse feels like dragging a light across the grain.
- **Grain reacts to the cursor:** locally intensify / displace the grain near the pointer (a
  spotlight of denser grain, or a slight turbulence/displacement that follows the cursor). A
  `<canvas>` noise field sampled per-frame with a mouse-influenced seed/offset works well; a small
  WebGL shader (noise + a mouse uniform) is the higher-fidelity option if the canvas look falls short.
- **Accent blocks + statement parallax:** the three accent blocks and hairline rules drift on a
  spring toward/away from the cursor at different depths (Framer Motion `useSpring` on mouse
  position) for subtle parallax. Small movement — this is editorial, not a toy.
- Motion is **eased and damped** (springs, not 1:1 jitter). On touch devices, fall back to a gentle
  ambient autoplay version. Under `prefers-reduced-motion`, render the static composition.
- Keep it 60fps: throttle to `requestAnimationFrame`, avoid React re-render per mouse event (write
  to refs / motion values, not state).

---

## 7. Motion language (rest of site)
- Page transitions: short cross-fade / light-wipe in the red+grain language. No flashy slides.
- Scroll reveals: cream text rises + fades on entry (Framer Motion `whileInView`, once). Restrained.
- Hover micro-interactions: red underline grow on links, slight grain shift on cards, accent-block
  nudge. One idea per element. Per the design skill: remove one accessory before shipping.

---

## 8. Quality floor (all required)
- Fully responsive; design mobile-first, verify the hero animation degrades gracefully on phones.
- Visible keyboard focus states; full keyboard nav incl. the Menu overlay (focus trap + Esc to close).
- `prefers-reduced-motion` respected everywhere (loader, hero, scroll reveals, grain shimmer).
- Semantic HTML, alt text, sufficient contrast for body text (cream on black passes; check
  red-on-black for any body-size text and bump if needed).
- Lighthouse: aim Performance ≥ 90, Accessibility ≥ 95. Self-host fonts, lazy-load heavy canvas.
- Metadata + Open Graph per page; a simple favicon from the `rmz` mark.
- Clean TypeScript (no `any` in app code), `npm run build` passes with zero errors.

---

## 9. Suggested structure
```
src/
  app/
    layout.tsx            # grain + red-light layers, Menu/Let's-chat chrome, fonts
    page.tsx              # Home
    about/page.tsx
    services/page.tsx
    portfolio/page.tsx
    contact/page.tsx
    careers/page.tsx
    privacy/page.tsx
    terms/page.tsx
    globals.css           # tokens as CSS vars (§2)
  components/
    Grain.tsx             # ambient SVG/canvas grain overlay
    RedLight.tsx          # diagonal red gradient layer
    HeroCursorField.tsx   # the cursor-reactive hero animation
    IntroLoader.tsx       # first-visit blocks intro
    MenuOverlay.tsx
    Nav.tsx               # Menu + Let's chat
    Footer.tsx            # markets / socials / © credit
    AccentBlocks.tsx      # the yellow/orange/green trio
    Logo.tsx              # rmz lockups
    ServiceRail.tsx       # numbered services w/ blurred stacked text
  content/
    services.ts  markets.ts  portfolio.ts  nav.ts  site.ts
  lib/
    useMousePosition.ts  useSmoothScroll.ts  reducedMotion.ts
public/
  brand/  rmz-logo.svg  ...
  fonts/  (self-hosted)
```

---

## 10. Build order
1. Scaffold + deps + fonts + tokens in `globals.css`. Blank dev server up.
2. Root layout: grain layer, red-light layer, Nav (Menu + Let`s chat), Footer. **Get the
   black + cream + red + grain "stage" feeling right before any page content** — this is the
   make-or-break of the whole look.
3. Home hero + **cursor animation** (§6). Iterate until it feels alive but disciplined.
4. Intro loader + rmz wordmark moment.
5. Services (numbered rail + blurred stacked text).
6. Contact (markets layout + form) and the shared Footer/markets block.
7. About, Portfolio, Careers.
8. Privacy, Terms.
9. Responsive pass, a11y pass, reduced-motion pass, Lighthouse, `npm run build`.
10. Replace placeholders (logo SVG, real portfolio, real phone/socials, confirmed hex) — list every
    placeholder in `NOTES.md` for Ahmad.

---

## 11. Acceptance criteria (definition of done)
- [ ] All 8 routes exist, navigable via Menu overlay + links, with the global chrome.
- [ ] Grain is visible site-wide; red diagonal light present and correctly layered.
- [ ] Home hero animation **reacts to cursor movement** (light + grain + parallax), eased, 60fps,
      with touch + reduced-motion fallbacks.
- [ ] First-visit intro loader plays once, skippable, reduced-motion safe.
- [ ] Brand colors and `rmz` wordmark match the spec; accent trio used as a trio only.
- [ ] Display = editorial italic serif, body = grotesque, both self-hosted.
- [ ] Services page shows the numbered rail + blurred stacked sub-items focus effect.
- [ ] Contact shows the four markets (Egyptian in red) + working validated form (placeholder submit).
- [ ] Privacy & Terms carry the "template text — review with counsel" notice.
- [ ] No real public figure named/quoted on the public site (About expresses the traits only).
- [ ] Mobile responsive, keyboard accessible, `prefers-reduced-motion` honored, `npm run build` clean.
- [ ] `NOTES.md` lists every placeholder needing Ahmad's real asset/value.

---

## 12. Open items for Ahmad (don't block — placeholder + flag)
- Exact hex for Rebel Red, Cream, and the three accents (from vector source).
- Logo SVG (both lockups) + favicon source.
- Whether to license **PP Editorial New** or ship with **Fraunces**.
- Real portfolio projects, real phone number(s), real social URLs, careers roles.
- Final domain (for canonical URLs / OG tags) and whether the form should hit a real endpoint
  (e.g. Resend / Formspree) instead of `mailto:`.
