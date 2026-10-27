# LED Farewell Poster — Project Plan

## Goal

Create one vertically scrolling React + TypeScript farewell page for a six-person therapy group, ready to share **Tuesday, 27 October 2026**. It should feel warm, personal, celebratory, and clearly pixel-art/LED.

This is a goodbye card, not a therapy record: use shared interests, strengths, and kind memories; do not include diagnoses, difficulties, private stories, progress claims, or anything not explicitly approved.

## Scope Lock

### Must ship

- One responsive, vertically scrolling page.
- Large readable farewell typography and colorful pixel art.
- Six-person gallery/slideshow: circular LEDs, six calm slides.
- Six module icons: readable square pixel art.
- Warm multicolor palette, with one accent color per person.
- Gentle slow pulse and a `prefers-reduced-motion` alternative.
- Closing thank-you/sign-off.

### Only if ahead of schedule

- Previous/next controls and keyboard navigation.
- A quiet hover/tap response on LEDs or icons.
- A sound-free lights-on intro.

### Out of scope

- Back end, accounts, analytics, public forms/sharing, image-upload tooling, or recreating Pixel Grid Studio.
- Flashing/flickering/rapid animation.
- Therapy history, anxiety, isolation, masks, exhaustion, or implied personal outcomes.

## Page Structure

1. **Opening / Marquee** — large title (for example, “A Little Farewell in Lights”), short inclusive line, LED border.
2. **Shared Year** — short group-centered, non-clinical introduction with six square pixel icons.
3. **In Lights** — six-slide circular LED gallery: abstract pixel art, approved initial/display name, and one approved positive caption each.
4. **Thank You** — collective note about showing up, sharing space, and the year ending.
5. **Closing Sign-Off** — creator’s goodbye, with optional final static LED pattern.

Keep version one to five sections. Cut copy instead of adding sections.

## Visual System

- **Circular LEDs:** slideshow art; CSS turns fixed-grid pixels into circles (`border-radius: 50%`) with restrained glow.
- **Square pixels:** module icons, for crisp readability.
- **Shared grid:** export every source image at one size (recommended `24 × 24` or `32 × 32`); the same grid renders both modes.
- **Palette:** deep warm navy/plum background; cream, coral, amber, mint, sky blue, violet lights. Per-person colors are visual keys, not personality labels.
- **Typography:** friendly large display face + highly legible sans-serif body copy. Glow never replaces contrast.
- **Motion:** one 3–5-second minor opacity/glow pulse, no strobe or abrupt changes; disable pulse under `prefers-reduced-motion: reduce`. If autoplay exists, no faster than 8 seconds per slide.

## Content Safety and Consent

Before publishing, get a simple yes/no from each person for:

- Their display name or initial.
- Their artwork’s theme/object and caption.
- Private sharing of the page with the group.

Use interests and creative strengths only with agreement. Captions should be factual, appreciative, short, and never interpret someone’s feelings or journey.

Suggested pattern: **“[Name/initial] — [approved interest or strength], represented in lights.”**

## Pixel Grid Studio Reuse Strategy

Do not start poster implementation until Pixel Grid Studio is available for inspection. When it is:

1. Identify its framework, source location, image converter entry point, canvas/export path, palette, and grid settings.
2. Reuse in this order: existing exports/data; then a dependency-light image-to-grid function; then palette/constants. Do not copy editor UI, state, or upload tooling unless truly tiny and necessary.
3. Choose one portable poster format after inspection: `PixelCell[][]` data or PNG exports with documented grid size.
4. Make a one-image proof rendered once as square pixels and once as circular LEDs. Approve it before preparing all six images.

Needed: Pixel Grid Studio folder path or repository link, startup instructions, and one sample converted export.

## Delivery Milestones

### Saturday, 24 October — plan and inputs

- [x] Lock scope and privacy boundary.
- [x] Create folder and this plan.
- [ ] Locate/inspect Pixel Grid Studio.
- [ ] Choose artwork format and make the one-image proof.
- [ ] Use placeholder copy until approvals are gathered.

### Sunday, 25 October — first working poster

- [ ] Scaffold React + TypeScript only after reuse choice.
- [ ] Build shell, palette, typography, responsive layout.
- [ ] Build reusable pixel-grid/circular-LED renderer.
- [ ] Add one complete gallery slide and six placeholder icons.

### Monday, 26 October — complete and simplify

- [ ] Add approved art and captions.
- [ ] Add controls only if the core is solid.
- [ ] Test phone + desktop and reduced motion.
- [ ] Ask a trusted viewer to proof content/readability.

### Tuesday, 27 October — delivery

- [ ] Correct only small copy/layout issues.
- [ ] Run final production build and local check.
- [ ] Share by the agreed private route.

If Sunday is missed, replace the slideshow with a static six-tile gallery and ship the simpler page.

## Technical Shape (after reuse inspection)

```text
src/
  components/
    LedPixelGrid.tsx       # source grid; square or circular presentation
    PersonGallery.tsx      # six slides and optional controls
    SectionIcon.tsx
  data/
    people.ts              # only approved initials, captions, colors, artwork refs
    artwork/               # generated pixel data or exports
  styles/
    tokens.css
    motion.css
  App.tsx
```

`LedPixelGrid` receives a grid plus `shape="square" | "led"`; all artwork derives from it so the two display styles never drift.

## Definition of Done

- Page builds cleanly and works at phone width.
- All six personal pieces display in circular LEDs.
- All six icons display as square pixel art.
- Text remains readable with motion disabled.
- No unapproved identifying or sensitive information appears.
- Private sharing route is known to the creator.

## Handoff Checklist — OpenCode / Antigravity

- [ ] Read this plan before editing.
- [ ] Confirm deadline/scope; do not add features before the core page works.
- [ ] Inspect Pixel Grid Studio; record exactly what is reused and why.
- [ ] Keep all personal content in one editable data file.
- [ ] Keep placeholders until consent and wording are confirmed.
- [ ] Preserve reduced-motion support and avoid flashing.
- [ ] Test build, phone, and desktop before handoff.
- [ ] Report changed files, run instructions, approvals remaining, and known issues.

## Reuse Findings (24 October)

- Pixel Grid Studio is available at `work/markit2d-main/markit2d-main` and is a React + TypeScript + Vite application.
- Its import flow turns a source image into a fixed 128 × 128 `Pixel[]` color grid; its project codes serialize the same data as `PGS2` or `PGS3`.
- The poster uses a lighter portable `PixelArtwork` shape (`cells` plus `size`) at 32 × 32. This keeps circular LED rendering efficient on phones while staying compatible with Studio colors and grid semantics.
- Reuse the Studio for making/exporting artwork. When final art is chosen, downsample/translate it into poster artwork data rather than embedding the editor or its persistence layer.
- The first proof is present: one 32 × 32 grid has square-pixel and circular-LED renderers. All visible labels and art are intentionally anonymous placeholders.

## Deferred Enhancements (after the base is signed off)

- Add a short fade and lateral slide transition to gallery changes, after testing reduced-motion behavior.
- Add one optional playful interaction: drag or swipe the visible rock aside to reveal a softly glowing second rock. It must work with click/tap as well, be clearly optional, and never block reading.
- Keep every interaction quiet and purposeful; no extra feature should delay the approved artwork, captions, or final privacy review.

## Artwork Import Guide — Pixel Grid Studio to LED Poster

The poster already knows how to show one artwork twice: as a square module icon and as circular LED lights. You only need one artwork grid per person. Keep the first version simple; test one person before making the other five.

### 1. Make the pixel art in Pixel Grid Studio

1. Start Pixel Grid Studio from `work/markit2d-main/markit2d-main` with `npm run dev`.
2. Use the **32** grid preset as a visual guide. Keep the subject simple and readable: one object/symbol, a dark or transparent background, and roughly 3–5 colours.
3. Draw directly, or import a reference image and simplify it manually. Do not aim for a detailed photo conversion.
4. Export a transparent PNG at `1x`. Name it clearly, for example `person-1-purple.png`.
5. Keep the exported PNGs somewhere safe as your source artwork. They are the editable originals.

### 2. Add it to the poster

The current poster does **not** yet automatically read PNG files. Its artwork lives in `src/data/artwork.ts` as a 32 × 32 list of colour cells. A future coding step must sample/export the PNG into that list.

When the grid is added to `galleryArt` in `src/data/artwork.ts`:

1. Keep its `size` at `32`.
2. Use `null` for background/unlit cells and a hex colour such as `#a675ff` for lit cells.
3. Attach that artwork to the matching object in `src/data/people.ts`.
4. Refresh the poster. The gallery uses it as round LEDs; the matching module can use the same grid as square pixels.

### 3. Check each artwork before moving on

- It is recognisable at phone width.
- The dark/unlit space helps the shape read clearly.
- Its main colour agrees with the person's chosen accent colour.
- It does not reveal anything the person has not agreed to share.

### First-artwork handoff request

When asking another coding agent for help, say: **“Convert `person-1-purple.png` into a 32 × 32 `PixelArtwork` entry in `src/data/artwork.ts`, preserving transparency as `null`, then connect it to the matching person in `src/data/people.ts`. Do not change the page layout.”**
