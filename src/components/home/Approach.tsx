import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/**
 * Connective tissue, written to her stated method — "clarify priorities,
 * develop practical tools, and establish habits that support lasting
 * progress" — rather than invented from scratch. Three steps, because her
 * own sentence has three clauses.
 */
/**
 * These three genuinely are sequential, so the order needs to be legible —
 * but as words on a spine rather than a brass "01". A numbered index is the
 * most over-used device in template design, and saying "First" out loud is
 * both warmer and harder to mistake for filler.
 */
const steps = [
  {
    marker: "First",
    title: "Understand what is actually happening",
    body: "Your revenue mix, your team's real capacity, and which donor conversations are actually happening. No assessment theater. We look at the few things that explain the rest.",
  },
  {
    marker: "Then",
    title: "Clarify priorities and name owners",
    body: "A focused plan with responsibilities and timelines attached to specific people. Specificity is the entire difference between a fundraising plan and a fundraising wish.",
  },
  {
    marker: "After that",
    title: "Build the habit, not the dependency",
    body: "Tools, coaching, and systems your team can run without me. The measure of good consulting is what still works two years after the engagement ends.",
  },
] as const;

export function Approach() {
  return (
    <section className="relative overflow-hidden border-y border-paper/10 field-mid edge-lit py-24 md:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-olive-600/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          {/* Portrait + framing statement */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="label flex items-center gap-4 text-brass-400">
                <span className="h-px w-10 bg-brass-400/60" />
                How we work
              </p>
              <h2 className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] text-paper">
                Ideas into
                <br />
                <span className="text-brass-400">consistent action</span>.
              </h2>
              <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-paper/60 md:text-lg md:leading-relaxed">
                Every engagement reflects the people doing the work, the
                resources available, and the communities the organization
                serves.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="relative mt-14 hidden max-w-sm lg:block">
                <span
                  aria-hidden="true"
                  className="absolute -right-4 -top-4 z-10 h-16 w-16 border-r-2 border-t-2 border-brass-400/70"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-4 -left-4 z-10 h-16 w-16 border-b-2 border-l-2 border-brass-400/70"
                />
                <div className="relative aspect-[4/5] overflow-hidden bg-sand-200">
                  <Image
                    src="/img/andrea-4-sand.jpg"
                    alt="Andrea Porter"
                    fill
                    sizes="320px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Steps, hung off a vertical spine with a brass node at each stop */}
          <ol className="relative">
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-[3px] top-10 hidden w-px bg-gradient-to-b from-brass-400/50 via-brass-400/25 to-transparent sm:block"
            />
            {steps.map((step, i) => (
              <Reveal key={step.marker} delay={i * 110} as="li">
                <div className="relative py-9 md:py-12">
                  <div className="sm:pl-12">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[2.9rem] hidden h-[7px] w-[7px] rotate-45 bg-brass-400 sm:block md:top-[3.9rem]"
                    />
                    <p className="label text-brass-400/85">{step.marker}</p>
                    <h3 className="mt-4 text-pretty text-2xl leading-tight text-paper md:text-3xl lg:text-[2.1rem]">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-pretty text-base leading-[1.75] text-paper/60 md:text-[1.05rem]">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
