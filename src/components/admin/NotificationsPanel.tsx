"use client";

import type { SmsLogEntry } from "@/lib/mockStore";
import { contact } from "@/content/placeholder";

/**
 * Shows the exact text Andrea receives when someone books. Rendering it as a
 * message bubble rather than a log row is the point — she should recognise it
 * as "the thing that arrives on my phone", not read a description of a feature.
 */
export function NotificationsPanel({ log }: { log: SmsLogEntry[] }) {
  return (
    <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h3 className="font-display text-xl font-bold tracking-tight text-paper md:text-2xl">
          Text notifications
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/55">
          Every new booking sends a text to your phone with the client&rsquo;s
          name, organization, and the time they chose — so you know before you
          open your laptop.
        </p>

        <dl className="mt-8 space-y-4 border-t border-paper/10 pt-6 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-paper/45">Sending to</dt>
            <dd className="text-paper">{contact.phone}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-paper/45">Sent this month</dt>
            <dd className="text-paper">{log.length}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-paper/45">Status</dt>
            <dd className="flex items-center gap-2 text-paper">
              <span className="h-1.5 w-1.5 rounded-full bg-brass-400" />
              Active
            </dd>
          </div>
        </dl>

        <p className="mt-7 border-l-2 border-brass-400/40 pl-4 text-xs leading-relaxed text-paper/45">
          <span className="text-brass-400/90">Mockup note —</span> these are
          sample messages. Live SMS is wired up during final development.
        </p>
      </div>

      <div>
        {log.length === 0 ? (
          <p className="border border-dashed border-paper/15 p-10 text-center text-sm text-paper/45">
            No notifications yet.
          </p>
        ) : (
          <ul className="space-y-5">
            {log.map((entry) => (
              <li key={entry.id}>
                <div className="relative max-w-lg bg-olive-800 p-5">
                  {/* Message tail */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 bg-olive-800"
                  />
                  <p className="text-pretty text-[0.95rem] leading-relaxed text-paper">
                    {entry.body}
                  </p>
                </div>
                <p className="ml-6 mt-3.5 text-xs text-paper/35">
                  {new Date(entry.sentAt).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  · delivered to {entry.to}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
