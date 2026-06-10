# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing landing page for **RBS Tech Teach** — one-on-one online English classes for adults. Live at **rbs.eng.br** on Cloudflare Pages. Vanilla HTML/CSS/JS, **no framework, no build step, no bundler**. Page content is **pt-BR**; code, commits, and docs are **English**.

Three source files do all the work: `index.html` (structure + three inline `<script>`s: footer year, timezone clocks + chat typing trigger, contact form), `styles.css` (the entire design system), `functions/api/contact.js` (the one backend endpoint). Images live in `assets/`.

## Running & verifying

- **Static preview**: open `index.html` in a browser, or `python3 -m http.server` from the repo root. This covers everything *except* the contact form, which needs the Function.
- **Full stack (incl. contact form)**: `npx wrangler pages dev .` — emulates Pages + Functions. Needs `RESEND_API_KEY` in a gitignored `.dev.vars` file.
- **JS sanity check**: `node --check functions/api/contact.js`. To check the inline page script: `sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' | node --check /dev/stdin`.
- **No test framework.** Visual/behavioral changes are verified by driving a local server with the Playwright MCP (a native browser is not available in this WSL env). The reliable checks used here: `scrollWidth - innerWidth` for horizontal overflow, and reading a marquee track's computed `transform` twice with a delay to prove it animates (there are two — `.badges-track` and `.tz-track`).

## Deployment (Cloudflare Pages)

- Repo root is served as static assets; `functions/` is auto-routed (`functions/api/contact.js` → `POST /api/contact`).
- **`RESEND_API_KEY`** is set in the Pages dashboard (Settings → Environment variables), Production **and** Preview — never in the repo.
- This is its **own git repo**, standalone (not part of the parent `/home/sias/projects` workspace) so Cloudflare can track it directly.
- `og:image` and the favicon point at absolute `rbs.eng.br` URLs / an inline SVG data URI — no external favicon file.

## Color system — the non-obvious a11y invariants

The palette derives from the hero banner artwork (liquid paint, green→teal→blue→violet). These rules were established by a contrast audit and are easy to silently break:

- **`--teal` (#1f9ea8) fails 4.5:1 on white.** For any *small text* use **`--teal-text` (#147a82)**. `--teal` is fine for non-text accents (focus ring, bullet dots, input focus outline).
- **`--violet` is the single "action" color** — every button (`.btn-schedule`, `.btn-submit`) is solid violet with `--violet-deep` on hover. White-on-violet passes AA.
- **`--grad` was removed** in the hero redesign (the h1 is plain — no highlighter). Do **not** reintroduce the gradient on buttons, bullets, or headings — repeating it was the "flat" problem a redesign fixed.
- The hero headline sits on a solid `--ink` band (`.hero-content`), not over the artwork — white-on-ink passes AA.
- **Dark surfaces (`.hero-content`, `.tz`, `#agendar`, footer) need light text**: white at ≥ 0.72 alpha for small text, or `#2bb6c2` (the light-teal eyebrow on `#agendar`). `--teal-text` / `--ink-soft` are for **light** backgrounds only — they fail on ink.
- `.tr` (dotted teal "translation underline") and the section washes (5–7% radial tints on `#sobre`/`#aulas`/`#contato`) are the only decorative color uses — both are non-text accents, consistent with the `--teal` rule above.
- Headings/measure use **scoped classes** (`.section-title`, `.prose`, `.footer-link`), not bare element selectors, to avoid specificity leaks. `.prose` is opt-in for the 60ch measure — don't restore a bare `section p { max-width }` rule (it leaked into the schedule placeholder before).

## Fragile layout mechanics (these have broken before — touch carefully)

- **Two marquees share the `scroll-left` keyframes** — the badges carousel and the timezone strip (`.tz` → `.tz-track` → two identical `.tz-set`s, whole strip `aria-hidden`, times filled by the inline clock script). Renaming or editing `scroll-left` affects both. The tz strip follows the same rules as the badges: animation on the inner track only, inside `@media (prefers-reduced-motion: no-preference)`; reduced-motion hides the duplicate set and wraps statically.
- **Badges marquee** (`#sobre`): structure is `.badges` (`overflow:hidden`) → `.badges-track` (animated) → **two** `.badges-set`, the second `aria-hidden="true"` and a duplicate of the first. Seamless loop math: the animation translates the track `-50%`, which only lands cleanly if the two sets are identical **and** `.badges-set` `padding-right` equals the inter-item `gap` (both `2rem`). The animation must stay on the **inner `.badges-track`**, inside `@media (prefers-reduced-motion: no-preference)`; reduced-motion hides the duplicate set and falls back to a static `flex-wrap` grid.
- **`.about` grid must not reintroduce `justify-items: start`, and `.about-text` keeps `min-width: 0`.** Without both, the marquee's wide intrinsic track defeats `overflow:hidden` and blows out page width (caused a ~670px horizontal-overflow bug). After any `#sobre` change, re-check `scrollWidth - innerWidth == 0` at 360px and desktop.
- **Hero is two stacked blocks**: `.hero-banner` (the artwork with "RBS TECH TEACH" baked in, light 0.14 scrim, `height: clamp(200px, 28vw, 400px)`, `background: center 50%/cover`) and `.hero-content` (solid `--ink` band with the h1 and CTAs). Invariant: the baked text must stay fully visible and uncropped — after touching the banner height/position, verify at 360/768/1440 in a browser, don't eyeball the CSS.

## Contact form contract

The form and the Function are coupled by field names — keep them in sync:

- Form posts JSON `{ nome, email, mensagem, website }` to `/api/contact`; the Function destructures exactly those keys.
- **`website` is a honeypot** (hidden input); a non-empty value is rejected. The submit handler and validation messages are pt-BR.
- `maxlength="2000"` on the textarea **mirrors** the server-side length check — change both together.
- The Function calls the **Resend HTTP API directly** via `fetch` (no SDK). `from: contato@rbs.eng.br` requires the `rbs.eng.br` domain be verified in Resend, or sends 403.
- The Function replies `{ ok: true }` or `{ ok: false, error }` (HTTP 400 validation / 502 Resend failure); the page's submit handler branches on `ok` to render the pt-BR status message.

## Conventions

- 2-space indentation everywhere. No JS libraries; new behavior goes in an inline `<script>` before `</body>`.
- Fonts: Space Grotesk (display) + Inter (body) + IBM Plex Mono (eyebrows, tz strip, chat/`feature-n` micro-labels), one Google Fonts `<link>`; swap via `--font-display` / `--font-body` / `--font-mono`.
- `assets/*:Zone.Identifier` are WSL download-marker artifacts (gitignored) — ignore them.

## Known follow-up

- `assets/banner.jpg` is still the full 512 KB / 3200 px export — compression to ~1920 px is a deliberately deferred separate task.
