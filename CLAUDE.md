# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing landing page for **RBS Tech Teach** — online English classes for adults (pt-BR). Single-file: `index.html` contains all HTML, CSS, and JS inline. No build step, no framework.

## Running

Open `index.html` directly in a browser. No server needed.

## Architecture

One file, five sections (anchors: `#sobre`, `#aulas`, `#agendar`, `#contato`) plus a `<footer>`. All styling is in `<head><style>` using CSS custom properties:

- **Design tokens** — `--ink`, `--teal`, `--violet`, `--grad` drive all colour. `--font-display` (currently `Georgia`) and `--font-body` (system-ui) are swappable.
- **`.wrap`** — single centred container, `max-width: 920px`, used by every section.
- **Buttons** — `.btn` base + `.btn-primary` (white fill) / `.btn-ghost` (transparent) / `.btn-submit` (gradient fill).
- **Contact form** — static markup under `.contact-form`; submit button is `type="button"` with no handler yet.

## Pending work (marked in source)

Comments tagged `CLAUDE CODE (Fase N):` flag planned work:

- **Fase 1** (static additions, no backend):
  - `og:image` meta tag with absolute URL after deploy
  - Professor photo with desktop side-by-side / mobile stacked layout (`#sobre`)
  - Google Calendar scheduling embed or button replacing `.schedule-embed` placeholder (`#agendar`)
  - Footer: e-mail link, WhatsApp link, dynamic copyright year

- **Fase 2** (requires backend):
  - Wire `.contact-form` to a `/api/contact` Cloudflare Function via `fetch`; add loading / success / error states
  - Replace `type="button"` with a real `<form>` + JS submission handler

## Conventions

- All CSS lives in `<head><style>` — no external stylesheet.
- No JS libraries. If JS is needed (form handler, dynamic year), add a `<script>` block before `</body>`.
- Content language: pt-BR. Code, commits, and this file: English.
- Follow the existing 2-space indentation throughout.
