"use client";

/**
 * Browser-only stand-in for the database.
 *
 * The proposal's real build puts bookings and availability in Postgres behind
 * API routes. For the mockup everything lives in localStorage — but behind the
 * same shape the real store will have, so swapping the implementation later
 * does not ripple through the components.
 *
 * The payoff for the demo: the public booking page and the admin dashboard
 * read the same store. Book a call on the site, open the dashboard, and it is
 * there. Block a date in the dashboard, go back to the booking page, and the
 * date is gone. That round trip is what makes the system feel real in a
 * walkthrough, and no backend is involved.
 */

import { useCallback, useEffect, useState } from "react";
import {
  addDays,
  toISODate,
  type Booking,
} from "@/lib/booking";
import { availability, vacations as seedVacations } from "@/content/placeholder";

const KEY = "impactlab.mock.v1";
const CHANGED = "impactlab:store-changed";

export type Vacation = { id: string; label: string; start: string; end: string };

export type SmsLogEntry = {
  id: string;
  bookingId: string;
  to: string;
  body: string;
  sentAt: string;
};

export type MockState = {
  bookings: Booking[];
  /** Weekly availability template, editable from the dashboard. */
  weekly: Record<number, [string, string][]>;
  blockedDates: string[];
  vacations: Vacation[];
  smsLog: SmsLogEntry[];
};

/* -------------------------------------------------------------------------- */
/* Seed                                                                       */
/* -------------------------------------------------------------------------- */

const SEED_PEOPLE = [
  {
    name: "Marcus Whitfield",
    email: "mwhitfield@northsideyouth.org",
    phone: "(773) 555-0182",
    organization: "Northside Youth Collective",
    role: "Executive Director",
    typeId: "discovery",
    notes:
      "We've never run a major gifts program. Board keeps asking about it and I don't know where to start.",
  },
  {
    name: "Priya Raghunathan",
    email: "praghunathan@lakeshorearts.org",
    phone: "(312) 555-0199",
    organization: "Lakeshore Arts Alliance",
    role: "Director of Development",
    typeId: "strategy",
    notes: "Campaign plan stalled at 60% of goal. Need a second set of eyes before the board meeting.",
  },
  {
    name: "Denis Kowalczyk",
    email: "dkowalczyk@brightpathfdn.org",
    phone: "(414) 555-0143",
    organization: "Brightpath Foundation",
    role: "Program Officer",
    typeId: "facilitation",
    notes: "Exploring a capacity-building cohort for 12 grantees in 2027.",
  },
  {
    name: "Alicia Moreno",
    email: "amoreno@casaesperanza.org",
    phone: "(312) 555-0166",
    organization: "Casa Esperanza",
    role: "Executive Director",
    typeId: "discovery",
    notes: "Referred by Marcus. Want to talk about board fundraising expectations.",
  },
  {
    name: "Tobias Lindgren",
    email: "tlindgren@riverbendconservancy.org",
    phone: "(608) 555-0121",
    organization: "Riverbend Conservancy",
    role: "Board Chair",
    typeId: "discovery",
    notes: "",
  },
];

/** Picks the next few Tue/Wed/Thu and drops the seed bookings onto them. */
function buildSeed(now = new Date()): MockState {
  const today = toISODate(now);
  const workdays: string[] = [];
  let cursor = addDays(today, 2);

  while (workdays.length < 6) {
    const dow = new Date(
      Number(cursor.slice(0, 4)),
      Number(cursor.slice(5, 7)) - 1,
      Number(cursor.slice(8, 10)),
    ).getDay();
    if ([2, 3, 4].includes(dow)) workdays.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const times = ["09:00", "10:30", "13:00", "09:45", "14:30"];
  const durations: Record<string, number> = {
    discovery: 30,
    strategy: 60,
    facilitation: 45,
  };
  const names: Record<string, string> = {
    discovery: "Discovery Call",
    strategy: "Strategy Session",
    facilitation: "Workshop & Facilitation Inquiry",
  };

  const bookings: Booking[] = SEED_PEOPLE.map((p, i) => ({
    id: `seed-${i + 1}`,
    date: workdays[i % workdays.length],
    time: times[i],
    typeId: p.typeId,
    typeName: names[p.typeId],
    duration: durations[p.typeId],
    name: p.name,
    email: p.email,
    phone: p.phone,
    organization: p.organization,
    role: p.role,
    notes: p.notes,
    createdAt: new Date(now.getTime() - (i + 1) * 36 * 3600_000).toISOString(),
    status: "confirmed",
  }));

  return {
    bookings,
    weekly: availability.weekly,
    blockedDates: [],
    vacations: [...seedVacations],
    smsLog: bookings.map((b, i) => ({
      id: `seed-sms-${i + 1}`,
      bookingId: b.id,
      to: "(312) 555-0147",
      body: smsBody(b),
      sentAt: b.createdAt,
    })),
  };
}

/** The text Andrea would receive. Shown verbatim in the dashboard. */
export function smsBody(b: Booking): string {
  const d = new Date(
    Number(b.date.slice(0, 4)),
    Number(b.date.slice(5, 7)) - 1,
    Number(b.date.slice(8, 10)),
  );
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const [h, m] = b.time.split(":").map(Number);
  const time = `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
  return `The Impact Lab: New ${b.typeName} booked — ${b.name}${
    b.organization ? ` (${b.organization})` : ""
  }, ${date} at ${time}. ${b.email}`;
}

/* -------------------------------------------------------------------------- */
/* Store                                                                      */
/* -------------------------------------------------------------------------- */

function read(): MockState {
  if (typeof window === "undefined") return buildSeed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seeded = buildSeed();
      window.localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as MockState;
  } catch {
    // Private browsing, quota, or a stale shape from an older build.
    return buildSeed();
  }
}

function write(state: MockState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* non-fatal in a mockup */
  }
  window.dispatchEvent(new CustomEvent(CHANGED));
}

export function resetStore() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  write(buildSeed());
}

/**
 * `ready` is false until the first client-side read completes. Components use
 * it to hold a skeleton for one frame — the seed is time-dependent, so
 * rendering it during SSR would guarantee a hydration mismatch.
 */
export function useMockStore() {
  const [state, setState] = useState<MockState | null>(null);

  useEffect(() => {
    setState(read());
    const sync = () => setState(read());
    window.addEventListener(CHANGED, sync);
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (s: MockState) => MockState) => {
    const next = fn(read());
    write(next);
    setState(next);
  }, []);

  const addBooking = useCallback(
    (booking: Booking) => {
      update((s) => ({
        ...s,
        bookings: [...s.bookings, booking],
        smsLog: [
          {
            id: `sms-${booking.id}`,
            bookingId: booking.id,
            to: "(312) 555-0147",
            body: smsBody(booking),
            sentAt: new Date().toISOString(),
          },
          ...s.smsLog,
        ],
      }));
    },
    [update],
  );

  const cancelBooking = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        bookings: s.bookings.map((b) =>
          b.id === id ? { ...b, status: "cancelled" as const } : b,
        ),
      }));
    },
    [update],
  );

  const setWeekly = useCallback(
    (weekly: Record<number, [string, string][]>) => {
      update((s) => ({ ...s, weekly }));
    },
    [update],
  );

  const toggleBlockedDate = useCallback(
    (iso: string) => {
      update((s) => ({
        ...s,
        blockedDates: s.blockedDates.includes(iso)
          ? s.blockedDates.filter((d) => d !== iso)
          : [...s.blockedDates, iso],
      }));
    },
    [update],
  );

  const addVacation = useCallback(
    (v: Omit<Vacation, "id">) => {
      update((s) => ({
        ...s,
        vacations: [...s.vacations, { ...v, id: `vac-${Date.now()}` }],
      }));
    },
    [update],
  );

  const removeVacation = useCallback(
    (id: string) => {
      update((s) => ({ ...s, vacations: s.vacations.filter((v) => v.id !== id) }));
    },
    [update],
  );

  return {
    state,
    ready: state !== null,
    addBooking,
    cancelBooking,
    setWeekly,
    toggleBlockedDate,
    addVacation,
    removeVacation,
    reset: resetStore,
  };
}
