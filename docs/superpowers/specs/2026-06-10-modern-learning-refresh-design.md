# Modern-Learning Visual Refresh — Design

Date: 2026-06-10
Status: approved by user from browser mockup ("hybrid" concept — all 5 elements)

## Problem

The page reads as lifeless: hero and footer are dark, everything between is flat white/mist. The user wants life along a technology / AI / connectivity / globalization concept — modern learning, not video-game aesthetics. The hero (approved earlier today) stays untouched.

## Decision — "modern, connected learning"

Five elements, validated in a browser mockup:

1. **Timezone strip** — thin marquee right below the hero (São Paulo · London · New York · Lisboa · Tóquio · Dublin with live local times via `Intl.DateTimeFormat`), on a violet-tinted dark band (`--ink-2: #141a2e`). Mechanics mirror the badges marquee exactly: `.tz` (overflow hidden) → `.tz-track` (reuses `scroll-left` keyframes, 32s) → two identical `.tz-set`s; whole strip `aria-hidden="true"`; reduced-motion hides the duplicate set and wraps statically. Times update every 30 s via the inline script; mono font.
2. **Video-call frame around the portrait** — `.call-frame` (max-width 300px, ink background, rounded, shadow) wrapping the existing `img.portrait`: top bar (three dots + "Aula ao vivo · Zoom"), bottom bar (pulsing green dot + "Rodrigo · online" + mono chip `tailor-made = sob medida`). Bars `aria-hidden`; pulse only under `prefers-reduced-motion: no-preference`. Desktop grid rule moves from `.about .portrait` to `.about .call-frame`.
3. **PT↔EN chat + numbered cards** — `#aulas` becomes a 2-column `.method` grid (≥840px): left, the 4 `ul.features` items restyled as white cards with mono `01–04` numbers and hover lift (dot bullets removed); right, a decorative `aria-hidden` chat: violet PT bubble ("Como eu digo \"sob medida\" em inglês?") and white EN bubble whose answer ("Tailor-made — that's the word!", 30 chars, mono 0.8rem) types in via CSS `steps(30)` once the section enters the viewport (`IntersectionObserver` adds `.play`; animation only under no-preference).
4. **Dark `#agendar` band with dot map** — section gets `--ink` background, centered white text, dot grid via `::before` (radial-gradient pattern, masked fade) and an absolute `aria-hidden` SVG with dashed arcs GRU→LHR→JFK + mono city labels. Eyebrow switches to light teal `#2bb6c2`; prose/note to white at ≥0.78 alpha (AA on ink). `.btn-schedule` stays solid violet.
5. **Color washes + bilingual eyebrows** — soft radial washes (teal/violet, 5–7% alpha) as extra background layers on `#sobre`, `#aulas`, `#contato` (no gradients on buttons/bullets/headings — the `--grad` ban holds). All four eyebrows switch to mono with an English pair in `.eyebrow-en` (`--ink-soft` on light, white .72 on dark): "Sobre o professor · About", "Como funcionam · The method", "Agende · Book a class", "Contato · Get in touch". Dotted-teal "translation underline" (`.tr`) on one prose phrase in #sobre and on "dúvida" in the contact heading. One-line `.badges-note` under the badges carousel tying the Google AI badges to the classes.

## Implementation notes

- Fonts: add IBM Plex Mono (400;500) to the single Google Fonts link; new tokens `--font-mono`, `--ink-2`.
- Badges carousel untouched. After `#sobre` changes re-check `scrollWidth - innerWidth == 0` at 360px and desktop (CLAUDE.md invariant).
- New JS goes in one inline `<script>` before `</body>` (clocks + IntersectionObserver); no libraries.
- Contrast: every new small text ≥ 4.5:1 (`--teal-text`/`--ink-soft` on light; ≥0.72 white or `#2bb6c2` on dark). Decorative pieces (`.tz`, chat, call bars, SVG) are `aria-hidden`.

## Verification (Playwright)

Screenshots 360/768/1440 read visually; `scrollWidth - innerWidth == 0` at 360 and 1440; badges marquee AND tz marquee both animate (computed transform changes); tz times populated (not `--:--`); chat types after scroll into view; console clean; `node --check` passes on extracted inline scripts.

## Out of scope

Hero, buttons, form behavior, banner compression, global scroll-reveal animations.
