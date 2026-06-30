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

---

## CMS — Payload 3 (admin dashboard)

### Setup steps (for Ahmad)
1. **Env:** copy `.env.example` → `.env.local`. Set `PAYLOAD_SECRET` (`openssl rand -hex 32`),
   `DATABASE_URI` (local: `file:./rmz.db`; prod: Neon/Vercel Postgres URL), `ADMIN_EMAIL` +
   `ADMIN_PASSWORD` (first admin), and in prod `BLOB_READ_WRITE_TOKEN` (Vercel Blob).
2. **Install:** `npm install` (Payload 3.85.1 + Next 16 are peer-compatible; no flags).
3. **Seed first admin:** `npm run seed` (idempotent; reads ADMIN_EMAIL/PASSWORD from env).
4. **Types:** `npm run generate:types` (writes `src/payload-types.ts`).
5. **Run:** `npm run dev` → admin at **`/studio`** (login screen if unauthenticated).

### Choices
- **Payload 3.85.1 embedded** in this Next 16 app. Admin path `/studio` (`routes.admin`,
  overridable via `PAYLOAD_ADMIN_PATH`). DB: **SQLite local / Postgres prod** (chosen by URI
  scheme). Media: **disk local / Vercel Blob prod** (adapter enabled when token present).
- App restructured into `app/(frontend)/` (the site) + `app/(payload)/` (admin/API) route
  groups — **route groups don't change URLs**; every public route + the design is untouched.

### ⚠️ Tooling workaround — Payload CLI vs Node 22.23/24 (important)
The bundled `payload` CLI uses `tsx` to load the TS config, which **breaks on this machine's
Node** (24 → tsx `?namespace=` resolution bug; 22.12+ → `require()` of ESM hits
`@payloadcms/richtext-lexical`'s top-level await; `@next/env` default-interop also breaks under
tsx). Tried tsx (all flags), `--use-swc`, `--disable-transpile`, Node 20/22 — each failed
differently. **Resolution:** drive the config-loading scripts with **Node's native TS
type-stripping** (no transpiler) instead of the CLI:
- `npm run seed` → `node scripts/seed.mts`
- `npm run generate:types` → `node scripts/generate-types.mts` (calls `generateTypes` from the
  public `payload/node` export)
Both load env first, then dynamic-import the config. Requires `.ts` extensions on the config's
relative imports (`allowImportingTsExtensions: true` in tsconfig) so native ESM can resolve them.
`next dev` / `next build` are unaffected — they load the config via Turbopack, not tsx.
Node 20 + 22 were installed via Homebrew during debugging; the app runs on the default Node.

### Schema (only existing content)
- Globals: `siteSettings`, `homeContent`, `aboutContent`, `servicesContent`, `contactContent`,
  `careersContent`, `legalPrivacy`, `legalTerms`. Collections: `portfolioProjects`,
  `careerRoles`, `media`, `users`. Mixed-style display lines use the structured **runs** field
  (`{text, style, tone, upper, noSpaceBefore}`) rendered by `RunsText` — identical typography.
- Per the approved schema, omitted from portfolio (no render home today): coverImage, slug/detail
  page, externalLink, per-item SEO. Portfolio page header copy stays code-driven (no global).

### Read-swap + revalidation
- `src/lib/cms.ts`: server-only getters (React `cache` deduped) returning the **same prop shapes**
  the components already used, with code defaults as a safety fallback. Pages are server
  components passing data into the unchanged presentational components.
- On-demand revalidation: `src/payload/hooks/revalidate.ts` `revalidatePath`s the affected
  routes on save (siteSettings → whole layout). `next/cache` is lazily imported so the seed's
  non-request context doesn't trip it.
- Legal body stored as Lexical; `src/lib/lexical.ts` walks it back into the numbered-section
  layout for byte-parity.

### Auth & roles (verified)
- Roles: **admin** (everything incl. users + siteSettings) / **editor** (content only). Verified
  by API: public registration → 403; editor edits content → 200; editor edits settings / creates
  users → 403. Secure httpOnly cookies (secure in prod), 5-attempt lockout (10 min).
- **First admin:** `npm run seed` (env creds). No public sign-up.
- **Extra gate (recommended for prod):** enable **Vercel Deployment Protection** (or an IP
  allowlist / Vercel password) in front of the deployment so `/studio` isn't world-reachable
  even before login. Or set a non-obvious `PAYLOAD_ADMIN_PATH`.

### Prod DB + media
- DB: SQLite local (`file:./rmz.db`) / **Postgres prod** (set `DATABASE_URI` to the Neon/Vercel
  Postgres URL — adapter auto-selected by URI scheme).
- Media: local disk in dev / **Vercel Blob** in prod (set `BLOB_READ_WRITE_TOKEN`; adapter
  auto-enables). `serverURL`/CSRF/CORS auto-set in prod from `NEXT_PUBLIC_SERVER_URL` or Vercel's
  production URL.

### Build order progress
- ✅ Step 1: Payload installed, `/studio` admin, SQLite, env-driven first-admin seed; build clean
  (8 static frontend routes unchanged + dynamic `/studio` & `/api/*`). Login verified (JWT, role).
- ✅ Steps 2–7: schema, runs field + adapter, full seed (globals + collections), read-swap with
  revalidation, role hardening, prod DB/Blob config.
- ✅ Step 8 (QA): `npm run build` clean (8 frontend routes still **statically prerendered** from
  the CMS + dynamic `/studio` & `/api/*`); `eslint` clean; types generated. **Parity** confirmed
  (hero, services rail, legal numbered sections, CMS-driven menu all render identically). **Roles**
  verified by API (registration 403 / editor content 200 / editor settings+users 403). **On-demand
  revalidation proven in prod**: edited `/about` via API → static page updated live (no rebuild) →
  reverted. Menu focus-trap + Esc + focus-return intact; reduced-motion guards untouched.

### CMS placeholders for Ahmad (in addition to the original site placeholders above)
- Set real `DATABASE_URI` (Postgres) + `PAYLOAD_SECRET` + `BLOB_READ_WRITE_TOKEN` in Vercel.
- Run `npm run seed` once against prod DB to populate it (or recreate content in `/studio`).
- Change the seeded admin password; consider a non-obvious `PAYLOAD_ADMIN_PATH` + Vercel
  Deployment Protection on `/studio`.
- The local SQLite `rmz.db` + `/media` uploads are gitignored (never committed).

---

## Intro animation refactor (animation-prompt.md / animation-task.md)

Refactored the first-visit intro loader from per-square Framer Motion into a **3-phase
choreographed sequence** driven by `data-phase` + CSS (per the prompt's required structure):

- **`IntroLoader.tsx`** is now a phase controller only — it toggles
  `data-phase="initial" → "scatter" → "final"` on `setTimeout` timing (entry 600 / hold 800 /
  scatter 900 / final 600 ms), then wipes the curtain up to reveal the site. Still once-per-session,
  skippable (click/key), CMS-toggleable (`enabled`), reduced-motion safe.
- **`globals.css`** owns every visual state via `[data-phase]` selectors using `transform:
  translate()` only (never left/top/width/height) and CSS custom properties for all positions/sizes
  (`--S: clamp(80px,10vw,120px)`, `--green-scatter-x`, `--yellow-scatter-y`, …). Viewport-relative.
- **Geometry verified** (measured in-browser): Phase 1 = centered G·O·Y group, gap = S×0.25;
  Phase 2/3 = green left-centre @22vw (centre on 50vh), yellow @68vw (bottom on 50vh), orange below
  yellow @68vw with gap = S (orange top = 50vh + S). Mobile @375px: no overflow. Reduced motion
  jumps straight to final. `npm run build` + `eslint` clean.
- **Square colors:** the prompt's hexes (`#7DC242/#E8451A/#F9C020`) are labelled "approximate" in
  animation-task.md, so the squares use the **exact brand accent tokens** (`--acc-green/-orange/
  -yellow`) for site consistency. Swap to the literal hexes if Ahmad prefers (3-line change).

---

## Typeface swap → IvarDisplay (whole site)

The entire public site now uses **IvarDisplay** (self-hosted OTF in `public/fonts/`) for both the
display and body/utility roles — replacing Fraunces (display) + Inter (body).

- `src/lib/fonts.ts`: one `localFont` with 8 faces (Regular/Medium/SemiBold/Bold + italics =
  weights 400/500/600/700), exposing `--font-display`.
- `globals.css`: `--font-body` aliased to `--font-display`, body fallback stack switched to serif.
- **Weights unchanged** — every existing weight class stays as-is; requests above 700 (e.g. the
  hero `font-black`/Logo 800) match the heaviest real face (700) since `font-synthesis-weight: none`.
- Fraunces/Inter `.woff2` left in `public/fonts/` (unreferenced) — safe to delete later.
- Verified in-browser (home + about render fully in Ivar) and `npm run build` clean.

---

## Contact form → Payload (stored submissions)

The contact form now stores each message in the CMS instead of opening a `mailto:`
(contact-form-Prompt.md).

- New collection `src/payload/collections/ContactSubmissions.ts` (slug `contact-submissions`,
  fields name/email/message + timestamps; `create` public, read/update/delete admin-only).
  Adapted the spec's v2 `payload/types` default-export snippet to this project's **Payload v3
  named-export** convention so it compiles; schema kept exactly as specified.
- Registered in `payload.config.ts` `collections` array (other collections untouched).
- `ContactForm.tsx`: **only the submit handler changed** — `mailto:` replaced with
  `fetch('/api/contact-submissions', POST {name,email,message})`, reusing the existing
  status state (+`loading`). No JSX/styling/validation changes.
- Verified: REST POST → **201** + row stored; form UI submit → success state, no Mail app;
  both rows confirmed in the DB (then cleared). `tsc`/`build` clean.
- Submissions appear in the admin at **`/studio/collections/contact-submissions`** (this app's
  admin path is `/studio`, not `/admin`). The prod build's schema-push creates the table.

---

### Known follow-ups (non-blocking)
- ✅ Logo replaced: `Logo.tsx` now renders the real brand vector `public/LOGO.svg` (red `rmz`
  + accent squares + ®) via `next/image` (`unoptimized`). The favicon (`app/icon.svg`) is still
  the earlier placeholder — swap it too if a favicon-specific asset is provided.
- Lenis intercepts programmatic `scrollTo`, which only affects test tooling, not users.

---

## Figma blend redesign (branch `Redesigned`, 10 stages)

Blended the site with the Figma references (text specs — the `/RMZ-figma/` images were not in
the repo). Kept all brand colors (existing `--acc-*` tokens) + fonts; changed only layouts,
components, and imagery.

- **S1 ClientsCollage** (home) — 3 overlapping rotated portrait placeholders + sticker badges
  over a faded `CLIENTS` watermark (`SectionWatermark`). Above markets/CTA.
- **S2 VideoSection** (home) — 16:9 video placeholder flanked by green/orange vertical-text
  strips, shared watermark. Mobile: strips → 50px horizontal bars.
- **S3 MarketsBlock** (home) — 40/60 two-column: stacked uppercase "LET'S CREATE A NEW / STORY"
  + 3 sharp accent squares (left) / 2×2 markets (right).
- **S4 Contact + `FloatingSquares`** — centred logo, squares framing the heading, info bar
  (address · email · arrow), 2-col form (+Company/Phone/Country, stored), cream pill submit.
- **S5 Services hero** — full-bleed dark image placeholder, overlay gradient, title bottom-left.
- **S6 ServiceRail** — Explore button squared-off (radius 0); stock image → labeled placeholder.
- **S7 Portfolio** — varied-height CSS-multi-column masonry; name overlay; hover scale + darken.
- **S8 Careers hero** — reuses `FloatingSquares` to frame the title.
- **S9 Image audit** — no real stock photos exist (only `LOGO.svg`); standardized every
  placeholder to #1a1a1a / #666 / 14px + TODO + "— REPLACE" labels.
- **S10 Responsive + cleanup** — swept 375 / 768 / 1280 on every page: no horizontal scroll
  anywhere (watermarks clipped by `overflow-hidden`), collage fits at 768, contact form 2-col at
  768, markets 2×2 at 768. No `console.log`, eslint clean, `npm run build` clean. No fixes needed.

**Redesign placeholders still to supply:** client photos ×3, showreel video, service hero image,
service work image, portfolio project images (all labeled). Contact office address is hardcoded
(`OFFICE_ADDRESS` in `contact/page.tsx`) with a TODO to move into `siteSettings`.
