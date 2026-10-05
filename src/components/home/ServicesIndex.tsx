import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { services } from "@/content/copy";

/**
 * Seven services as a numbered editorial index rather than a card grid.
 *
 * Seven is an awkward number for cards — you get two rows of three and one
 * orphan, which always looks like a mistake. A numbered list handles any count
 * gracefully and reads as "practice areas" rather than "pricing tiers", which
 * is the correct signal for an advisor at her level.
 */
export function ServicesIndex() {
  return (
    <section className="relative bg-olive-950 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 border-b border-paper/10 pb-12 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <Reveal>
            <p className="label flex items-center gap-4 text-brass-400">
              <span className="h-px w-10 bg-brass-400/60" />
              What we do
            </p>
            <h2 className="mt-8 max-w-2xl text-[clamp(2.25rem,5.5vw,4.5rem)] text-paper">
              Strategy, and the
              <br />
              <span className="text-brass-400">follow-through</span> it needs.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-sm text-pretty text-base leading-relaxed text-paper/60">
              Seven practice areas. Most engagements draw on two or three — we
              scope to what your organization can actually absorb.
            </p>
          </Reveal>
        </div>

        <ol className="mt-2">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={Math.min(i * 60, 300)} as="li">
              <Link
                href={`/services#${service.id}`}
                className="group relative grid items-baseline gap-x-6 gap-y-3 border-b border-paper/10 py-8 transition-colors duration-500 md:grid-cols-[auto_1.05fr_1fr_auto] md:gap-x-10 md:py-10"
              >
                {/* Hover wash, bled past the container gutters */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-6 inset-y-0 -z-10 bg-olive-900/0 transition-colors duration-500 group-hover:bg-olive-900/70 md:-inset-x-10"
                />

                <span className="numeral text-sm font-bold text-brass-400/55 transition-colors duration-300 group-hover:text-brass-400 md:text-base">
                  {service.index}
                </span>

                <h3 className="text-[1.45rem] leading-tight text-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:text-[1.75rem] lg:text-[2rem]">
                  {service.title}
                </h3>

                <p className="text-pretty text-[0.95rem] leading-relaxed text-paper/50 transition-colors duration-300 group-hover:text-paper/75">
                  {service.summary}
                </p>

                <span
                  aria-hidden="true"
                  className="hidden text-brass-400 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100 md:block"
                >
                  <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1 8h13M9 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
