# Portfolio intake

Everything for the Portfolio lives here, in one predictable shape, so it can be
seeded into the CMS (projects, categories, images) in one go.

```
portfolio-intake/
├── README.md                  ← this file
├── categories.json            ← the Portfolio sections, in display order
├── _inbox/                    ← DUMP EVERYTHING UNORGANIZED HERE (git-ignored)
│                                 (photos, videos, docs, text, links — any mess)
└── projects/
    └── <project-slug>/        ← one folder per project (lowercase-with-dashes)
        ├── project.json       ← all the text + which image goes where
        ├── cover/             ← 1 hero image   (cover.jpg)
        ├── gallery/           ← 01.jpg 02.jpg …  (full-width / 2-col / 3-col blocks)
        ├── mockups/           ← 01.jpg 02.jpg …  (phone / desktop / packaging …)
        └── video/             ← poster.jpg (+ video link goes in project.json)
```

`projects/_TEMPLATE-project-slug/` is a ready-to-copy example — copy it, rename
the folder to the project's slug, fill `project.json`.

## How we work

1. **You**: drop all raw material into `_inbox/` (any structure, any names). If
   some of it is only in WhatsApp/Drive/Notion, export or paste the text into a
   `notes.txt` file in `_inbox/`.
2. **Claude**: reads `_inbox/`, groups it per project, renames/moves files into
   `projects/<slug>/…`, writes each `project.json`, and lists what is missing
   (no cover, no result line, unknown category…). Nothing is invented — gaps are
   marked `"TODO"` and reported.
3. **You**: review `projects/` (and the missing-list), fix gaps.
4. **Seed**: a small import script reads `projects/*/project.json`, uploads the
   images to the CMS media library (Vercel Blob) and creates/updates the
   projects. Run first against a local scratch DB, then the live one — only when
   you say so. Re-running updates by slug, it never duplicates.

## Image rules

| What | Format | Size |
|---|---|---|
| Cover | JPG/WebP | ≥ 2000 px wide, < ~500 KB |
| Gallery / mockups | JPG/WebP | ≥ 1600 px wide, < ~400 KB each |
| Video poster | JPG/WebP | same ratio as the video |

Large videos do NOT go in this folder: upload them to Bunny and paste the link
in a `video` block of `project.json` (`url`; add `"vertical": true` for 9:16 videos). A project can have several `video` blocks, anywhere in the page. Every image gets `alt` text (what is in it).

## project.json fields

| Field | Required | Notes |
|---|---|---|
| `name`, `client`, `market`, `resultLine` | yes | `resultLine` = the one-line result shown on the card |
| `category` | yes | must match a `title` in `categories.json` |
| `discipline` | yes | short legacy label (e.g. "Branding") |
| `year`, `sortOrder` | no | order inside its category, lower first |
| `cover` | no* | `{ file, ratio, alt }` — ratios: 21/9 16/9 3/2 4/3 1/1 4/5 9/16 |
| `blocks[]` | no | the case study, in order — types below |

Block types (all optional, any order): `overview` (idea/goal/challenge),
`services` (items), `imageFull`, `galleryTwo` (exactly 2 images),
`galleryThree` (exactly 3), `mockups` (kind: mobile/desktop/branding/packaging/
social/campaign, 1–6 images), `textBreak`, `stats` (1–4 value/label),
`beforeAfter`, `video`, `summary` (body + optional quote).
