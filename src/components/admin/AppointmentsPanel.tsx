"use client";

import { useMemo, useState } from "react";
import {
  formatLongDate,
  formatShortDate,
  formatTimeRange,
  toISODate,
  type Booking,
} from "@/lib/booking";
import { availability } from "@/content/placeholder";

export function AppointmentsPanel({
  bookings,
  onCancel,
}: {
  bookings: Booking[];
  onCancel: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const today = toISODate(new Date());

  const { upcoming, past } = useMemo(() => {
    const sorted = [...bookings].sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
    );
    return {
      upcoming: sorted.filter((b) => b.date >= today),
      past: sorted.filter((b) => b.date < today).reverse(),
    };
  }, [bookings, today]);

  const list = showPast ? past : upcoming;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/10 pb-5">
        <div className="flex gap-1">
          <Toggle active={!showPast} onClick={() => setShowPast(false)}>
            Upcoming ({upcoming.length})
          </Toggle>
          <Toggle active={showPast} onClick={() => setShowPast(true)}>
            Past ({past.length})
          </Toggle>
        </div>
        <p className="text-xs text-paper/40">
          All times {availability.timezoneLabel}
        </p>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 border border-dashed border-paper/15 p-10 text-center text-sm text-paper/45">
          {showPast ? "No past appointments yet." : "Nothing on the calendar yet."}
        </p>
      ) : (
        <ul className="mt-2">
          {list.map((b) => {
            const open = expanded === b.id;
            const cancelled = b.status === "cancelled";
            return (
              <li key={b.id} className="border-b border-paper/10">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : b.id)}
                  aria-expanded={open}
                  className="group flex w-full items-center gap-5 py-5 text-left transition-colors duration-300 hover:bg-olive-900/40 md:gap-8"
                >
                  {/* Date chip */}
                  <span
                    className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center border md:h-16 md:w-16 ${
                      cancelled
                        ? "border-paper/10 text-paper/25"
                        : "border-brass-400/40 text-paper"
                    }`}
                  >
                    <span className="label text-[0.6rem] text-brass-400/80">
                      {formatShortDate(b.date).split(",")[1].trim().split(" ")[0]}
                    </span>
                    <span className="numeral text-xl font-bold leading-none md:text-2xl">
                      {Number(b.date.slice(8, 10))}
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate font-display text-lg font-bold tracking-tight md:text-xl ${
                        cancelled ? "text-paper/35 line-through" : "text-paper"
                      }`}
                    >
                      {b.name}
                    </span>
                    <span className="mt-1 block truncate text-sm text-paper/50">
                      {b.organization}
                      {b.role ? ` · ${b.role}` : ""}
                    </span>
                  </span>

                  <span className="hidden shrink-0 text-right sm:block">
                    <span className="block text-sm text-paper">
                      {formatTimeRange(b.time, b.duration)}
                    </span>
                    <span className="mt-1 block text-xs text-paper/45">
                      {b.typeName}
                    </span>
                  </span>

                  {cancelled && (
                    <span className="shrink-0 border border-red-400/40 px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-red-300/80">
                      Cancelled
                    </span>
                  )}

                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-paper/35 transition-transform duration-400 ${
                      open ? "rotate-180" : ""
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <div className="grid gap-8 bg-olive-900/40 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
                      <div>
                        <h4 className="label mb-5 text-brass-400">
                          Client details
                        </h4>
                        <dl className="space-y-4 text-sm">
                          <Pair term="Name" detail={b.name} />
                          <Pair
                            term="Email"
                            detail={
                              <a
                                href={`mailto:${b.email}`}
                                className="text-brass-300 underline underline-offset-4 hover:text-brass-200"
                              >
                                {b.email}
                              </a>
                            }
                          />
                          {b.phone && (
                            <Pair
                              term="Phone"
                              detail={
                                <a
                                  href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}
                                  className="text-brass-300 underline underline-offset-4 hover:text-brass-200"
                                >
                                  {b.phone}
                                </a>
                              }
                            />
                          )}
                          <Pair term="Organization" detail={b.organization} />
                          {b.role && <Pair term="Role" detail={b.role} />}
                          <Pair
                            term="Booked"
                            detail={new Date(b.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          />
                        </dl>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="label mb-5 text-brass-400">
                          What they want to discuss
                        </h4>
                        <p className="flex-1 text-pretty text-sm leading-relaxed text-paper/70">
                          {b.notes || (
                            <span className="text-paper/30">
                              Nothing written — they left this blank.
                            </span>
                          )}
                        </p>

                        <div className="mt-7 border-t border-paper/10 pt-5">
                          <p className="mb-3 text-xs text-paper/40">
                            {formatLongDate(b.date)} ·{" "}
                            {formatTimeRange(b.time, b.duration)}
                          </p>
                          {!cancelled &&
                            (confirmCancel === b.id ? (
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm text-paper/70">
                                  Cancel this appointment?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onCancel(b.id);
                                    setConfirmCancel(null);
                                  }}
                                  className="border border-red-400/60 px-4 py-2 text-xs uppercase tracking-wider text-red-300 transition-colors hover:bg-red-400/10"
                                >
                                  Yes, cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmCancel(null)}
                                  className="px-2 py-2 text-xs uppercase tracking-wider text-paper/50 transition-colors hover:text-paper"
                                >
                                  Keep it
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmCancel(b.id)}
                                className="border border-paper/20 px-4 py-2.5 text-xs uppercase tracking-wider text-paper/70 transition-colors hover:border-red-400/60 hover:text-red-300"
                              >
                                Cancel appointment
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 label transition-colors duration-300 ${
        active
          ? "bg-brass-400 text-olive-950"
          : "text-paper/50 hover:bg-olive-900 hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

function Pair({ term, detail }: { term: string; detail: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <dt className="w-28 shrink-0 text-paper/40">{term}</dt>
      <dd className="min-w-0 flex-1 break-words text-paper/85">{detail}</dd>
    </div>
  );
}
