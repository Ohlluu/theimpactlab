"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/booking/Calendar";
import { useMockStore } from "@/lib/mockStore";
import {
  formatLongDate,
  formatTime,
  formatTimeRange,
  nextBookableDate,
  openSlots,
  toICS,
  toISODate,
  type AvailabilityOverrides,
  type Booking,
} from "@/lib/booking";
import { appointmentTypes, availability, contact } from "@/content/placeholder";

const STEPS = ["Type", "Date & Time", "Your Details", "Confirmed"] as const;

type Details = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  notes: string;
};

const EMPTY: Details = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  notes: "",
};

export function BookingFlow({ initialTopic }: { initialTopic?: string }) {
  const { state, ready, addBooking } = useMockStore();

  const [step, setStep] = useState(0);
  const [typeId, setTypeId] = useState(appointmentTypes[0].id);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const type = appointmentTypes.find((t) => t.id === typeId) ?? appointmentTypes[0];

  const overrides: AvailabilityOverrides = useMemo(
    () =>
      state
        ? {
            weekly: state.weekly,
            blockedDates: state.blockedDates,
            vacations: state.vacations,
          }
        : {},
    [state],
  );

  const bookings = state?.bookings ?? [];

  // Prefill the "what would you like to discuss" box when arriving from a
  // service panel: /booking?topic=major-gifts
  useEffect(() => {
    if (!initialTopic) return;
    const label = initialTopic.replace(/-/g, " ");
    setDetails((d) =>
      d.notes
        ? d
        : { ...d, notes: `I'd like to talk about ${label}.` },
    );
  }, [initialTopic]);

  const firstOpen = useMemo(() => {
    if (!ready) return null;
    return nextBookableDate(toISODate(new Date()), type, bookings, overrides);
  }, [ready, type, bookings, overrides]);

  const slots = useMemo(
    () => (date ? openSlots(date, type, bookings, overrides) : []),
    [date, type, bookings, overrides],
  );

  // Changing appointment type can invalidate the chosen slot — a 60-minute
  // session may not fit where a 30-minute one did.
  useEffect(() => {
    setTime(null);
    setDate(null);
  }, [typeId]);

  const validate = () => {
    const next: Partial<Record<keyof Details, string>> = {};
    if (!details.name.trim()) next.name = "Please tell us your name.";
    if (!details.email.trim()) next.email = "We need an email to confirm.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
      next.email = "That email doesn't look right.";
    if (!details.organization.trim())
      next.organization = "Which organization are you with?";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate() || !date || !time) return;
    const booking: Booking = {
      id: `bk-${Date.now().toString(36)}`,
      date,
      time,
      typeId: type.id,
      typeName: type.name,
      duration: type.duration,
      ...details,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    addBooking(booking);
    setConfirmed(booking);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goto = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 pb-32 md:px-10 lg:px-16">
        <div className="h-96 animate-pulse bg-olive-900/50" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 md:px-10 lg:px-16">
      <Stepper step={step} onJump={goto} />

      {/* ---------------------------------------------------- 1. Type ---- */}
      {step === 0 && (
        <div className="mt-14">
          <h2 className="text-3xl text-paper md:text-4xl">
            What kind of conversation?
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-paper/60">
            If you are not sure, choose the discovery call. It is the right
            starting point for almost everyone.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {appointmentTypes.map((t) => {
              const active = t.id === typeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTypeId(t.id)}
                  aria-pressed={active}
                  className={`group relative flex flex-col p-7 text-left transition-all duration-400 ${
                    active
                      ? "bg-olive-800 ring-1 ring-brass-400"
                      : "bg-olive-900/60 ring-1 ring-paper/10 hover:bg-olive-900 hover:ring-paper/25"
                  }`}
                >
                  {active && (
                    <>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-1.5 -top-1.5 h-6 w-6 border-r-2 border-t-2 border-brass-400"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-6 w-6 border-b-2 border-l-2 border-brass-400"
                      />
                    </>
                  )}

                  <div className="flex items-baseline justify-between gap-4">
                    <span className="label text-brass-400">{t.duration} min</span>
                    <span className="text-xs text-paper/45">{t.priceNote}</span>
                  </div>

                  <h3 className="mt-5 text-pretty text-xl leading-tight text-paper md:text-2xl">
                    {t.name}
                  </h3>
                  <p className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-paper/60">
                    {t.description}
                  </p>
                  <p className="mt-6 border-t border-paper/10 pt-4 text-xs text-paper/40">
                    {t.bestFor}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-12">
            <button
              type="button"
              onClick={() => goto(1)}
              className="group inline-flex items-center gap-3 bg-brass-400 px-8 py-4 label text-olive-950 transition-colors duration-300 hover:bg-brass-300"
            >
              Choose a Time
              <Arrow />
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------- 2. Date/time ---- */}
      {step === 1 && (
        <div className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-3xl text-paper md:text-4xl">Pick a time</h2>
            <p className="text-sm text-paper/50">
              {type.name} · {type.duration} minutes · All times{" "}
              {availability.timezoneLabel}
            </p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="bg-olive-900/50 p-6 md:p-8">
              <Calendar
                type={type}
                bookings={bookings}
                overrides={overrides}
                selected={date}
                onSelect={(iso) => {
                  setDate(iso);
                  setTime(null);
                }}
                initialMonth={firstOpen ?? toISODate(new Date())}
              />
            </div>

            <div>
              {!date && (
                <div className="flex h-full min-h-56 flex-col justify-center border border-dashed border-paper/15 p-8 text-center">
                  <p className="text-pretty text-base text-paper/50">
                    Choose a date to see open times.
                  </p>
                  {firstOpen && (
                    <button
                      type="button"
                      onClick={() => setDate(firstOpen)}
                      className="mx-auto mt-5 text-sm text-brass-300 underline underline-offset-4 transition-colors hover:text-brass-200"
                    >
                      Jump to the next opening — {formatLongDate(firstOpen)}
                    </button>
                  )}
                </div>
              )}

              {date && (
                <>
                  <h3 className="font-display text-xl font-bold tracking-tight text-paper md:text-2xl">
                    {formatLongDate(date)}
                  </h3>
                  <p className="mt-2 text-sm text-paper/50">
                    {slots.length} {slots.length === 1 ? "opening" : "openings"}
                  </p>

                  {slots.length === 0 ? (
                    <p className="mt-7 border border-dashed border-paper/15 p-6 text-sm text-paper/50">
                      Nothing open that day. Try another date on the calendar.
                    </p>
                  ) : (
                    <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {slots.map((s) => {
                        const active = time === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setTime(s)}
                            aria-pressed={active}
                            className={`border py-3.5 text-sm transition-all duration-300 ${
                              active
                                ? "border-brass-400 bg-brass-400 font-medium text-olive-950"
                                : "border-paper/20 text-paper hover:border-brass-400/70 hover:bg-olive-900"
                            }`}
                          >
                            {formatTime(s)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {time && (
                    <div className="mt-9 border-t border-paper/10 pt-7">
                      <p className="text-sm text-paper/55">You are booking</p>
                      <p className="mt-2 font-display text-lg font-bold tracking-tight text-brass-300">
                        {formatTimeRange(time, type.duration)}
                      </p>
                      <button
                        type="button"
                        onClick={() => goto(2)}
                        className="group mt-7 inline-flex w-full items-center justify-center gap-3 bg-brass-400 px-8 py-4 label text-olive-950 transition-colors duration-300 hover:bg-brass-300 sm:w-auto"
                      >
                        Continue
                        <Arrow />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <BackLink onClick={() => goto(0)}>Back to appointment type</BackLink>
        </div>
      )}

      {/* -------------------------------------------------- 3. Details --- */}
      {step === 2 && date && time && (
        <div className="mt-14">
          <h2 className="text-3xl text-paper md:text-4xl">A little context</h2>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-paper/60">
            Enough that Andrea can come to the call prepared. Nothing you write
            here is shared with anyone.
          </p>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="grid gap-6 sm:grid-cols-2"
            >
              <Field
                label="Full name"
                required
                value={details.name}
                error={errors.name}
                onChange={(v) => setDetails({ ...details, name: v })}
                autoComplete="name"
              />
              <Field
                label="Email"
                type="email"
                required
                value={details.email}
                error={errors.email}
                onChange={(v) => setDetails({ ...details, email: v })}
                autoComplete="email"
              />
              <Field
                label="Organization"
                required
                value={details.organization}
                error={errors.organization}
                onChange={(v) => setDetails({ ...details, organization: v })}
                autoComplete="organization"
              />
              <Field
                label="Your role"
                value={details.role}
                onChange={(v) => setDetails({ ...details, role: v })}
                autoComplete="organization-title"
              />
              <Field
                label="Phone"
                type="tel"
                hint="Optional"
                value={details.phone}
                onChange={(v) => setDetails({ ...details, phone: v })}
                autoComplete="tel"
                className="sm:col-span-2"
              />
              <Field
                label="What would you like to talk about?"
                hint="Optional, but it helps"
                multiline
                value={details.notes}
                onChange={(v) => setDetails({ ...details, notes: v })}
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-3 bg-brass-400 px-8 py-4 label text-olive-950 transition-colors duration-300 hover:bg-brass-300 sm:w-auto"
                >
                  Confirm Booking
                  <Arrow />
                </button>
                <p className="mt-4 text-xs text-paper/40">
                  You will get a confirmation email, and Andrea gets a text
                  immediately.
                </p>
              </div>
            </form>

            <aside className="h-fit border border-paper/15 p-7 lg:sticky lg:top-32">
              <p className="label text-brass-400">Your appointment</p>
              <dl className="mt-6 space-y-5 text-sm">
                <Row term="What" detail={type.name} />
                <Row term="When" detail={formatLongDate(date)} />
                <Row
                  term="Time"
                  detail={`${formatTimeRange(time, type.duration)} ${availability.timezoneLabel}`}
                />
                <Row term="Length" detail={`${type.duration} minutes`} />
                <Row term="Cost" detail={type.priceNote} />
              </dl>
              <button
                type="button"
                onClick={() => goto(1)}
                className="mt-7 w-full border-t border-paper/10 pt-5 text-left text-sm text-brass-300 transition-colors hover:text-brass-200"
              >
                Change date or time
              </button>
            </aside>
          </div>

          <BackLink onClick={() => goto(1)}>Back to date and time</BackLink>
        </div>
      )}

      {/* ---------------------------------------------- 4. Confirmed ----- */}
      {step === 3 && confirmed && <Confirmation booking={confirmed} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function Stepper({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  return (
    <ol className="flex flex-wrap gap-x-2 gap-y-3 border-b border-paper/10 pb-6">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!done}
              onClick={() => done && onJump(i)}
              className={`flex items-center gap-2.5 px-1 py-1 label transition-colors duration-300 ${
                active
                  ? "text-brass-400"
                  : done
                    ? "text-paper/55 hover:text-paper"
                    : "text-paper/25"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center text-[0.65rem] transition-colors duration-300 ${
                  active
                    ? "bg-brass-400 text-olive-950"
                    : done
                      ? "bg-olive-700 text-paper"
                      : "border border-paper/20"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="hidden h-px w-6 bg-paper/15 sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Row({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="flex justify-between gap-5 border-b border-paper/8 pb-4 last:border-0">
      <dt className="shrink-0 text-paper/45">{term}</dt>
      <dd className="text-right text-paper">{detail}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  multiline = false,
  hint,
  error,
  className = "",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  autoComplete?: string;
}) {
  const id = `f-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const base =
    "w-full border bg-transparent px-4 py-3.5 text-[0.95rem] text-paper placeholder:text-paper/25 transition-colors duration-200 focus:outline-none";
  const tone = error
    ? "border-red-400/70 focus:border-red-400"
    : "border-paper/20 focus:border-brass-400";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 flex items-baseline gap-2">
        <span className="label text-paper/65">{label}</span>
        {required && <span className="text-brass-400">*</span>}
        {hint && <span className="text-xs text-paper/30">{hint}</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${tone} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={`${base} ${tone}`}
        />
      )}
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function Confirmation({ booking }: { booking: Booking }) {
  const download = () => {
    const blob = new Blob([toICS(booking)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `impact-lab-${booking.date}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-16 max-w-3xl">
      <div className="relative inline-block">
        <span
          aria-hidden="true"
          className="absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-brass-400"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-brass-400"
        />
        <p className="label px-3 py-1 text-brass-400">Confirmed</p>
      </div>

      <h2 className="mt-9 text-[clamp(2.25rem,5.5vw,4rem)] text-paper">
        You&rsquo;re on
        <br />
        the calendar.
      </h2>

      <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-paper/65">
        A confirmation is on its way to{" "}
        <span className="text-paper">{booking.email}</span>. Andrea has been
        texted the details and will reach out if anything needs to shift.
      </p>

      <dl className="mt-12 grid gap-px border-y border-paper/15 sm:grid-cols-2">
        <Detail term="Appointment" detail={booking.typeName} />
        <Detail term="Date" detail={formatLongDate(booking.date)} />
        <Detail
          term="Time"
          detail={`${formatTimeRange(booking.time, booking.duration)} ${availability.timezoneLabel}`}
        />
        <Detail term="Booked for" detail={`${booking.name}, ${booking.organization}`} />
      </dl>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={download}
          className="group inline-flex items-center justify-center gap-3 bg-brass-400 px-7 py-4 label text-olive-950 transition-colors duration-300 hover:bg-brass-300"
        >
          Add to Calendar
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-3 border border-paper/25 px-7 py-4 label text-paper transition-colors duration-300 hover:border-brass-400 hover:text-brass-300"
        >
          Back to Home
        </Link>
      </div>

      <p className="mt-12 border-t border-paper/10 pt-7 text-sm leading-relaxed text-paper/45">
        Need to reschedule or cancel? Reply to the confirmation email, or reach
        Andrea directly at{" "}
        <a
          href={`mailto:${contact.email}`}
          className="text-brass-300 underline underline-offset-4 transition-colors hover:text-brass-200"
        >
          {contact.email}
        </a>
        .
      </p>
    </div>
  );
}

function Detail({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="py-6 sm:even:pl-8 sm:odd:pr-8">
      <dt className="label text-paper/40">{term}</dt>
      <dd className="mt-2.5 text-pretty text-lg text-paper">{detail}</dd>
    </div>
  );
}

function BackLink({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mt-14 inline-flex items-center gap-2.5 text-sm text-paper/50 transition-colors duration-300 hover:text-paper"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-translate-x-1"
      >
        <path d="M15 8H2M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
      {children}
    </button>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
