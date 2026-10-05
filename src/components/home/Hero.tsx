import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

/**
 * The headline is Andrea's own sentence, lifted from her bio:
 * "…fundraising depends on people: their confidence, relationships,
 *  organizational culture, and ability to turn ideas into consistent action."
 *
 * Nothing invented reads as true as something she already wrote.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-olive-950 pt-32 md:pt-40 lg:pt-44">
      {/* Oversized bracket, bled off the left edge — the logo motif at
          architectural scale. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[22%] hidden h-[460px] w-[460px] border-b border-l border-paper/[0.07] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-10 hidden h-[380px] w-[380px] border-r border-t border-paper/[0.07] lg:block"
      />
      {/* Warmth pooled behind the type so the dark field isn't flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full bg-olive-600/20 blur-[140px]"
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid items-end gap-16 pb-20 md:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pb-32">
          {/* Type column */}
          <div className="relative z-10">
            <Reveal>
              <p className="label flex items-center gap-4 text-brass-400">
                <span className="h-px w-10 bg-brass-400/60" />
                Fundraising Strategy &amp; Capacity Building
              </p>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-9 text-[clamp(3rem,8.5vw,7.5rem)] text-paper">
                Fundraising
                <br />
                depends on
                <br />
                <span className="text-brass-400">people.</span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-10 max-w-xl text-pretty text-lg leading-[1.75] text-paper/70 md:text-xl md:leading-[1.7]">
                Their confidence. Their relationships. Their ability to turn
                ideas into consistent action. The Impact Lab helps nonprofits
                and foundations build all three — and the systems that keep
                them going.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/booking" variant="primary" arrow>
                  Book a Discovery Call
                </ButtonLink>
                <ButtonLink href="/services" variant="outline">
                  See How We Work
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <p className="mt-10 text-sm text-paper/40">
                30 minutes · No preparation · No pitch
              </p>
            </Reveal>
          </div>

          {/* Portrait column */}
          <Reveal delay={200} className="relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Bracket frame, same orientation as the logo */}
              <span
                aria-hidden="true"
                className="absolute -right-4 -top-4 z-20 h-20 w-20 border-r-2 border-t-2 border-brass-400 md:-right-6 md:-top-6 md:h-28 md:w-28"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-4 -left-4 z-20 h-20 w-20 border-b-2 border-l-2 border-brass-400 md:-bottom-6 md:-left-6 md:h-28 md:w-28"
              />

              {/* The studio seamless has been re-matted to brand sand, so the
                  portrait reads as a warm panel set into the dark field rather
                  than a stock photo dropped on top of it. */}
              <div className="relative aspect-[4/5] overflow-hidden bg-sand-200">
                <Image
                  src="/img/andrea-1-sand.jpg"
                  alt="Andrea Porter, Founder and Principal of The Impact Lab"
                  fill
                  priority
                  sizes="(max-width: 1024px) 384px, 40vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Name plate, carrying the dark back up under the portrait */}
              <div className="relative z-10 border-t-2 border-brass-400 bg-olive-900 px-6 py-5">
                <p className="font-display text-xl font-bold tracking-tight text-paper">
                  Andrea Porter
                </p>
                <p className="label mt-1.5 text-brass-400/90">
                  Founder &amp; Principal
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
