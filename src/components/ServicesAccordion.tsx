"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Service } from "@/content/copy";

/**
 * Expandable index of the seven practice areas.
 *
 * Content stays in the DOM when collapsed (height transition, not conditional
 * render) so it is still crawlable and still findable with ⌘F. Deep links from
 * the footer — /services#major-gifts — open the matching panel and scroll to
 * it.
 */
export function ServicesAccordion({ services }: { services: Service[] }) {
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id || !services.some((s) => s.id === id)) return;
      setOpen(id);
      // Let the panel expand before scrolling to it.
      window.requestAnimationFrame(() => {
        document.getElementById(`service-${id}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [services]);

  return (
    <ol className="border-t border-paper/10">
      {services.map((service) => {
        const isOpen = open === service.id;
        return (
          <li key={service.id} id={`service-${service.id}`} className="scroll-mt-32">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : service.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${service.id}`}
                className="group relative flex w-full items-start gap-5 border-b border-paper/10 py-8 text-left transition-colors duration-500 md:gap-10 md:py-10"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -inset-x-6 inset-y-0 -z-10 transition-colors duration-500 md:-inset-x-10 ${
                    isOpen ? "bg-olive-900/60" : "bg-transparent group-hover:bg-olive-900/40"
                  }`}
                />

                <span
                  className={`numeral mt-1.5 shrink-0 text-sm font-bold transition-colors duration-300 md:text-base ${
                    isOpen ? "text-brass-400" : "text-brass-400/50 group-hover:text-brass-400"
                  }`}
                >
                  {service.index}
                </span>

                <span className="flex-1">
                  <span className="block font-display text-[1.45rem] font-bold leading-tight tracking-tight text-paper md:text-[1.9rem] lg:text-[2.2rem]">
                    {service.title}
                  </span>
                  <span
                    className={`mt-2 block text-[0.95rem] leading-relaxed transition-colors duration-300 ${
                      isOpen ? "text-paper/45" : "text-paper/55"
                    }`}
                  >
                    {service.summary}
                  </span>
                </span>

                {/* Plus / minus, drawn rather than iconified */}
                <span
                  aria-hidden="true"
                  className="relative mt-3 flex h-6 w-6 shrink-0 items-center justify-center"
                >
                  <span className="absolute h-px w-5 bg-brass-400" />
                  <span
                    className={`absolute h-5 w-px bg-brass-400 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={`panel-${service.id}`}
              ref={(el) => {
                panelRefs.current[service.id] = el;
              }}
              className={`grid overflow-hidden border-b border-paper/10 transition-[grid-template-rows,opacity] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen
                  ? "grid-rows-[1fr] border-b opacity-100"
                  : "grid-rows-[0fr] border-b-0 opacity-0"
              }`}
            >
              <div className="min-h-0">
                <div className="grid gap-8 py-10 md:grid-cols-[auto_1fr] md:gap-10 md:py-14 lg:grid-cols-[auto_1.2fr_0.8fr]">
                  <span aria-hidden="true" className="hidden w-5 md:block" />
                  <p className="max-w-2xl text-pretty text-lg leading-[1.8] text-paper/75 md:text-xl md:leading-[1.75]">
                    {service.body}
                  </p>
                  <div className="lg:pl-8">
                    <Link
                      href={`/booking?topic=${service.id}`}
                      className="group inline-flex items-center gap-3 border border-paper/20 px-6 py-3.5 label text-paper transition-colors duration-300 hover:border-brass-400 hover:text-brass-300"
                    >
                      Discuss This
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M1 8h13M9 3l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="square"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
