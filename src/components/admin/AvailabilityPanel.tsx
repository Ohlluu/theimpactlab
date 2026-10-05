"use client";

import { useMemo, useState } from "react";
import {
  formatLongDate,
  formatTime,
  monthGrid,
  monthLabel,
  toISODate,
  WEEKDAY_INITIALS,
} from "@/lib/booking";
import type { Vacation } from "@/lib/mockStore";
import { availability } from "@/content/placeholder";

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

/** 07:00 → 20:00 in half hours. */
const TIME_OPTIONS = Array.from({ length: 27 }, (_, i) => {
  const mins = 7 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

export function AvailabilityPanel({
  weekly,
  blockedDates,
  vacations,
  onWeeklyChange,
  onToggleBlocked,
  onAddVacation,
  onRemoveVacation,
}: {
  weekly: Record<number, [string, string][]>;
  blockedDates: string[];
  vacations: Vacation[];
  onWeeklyChange: (w: Record<number, [string, string][]>) => void;
  onToggleBlocked: (iso: string) => void;
  onAddVacation: (v: Omit<Vacation, "id">) => void;
  onRemoveVacation: (id: string) => void;
}) {
  const setWindow = (day: number, index: number, which: 0 | 1, value: string) => {
    const next = { ...weekly, [day]: weekly[day].map((w) => [...w] as [string, string]) };
    next[day][index][which] = value;
    // Keep the window coherent — nudge the other end rather than allowing
    // an end before its start, which would silently produce zero slots.
    const [open, close] = next[day][index];
    if (which === 0 && value >= close) {
      const i = TIME_OPTIONS.indexOf(value);
      next[day][index][1] = TIME_OPTIONS[Math.min(i + 2, TIME_OPTIONS.length - 1)];
    }
    if (which === 1 && value <= open) {
      const i = TIME_OPTIONS.indexOf(value);
      next[day][index][0] = TIME_OPTIONS[Math.max(i - 2, 0)];
    }
    onWeeklyChange(next);
  };

  const addWindow = (day: number) => {
    const existing = weekly[day] ?? [];
    const fallback: [string, string] = existing.length ? ["13:00", "16:00"] : ["09:00", "12:00"];
    onWeeklyChange({ ...weekly, [day]: [...existing, fallback] });
  };

  const removeWindow = (day: number, index: number) => {
    onWeeklyChange({
      ...weekly,
      [day]: (weekly[day] ?? []).filter((_, i) => i !== index),
    });
  };

  const toggleDay = (day: number) => {
    const on = (weekly[day] ?? []).length > 0;
    onWeeklyChange({ ...weekly, [day]: on ? [] : [["09:00", "12:00"]] });
  };

  return (
    <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      {/* ------------------------------------------------ Weekly hours --- */}
      <section>
        <header className="border-b border-paper/10 pb-5">
          <h3 className="font-display text-xl font-bold tracking-tight text-paper md:text-2xl">
            Your weekly hours
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-paper/50">
            The days and times you are open to appointments. Changes take effect
            on the booking page immediately.
          </p>
        </header>

        <ul className="divide-y divide-paper/10">
          {DAY_NAMES.map((name, day) => {
            const windows = weekly[day] ?? [];
            const on = windows.length > 0;
            return (
              <li key={name} className="py-5">
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`font-display text-base font-bold tracking-tight transition-colors ${
                      on ? "text-paper" : "text-paper/35"
                    }`}
                  >
                    {name}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={`${name} availability`}
                    onClick={() => toggleDay(day)}
                    className={`relative h-6 w-11 shrink-0 transition-colors duration-300 ${
                      on ? "bg-brass-400" : "bg-paper/15"
                    }`}
                  >
                    {/* `left-0` is load-bearing: without it the knob is laid
                        out from the button's centred static position, so the
                        "on" offset pushes it off the end of the track. */}
                    <span
                      className={`absolute left-0 top-1 h-4 w-4 bg-olive-950 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {on && (
                  <div className="mt-4 space-y-2.5">
                    {windows.map(([open, close], i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2.5">
                        <TimeSelect
                          value={open}
                          label={`${name} window ${i + 1} start`}
                          onChange={(v) => setWindow(day, i, 0, v)}
                        />
                        <span className="text-paper/35">to</span>
                        <TimeSelect
                          value={close}
                          label={`${name} window ${i + 1} end`}
                          onChange={(v) => setWindow(day, i, 1, v)}
                        />
                        <button
                          type="button"
                          onClick={() => removeWindow(day, i)}
                          aria-label={`Remove ${name} window ${i + 1}`}
                          className="ml-auto flex h-9 w-9 items-center justify-center border border-paper/15 text-paper/45 transition-colors hover:border-red-400/60 hover:text-red-300"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addWindow(day)}
                      className="text-xs uppercase tracking-wider text-brass-400/80 transition-colors hover:text-brass-300"
                    >
                      + Add another window
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-5 border-l-2 border-brass-400/40 pl-4 text-xs leading-relaxed text-paper/45">
          Appointments are spaced {availability.bufferMinutes} minutes apart, and
          nobody can book within {availability.noticeHours} hours of now.
        </p>
      </section>

      {/* ------------------------------------- Blocked dates + vacation --- */}
      <div className="space-y-14">
        <BlockedDates blocked={blockedDates} onToggle={onToggleBlocked} />
        <Vacations
          vacations={vacations}
          onAdd={onAddVacation}
          onRemove={onRemoveVacation}
        />
      </div>
    </div>
  );
}

function TimeSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-paper/20 bg-olive-900 px-3 py-2 text-sm text-paper transition-colors focus:border-brass-400 focus:outline-none"
    >
      {TIME_OPTIONS.map((t) => (
        <option key={t} value={t}>
          {formatTime(t)}
        </option>
      ))}
    </select>
  );
}

function BlockedDates({
  blocked,
  onToggle,
}: {
  blocked: string[];
  onToggle: (iso: string) => void;
}) {
  const now = new Date();
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const cells = useMemo(
    () => monthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );
  const today = toISODate(now);

  const shift = (d: number) =>
    setCursor((c) => {
      const next = new Date(c.year, c.month + d, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  return (
    <section>
      <header className="border-b border-paper/10 pb-5">
        <h3 className="font-display text-xl font-bold tracking-tight text-paper md:text-2xl">
          Block specific dates
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-paper/50">
          Click any date to close it off — a conference, a deadline, a day you
          simply do not want calls. Click again to reopen it.
        </p>
      </header>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-base font-bold tracking-tight text-paper">
          {monthLabel(cursor.year, cursor.month)}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center border border-paper/20 text-paper transition-colors hover:border-brass-400 hover:text-brass-300"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center border border-paper/20 text-paper transition-colors hover:border-brass-400 hover:text-brass-300"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {WEEKDAY_INITIALS.map((d, i) => (
          <div key={i} className="pb-1.5 text-center label text-paper/30" aria-hidden="true">
            {d}
          </div>
        ))}
        {cells.map((cell) =>
          !cell.inMonth ? (
            <div key={cell.iso} aria-hidden="true" />
          ) : (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onToggle(cell.iso)}
              aria-pressed={blocked.includes(cell.iso)}
              aria-label={`${cell.iso}${blocked.includes(cell.iso) ? ", blocked" : ""}`}
              className={`relative flex aspect-square items-center justify-center text-sm transition-all duration-300 ${
                blocked.includes(cell.iso)
                  ? "bg-red-400/15 text-red-200 ring-1 ring-red-400/50"
                  : cell.iso < today
                    ? "text-paper/20"
                    : "bg-olive-900/60 text-paper/80 hover:bg-olive-800"
              }`}
            >
              {cell.day}
              {blocked.includes(cell.iso) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-red-300/70"
                />
              )}
            </button>
          ),
        )}
      </div>

      {blocked.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {[...blocked].sort().map((iso) => (
            <button
              key={iso}
              type="button"
              onClick={() => onToggle(iso)}
              className="group flex items-center gap-2 border border-red-400/30 px-3 py-1.5 text-xs text-red-200/90 transition-colors hover:border-red-400/60"
            >
              {formatLongDate(iso).replace(/,\s\d{4}$/, "")}
              <span aria-hidden="true" className="text-red-300/60 group-hover:text-red-300">
                ×
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function Vacations({
  vacations,
  onAdd,
  onRemove,
}: {
  vacations: Vacation[];
  onAdd: (v: Omit<Vacation, "id">) => void;
  onRemove: (id: string) => void;
}) {
  const [label, setLabel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const valid = start && end && end >= start;

  return (
    <section>
      <header className="border-b border-paper/10 pb-5">
        <h3 className="font-display text-xl font-bold tracking-tight text-paper md:text-2xl">
          Vacation &amp; time off
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-paper/50">
          Close a whole stretch at once. Nobody can book inside these dates.
        </p>
      </header>

      {vacations.length > 0 && (
        <ul className="divide-y divide-paper/10">
          {vacations.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate text-[0.95rem] text-paper">
                  {v.label || "Time off"}
                </p>
                <p className="mt-1 text-xs text-paper/45">
                  {formatLongDate(v.start).replace(/,\s\d{4}$/, "")} —{" "}
                  {formatLongDate(v.end).replace(/,\s\d{4}$/, "")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(v.id)}
                aria-label={`Remove ${v.label || "time off"}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-paper/15 text-paper/45 transition-colors hover:border-red-400/60 hover:text-red-300"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          onAdd({ label: label.trim() || "Time off", start, end });
          setLabel("");
          setStart("");
          setEnd("");
        }}
        className="mt-6 space-y-3"
      >
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="What is it? (optional)"
          aria-label="Vacation label"
          className="w-full border border-paper/20 bg-transparent px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/25 transition-colors focus:border-brass-400 focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            aria-label="Start date"
            className="flex-1 border border-paper/20 bg-transparent px-3.5 py-2.5 text-sm text-paper transition-colors focus:border-brass-400 focus:outline-none [color-scheme:dark]"
          />
          <span className="text-paper/35">to</span>
          <input
            type="date"
            value={end}
            min={start || undefined}
            onChange={(e) => setEnd(e.target.value)}
            aria-label="End date"
            className="flex-1 border border-paper/20 bg-transparent px-3.5 py-2.5 text-sm text-paper transition-colors focus:border-brass-400 focus:outline-none [color-scheme:dark]"
          />
        </div>
        <button
          type="submit"
          disabled={!valid}
          className="w-full bg-brass-400 px-5 py-3 label text-olive-950 transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Add Time Off
        </button>
      </form>
    </section>
  );
}
