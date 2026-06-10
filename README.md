# RBS Tech Teach — Landing Page

Static landing page for RBS Tech Teach: one-on-one online English classes for adults (pt-BR content).

## Stack

- HTML / CSS / JavaScript (vanilla) — no frameworks, no build step
- [Cloudflare Pages](https://pages.cloudflare.com/) for hosting (static files served from the repo root)
- [Cloudflare Functions](https://developers.cloudflare.com/pages/functions/) under `functions/` for future backend endpoints (e.g. `functions/api/contact.js` → `/api/contact`)

## Environment variables

Set in the Cloudflare Pages dashboard (Settings → Environment variables), for both Production and Preview. Never commit these to the repo.

| Variable | Used by | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | `functions/api/contact.js` | [Resend](https://resend.com) API key for delivering contact-form emails |

## Running locally

Open `index.html` directly in a browser — no server required.

Once Functions are added, use Wrangler to emulate the full Pages environment:

```sh
npx wrangler pages dev .
```
