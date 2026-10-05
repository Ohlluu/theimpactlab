"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { testimonials } from "@/content/placeholder";

/**
 * The one place navy takes over from olive — a deliberate shift of ground so
 * the reader registers these as other people's voices, not more of Andrea's.
 *
 * ⚠️  Every quote here is PLACEHOLDER. Attributions are role + organisation
 * type + city only; no real organisation or person is named. See
 * content/placeholder.ts.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 md:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-navy-500/25 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 hidden h-80 w-80 border-r border-t border-paper/[0.08] md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 hidden h-80 w-80 border-b border-l border-paper/[0.08] md:block"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <Reveal>
          <p className="label flex items-center gap-4 text-brass-400">
            <span className="h-px w-10 bg-brass-400/60" />
            In their words
          </p>
        </Reveal>

        <div className="mt-14 grid gap-16 lg:grid-cols-[1.35fr_0.65fr] lg:gap-24">
          <Reveal delay={100}>
            <figure>
              <blockquote>
                <p
                  key={active}
                  className="text-pretty font-display text-[clamp(1.6rem,3.6vw,2.85rem)] font-bold leading-[1.22] tracking-tight text-paper"
                  style={{ animation: "none" }}
                >
                  <span className="text-brass-400">“</span>
                  {current.quote}
                  <span className="text-brass-400">”</span>
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-brass-400/60" />
                <span className="text-sm leading-relaxed text-paper/65">
                  <span className="font-medium text-paper">{current.role}</span>
                  <span className="text-paper/40"> · </span>
                  {current.org}
                  <span className="text-paper/40"> · </span>
                  {current.location}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Selector */}
          <Reveal delay={180}>
            <div className="flex flex-col justify-end border-t border-paper/10 lg:h-full lg:border-t-0">
              {testimonials.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={t.quote.slice(0, 20)}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`group flex items-center gap-5 border-b border-paper/10 py-5 text-left transition-colors duration-300 lg:border-b-0 lg:border-t ${
                      isActive ? "text-paper" : "text-paper/40 hover:text-paper/70"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-px shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? "w-10 bg-brass-400" : "w-4 bg-paper/25"
                      }`}
                    />
                    <span className="text-sm leading-snug">
                      <span className="block font-medium">{t.role}</span>
                      <span className="block text-xs text-paper/40">{t.org}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
