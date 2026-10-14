"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppointmentsPanel } from "@/components/admin/AppointmentsPanel";
import { AvailabilityPanel } from "@/components/admin/AvailabilityPanel";
import { NotificationsPanel } from "@/components/admin/NotificationsPanel";
import { useMockStore } from "@/lib/mockStore";
import {
  addDays,
  formatLongDate,
  formatTimeRange,
  toISODate,
} from "@/lib/booking";

const TABS = ["Appointments", "Availability", "Notifications"] as const;
type Tab = (typeof TABS)[number];

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Appointments");
  const [checked, setChecked] = useState(false);

  const {
    state,
    ready,
    cancelBooking,
    setWeekly,
    toggleBlockedDate,
    addVacation,
    removeVacation,
    reset,
  } = useMockStore();

  // Mock gate. Real auth lands in the final build — see the login page.
  useEffect(() => {
    let ok = true;
    try {
      ok = sessionStorage.getItem("impactlab.admin") === "1";
    } catch {
      ok = true; // private browsing: don't lock her out of a mockup
    }
    if (!ok) router.replace("/admin");
    else setChecked(true);
  }, [router]);

  const today = toISODate(new Date());
  const weekEnd = addDays(today, 7);

  const stats = useMemo(() => {
    const all = state?.bookings ?? [];
    const live = all.filter((b) => b.status === "confirmed");
    const upcoming = live.filter((b) => b.date >= today);
    const sorted = [...upcoming].sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
    );
    return {
      next: sorted[0] ?? null,
      thisWeek: upcoming.filter((b) => b.date <= weekEnd).length,
      upcoming: upcoming.length,
      total: live.length,
    };
  }, [state, today, weekEnd]);

  if (!checked || !ready || !state) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="label text-paper/40">Loading…</p>
      </main>
    );
  }

  return (
    <>
      {/* ------------------------------------------------------- Bar ---- */}
      <header className="sticky top-0 z-40 border-b border-paper/10 bg-olive-950/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-6 py-4 md:px-10">
          <div className="flex items-center gap-5">
            <Link href="/" aria-label="The Impact Lab, home">
              <Image
                src="/img/logo-wordmark-white.png"
                alt="The Impact Lab"
                width={476}
                height={158}
                priority
                className="h-6 w-auto md:h-7"
              />
            </Link>
            <span aria-hidden="true" className="hidden h-6 w-px bg-paper/15 sm:block" />
            <span className="hidden label text-paper/45 sm:block">Dashboard</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-paper/50 md:block">
              Andrea Porter
            </span>
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.removeItem("impactlab.admin");
                } catch {
                  /* ignore */
                }
                router.push("/admin");
              }}
              className="border border-paper/20 px-4 py-2 label text-paper/70 transition-colors hover:border-brass-400 hover:text-brass-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] flex-1 px-6 py-12 md:px-10 md:py-16">
        {/* ------------------------------------------------- Summary ---- */}
        <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <div>
            <p className="label text-brass-400">Next appointment</p>
            {stats.next ? (
              <div className="relative mt-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2.5 -top-2.5 h-9 w-9 border-r-2 border-t-2 border-brass-400"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-9 w-9 border-b-2 border-l-2 border-brass-400"
                />
                <div className="bg-olive-900/70 p-7">
                  <h1 className="text-pretty text-3xl text-paper md:text-4xl">
                    {stats.next.name}
                  </h1>
                  <p className="mt-2.5 text-[0.95rem] text-paper/60">
                    {stats.next.organization}
                    {stats.next.role ? ` · ${stats.next.role}` : ""}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-paper/10 pt-5 text-sm">
                    <span className="text-paper">
                      {formatLongDate(stats.next.date)}
                    </span>
                    <span className="text-brass-300">
                      {formatTimeRange(stats.next.time, stats.next.duration)}
                    </span>
                    <span className="text-paper/50">{stats.next.typeName}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-6 border border-dashed border-paper/15 p-8 text-sm text-paper/45">
                Nothing booked yet.
              </p>
            )}
          </div>

          <div className="lg:pt-[2.1rem]">
            <dl className="grid h-full grid-cols-3 bg-olive-900/40">
              <Stat label="This week" value={stats.thisWeek} />
              <Stat label="Upcoming" value={stats.upcoming} />
              <Stat label="All time" value={stats.total} />
            </dl>
          </div>
        </div>

        {/* ---------------------------------------------------- Tabs ---- */}
        <nav className="mt-16 flex gap-1 border-b border-paper/10 md:mt-20">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-current={tab === t ? "page" : undefined}
              className={`relative px-4 py-3.5 label transition-colors duration-300 md:px-6 ${
                tab === t ? "text-brass-400" : "text-paper/45 hover:text-paper"
              }`}
            >
              {t}
              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 bg-brass-400 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  tab === t ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="mt-12">
          {tab === "Appointments" && (
            <AppointmentsPanel bookings={state.bookings} onCancel={cancelBooking} />
          )}
          {tab === "Availability" && (
            <AvailabilityPanel
              weekly={state.weekly}
              blockedDates={state.blockedDates}
              vacations={state.vacations}
              onWeeklyChange={setWeekly}
              onToggleBlocked={toggleBlockedDate}
              onAddVacation={addVacation}
              onRemoveVacation={removeVacation}
            />
          )}
          {tab === "Notifications" && <NotificationsPanel log={state.smsLog} />}
        </div>

        {/* --------------------------------------------- Mockup note ---- */}
        <footer className="mt-24 flex flex-wrap items-center justify-between gap-5 border-t border-paper/10 pt-8">
          <p className="max-w-2xl text-xs leading-relaxed text-paper/40">
            <span className="text-brass-400/90">Mockup:</span> this dashboard
            runs on sample data stored in your browser. Changes here do affect
            the live booking page, so feel free to block a date and go look.
            The final build moves all of this to a secure database.
          </p>
          <button
            type="button"
            onClick={reset}
            className="shrink-0 border border-paper/15 px-4 py-2 text-xs uppercase tracking-wider text-paper/50 transition-colors hover:border-brass-400 hover:text-brass-300"
          >
            Reset sample data
          </button>
        </footer>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col justify-center border-l border-paper/10 px-5 py-7 first:border-l-0 md:px-7">
      <dt className="label text-paper/40">{label}</dt>
      <dd className="numeral mt-3 text-4xl font-bold text-brass-400 md:text-5xl">
        {value}
      </dd>
    </div>
  );
}
