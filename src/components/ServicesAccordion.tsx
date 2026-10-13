"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { families, type Service } from "@/content/copy";

/**
 * Expandable index of the seven practice areas, grouped into four families.
 *
 * Content stays in the DOM when collapsed (height transition, not conditional
 * render) so it is still crawlable and still findable with ⌘F. Deep links from
 * the footer — /services#major-gifts — open the matching panel and scroll to
 * it.
 */
export function ServicesAccordion({ services }: { services: Service[] }) {
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null);

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
    <div>
      {families.map((family) => {
        const members = services.filter((s) => s.family === family.id);
        if (!members.length) return null;

        return (
          <section key={family.id} className="mb-14 last:mb-0 md:mb-20">
            <header className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b-2 border-brass-400/40 pb-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-brass-400 md:text-3xl">
                {family.name}
              </h2>
              <p className="text-sm text-paper/45">{family.blurb}</p>
            </header>

            <ul>
              {members.map((service) => {
                const isOpen = open === service.id;
                return (
                  <li
                    key={service.id}
                    id={`service-${service.id}`}
                    className="scroll-mt-32"
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : service.id)}
                        aria-expanded={isOpen}
                        aria-controls={`panel-${service.id}`}
                        className="group relative flex w-full items-start gap-5 border-b border-paper/10 py-7 text-left transition-colors duration-500 md:gap-10 md:py-9"
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute -inset-x-6 inset-y-0 -z-10 transition-colors duration-500 md:-inset-x-10 ${
                            isOpen
                              ? "bg-olive-900/60"
                              : "bg-transparent group-hover:bg-olive-900/40"
                          }`}
                        />

                        <span className="flex-1">
                          <span className="block font-display text-[1.4rem] font-bold leading-tight tracking-tight text-paper md:text-[1.8rem] lg:text-[2rem]">
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
                      className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? "grid-rows-[1fr] border-b border-paper/10 opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0">
                        <div className="grid gap-8 py-9 md:grid-cols-[1.2fr_0.8fr] md:gap-12 md:py-12">
                          <p className="max-w-2xl text-pretty text-lg leading-[1.8] text-paper/75 md:text-xl md:leading-[1.75]">
                            {service.body}
                          </p>
                          <div className="md:pl-4">
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
            </ul>
          </section>
        );
      })}
    </div>
  );
}
