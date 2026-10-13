import { Reveal } from "@/components/Reveal";
import { stats } from "@/content/placeholder";

/**
 * Credibility band. She is a fundraiser — her prospects think in numbers, so
 * the site should offer some before it asks for a meeting.
 *
 * Two of the four figures are PLACEHOLDER (see content/placeholder.ts).
 */
export function StatBand() {
  return (
    <section className="relative border-y border-paper/10 field-mid edge-lit">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              className={`border-paper/10 px-2 py-10 md:px-8 md:py-14 ${
                i % 2 === 1 ? "border-l" : ""
              } ${i > 1 ? "border-t lg:border-t-0" : ""} ${
                i === 2 ? "lg:border-l" : ""
              } ${i === 3 ? "lg:border-l" : ""}`}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="numeral block text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-none text-brass-400">
                  {stat.value}
                </span>
                <span className="mt-4 block max-w-[22ch] text-pretty text-sm leading-relaxed text-paper/55">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
