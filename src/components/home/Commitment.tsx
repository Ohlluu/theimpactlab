import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { practiceOverview, audiences } from "@/content/copy";

/**
 * The warm break in an otherwise dark site — and the place her actual
 * differentiator sits. Plenty of consultants do major gifts. The stated
 * commitment to social justice and to Black- and Brown-led organizations is
 * the sentence that sorts the right clients from the wrong ones, so it gets
 * display type rather than a line in a paragraph.
 */
export function Commitment() {
  return (
    <section className="relative overflow-hidden bg-sand-200 text-olive-950">
      {/* Bracket, logo orientation, drawn in the olive on the warm field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 hidden h-80 w-80 border-r border-t border-olive-950/10 md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 hidden h-96 w-96 border-b border-l border-olive-950/10 md:block"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* Sticky so the short left column tracks the tall right one instead
              of leaving a column of dead sand behind it. */}
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="label flex items-center gap-4 text-olive-600">
              <span className="h-px w-10 bg-olive-600/50" />
              Who we work with
            </p>
            <p className="mt-9 text-pretty text-xl leading-relaxed text-olive-900/80 md:text-2xl md:leading-relaxed">
              {practiceOverview.lede}
            </p>
          </Reveal>

          <div>
            <Reveal delay={100}>
              <blockquote className="relative">
                <p className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-display font-bold leading-[1.08] tracking-tight text-olive-950">
                  We work with mission-driven organizations, with a particular
                  commitment to{" "}
                  {/* A brass rule below the baseline rather than a highlighter
                      bar — a bar at this size collides with the descender on
                      "justice" and reads like a marker pen. */}
                  <span className="relative inline-block">
                    social justice
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-[3px] bg-brass-400"
                    />
                  </span>{" "}
                  and organizations led by{" "}
                  <span className="relative inline-block">
                    Black and Brown leaders
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-[3px] bg-brass-400"
                    />
                  </span>
                  .
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-12 space-y-5 border-l-2 border-olive-600/25 pl-7 text-pretty text-base leading-relaxed text-olive-900/75 md:text-lg md:leading-relaxed">
                {practiceOverview.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Audience split */}
        <div className="mt-20 grid gap-px border-t border-olive-950/15 md:mt-28 md:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 90}
              className={`pt-9 md:px-8 md:first:pl-0 md:last:pr-0 ${
                i > 0 ? "border-olive-950/15 md:border-l" : ""
              }`}
            >
              <h3 className="text-xl text-olive-950 md:text-2xl">{a.title}</h3>
              <p className="mt-4 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-olive-900/70">
                {a.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 md:mt-20">
            <ButtonLink href="/about" variant="dark" arrow>
              More About Andrea
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
