/**
 * ============================================================================
 * ⚠️  PLACEHOLDER CONTENT — INVENTED BY THE DEVELOPER, NOT BY THE CLIENT
 * ----------------------------------------------------------------------------
 * Andrea did not supply testimonials, metrics, contact details, appointment
 * types, or availability. Rather than ship a mockup full of visible holes,
 * every one of those is stubbed here with realistic stand-in content so the
 * design can be judged on its merits.
 *
 * NOTHING IN THIS FILE MAY GO LIVE.
 *
 * Deliberate safety choices:
 *   · Testimonials are attributed to ROLE + ORGANISATION TYPE + CITY only.
 *     No real nonprofit, foundation, or person is named anywhere. A fabricated
 *     quote attached to a real organisation would be Andrea's legal problem,
 *     not ours.
 *   · Metrics are obvious round-ish numbers that invite correction.
 *   · Contact details point at a domain that may not be registered yet.
 *
 * See REPLACE-BEFORE-LAUNCH.md in the project root for the full checklist.
 * ============================================================================
 */

/** Set to `true` to render a dev-only ribbon flagging placeholder blocks. */
export const SHOW_PLACEHOLDER_HINTS = false;

/* -------------------------------------------------------------------------- */
/* Metrics                                                                    */
/* -------------------------------------------------------------------------- */

export const stats = [
  {
    value: "15+",
    label: "Years in fundraising and nonprofit leadership",
    verified: true, // ← stated in her bio
  },
  {
    value: "$60M+",
    label: "Raised across campaigns and institutions",
    verified: false, // ← PLACEHOLDER: needs her real figure, or remove
  },
  {
    value: "140+",
    label: "Organizations, boards, and leaders advised",
    verified: false, // ← PLACEHOLDER
  },
  {
    value: "3",
    label: "Sectors: higher education, national nonprofits, community-based",
    verified: true, // ← stated in her bio
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Testimonials — ALL PLACEHOLDER                                             */
/* -------------------------------------------------------------------------- */

export const testimonials = [
  {
    quote:
      "We had been talking about a major gifts program for three years. Andrea got us to a working pipeline in four months. Not because she handed us a template, but because she made us decide who we were actually going to ask.",
    role: "Executive Director",
    org: "Youth development organization",
    location: "Chicago, IL",
  },
  {
    quote:
      "Our board had been polite about fundraising for a decade. Andrea ran one retreat, and six of our eleven members have since made an ask. She is warm, and she does not let you off the hook.",
    role: "Board Chair",
    org: "Regional arts nonprofit",
    location: "Milwaukee, WI",
  },
  {
    quote:
      "Andrea designed our grantee capacity-building cohort from scratch. Two years later our grantees still use the tools, which is the only metric I actually care about.",
    role: "Program Officer",
    org: "Family foundation",
    location: "Minneapolis, MN",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Contact — ALL PLACEHOLDER                                                  */
/* -------------------------------------------------------------------------- */

export const contact = {
  email: "hello@theimpactlab.co",
  phone: "(312) 555-0147",
  /** Shown on the contact page instead of a street address. */
  basedIn: "Chicago, Illinois",
  serving: "Working with organizations nationwide, remotely and on-site.",
  linkedin: "https://www.linkedin.com/in/andreaporter",
  instagram: "",
} as const;

/* -------------------------------------------------------------------------- */
/* Booking configuration — ALL PLACEHOLDER                                    */
/* -------------------------------------------------------------------------- */

export type AppointmentType = {
  id: string;
  name: string;
  duration: number; // minutes
  /** Omit for "discussed in advance" — deliberately not inventing her rates. */
  price?: string;
  priceNote: string;
  description: string;
  /** Shown as a short qualifier under the type card. */
  bestFor: string;
};

export const appointmentTypes: AppointmentType[] = [
  {
    id: "discovery",
    name: "Discovery Call",
    duration: 30,
    priceNote: "Complimentary",
    description:
      "A first conversation about where your organization is and what you are trying to build. No preparation needed. Come as you are.",
    bestFor: "Start here if we have not spoken before",
  },
  {
    id: "strategy",
    name: "Strategy Session",
    duration: 60,
    priceNote: "Rate confirmed before booking",
    description:
      "A focused working session on one specific challenge: a campaign plan, a stalled pipeline, a board conversation you have been avoiding.",
    bestFor: "Existing clients and referred leaders",
  },
  {
    id: "facilitation",
    name: "Workshop & Facilitation Inquiry",
    duration: 45,
    priceNote: "Scoped after the call",
    description:
      "For teams, boards, and foundations exploring a retreat, a training series, or a multi-session learning cohort.",
    bestFor: "Groups of five or more",
  },
];

/**
 * Weekly availability template. 0 = Sunday.
 * PLACEHOLDER — needs Andrea's real working hours and time zone.
 */
export const availability = {
  timezone: "America/Chicago",
  timezoneLabel: "Central Time",
  /** Days she takes calls, with time windows in 24h local time. */
  weekly: {
    0: [],
    1: [], // Mondays held for client delivery
    2: [
      ["09:00", "12:00"],
      ["13:00", "16:00"],
    ],
    3: [
      ["09:00", "12:00"],
      ["13:00", "16:00"],
    ],
    4: [
      ["09:00", "12:00"],
      ["13:00", "16:00"],
    ],
    5: [["09:00", "12:00"]],
    6: [],
  } as Record<number, [string, string][]>,
  /** Minimum notice before a bookable slot. */
  noticeHours: 24,
  /** How far ahead the calendar opens. */
  horizonDays: 60,
  /** Gap enforced between appointments. */
  bufferMinutes: 15,
};

/**
 * Dates fully blocked off. PLACEHOLDER — these simply demonstrate the feature
 * in the mockup. Stored as YYYY-MM-DD.
 */
export const blockedDates: string[] = [];

/** Vacation ranges, demonstrated in the admin dashboard. PLACEHOLDER. */
export const vacations: { id: string; label: string; start: string; end: string }[] = [
  { id: "v1", label: "Thanksgiving week", start: "2026-11-23", end: "2026-11-27" },
];
