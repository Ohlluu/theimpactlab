# Replace before launch

Everything on this list is **placeholder content written by the developer, not
by Andrea**. It exists so the mockup reads as a finished site instead of a
wireframe full of holes. None of it is true, and none of it may go live.

Nearly all of it lives in one file: **`src/content/placeholder.ts`**.
Anything sourced from Andrea's own documents is in `src/content/copy.ts` and is
safe.

---

## 1. Testimonials — invented

**File:** `src/content/placeholder.ts` → `testimonials`

Three quotes, written to sound like her clients. Attributions are deliberately
limited to **role + organisation type + city** — no real nonprofit, foundation
or person is named anywhere in this project. A fabricated quote attached to a
real organisation is Andrea's legal exposure, not ours, so that line was not
crossed even for a mockup.

**Needed from Andrea:** two or three real quotes with permission to publish,
and how each person wants to be credited. If she has none yet, the section
should be cut rather than softened — an anonymous testimonial reads worse than
no testimonial.

## 2. Metrics — two of four invented

**File:** `src/content/placeholder.ts` → `stats` (see the `verified` flag)

| Figure | Status |
| --- | --- |
| `15+` years | ✅ Stated in her bio |
| `$60M+` raised | ❌ **Invented** |
| `140+` organizations advised | ❌ **Invented** |
| `3` sectors | ✅ Stated in her bio |

**Needed from Andrea:** her real numbers, or permission to drop the two
unverified tiles. A stat band of two true figures beats four where half are
decorative.

## 3. Contact details — invented

**File:** `src/content/placeholder.ts` → `contact`

Email, phone, city, and LinkedIn URL are all made up. The phone number uses the
555-01xx range reserved for fiction, so it cannot ring a real person.

**Needed from Andrea:** real email, real phone (this is also the number the SMS
notifications go to), the city she wants listed, and her LinkedIn URL.

## 4. Appointment types and pricing — invented

**File:** `src/content/placeholder.ts` → `appointmentTypes`

Three types were invented: Discovery Call (30 min, free), Strategy Session
(60 min), Workshop & Facilitation Inquiry (45 min).

Note that **no rates are stated anywhere** — paid types say "Rate confirmed
before booking". That was deliberate: inventing a consultant's fees is the
placeholder most likely to cause a problem, and deferring price to the
conversation is how most advisors at her level actually work. If she wants
prices on the site, they need to come from her.

**Needed from Andrea:** which types she actually offers, their lengths, and
whether to show rates.

## 5. Availability and time zone — invented

**File:** `src/content/placeholder.ts` → `availability`

Currently Tue/Wed/Thu 9–12 and 1–4, Fri 9–12, Central Time, with a 24-hour
notice window and 15-minute buffers. **Central Time is a guess** based on her
University of Chicago background.

**Needed from Andrea:** her real working hours and her actual time zone.

## 6. Privacy policy — not legal advice

**File:** `src/app/(site)/privacy/page.tsx`

Written in plain language and accurate to what the site does, but not reviewed
by a lawyer. Should be checked before launch, particularly if she works with
donors in California or the EU.

---

## Not content — things the real build must add

These are intentionally absent from the mockup:

- **Real authentication.** `/admin` accepts any credentials and the dashboard
  gate is a `sessionStorage` flag. The real build needs a hashed password, an
  HTTP-only session cookie, and server-side route protection.
- **A database.** All bookings and availability live in `localStorage` via
  `src/lib/mockStore.ts`. The logic in `src/lib/booking.ts` is already pure and
  storage-agnostic, so it moves server-side unchanged.
- **Real email and SMS.** The confirmation screen and the SMS log are
  simulations. See the note below on SMS cost.
- **Form submission.** The contact form validates and shows a success state
  without sending anything.

### ⚠️ On the SMS promise

The proposal commits to covering text-messaging costs within the $750 and the
$150/yr renewal. Worth confirming before launch:

- Twilio has no meaningful free tier.
- US A2P 10DLC registration is required for application-to-person SMS and
  takes days to weeks to approve.
- Per-message and per-number costs recur monthly, forever.

Email notification costs effectively nothing and is instant to set up. If SMS
stays in scope, the renewal price should be checked against real carrier fees.

---

## Photography

Only four headshots exist, all from one session in the same outfit and
near-identical poses — effectively **one usable image**. The site is designed
around that constraint (typographic sections and olive fields rather than
padding with stock photos of strangers, which would destroy the authenticity
the whole design depends on).

The portraits in `public/img/*-sand.jpg` are processed versions: the light grey
studio seamless has been replaced with brand sand via
`scripts/grade.mjs`. Originals are untouched alongside them.

**Worth asking for:** photos of her facilitating, presenting, or working with a
group. Those would materially improve the About and Services pages.
