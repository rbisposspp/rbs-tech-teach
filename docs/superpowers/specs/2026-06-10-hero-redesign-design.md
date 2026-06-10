# Hero Redesign — Clean Banner + Content Band

Date: 2026-06-10
Status: approved by user (Option C, with plain h1 — no gradient highlight)

## Problem

The hero overlays the headline on the banner artwork, which has "RBS TECH TEACH" baked in near its vertical center. At 1440×900 the baked text ghosts through the h1; at 360×800 it crosses the subtitle. The artwork text stays (user decision) and must become fully visible and legible.

## Decision

Split the hero into two stacked blocks with zero text-over-image overlap:

1. **Banner block** — the artwork shown nearly clean, baked "RBS TECH TEACH" fully legible. It becomes the page's brand signature.
2. **Content band** — solid dark band (same ink as the footer) holding the h1, subtitle, and the two existing CTA buttons, centered.

## Changes

### index.html

- `.hero` gets two children:
  - `<div class="hero-banner" role="img" aria-label="RBS Tech Teach"></div>` — empty; image via CSS.
  - `<div class="hero-content">` wrapping the existing `.wrap` with h1, subtitle, and `.actions` (button markup unchanged).
- Remove `<p class="brand">RBS Tech Teach</p>` — the brand is now the artwork text; `aria-label` keeps it accessible.
- Remove the `<em>` around "sob medida" — the h1 becomes plain: `Aulas de inglês online, individuais e sob medida`.

### styles.css

- `.hero`: drop the background composite and padding; move `color: #fff` and `text-align: center` to `.hero-content`.
- `.hero-banner`: `height: clamp(200px, 28vw, 400px);` `background: linear-gradient(rgba(15,20,25,.14), rgba(15,20,25,.14)), url('assets/banner.jpg') center 50%/cover no-repeat;` — clamp and position are starting points, fine-tuned visually so the baked text is never cropped.
- `.hero-content`: `background: var(--ink);` `padding-block: clamp(2.5rem, 6vw, 4rem);`.
- Remove `.hero .brand` rule.
- Remove `.hero h1 em` rule and the now-unused `--grad` custom property.
- Remove the `@media (max-width: 600px)` hero scrim override — no text sits over the image anymore.
- Keep `.hero :focus-visible { outline-color: #fff; }` (still a dark surface).
- Buttons (`.btn`, `.btn-primary`, `.btn-ghost`) untouched.

### CLAUDE.md (project)

- Replace the "hero banner baked text / scrim / background-position 55%" fragile-mechanics bullet with the new invariant: the banner block must show the baked text uncropped (`center 50%/cover` + height clamp, verified at 360/768/1440).
- Update the `--grad` note in the color system section (the gradient is gone, not "used exactly once"; do not reintroduce it).

## Verification (Playwright against a local server)

- Screenshots at 360, 768, and 1440 wide: baked "RBS TECH TEACH" fully visible and uncropped; h1 plain; no ghost overlap.
- `scrollWidth - innerWidth == 0` at 360 and 1440.
- Badges marquee still animates; console has no errors.

## Out of scope

- Button styles (white pill stays), `banner.jpg` compression (known deferred task), WhatsApp link, sticky header.
