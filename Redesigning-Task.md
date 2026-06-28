# RMZ Website — Redesigning Task List

> **Goal:** Blend the existing RMZ website with the Figma reference.  
> Colors and typography are already ~90% aligned. Focus is on **components, layouts, imagery, and new sections.**  
> Figma screens are in the `/RMZ-figma/` folder in the project.

---

## How to Use This File

Work through stages in order. Each stage is a separate Claude Code session.  
Complete and verify each stage before moving to the next.  
Reference the matching Figma screen for each task.

---

## Stage 1 — Homepage: Client Photos Collage Section

**Figma reference:** `RMZ-figma/clients.png`  
**Priority:** Critical

### Tasks
- [ ] Add a new section above the markets/CTA section
- [ ] Layout: 3 portrait photos in an overlapping collage arrangement (not a grid)
- [ ] Photos should be at slightly different heights and slight rotations (~2–3deg) to feel editorial
- [ ] Add sticker-style label badges on 2 of the 3 photos (small colored rectangles with client name text, slightly rotated)
- [ ] Behind the photos, add a giant faded watermark text "CLIENTS" — very large, low opacity (~8–12%), white or light color
- [ ] The watermark should span the full width of the section
- [ ] Background stays dark red gradient (existing)
- [ ] Use placeholder images for now — mark them clearly so they can be swapped later

### Acceptance Criteria
- Photos overlap and feel intentionally composed, not like a grid
- Sticker badges are visible and on-brand (use brand accent colors: orange, green, yellow)
- "CLIENTS" watermark is visible but clearly background — it should not compete with the photos
- Section is responsive down to mobile (photos stack vertically on small screens)

---

## Stage 2 — Homepage: Video Section

**Figma reference:** `RMZ-figma/clients.png` (bottom half)  
**Priority:** Critical

### Tasks
- [ ] Add a new section directly below the client photos section
- [ ] Layout: a video player block in the center, with two vertical colored sidebar strips flanking it
- [ ] Left sidebar strip: dark green background, vertical text reading "HOW TO SUCCESS" (rotated 90deg, bottom-to-top)
- [ ] Right sidebar strip: orange background, vertical text reading "HOW TO BE REBEL" (rotated 90deg, top-to-bottom)
- [ ] Video player: placeholder with a play button icon centered
- [ ] The video block + sidebars should feel like one unified horizontal unit
- [ ] Behind this section, continue or repeat the "CLIENTS" watermark text (same style as Stage 1)

### Acceptance Criteria
- Green and orange sidebars are clearly visible and match brand colors
- Vertical text is legible and properly rotated
- Play button is centered on the video placeholder
- Watermark text reads "CLIENTS" in background

---

## Stage 3 — Homepage: Markets / CTA Section Redesign

**Figma reference:** `RMZ-figma/clients.png` (bottom section)  
**Priority:** High

### Tasks
- [ ] Restructure the current markets section into a 2-column layout
- [ ] Left column: "LET'S CREATE A NEW STORY" large heading — "STORY" on its own line
- [ ] Below "STORY", add 3 small colored squares in a row: yellow, orange, green (brand colors)
- [ ] Right column: 4 market cards in a 2×2 grid (Gulf, Levantine, Arab, Egyptian)
- [ ] Each market card: market name as a link, category tags (Restaurants / Automotive / Decorations), short description, contact info
- [ ] Keep existing content — only restructure the layout

### Acceptance Criteria
- 2-column layout holds correctly on desktop
- Colored squares appear next to "STORY" word
- 2×2 market grid is clean and readable
- Mobile: stacks to single column (CTA first, markets below)

---

## Stage 4 — Contact Page Redesign

**Figma reference:** `RMZ-figma/Contact__-_1.png`  
**Priority:** Critical

### Tasks
- [ ] Add large centered RMZ logo at the very top of the contact page (above the heading)
- [ ] Add 2 floating decorative shapes near the "Book A Meeting" heading:
  - Orange square, rotated ~15deg, positioned top-left of the heading
  - Green square, rotated ~-10deg, overlapping the orange slightly
- [ ] Add a horizontal info bar below the heading with 2 items side by side:
  - Left: office address (underlined, muted color)
  - Right: email address (underlined, muted color)
  - A diagonal arrow icon (↗) on the far right of the bar
  - Full-width bottom border line under this bar
- [ ] Restructure the form into 2 columns:
  - Row 1: Full Name (left) | [empty or label] (right)  
  - Row 2: Full Name / Email (left) | Company Name (right)
  - Row 3: Phone Number (left) | Country dropdown (right)
  - Row 4: "Give us a brief about your project" textarea — full width
- [ ] Replace current submit button with a full-width pill-shaped button in cream/off-white color with dark text

### Acceptance Criteria
- Logo appears large and centered at top
- Floating colored shapes are visible and positioned near heading (not blocking text)
- Info bar is clean horizontal layout with bottom border
- Form is clean 2-column layout
- Submit button is full-width pill shape
- Mobile: form collapses to 1 column

---

## Stage 5 — Services Page: Hero Image

**Figma reference:** `RMZ-figma/Explore-marketing_and_content.png`  
**Priority:** High

### Tasks
- [ ] Replace the current services page hero with a full-bleed dark image hero
- [ ] Image should be a real brand/client image (use `RMZ-figma/Explore-marketing_and_content.png` as reference for the mood — dark, editorial, branded)
- [ ] Service name ("Marketing & Content") overlaid on top of the image, bottom-left position
- [ ] Image should have a dark overlay so text stays readable

### Acceptance Criteria
- Hero image spans full page width
- Service name text is clearly readable over the image
- Dark overlay is present but not too heavy (image should still be visible)

---

## Stage 6 — Services Page: Service Cards / Explore Button

**Figma reference:** `RMZ-figma/Explore-marketing_and_content.png` (service item layout)  
**Priority:** Medium

### Tasks
- [ ] Update the "Explore" button style: make it more boxy/squared (reduce or remove border-radius)
- [ ] Button should stay dark red, full-width of its column
- [ ] Replace the stock "digital marketing" photo with a placeholder that clearly notes "REPLACE WITH REAL WORK IMAGE"
- [ ] Add a comment in the code: `/* TODO: Replace all stock images with real client work photos */`

### Acceptance Criteria
- Button is squared/boxy — not rounded pill
- Stock image has a visible placeholder label
- Code comment is in place

---

## Stage 7 — Portfolio Page: Grid Layout

**Figma reference:** `RMZ-figma/Portfolio.png` + `RMZ-figma/work_s.png`  
**Priority:** High

### Tasks
- [ ] Redesign the portfolio grid from equal-size cards to a varied-height masonry/editorial layout
- [ ] Images should be different heights — some tall, some shorter — arranged in rows
- [ ] Project name overlay stays: white text, bottom-left of each image (already exists — keep this)
- [ ] Images span full width of the row with no gaps between them (or minimal 2–4px gaps)
- [ ] Hover state: slight darkening overlay + subtle scale up on the image

### Acceptance Criteria
- No two adjacent images are the same height
- Project name is readable on all images
- Layout feels editorial, not like a regular grid
- Mobile: single column stack

---

## Stage 8 — Career Page: Job Description Hero

**Figma reference:** `RMZ-figma/social_media_designer-Description.png`  
**Priority:** Medium

### Tasks
- [ ] Add floating colored squares to the job description page hero (same as Contact page — reuse the component)
- [ ] Orange square: top-left area of the job title
- [ ] Green square: slightly overlapping the orange, offset down-right
- [ ] Job title remains large, white, left-aligned

### Acceptance Criteria
- Floating squares appear and match the style of the Contact page
- Squares are a reusable component (not copy-pasted code)
- Job title remains prominent and readable

---

## Stage 9 — Global: Replace All Stock Images

**Figma reference:** All screens — general principle  
**Priority:** High (do after all layout changes are done)

### Tasks
- [ ] Audit every image on the site
- [ ] Replace any stock photo with either:
  - A real image from the project assets, OR
  - A clearly labeled placeholder: dark rectangle with centered text "[ CLIENT PHOTO — REPLACE ]"
- [ ] Pages to check: Homepage hero, Services (each service item), Career hero, Portfolio (all project images)

### Acceptance Criteria
- Zero generic stock photos remain without a placeholder label
- All placeholder labels are visible and clearly worded
- No broken image paths

---

## Stage 10 — Global: Floating Squares Component

**Figma reference:** `RMZ-figma/Contact__-_1.png` + `RMZ-figma/social_media_designer-Description.png`  
**Priority:** Medium (do before Stage 4 and Stage 8)

### Tasks
- [ ] Create a reusable `FloatingSquares` component (or CSS class set)
- [ ] Props / variants: size, colors, positions, rotations
- [ ] Default variant: orange square (rotated 15deg) + green square (rotated -10deg), overlapping
- [ ] Should work as an absolute-positioned decorative layer that doesn't affect layout flow

### Acceptance Criteria
- Component is in its own file and imported where needed
- Used on both Contact page and Job Description page
- Squares are purely decorative and don't interfere with text readability

---

## Final Verification Checklist

After all stages are complete:

- [ ] All pages work on mobile (375px)
- [ ] All pages work on tablet (768px)
- [ ] All pages work on desktop (1280px+)
- [ ] No broken images or placeholder images left unintentionally
- [ ] No console errors
- [ ] All links work
- [ ] Dark backgrounds don't cause any text contrast issues
- [ ] Floating squares appear on Contact and Job Description pages
- [ ] "CLIENTS" watermark appears on Homepage
- [ ] Video section exists on Homepage
- [ ] Portfolio grid uses varied heights
- [ ] Contact form is 2-column
- [ ] Contact page has large logo at top

---

*Last updated: June 2026*
