/**
 * Booking logic for the mockup.
 *
 * Deliberately pure and storage-agnostic: slot generation, availability rules
 * and conflict detection all live here, with no React and no persistence. When
 * this becomes the real product, the same functions run server-side against the
 * database — only `mockStore` gets replaced.
 *
 * All dates are handled as local `YYYY-MM-DD` strings rather than `Date`
 * objects. Dates-as-Date is the single most common source of off-by-one
 * booking bugs, because `new Date("2026-03-14")` parses as UTC midnight and
 * renders as the 13th anywhere west of Greenwich.
 */

import { availability, type AppointmentType } from "@/content/placeholder";

export type Booking = {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, 24h, in Andrea's timezone */
  time: string;
  typeId: string;
  typeName: string;
  duration: number;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  notes: string;
  /** ISO timestamp of when the booking was made */
  createdAt: string;
  status: "confirmed" | "cancelled";
};

/* -------------------------------------------------------------------------- */
/* Date helpers — local-time only, no UTC round trips                         */
/* -------------------------------------------------------------------------- */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

/** "Tuesday, March 17, 2026" */
export function formatLongDate(iso: string): string {
  const d = fromISODate(iso);
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "Tue, Mar 17" — for dense lists in the dashboard */
export function formatShortDate(iso: string): string {
  const d = fromISODate(iso);
  return `${DAYS[d.getDay()].slice(0, 3)}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

/** "2:30 PM" from "14:30" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/** End time of an appointment, for display: "2:30 – 3:00 PM" */
export function formatTimeRange(hhmm: string, duration: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const end = h * 60 + m + duration;
  const endHHMM = `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
  return `${formatTime(hhmm)} – ${formatTime(endHHMM)}`;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const fromMinutes = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/* -------------------------------------------------------------------------- */
/* Calendar grid                                                              */
/* -------------------------------------------------------------------------- */

export type CalendarCell = {
  iso: string;
  day: number;
  /** Belongs to the month being displayed, vs. padding from the neighbours. */
  inMonth: boolean;
};

/** Six-row grid, Sunday-first, so the calendar never changes height month to month. */
export function monthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return {
      iso: toISODate(d),
      day: d.getDate(),
      inMonth: d.getMonth() === month,
    };
  });
}

export const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

/* -------------------------------------------------------------------------- */
/* Availability                                                               */
/* -------------------------------------------------------------------------- */

export type AvailabilityOverrides = {
  /** Replaces the weekly template when present. */
  weekly?: Record<number, [string, string][]>;
  blockedDates?: string[];
  vacations?: { start: string; end: string }[];
};

function isWithinVacation(iso: string, vacations: { start: string; end: string }[]) {
  return vacations.some((v) => iso >= v.start && iso <= v.end);
}

/**
 * Every slot the template allows on a date, before bookings are subtracted.
 * Returns [] for days she doesn't work, blocked dates, vacations, dates in the
 * past, inside the notice window, or beyond the booking horizon.
 */
export function slotsForDate(
  iso: string,
  type: AppointmentType,
  overrides: AvailabilityOverrides = {},
  now: Date = new Date(),
): string[] {
  const weekly = overrides.weekly ?? availability.weekly;
  const blocked = overrides.blockedDates ?? [];
  const vacations = overrides.vacations ?? [];

  if (blocked.includes(iso)) return [];
  if (isWithinVacation(iso, vacations)) return [];

  const todayISO = toISODate(now);
  if (iso < todayISO) return [];
  if (iso > addDays(todayISO, availability.horizonDays)) return [];

  const windows = weekly[fromISODate(iso).getDay()] ?? [];
  const step = type.duration + availability.bufferMinutes;

  // Anything sooner than the notice window is not bookable.
  const earliest = new Date(now.getTime() + availability.noticeHours * 3600_000);

  const slots: string[] = [];
  for (const [open, close] of windows) {
    const closeMins = toMinutes(close);
    for (let t = toMinutes(open); t + type.duration <= closeMins; t += step) {
      const hhmm = fromMinutes(t);
      const when = fromISODate(iso);
      when.setHours(Math.floor(t / 60), t % 60, 0, 0);
      if (when < earliest) continue;
      slots.push(hhmm);
    }
  }
  return slots;
}

/**
 * Two appointments conflict if their occupied spans overlap, where an occupied
 * span is the appointment plus its trailing buffer. Checking start times alone
 * would happily double-book a 30-minute call on top of a 60-minute one.
 */
function overlaps(
  aStart: string,
  aDuration: number,
  bStart: string,
  bDuration: number,
): boolean {
  const buffer = availability.bufferMinutes;
  const a0 = toMinutes(aStart);
  const a1 = a0 + aDuration + buffer;
  const b0 = toMinutes(bStart);
  const b1 = b0 + bDuration + buffer;
  return a0 < b1 && b0 < a1;
}

/** Slots still open once existing bookings are removed. */
export function openSlots(
  iso: string,
  type: AppointmentType,
  bookings: Booking[],
  overrides: AvailabilityOverrides = {},
  now: Date = new Date(),
): string[] {
  const taken = bookings.filter((b) => b.date === iso && b.status === "confirmed");
  return slotsForDate(iso, type, overrides, now).filter(
    (slot) => !taken.some((b) => overlaps(slot, type.duration, b.time, b.duration)),
  );
}

export function isDateBookable(
  iso: string,
  type: AppointmentType,
  bookings: Booking[],
  overrides: AvailabilityOverrides = {},
  now: Date = new Date(),
): boolean {
  return openSlots(iso, type, bookings, overrides, now).length > 0;
}

/** First bookable date at or after `from` — used to open the calendar usefully. */
export function nextBookableDate(
  from: string,
  type: AppointmentType,
  bookings: Booking[],
  overrides: AvailabilityOverrides = {},
  now: Date = new Date(),
): string | null {
  let iso = from;
  for (let i = 0; i <= availability.horizonDays; i++) {
    if (isDateBookable(iso, type, bookings, overrides, now)) return iso;
    iso = addDays(iso, 1);
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Calendar export                                                            */
/* -------------------------------------------------------------------------- */

/** Minimal RFC 5545 event so "Add to calendar" is a real download, not a stub. */
export function toICS(booking: Booking): string {
  const [y, m, d] = booking.date.split("-").map(Number);
  const [hh, mm] = booking.time.split(":").map(Number);
  const start = new Date(y, m - 1, d, hh, mm);
  const end = new Date(start.getTime() + booking.duration * 60_000);

  const stamp = (date: Date) =>
    [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0"),
      "T",
      String(date.getUTCHours()).padStart(2, "0"),
      String(date.getUTCMinutes()).padStart(2, "0"),
      "00Z",
    ].join("");

  const escape = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Impact Lab//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@theimpactlab.co`,
    `DTSTAMP:${stamp(new Date(booking.createdAt))}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(`${booking.typeName} with Andrea Porter`)}`,
    `DESCRIPTION:${escape(
      `${booking.typeName} with Andrea Porter, The Impact Lab.\n\nBooked for ${booking.name}${
        booking.organization ? ` (${booking.organization})` : ""
      }.`,
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
