import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { families, services } from "@/content/copy";

/**
 * Seven practice areas, grouped into four families.
 *
 * This replaced a 01–07 numbered index. The numbers were ornament: the list
 * isn't a sequence or a ranking, so counting to seven told the reader nothing.
 * Family headings carry actual information — how the practice is organised —
 * and sidestep the fact that seven of anything is an awkward number to lay out.
 */
export function ServicesIndex() {
  return (
    <section className="relative field-deep py-24 md:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-bracket"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
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
              Four kinds of work. Most engagements draw on two or three — we
              scope to what your organization can actually absorb.
            </p>
          </Reveal>
        </div>

        <div className="mt-4">
          {families.map((family, fi) => {
            const members = services.filter((s) => s.family === family.id);
            return (
              <Reveal key={family.id} delay={Math.min(fi * 90, 280)}>
                <section className="grid gap-y-5 border-b border-paper/10 py-10 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-x-14 md:py-12">
                  <header className="md:pt-1">
                    <h3 className="font-display text-xl font-bold tracking-tight text-brass-400 md:text-2xl">
                      {family.name}
                    </h3>
                    <p className="mt-2.5 max-w-[26ch] text-pretty text-sm leading-relaxed text-paper/45">
                      {family.blurb}
                    </p>
                  </header>

                  <ul>
                    {members.map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/services#${service.id}`}
                          className="group relative grid items-baseline gap-x-8 gap-y-2 border-b border-paper/[0.07] py-5 last:border-b-0 md:grid-cols-[1.05fr_1fr_auto]"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-x-5 inset-y-0 -z-10 bg-olive-900/0 transition-colors duration-500 group-hover:bg-olive-900/60"
                          />

                          <h4 className="text-pretty text-[1.3rem] leading-tight text-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:text-[1.5rem]">
                            {service.title}
                          </h4>

                          <p className="text-pretty text-[0.9rem] leading-relaxed text-paper/45 transition-colors duration-300 group-hover:text-paper/70">
                            {service.summary}
                          </p>

                          <span
                            aria-hidden="true"
                            className="hidden self-center text-brass-400 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100 md:block"
                          >
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M1 8h13M9 3l5 5-5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="square"
                              />
                            </svg>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
