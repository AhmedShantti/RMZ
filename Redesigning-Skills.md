# RMZ Website — Redesigning Skills Guide

> How to work with Claude Code effectively on this redesign.  
> Read this before starting any session.

---

## Core Principle: One Stage Per Session

Never try to do multiple stages in a single Claude Code session.  
Each stage in `Redesigning-Task.md` is its own focused session.

**Why:** Claude Code holds context better on focused tasks. A session that tries to redesign the homepage AND the contact page will produce worse results than two clean sessions, one for each.

---

## How to Start Each Session

Open Claude Code and begin with this exact structure:

```
I'm working on the RMZ marketing agency website.
Tech stack: [tell Claude what stack you're using — Next.js, React, HTML/CSS, etc.]
The Figma reference screens are in the folder: /RMZ-figma/

Today's task: [copy the stage title and tasks from Redesigning-Task.md]

Here is the current code for the component/page I want to change:
[paste the relevant file or component]

Do not change anything outside of what I've described.
```

Always paste the current code. Never assume Claude Code remembers previous sessions.

---

## How to Give Claude Code the Figma Reference

Since the screens are in your project folder, tell Claude Code:

```
The Figma reference for this task is at: /RMZ-figma/[filename].png
Use it as inspiration for the layout and component structure,
but keep our existing color palette and typography.
```

If Claude Code can't read the image directly, describe the key elements:

```
The Figma reference shows:
- [describe the layout]
- [describe the component]
- [describe what's different from our current version]
```

---

## The Blend Rule — Always Remind Claude Code

At the start of every session, include this line:

```
Important: We are blending our existing design with the Figma reference — not copying it.
Keep our color palette (dark black/red gradient, brand colors: orange #E8593C, green #5CAD3C, yellow #F5C842).
Keep our typography.
Only change the layout, components, and imagery as described.
```

---

## How to Handle Images

### For new image placeholders:
```
Where a real photo is needed, add a placeholder:
- Dark rectangle background
- Centered text: "[ REPLACE WITH: description of what goes here ]"
- Same dimensions as the final image will be
```

### For replacing existing stock photos:
```
Replace the image at [path] with a placeholder.
Label it clearly: "[ CLIENT PHOTO — REPLACE ]"
Keep the same dimensions and aspect ratio.
```

### For the floating decorative squares (Contact + Job pages):
```
Create a reusable FloatingSquares component.
It should accept props for size, colors, and rotation.
Default: orange square rotated 15deg + green square rotated -10deg, overlapping.
Make it absolute-positioned so it doesn't affect document flow.
```

---

## How to Handle Layout Changes

When restructuring from a single-column to a multi-column layout:

```
Change the layout of [section name] from its current structure to [new layout].
Keep all existing content — text, links, and data — exactly as is.
Only change the visual arrangement.
Make it responsive: [describe mobile behavior].
```

When adding a new section:

```
Add a new section [above/below] the [existing section name].
It should sit between [section A] and [section B] in the page order.
Here is what it should contain: [description from task file]
```

---

## How to Handle the Watermark Text

The "CLIENTS" watermark on the homepage needs specific treatment:

```
Add a large background watermark text behind [the photos/video section].
Text: "CLIENTS"
Style: very large font size (clamp between 120px and 200px), white or near-white color,
opacity between 0.08 and 0.12, pointer-events: none, user-select: none.
Position: centered horizontally, spanning the full section width.
It should sit behind all other elements using z-index.
```

---

## How to Handle Vertical Text (Video Section Sidebars)

```
The sidebar strips have vertical text rotated 90 degrees.
Use writing-mode: vertical-rl and rotate as needed (transform: rotate(180deg) for bottom-to-top).
Left strip: "HOW TO SUCCESS" — text reads bottom to top
Right strip: "HOW TO BE REBEL" — text reads top to bottom
Font: bold/heavy weight, all caps, white color
```

---

## How to Handle the Portfolio Grid

```
The portfolio grid should NOT be a regular equal-height grid.
Use CSS Grid with grid-template-rows to create varied heights.
Aim for a masonry-like feel where different images have different heights.
Suggested pattern: alternate between 300px and 420px row heights.
Images should use object-fit: cover to fill their container.
Project name overlay: position absolute, bottom-left, white text, no background needed (image provides contrast).
```

---

## Reviewing Claude Code's Output

After each task, check:

1. **Does it match the Figma reference structurally?** Not pixel-perfect — structurally.
2. **Does it keep our colors and fonts?** No new fonts or colors should appear.
3. **Is it responsive?** Resize the browser and check at 375px, 768px, 1280px.
4. **Is the code clean?** No inline styles where classes already exist.
5. **Did anything else break?** Quickly check other pages.

If something is wrong, give Claude Code precise feedback:

```
The [element] is [too large / wrong color / not aligned].
It should be [description].
Don't change anything else.
```

---

## Common Mistakes to Avoid

**Don't say:** "Make it look like the Figma"  
**Do say:** "Add the overlapping photo collage from the Figma reference (RMZ-figma/clients.png) — specifically the 3-photo layout with sticker badges. Keep our dark red background."

**Don't say:** "Fix the design"  
**Do say:** "The floating squares on the contact page are overlapping the form title. Move them so they sit behind and above the heading, not overlapping it."

**Don't say:** "Make it better"  
**Do say:** "The video section sidebars need to be taller — they should match the height of the video block. Currently they are shorter."

---

## If Claude Code Gets Confused

If the output is way off, reset with:

```
Let's start over on this task.
Here is the current state of the file: [paste current code]
Here is exactly what I want to change: [one specific thing]
Everything else stays the same.
```

Always paste the current file contents when resetting — don't rely on Claude Code's memory.

---

## Component Naming Conventions

Stay consistent with these names across all sessions:

| Component | Name to use |
|---|---|
| Decorative colored squares | `FloatingSquares` |
| Client photo collage | `ClientsCollage` |
| CLIENTS watermark | `SectionWatermark` |
| Video section with sidebars | `VideoSection` |
| Market cards (2×2 grid) | `MarketGrid` or `RegionalMarkets` |
| Portfolio masonry grid | `PortfolioGrid` |
| Full-width pill button | `PillButton` |

Using consistent names means Claude Code won't create duplicate components with different names.

---

*Last updated: June 2026*
