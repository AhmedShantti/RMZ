# RMZ Website — Redesigning Prompts

> Copy-paste ready prompts for Claude Code.  
> One prompt per stage. Use them in order.  
> Always paste your current file contents where marked with `[PASTE CURRENT CODE HERE]`.

---

## Before Every Session — Context Primer

Paste this at the very start of every new Claude Code session:

```
I'm working on the RMZ (Rebel Mind Zone) marketing agency website.
Tech stack: [your stack — e.g. Next.js 14 / React / Tailwind]

Brand identity:
- Dark backgrounds: black to deep red gradient
- Brand accent colors: orange #E8593C, green #5CAD3C, yellow #F5C842
- Typography: already set — do not change fonts
- The existing design is working well — we are only making targeted layout and component changes

The Figma reference screens are in the folder: /RMZ-figma/ in this project.
We are blending our design with the Figma — not copying it.
Keep all colors and fonts. Only change layout, components, and imagery as I describe.
```

---

## Stage 1 — Homepage: Client Photos Collage Section

```
Task: Add a new "Clients" section to the homepage.

Location: Insert this section above the existing markets/CTA section.

Figma reference: /RMZ-figma/clients.png — look at the top half showing 3 photos.

What to build:
- A full-width section with a dark red background (matching the rest of the page)
- Behind everything in this section, add a large watermark text that says "CLIENTS"
  - Font size: clamp(100px, 15vw, 200px)
  - Color: white, opacity: 0.08
  - Position: absolute, centered horizontally, vertically centered in the section
  - pointer-events: none, user-select: none, z-index: 0
- 3 portrait-orientation photos arranged in a collage (not a grid):
  - Photo 1: left side, slightly lower than center
  - Photo 2: center, slightly higher (tallest / most prominent)
  - Photo 3: right side, slightly lower than center
  - Photos should overlap each other slightly (use negative margins or absolute positioning)
  - Each photo: slight rotation — Photo 1: rotate(-2deg), Photo 2: rotate(0deg), Photo 3: rotate(2deg)
  - Use placeholder images for now — dark rectangles labeled "[ CLIENT PHOTO 1 ]", "[ CLIENT PHOTO 2 ]", "[ CLIENT PHOTO 3 ]"
- Sticker badges on Photo 1 and Photo 3:
  - Small colored rectangle (brand accent colors), rotated slightly
  - Text inside: placeholder client name (e.g. "CLIENT NAME")
  - Position: overlaid on the photo, roughly center or lower-center
- All photos and badges sit above the watermark (z-index: 1 or higher)
- Section min-height: 600px, padding: 80px 0

Mobile (below 768px): photos stack vertically, full width, no rotation, no overlapping.

Here is the current homepage file:
[PASTE CURRENT CODE HERE]
```

---

## Stage 2 — Homepage: Video Section

```
Task: Add a video section to the homepage.

Location: Directly below the client photos collage section (Stage 1), before the markets/CTA section.

Figma reference: /RMZ-figma/clients.png — look at the bottom half showing the video block with colored sidebars.

What to build:
- A full-width horizontal section
- Layout: [left sidebar strip] + [video block] + [right sidebar strip] all in a single row
- Left sidebar strip:
  - Background color: #5CAD3C (brand green)
  - Width: about 80–100px
  - Full height of the section
  - Contains vertical text: "HOW TO SUCCESS"
  - Text style: bold, all caps, white, writing-mode: vertical-rl, transform: rotate(180deg) (reads bottom to top)
  - Text should be centered vertically in the strip
- Right sidebar strip:
  - Background color: #E8593C (brand orange)
  - Width: about 80–100px
  - Full height of the section
  - Contains vertical text: "HOW TO BE REBEL"
  - Text style: bold, all caps, white, writing-mode: vertical-rl (reads top to bottom — no extra rotation)
  - Text should be centered vertically in the strip
- Video block (center):
  - Takes up the remaining width between the two strips
  - Background: dark, placeholder for a video
  - Centered white play button icon (circle with triangle inside, or use an existing icon from your icon library)
  - Aspect ratio: 16:9
- Behind the entire section (or continuing from Stage 1), the same "CLIENTS" watermark text in the background (same style: white, opacity 0.08, very large)
- Section should have no extra padding between the strips and the video block — they should be flush

Mobile (below 768px):
- Strips become horizontal bars (top and bottom of the video)
- Vertical text becomes horizontal
- Strip height: 50px on mobile

Here is the current homepage file:
[PASTE CURRENT CODE HERE]
```

---

## Stage 3 — Homepage: Markets / CTA Section Redesign

```
Task: Restructure the existing markets/CTA section layout.

Figma reference: /RMZ-figma/clients.png — look at the bottom section showing the 2-column layout.

Keep all existing content (text, links, market data). Only change the layout.

What to change:
- Change from the current layout to a 2-column layout:

Left column (roughly 40% width):
  - Large heading text: "LET'S CREATE A"  on line 1, "NEW" on line 2, "STORY" on line 3
  - "STORY" should be on its own line
  - Directly below "STORY", add a row of 3 small colored squares:
    - Square 1: #F5C842 (yellow), 16x16px
    - Square 2: #E8593C (orange), 16x16px
    - Square 3: #5CAD3C (green), 16x16px
    - Gap between squares: 6px
    - No border-radius — they should be sharp squares

Right column (roughly 60% width):
  - The 4 regional market items (Gulf, Levantine, Arab, Egyptian) in a 2×2 grid
  - Each market card: market name as link (styled as before), sub-categories, description, contact
  - Keep existing styling on the cards

Gap between columns: 60–80px
Section padding: 100px top and bottom

Mobile (below 768px): single column, left column content first, market grid below.

Here is the current homepage section code:
[PASTE CURRENT CODE HERE]
```

---

## Stage 4 — Contact Page Redesign

```
Task: Redesign the contact page layout.

Figma reference: /RMZ-figma/Contact__-_1.png

What to change:

1. Top of the page — add large centered logo:
   - Place the RMZ logo (already in the project) centered at the top of the page content area
   - Size: large — around 200–280px wide
   - This sits above the "Book A Meeting" heading

2. Floating decorative squares near the heading:
   - Create an absolutely positioned decorative layer around the "Book A Meeting" heading
   - Orange square: 80x80px, background #E8593C, transform: rotate(15deg), position: top-left near the heading
   - Green square: 80x80px, background #5CAD3C, transform: rotate(-10deg), slightly overlapping the orange square
   - Both squares: z-index behind the text, pointer-events: none
   - These are purely decorative — they should not block the heading text

3. Info bar below the heading:
   - A horizontal row with:
     - Left: office address text (e.g. "Office 102: Nasr city, Cairo, Egypt") — underlined, muted/light color
     - Right: email address (e.g. "info@rmz.com") — underlined, muted/light color
     - Far right: a diagonal arrow icon ↗ or similar
   - Full-width bottom border line under this row (1px, muted color)
   - Padding: 20px 0

4. Form layout — change to 2 columns:
   - Row 1: Full Name field (left, full row or just left column)
   - Row 2: Email field (left) | Company Name field (right)
   - Row 3: Phone Number field (left) | Country dropdown (right)
   - Row 4: "Give us a brief about your project" textarea — full width, spans both columns
   - Keep all existing field labels, placeholders, and validation

5. Submit button:
   - Full width (spans both form columns)
   - Shape: pill (border-radius: 999px)
   - Background: #F5F0E8 or similar cream/off-white
   - Text: dark color (near black), centered
   - Height: 60–70px
   - Replace the current submit button entirely

Mobile (below 768px): form collapses to 1 column, floating squares scale down or hide.

Here is the current contact page file:
[PASTE CURRENT CODE HERE]
```

---

## Stage 5 — Services Page: Hero Image

```
Task: Update the hero section of the services/service detail page.

Figma reference: /RMZ-figma/Explore-marketing_and_content.png — look at the top hero image area.

What to change:
- The hero should be a full-bleed image (100% width, no side padding)
- Image height: 50–60vh minimum
- Add a dark overlay on the image: background linear-gradient from rgba(0,0,0,0.5) to rgba(0,0,0,0.2)
- The service name text ("Marketing & Content" or whatever the current service is) should be:
  - Positioned absolute, bottom-left of the hero image
  - Padding: 40px from the bottom and left
  - Font: large, bold, white
  - Keep existing typography scale
- Use a placeholder dark image for now: dark rectangle labeled "[ SERVICE HERO IMAGE — REPLACE ]"
- Remove any existing hero background color or non-full-bleed treatment

Here is the current services page/component file:
[PASTE CURRENT CODE HERE]
```

---

## Stage 6 — Services Page: Explore Button + Image Placeholders

```
Task: Two small updates to the service item layout.

Figma reference: /RMZ-figma/Explore-marketing_and_content.png — look at the service item block.

Change 1 — Explore button style:
- Find the "Explore" button on the service items
- Change border-radius to 0 (remove all rounding — make it a sharp rectangle)
- Keep background color (dark red, existing)
- Keep all other styles

Change 2 — Replace stock image:
- Find the service item image (currently a stock "digital marketing" photo)
- Replace with a dark placeholder rectangle
- Text on placeholder: "[ REPLACE WITH REAL WORK IMAGE ]"
- Keep the same width and height as the current image
- Add a code comment directly above: /* TODO: Replace with real client work photo */

Do not change anything else on the page.

Here is the current services component/file:
[PASTE CURRENT CODE HERE]
```

---

## Stage 7 — Portfolio Page: Masonry Grid Layout

```
Task: Redesign the portfolio image grid layout.

Figma reference: /RMZ-figma/Portfolio.png and /RMZ-figma/work_s.png

What to change:
- Replace the current equal-height grid with a varied-height layout
- Use CSS Grid for the layout
- Target layout (desktop): images in rows, varying heights, filling full width
  - Suggested: alternate row heights between 300px and 420px
  - Images should be flush (2px gap or no gap between them)
  - Try: 2 images in row 1 (one 300px, one 420px), then 3 images in row 2 at shorter height, etc.
  - The exact arrangement can vary — the goal is it feels editorial, not like a grid
- Each image:
  - object-fit: cover, fill its container completely
  - Relative positioning as the container for the overlay
- Project name overlay (keep existing but verify it's correct):
  - Position: absolute, bottom: 16px, left: 16px
  - Color: white
  - Font: existing scale
  - No background box needed (image provides contrast)
- Hover state on each portfolio item:
  - Image: subtle scale up (transform: scale(1.03)) with transition: 0.3s ease
  - Optional: slight darkening overlay on hover
  - overflow: hidden on the container to clip the scale

Mobile (below 768px): single column, all images full width, equal height (300px each).

Do not change the page heading, intro text, or any content — only the grid layout.

Here is the current portfolio page/component file:
[PASTE CURRENT CODE HERE]
```

---

## Stage 8 — Career/Job Description Page: Floating Squares Hero

```
Task: Add floating decorative squares to the job description page hero.

Figma reference: /RMZ-figma/social_media_designer-Description.png — look at the top hero area with the colored shapes.

This should reuse the same FloatingSquares component or style created in Stage 4 (Contact page).

What to add:
- In the job description page, around the job title heading area:
  - Orange square: 70x70px, background #E8593C, transform: rotate(15deg)
    Position: top-left of the job title block, slightly overlapping or beside the first word
  - Green square: 70x70px, background #5CAD3C, transform: rotate(-10deg)
    Position: slightly lower and to the right of the orange square, overlapping it
- Both squares: position absolute, z-index behind the text, pointer-events: none
- Job title: stays large, white, left-aligned — squares should frame it, not cover it

If FloatingSquares is already a component (from Stage 4):
  Import and use it here with the same default props.

If not yet a component:
  Create it now as a reusable component and update Stage 4 to use it too.

Here is the current job description page/component file:
[PASTE CURRENT CODE HERE]
```

---

## Stage 9 — Global: Stock Image Audit and Placeholders

```
Task: Replace all remaining stock images across the site with labeled placeholders.

This is a global audit — check every page.

For each stock or generic image found:
1. Replace with a dark rectangle placeholder (same dimensions)
2. Add centered text label describing what should go there:
   - Homepage hero: "[ HERO IMAGE — REPLACE ]"
   - Service items: "[ SERVICE IMAGE: [service name] — REPLACE ]"
   - Career page hero: "[ TEAM PHOTO — REPLACE ]"
   - Any other stock photo: "[ PHOTO — REPLACE ]"
3. Add a code comment directly above each placeholder:
   /* TODO: Replace with [description] */

Placeholder style:
- Background: #1a1a1a or similar very dark color
- Text: #666666, font-size: 14px, centered both axes
- Same width and height as the image it replaces

Do not change any layouts, only the images.

List every file you change and what you replaced.
```

---

## Stage 10 — Final: Responsive Check and Cleanup

```
Task: Final responsive check and code cleanup.

Go through every page and verify:

1. Mobile (375px):
   - Homepage: collage photos stack vertically, video strips become horizontal bars, markets stack to 1 column
   - Contact: form is 1 column, floating squares are smaller or hidden
   - Portfolio: single column grid
   - Career/Job: floating squares scaled or hidden
   - Services: hero image full width

2. Tablet (768px):
   - Homepage: 2-column market grid works, collage photos fit
   - Contact: form 2-column layout holds

3. Desktop (1280px+):
   - All layouts as designed

Cleanup:
- Remove any unused CSS classes
- Remove any console.log statements
- Fix any obvious spacing inconsistencies (sections that are too tight or too loose)
- Make sure the "CLIENTS" watermark text doesn't overflow its section

Do not redesign anything — only fix issues found during responsive testing.

Report: list every issue found and what was fixed.
```

---

## Quick Fix Prompts

Use these for small corrections during any stage:

### Fix alignment:
```
The [element] on the [page/section] is misaligned.
It should be [left/center/right aligned] within its container.
Don't change anything else.

Current file: [PASTE CODE]
```

### Fix spacing:
```
The gap between [element A] and [element B] is too [large/small].
It should be approximately [Xpx].
Don't change anything else.

Current file: [PASTE CODE]
```

### Fix mobile:
```
On mobile (below 768px), the [element/section] is [broken/overflowing/misaligned].
Fix only the mobile breakpoint styles.
Don't change desktop styles.

Current file: [PASTE CODE]
```

### Revert a change:
```
The last change broke [something].
Please revert only the [specific element] back to how it was before.
Keep everything else as it is now.

Here is the version I want to revert to: [PASTE OLD CODE]
Here is the current (broken) version: [PASTE CURRENT CODE]
```

---

*Last updated: June 2026*
