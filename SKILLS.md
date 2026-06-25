# SKILLS.md — what to enable & install for the RMZ build

There are two different things people mean by "skills." This covers both: the **Claude Code
skill** to switch on, and the **project dependencies** Claude Code will install while building.

---

## 1. Claude Code skill to enable

### `frontend-design`  ← the one that matters here
This is the skill that pushes Claude toward a distinctive, intentional visual identity instead of
a templated default — exactly what this brief needs (grainy editorial, not generic SaaS). It
drives a two-pass process: brainstorm a token system + a single "signature" element, critique it
against the brief, then build.

**Why it's essential here:** the brief already has a strong art direction (black stage, cream
serif, red light, grain, cursor hero). The skill keeps Claude executing *that* direction with
discipline rather than drifting into one of the common AI-design defaults.

How to enable: it ships with Claude Code's public skills. In your Claude Code session, make sure
skills are enabled and reference it (the kickoff prompt in `PROMPT.md` already tells Claude to use
it). If you're managing skills manually, ensure `frontend-design` is present and active before the
design pass.

> Other public skills (docx, pptx, xlsx, pdf) aren't relevant to this website build — leave them
> off for this project unless you later want a branded deck or one-pager from the same identity.

---

## 2. System prerequisites (install once on your machine)

| Tool        | Version        | Check                  |
|-------------|----------------|------------------------|
| Node.js     | **20 LTS or 22**| `node -v`             |
| npm         | 10+ (bundled)  | `npm -v`               |
| Git         | any recent     | `git --version`        |

If Node is older than 20, install the current LTS (via [nodejs.org](https://nodejs.org) or `nvm`).
Next.js 15 + Tailwind v4 need a modern Node.

---

## 3. Project dependencies (Claude Code installs these during the build)

You don't have to run these yourself — `TASK.md` tells Claude Code to scaffold and install. Listed
here so you know what's going in and can sanity-check the bundle.

**Scaffold:**
```bash
npx create-next-app@latest rmz-website --typescript --tailwind --eslint --app --src-dir --use-npm
cd rmz-website
```

**Runtime dependencies:**
```bash
npm install motion lenis
```
- `motion` — Framer Motion: page transitions, scroll reveals, and the cursor parallax / spring
  values for the hero.
- `lenis` — buttery smooth scroll that suits the editorial pacing.

**Fonts (self-hosted via next/font/local — no install, just files):**
- Display: **Fraunces** (free, variable) as the default — download the variable `.woff2` from
  Google Fonts / the Fraunces repo into `public/fonts/`. Swap to **PP Editorial New** later if
  Ahmad licenses it (clearly marked swap point in code).
- Body/UI: **Inter** (free, variable) — `.woff2` into `public/fonts/`.

**Optional — only if the canvas grain/cursor effect can't hit the look:**
```bash
npm install three @react-three/fiber
```
- A small WebGL noise shader with a mouse uniform is the highest-fidelity version of the
  cursor-reactive hero. Keep it optional to protect the bundle size — try `<canvas>` first.

**Dev convenience (optional):**
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

That's the whole list. No CMS, DB, auth, or UI kit — the site is intentionally lean.

---

## 4. Quick start (the order it happens)
1. Confirm Node 20+ (`node -v`).
2. Enable the `frontend-design` skill in Claude Code.
3. Drop `PROMPT.md`, `TASK.md`, `SKILLS.md` into the project root and paste `PROMPT.md` as your
   first message to Claude Code.
4. Hand Claude the **logo SVG** and **exact brand hex values** when you have them (it'll use
   faithful placeholders until then, listed in `NOTES.md`).
5. Approve Claude's one-paragraph design plan, then let it build page by page.
