import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { founderBio, practiceOverview, voice, brand } from "@/content/copy";

export const metadata: Metadata = {
  title: "About Andrea Porter",
  description:
    "Andrea Porter is a fundraising strategist, facilitator, and nonprofit advisor with more than 15 years of experience across higher education, national nonprofits, and community-based organizations.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Founder & Principal"
        title={
          <>
            Andrea
            <br />
            <span className="text-brass-400">Porter</span>
          </>
        }
        lede={founderBio.lede}
      />

      {/* Portrait + bio */}
      <section className="relative field-deep pb-24 md:pb-32 lg:pb-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <span
                  aria-hidden="true"
                  className="absolute -right-4 -top-4 z-10 h-20 w-20 border-r-2 border-t-2 border-brass-400 md:-right-6 md:-top-6 md:h-24 md:w-24"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-4 -left-4 z-10 h-20 w-20 border-b-2 border-l-2 border-brass-400 md:-bottom-6 md:-left-6 md:h-24 md:w-24"
                />
                <div className="relative aspect-[4/5] overflow-hidden bg-sand-200">
                  <Image
                    src="/img/andrea-3-sand.jpg"
                    alt="Andrea Porter"
                    fill
                    priority
                    sizes="(max-width: 1024px) 384px, 34vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>

              {/* Credentials */}
              <div className="mt-14">
                <h2 className="label mb-7 text-paper/40">Education &amp; Training</h2>
                <ul className="space-y-6">
                  {founderBio.credentials.map((c) => (
                    <li key={c.credential} className="border-l border-brass-400/40 pl-5">
                      <p className="text-pretty text-[0.95rem] font-medium leading-snug text-paper">
                        {c.credential}
                      </p>
                      <p className="mt-1.5 text-sm text-paper/50">{c.institution}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <div className="space-y-7 text-pretty text-lg leading-[1.8] text-paper/70 md:text-xl md:leading-[1.75]">
                  {founderBio.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </Reveal>

              {/* Pull quote — the line that is really her thesis */}
              <Reveal delay={120}>
                <blockquote className="relative mt-16 border-y border-paper/10 py-12 md:mt-20 md:py-16">
                  <span
                    aria-hidden="true"
                    className="absolute -top-px right-0 h-10 w-10 border-r-2 border-t-2 border-brass-400"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-px left-0 h-10 w-10 border-b-2 border-l-2 border-brass-400"
                  />
                  <p className="px-2 text-pretty font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-[1.2] tracking-tight text-paper md:px-8">
                    Fundraising depends on people: their confidence,
                    relationships, organizational culture, and ability to turn
                    ideas into{" "}
                    <span className="text-brass-400">consistent action</span>.
                  </p>
                </blockquote>
              </Reveal>

              {/* The practice */}
              <Reveal delay={100}>
                <div className="mt-16 md:mt-20">
                  <h2 className="label mb-8 flex items-center gap-4 text-brass-400">
                    <span className="h-px w-10 bg-brass-400/60" />
                    About {brand.name}
                  </h2>
                  <p className="text-pretty text-xl leading-relaxed text-paper md:text-2xl md:leading-relaxed">
                    {practiceOverview.lede}
                  </p>
                  <div className="mt-7 space-y-6 text-pretty text-base leading-[1.8] text-paper/65 md:text-lg">
                    <p className="text-paper/85">{practiceOverview.commitment}</p>
                    {practiceOverview.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-14 flex flex-col gap-4 sm:flex-row">
                  <ButtonLink href="/booking" variant="primary" arrow>
                    Book a Discovery Call
                  </ButtonLink>
                  <ButtonLink href="/services" variant="outline">
                    Explore Services
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How she works — straight from the brand voice board */}
      <section className="border-t border-olive-950/10 field-sand py-24 text-olive-950 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <Reveal>
            <p className="label flex items-center gap-4 text-olive-600">
              <span className="h-px w-10 bg-olive-600/50" />
              What to expect
            </p>
            <h2 className="mt-8 max-w-2xl text-[clamp(2rem,4.5vw,3.5rem)]">
              Four things you can
              <br />
              count on in the room.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-px border-t border-olive-950/15 sm:grid-cols-2 lg:grid-cols-4">
            {voice.map((v, i) => (
              <Reveal
                key={v.name}
                delay={i * 80}
                className={`pt-9 lg:px-7 lg:first:pl-0 lg:last:pr-0 ${
                  i > 0 ? "border-olive-950/15 lg:border-l" : ""
                } ${i % 2 === 1 ? "sm:border-l sm:border-olive-950/15 lg:border-l" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="block h-[7px] w-[7px] rotate-45 bg-olive-600/70"
                />
                <h3 className="mt-5 text-pretty text-xl leading-tight md:text-[1.4rem]">
                  {v.name}
                </h3>
                <p className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-olive-900/70">
                  {v.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
