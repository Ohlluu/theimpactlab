# The Impact Lab

Website and booking system for The Impact Lab — a fundraising and nonprofit
capacity-building consultancy led by Andrea Porter.

**This repository is currently the design mockup** (stage one of the proposal).
Everything is clickable and behaves like the finished product, but there is no
backend: bookings and availability live in the browser. See
[REPLACE-BEFORE-LAUNCH.md](./REPLACE-BEFORE-LAUNCH.md) for the full list of
placeholder content and what the production build still needs.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

The admin dashboard is at **`/admin`**. Any email and password will sign you in.

## What to look at

| Route | What it demonstrates |
| --- | --- |
| `/` | Home — hero, credibility band, the seven practice areas, approach, testimonials |
| `/about` | Andrea's full bio, credentials, and working style |
| `/services` | Seven practice areas as an expandable index; deep-linkable (`/services#major-gifts`) |
| `/booking` | Four-step booking: type → calendar → details → confirmation |
| `/contact` | Enquiry form with validation |
| `/admin` | Mock sign-in |
| `/admin/dashboard` | Appointments, availability editor, SMS notification log |

**The round trip worth demonstrating:** book a call on `/booking`, then open
the dashboard — it is there. Block a date under *Availability*, go back to
`/booking` — the date is gone. Both surfaces read the same store.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind v4** — design tokens in `src/app/globals.css`
- **League Spartan** (display) + **Roboto** (body) via `next/font`, self-hosted

Chosen so the mockup becomes the production site rather than being thrown away:
the booking logic is already written to run server-side, and only the storage
layer changes.

## Design notes

The palette, type and logo are Andrea's existing brand. Three decisions shape
the rest:

1. **Olive is a field colour, not an accent.** The site is predominantly dark
   olive, with sand used for warm relief and navy once, for testimonials. Brass
   is used sparingly so it still reads as valuable.
2. **The corner bracket from the logo is the design system.** It frames
   portraits, section openers, the selected date in the booking calendar, and
   the confirmation state — always in the logo's own orientation (top-right,
   bottom-left), so the repetition registers as a system.
3. **Seven services are an index, not a card grid.** Seven cards always leave an
   orphan in the last row. A numbered editorial list handles any count and
   signals "practice areas" rather than "pricing tiers".

Copy is reproduced close to verbatim from Andrea's own documents. Her brand
voice board asks for "clear, actionable strategies without fluff or jargon" —
the surest way to honour that was to write as little new prose as possible.

## Layout

```
src/
  app/
    (site)/        public pages — share the header/footer shell
    admin/         dashboard — no site chrome, noindex
  components/      UI, grouped by surface (home/, booking/, admin/)
  content/
    copy.ts        ✅ verified client copy — do not rewrite
    placeholder.ts ⚠️ invented stand-ins — see REPLACE-BEFORE-LAUNCH.md
  lib/
    booking.ts     pure availability + slot logic; no React, no storage
    mockStore.ts   localStorage stand-in for the database
scripts/           dev-only asset prep and screenshot QA (not shipped)
```

## Scripts

Run from the project root. None of these are part of the build.

```bash
node scripts/logo.mjs     # extract the wordmark from the olive logo square
node scripts/grade.mjs    # re-matte the headshot backdrops to brand sand
node scripts/icons.mjs    # favicon, apple icon, Open Graph card
node scripts/shot.mjs /about /tmp/about.png --w=1440 --full
node scripts/sweep.mjs    # every page at phone + tablet; flags overflow and console errors
```

`scripts/grade.mjs` is the interesting one. The studio headshots sit on a light
cool-grey seamless, which reads as a bright rectangle pasted onto a dark page.
It flood-fills the backdrop from the image edges, feathers the mask, suppresses
the halo that curly hair leaves behind, and repaints it in brand sand — light
replacing light, so any imperfection in the matte is invisible.
