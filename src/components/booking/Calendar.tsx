"use client";

import { useMemo, useState } from "react";
import {
  WEEKDAY_INITIALS,
  isDateBookable,
  monthGrid,
  monthLabel,
  toISODate,
  type AvailabilityOverrides,
  type Booking,
} from "@/lib/booking";
import type { AppointmentType } from "@/content/placeholder";

/**
 * Month calendar. The selected date gets the logo's corner brackets rather
 * than a filled pill — it's the one interaction on the site where the brand
 * mark does real UI work instead of decoration.
 */
export function Calendar({
  type,
  bookings,
  overrides,
  selected,
  onSelect,
  initialMonth,
}: {
  type: AppointmentType;
  bookings: Booking[];
  overrides: AvailabilityOverrides;
  selected: string | null;
  onSelect: (iso: string) => void;
  /** ISO date whose month the calendar should open on. */
  initialMonth: string;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(
      Number(initialMonth.slice(0, 4)),
      Number(initialMonth.slice(5, 7)) - 1,
      1,
    );
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const today = toISODate(new Date());
  const cells = useMemo(
    () => monthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  const bookable = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const c of cells) {
      map.set(c.iso, isDateBookable(c.iso, type, bookings, overrides));
    }
    return map;
  }, [cells, type, bookings, overrides]);

  const shift = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  // Don't let the user page backwards past the current month.
  const atFloor =
    cursor.year < new Date().getFullYear() ||
    (cursor.year === new Date().getFullYear() && cursor.month <= new Date().getMonth());

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold tracking-tight text-paper md:text-2xl">
          {monthLabel(cursor.year, cursor.month)}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={atFloor}
            aria-label="Previous month"
            className="flex h-10 w-10 items-center justify-center border border-paper/20 text-paper transition-colors duration-200 hover:border-brass-400 hover:text-brass-300 disabled:pointer-events-none disabled:opacity-25"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="flex h-10 w-10 items-center justify-center border border-paper/20 text-paper transition-colors duration-200 hover:border-brass-400 hover:text-brass-300"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5" role="grid">
        {WEEKDAY_INITIALS.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="pb-2 text-center label text-paper/35"
            aria-hidden="true"
          >
            {d}
          </div>
        ))}

        {cells.map((cell) => {
          const open = cell.inMonth && (bookable.get(cell.iso) ?? false);
          const isSelected = selected === cell.iso;
          const isToday = cell.iso === today;

          if (!cell.inMonth) {
            return <div key={cell.iso} aria-hidden="true" />;
          }

          return (
            <div key={cell.iso} className="relative">
              <button
                type="button"
                disabled={!open}
                onClick={() => onSelect(cell.iso)}
                aria-pressed={isSelected}
                aria-label={`${cell.day}${open ? "" : ", unavailable"}`}
                className={`relative flex aspect-square w-full items-center justify-center text-[0.95rem] transition-all duration-300 ${
                  isSelected
                    ? "bg-brass-400 font-medium text-olive-950"
                    : open
                      ? "bg-olive-800/70 text-paper hover:bg-olive-700"
                      : "text-paper/20"
                }`}
              >
                {cell.day}
                {/* Availability dot — reads at a glance before you click anything */}
                {open && !isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1.5 h-1 w-1 rounded-full bg-brass-400"
                  />
                )}
                {isToday && !isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 border border-paper/25"
                  />
                )}
              </button>

              {/* Logo brackets mark the chosen date */}
              {isSelected && (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 border-r-2 border-t-2 border-brass-400"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b-2 border-l-2 border-brass-400"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-paper/10 pt-5 text-xs text-paper/45">
        <span className="flex items-center gap-2">
          <span className="relative flex h-4 w-4 items-center justify-center bg-olive-800/70">
            <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brass-400" />
          </span>
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border border-paper/25" />
          Today
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border border-dashed border-paper/15" />
          Fully booked or unavailable
        </span>
      </div>
    </div>
  );
}
