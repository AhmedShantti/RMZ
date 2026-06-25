# CMS_TASK.md — Rebel Mind Zone Admin Dashboard / CMS

## 0. Goal & hard guardrails

Add a **protected admin dashboard** to the **existing** `rmz-website` (Next.js 16 + TS + Tailwind)
that gives full editorial control over the content **that already exists on the public site** —
and nothing more.

**Non-negotiable rules:**
1. **Model only what exists.** Every collection, global, and field must map to real content already
   on the public site (per the original `TASK.md`). Do **not** invent a blog, shop, events,
   testimonials engine, multi-language, page-builder, or any content type that has no home on the
   site today. If a field has nowhere to render, it doesn't belong.
2. **CMS is a content-source swap, not a redesign.** The public site's design, layout, animation,
   grain, red light, brand tokens, fonts, and component structure stay **exactly** as built. We are
   only replacing where the text/images come from (the hardcoded `src/content/*.ts` → the CMS).
   For unchanged content, every page must render pixel-identical before and after the migration.
3. **One protected URL.** The dashboard is reachable only when authenticated. No public sign-up.
4. **Don't touch the hero animation internals.** The cursor hero writes to refs/motion-values; the
   CMS only feeds it text/config, never re-architects it.

---

## 1. Approach (recommended)

**Payload CMS 3, embedded in the existing Next.js app.**
- Admin UI mounts at a **configurable path** (default `/studio`; pick a non-obvious one for prod).
- Database: **Postgres** (Neon/Vercel free tier works) for prod; SQLite fine for local dev.
- Payload generates TypeScript types, so the public site keeps full type safety.
- Open-source, self-hosted, lives in the same deployment — no separate service.

> If Ahmad prefers a different route, see the **Appendix** for a custom Auth.js+Prisma dashboard or
> the git-based Keystatic (no database) option. Do not proceed with an alternative without his OK.

---

## 2. Content model — 1:1 with the site

Define **globals** (single-instance content) and **collections** (repeatable content). Nothing here
should exist that isn't visible on the public site.

### Globals (one of each)
- **`siteSettings`** — socials (Instagram, Facebook, LinkedIn URLs), phone number, footer credit
  text (default `© {year} All rights reserved. fromanother.`), `Let`s chat` target, and the
  **menu items** (label + route) — chosen only from the site's real routes (Home, About, Services,
  Portfolio, Careers, Contact). Plus default SEO (site title template, default description, default
  OG image).
- **`homeContent`** — intro-loader on/off toggle + accent-block order; the **hero statement**
  (structured — see §3); the `rmz` wordmark-moment label (if any text); which services appear in
  the Home teaser.
- **`aboutContent`** — brand idea, brand character, personality traits (list of strings), closing
  statement. *(No field that invites naming a real public figure — keep the original rule.)*
- **`servicesContent`** — the six numbered services, each `{ title, items[] }`, ordered. Seeded with
  the real six (Design / Content Creation / Photography / Video Production / Creative Consulting /
  Web & App Development) and their sub-items. Add/remove allowed, but seeded to match the site.
- **`contactContent`** — contact hero line; the **four markets** as an ordered array
  `{ label, categories, blurb, contactLine, isHighlighted }` (Gulf, Levantine, Arab, Egyptian —
  Egyptian `isHighlighted: true`); contact-form settings (recipient email / endpoint) and the
  form's success / empty / error microcopy.
- **`careersContent`** — intro line + application CTA (label + target). Roles live in a collection
  (below) or as an inline array here — pick one, don't duplicate.
- **`legalPrivacy`** & **`legalTerms`** — rich-text body, a "template text — review with counsel"
  banner toggle, and a `lastUpdated` date.

### Collections (repeatable)
- **`portfolioProjects`** — `name`, `slug`, `marketTag` (client/market), `resultLine` (the one-liner),
  `coverImage` (→ media), `externalLink`, `order`, `published`, per-item SEO. *(No gallery/body
  field unless the public Portfolio actually shows one — it doesn't today, so omit it.)*
- **`careerRoles`** — `title`, `type`, `location`, `description`, `applyTarget`, `published`, `order`.
  (Use this **or** the inline array in `careersContent`, not both.)
- **`media`** — uploads for portfolio covers, OG images, and the `rmz` logo SVG.
- **`users`** — admin accounts with **roles** (`admin`, `editor`). No public registration.

### Per-page SEO
Each page global/collection carries optional `seoTitle`, `seoDescription`, `ogImage` overrides that
feed the existing per-page metadata. Don't add SEO fields for pages that don't have a metadata slot.

### Brand tokens — intentionally NOT editable
Colors and fonts stay in code to protect the tuned identity. Do **not** build a "theme editor."
(Optional, off by default: a read-only "Brand reference" panel that *displays* the locked tokens for
editors to see — no write access.)

---

## 3. Hero statement = structured runs (important)

The hero line mixes roman / italic / weight per word ("COLOR PALETTE *balances* **BOLD** EXPRESSION
*with Professional Presence.*"). **Do not store it as a plain string.** Model it as an ordered array
of runs:

```ts
type Run = { text: string; style: 'normal' | 'italic' | 'bold' | 'bold-italic'; upper?: boolean };
```

The existing Hero component renders `runs` → `<span>`s with the right class. This keeps the editorial
typography fully editable from the dashboard without flattening it. Apply the same pattern to any
other mixed-style display line on the site (e.g. the Contact "Let`s create a new STORY..").

---

## 4. Auth & protection
- Use Payload's auth on the `users` collection; gate the admin path. Unauthenticated visits to the
  dashboard URL → redirect to login. No open registration; seed the first admin via an env-driven
  script.
- Enforce roles: `admin` = everything (incl. users + settings); `editor` = content only.
- Secrets in env only (`PAYLOAD_SECRET`, `DATABASE_URI`, admin seed creds) — never committed.
- Secure, httpOnly cookies; CSRF protection on; HTTPS-only in prod; login rate-limiting.
- **Recommended extra gate** in front of the admin path for defense-in-depth: an IP allowlist or a
  platform password (e.g. Vercel deployment protection) on the `/studio` route. Document whichever
  is chosen in `NOTES.md`.

> Build-side note for Claude Code: implement the auth flow and seeding **in code**. Do not hardcode
> any real password — read it from env and document the setup steps for Ahmad to run himself.

---

## 5. Wire the public site to the CMS (without changing the design)
- Replace reads from `src/content/*.ts` with CMS queries in server components. **Keep the exact same
  prop shapes** the components already expect, so no design/animation code changes.
- Use ISR + **on-demand revalidation**: saving in the dashboard triggers `revalidatePath` /
  `revalidateTag` for the affected routes, so edits go live without a redeploy.
- Keep generated Payload types as the typed content layer (preserves TS safety end to end).
- Verify: grain, red light, cursor hero, reduced-motion, and tokens are byte-for-byte unchanged for
  identical content.

---

## 6. Migration / seed
- Write a seed script that imports the **current** `src/content/*.ts` values into the matching
  globals/collections, so the live site is identical immediately after migration.
- After parity is confirmed, the old content files can be deleted (or kept as the seed source).

---

## 7. Media & images
- Portfolio covers + OG images go through the Payload `media` collection. Local disk in dev; for
  prod use a storage adapter (S3 / Cloudflare R2 / Vercel Blob — pick one, note the choice).
- `next/image` stays the renderer on the public side; preserve existing `alt` text discipline.

---

## 8. Definition of done
- [ ] Dashboard reachable **only** when authenticated; unauth → login redirect.
- [ ] Every public text block / section in §2 is editable from the dashboard and re-renders correctly.
- [ ] **No collection, global, or field exists that has no home on the public site.**
- [ ] Hero (and any mixed-style line) editable via structured runs, typography preserved.
- [ ] Edit → save → revalidate reflects on the live page without redeploy.
- [ ] Roles enforced (admin vs editor); no public registration; secrets in env.
- [ ] Portfolio + career roles support full CRUD with publish/draft + ordering.
- [ ] Design parity: side-by-side screenshots of each page (pre- vs post-migration, identical
      content) match. No regressions to grain, red light, hero animation, fonts, or a11y.
- [ ] `npm run build` clean; Payload types generated; `NOTES.md` updated with setup steps + choices.

---

## 9. Dependencies (add to the existing app)
```bash
npm install payload @payloadcms/next @payloadcms/richtext-lexical @payloadcms/db-postgres sharp
# local-only alternative DB: @payloadcms/db-sqlite
# prod storage adapter (pick one): @payloadcms/storage-s3  |  @payloadcms/storage-vercel-blob
```
Node 20+. Add the admin route + Payload config per Payload 3's Next.js install guide. Confirm exact
package names/versions against the current Payload docs at build time (they move fast).

---

## 10. Build order
1. Install Payload into the existing app; mount admin at `/studio`; connect DB; seed first admin from env.
2. Define globals + collections per §2 — **only existing content**.
3. Implement the hero structured-runs field + the render adapter in the existing Hero component.
4. Run the seed script; confirm the site is identical to pre-CMS.
5. Swap all public reads to the CMS; add on-demand revalidation.
6. Harden auth: roles, rate-limit, extra gate on the admin path.
7. Wire prod media storage.
8. QA: parity screenshots, build, a11y + reduced-motion unaffected, role tests.

---

## Appendix — alternatives (only if Ahmad chooses one)
- **Custom dashboard** — Auth.js (credentials) + Prisma + Postgres, hand-built CRUD screens scoped to
  §2. Most bespoke and most literally "based on the website only," but the most code to write and
  maintain, and more surface area for bugs.
- **Keystatic (git-based, no database)** — content stays as files in the repo; edits commit via the
  admin UI; great for Git history and zero-DB hosting, but live-editing UX and auth differ (needs
  Keystatic Cloud or GitHub auth for a hosted protected dashboard).
