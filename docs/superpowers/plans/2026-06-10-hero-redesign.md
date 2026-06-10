# Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the hero into a clean banner block (baked "RBS TECH TEACH" fully visible) and a solid dark content band below it, with a plain h1 (no gradient highlight).

**Architecture:** Pure HTML/CSS restructuring of the `.hero` header in `index.html` + the HERO section of `styles.css`. No JS changes, no new files. Spec: `docs/superpowers/specs/2026-06-10-hero-redesign-design.md`.

**Tech Stack:** Vanilla HTML/CSS, no build step, no test framework. Verification is done by driving a local server (`python3 -m http.server 8000`) with the Playwright MCP — this repo's standard practice (see project CLAUDE.md).

**Caution:** `CLAUDE.md` and `README.md` carry pre-existing uncommitted user edits. Never `git add` them as part of this plan's commits. Task 5 edits `CLAUDE.md` but leaves it uncommitted for the user to review.

---

### Task 1: Restructure the hero HTML

**Files:**
- Modify: `index.html:24-34`

- [ ] **Step 1: Replace the hero header block**

Current content (lines 24–34):

```html
  <header class="hero">
    <div class="wrap">
      <p class="brand">RBS Tech Teach</p>
      <h1>Aulas de inglês online, individuais e <em>sob medida</em></h1>
      <p>Aprenda no seu ritmo, sem sair de casa — com aulas planejadas para o seu objetivo.</p>
      <div class="actions">
        <a class="btn btn-primary" href="#agendar">Agendar aula experimental</a>
        <a class="btn btn-ghost" href="#contato">Falar com o professor</a>
      </div>
    </div>
  </header>
```

Replace with:

```html
  <header class="hero">
    <div class="hero-banner" role="img" aria-label="RBS Tech Teach"></div>
    <div class="hero-content">
      <div class="wrap">
        <h1>Aulas de inglês online, individuais e sob medida</h1>
        <p>Aprenda no seu ritmo, sem sair de casa — com aulas planejadas para o seu objetivo.</p>
        <div class="actions">
          <a class="btn btn-primary" href="#agendar">Agendar aula experimental</a>
          <a class="btn btn-ghost" href="#contato">Falar com o professor</a>
        </div>
      </div>
    </div>
  </header>
```

Notes: the `<p class="brand">` kicker is gone (the artwork text is the brand; `aria-label` keeps it accessible) and the `<em>` around "sob medida" is gone (plain h1).

- [ ] **Step 2: Sanity-check the edit**

Run: `grep -n 'class="brand"\|<em>\|hero-banner\|hero-content' index.html`
Expected: exactly two hits — `hero-banner` and `hero-content` on the new lines; no `class="brand"`, no `<em>` anywhere.

### Task 2: Rewrite the HERO section of the CSS

**Files:**
- Modify: `styles.css:16` (remove `--grad`), `styles.css:44-85` (HERO section)

- [ ] **Step 1: Remove the now-unused `--grad` token**

Delete line 16 (and its surrounding blank line if it leaves a double blank):

```css
  --grad: linear-gradient(120deg, #2f7d5a 0%, #1f9ea8 38%, #3a5bd0 68%, #7b3fd4 100%);
```

- [ ] **Step 2: Replace the HERO block**

Current content (lines 44–85): the `.hero { background: …55%… }` composite, `.hero .brand`, `.hero h1`, `.hero h1 em`, `.hero p`, and the `@media (max-width: 600px)` scrim override.

Replace the whole section with:

```css
/* ---------- HERO ---------- */
.hero-banner {
  height: clamp(200px, 28vw, 400px);
  background: linear-gradient(rgba(15,20,25,0.14), rgba(15,20,25,0.14)), url('assets/banner.jpg') center 50%/cover no-repeat;
}
.hero-content {
  background: var(--ink);
  color: #fff;
  text-align: center;
  padding-block: clamp(2.5rem, 6vw, 4rem);
}
.hero h1 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(2.1rem, 6vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-wrap: balance;
  max-width: 16ch;
  margin-inline: auto;
}
.hero p {
  margin-top: 1.25rem;
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  max-width: 42ch;
  margin-inline: auto;
}
```

Kept rules elsewhere in the file — do NOT touch: `.hero .actions` (~line 108) and `.hero :focus-visible` (~line 253) still apply inside `.hero-content`.

- [ ] **Step 3: Sanity-check the edit**

Run: `grep -n 'grad\|brand\|55%\|max-width: 600px' styles.css`
Expected: no `--grad`, no `var(--grad)`, no `.hero .brand`, no `55%`, no hero `@media (max-width: 600px)` override. (Hits on `linear-gradient` inside `.hero-banner`/marquee mask are fine; the grep will show them — check each hit is one of those.)

### Task 3: Verify in the browser (Playwright MCP)

**Files:** none (verification only)

- [ ] **Step 1: Serve the site**

Check if a server is already up: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/` → `200` means skip the next command. Otherwise run in background: `python3 -m http.server 8000 --directory /home/sias/projects/my_page`

- [ ] **Step 2: Desktop check (1440×900)**

Navigate to `http://localhost:8000`, resize to 1440×900, take a viewport screenshot and READ it. Expected: banner on top with "RBS TECH TEACH" from the artwork fully visible and uncropped; below it a solid dark band with the plain h1 (no gradient underline), subtitle, and the two buttons unchanged.

- [ ] **Step 3: Tablet and mobile checks (768 and 360 wide)**

Resize to 768×900, screenshot, read. Resize to 360×800, screenshot, read. Same expectations; baked text must not be cut off at any width.

- [ ] **Step 4: Measured checks**

Run via `browser_evaluate` at 360 and at 1440:

```js
() => {
  const track = document.querySelector('.badges-track');
  const t1 = track ? getComputedStyle(track).transform : null;
  return new Promise(resolve => setTimeout(() => resolve({
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    bannerHeight: document.querySelector('.hero-banner').getBoundingClientRect().height,
    marqueeMoved: t1 !== getComputedStyle(track).transform,
    brandGone: !document.querySelector('.hero .brand'),
    emGone: !document.querySelector('.hero h1 em')
  }), 600));
}
```

Expected: `overflowX: 0`, `bannerHeight` > 0 (≈200 at 360px wide, ≈400 at 1440), `marqueeMoved: true`, `brandGone: true`, `emGone: true`. Also fetch console messages — expected: 0 errors, 0 warnings.

- [ ] **Step 5: Fine-tune only if needed**

If a screenshot shows the baked text cropped, adjust ONLY `clamp(200px, 28vw, 400px)` and/or `center 50%` in `.hero-banner`, then repeat Steps 2–4. This is a visual judgment — decide from screenshots, not from the CSS.

### Task 4: Commit the code changes

**Files:** `index.html`, `styles.css` only

- [ ] **Step 1: Commit**

```bash
git add index.html styles.css
git commit -m "feat: hero redesign — clean banner + dark content band, plain h1

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

Do NOT `git add` CLAUDE.md or README.md (pre-existing user edits).

### Task 5: Update project CLAUDE.md (no commit)

**Files:**
- Modify: `CLAUDE.md` (working-tree version — it already has uncommitted user edits; edit on top, leave uncommitted)

- [ ] **Step 1: Replace the `--grad` bullet**

Old:

```markdown
- **`--grad` appears exactly once**: the highlighter swipe under `<em>` in the hero `<h1>`. Do **not** reintroduce the gradient on buttons or bullets — repeating it was the "flat" problem a redesign fixed. Grep before adding a `var(--grad)`.
- Hero text is legible only because of the dark scrim layered over the banner (see below), not the text color alone.
```

New:

```markdown
- **`--grad` was removed** in the hero redesign (the h1 is plain — no highlighter). Do **not** reintroduce the gradient on buttons, bullets, or headings — repeating it was the "flat" problem a redesign fixed.
- The hero headline sits on a solid `--ink` band (`.hero-content`), not over the artwork — white-on-ink passes AA.
```

- [ ] **Step 2: Replace the hero-banner fragile-mechanics bullet**

Old:

```markdown
- **Hero banner has "RBS TECH TEACH" baked into the artwork** near vertical center. `background-position: center 55%` plus the dark scrim keeps it out of / behind the headline. Mobile (`max-width: 600px`) uses a stronger scrim (0.75 vs 0.70 desktop). Changing the banner position/scrim is a visual judgment — verify in a browser, don't eyeball the CSS.
```

New:

```markdown
- **Hero is two stacked blocks**: `.hero-banner` (the artwork with "RBS TECH TEACH" baked in, light 0.14 scrim, `height: clamp(200px, 28vw, 400px)`, `background: center 50%/cover`) and `.hero-content` (solid `--ink` band with the h1 and CTAs). Invariant: the baked text must stay fully visible and uncropped — after touching the banner height/position, verify at 360/768/1440 in a browser, don't eyeball the CSS.
```

- [ ] **Step 3: Report**

Tell the user CLAUDE.md was updated but intentionally left uncommitted (it carries their pending edits) so they can review and commit it themselves.
