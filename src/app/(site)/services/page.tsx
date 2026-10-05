import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { ServicesAccordion } from "@/components/ServicesAccordion";
import { services, audiences } from "@/content/copy";

export const metadata: Metadata = {
  title: "Consulting Services",
  description:
    "Fundraising strategy and planning, major gifts, foundation capacity building, board development, leadership coaching, workshops and retreats, and donor stewardship systems.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Consulting Services"
        title={
          <>
            Seven ways
            <br />
            we <span className="text-brass-400">work together</span>.
          </>
        }
        lede="Most engagements draw on two or three of these. We scope to what your organization can genuinely absorb, not to a package."
      />

      <section className="relative bg-olive-950 pb-24 md:pb-32 lg:pb-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <ServicesAccordion services={services} />
        </div>
      </section>

      {/* Fit check */}
      <section className="border-t border-olive-950/10 bg-sand-200 py-24 text-olive-950 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <Reveal>
              <p className="label flex items-center gap-4 text-olive-600">
                <span className="h-px w-10 bg-olive-600/50" />
                Is this a fit?
              </p>
              <h2 className="mt-8 text-[clamp(2rem,4.5vw,3.5rem)]">
                The honest
                <br />
                answer, early.
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="text-pretty text-xl leading-relaxed text-olive-900/85 md:text-2xl md:leading-relaxed">
                Not every organization needs a consultant, and not every
                consultant is the right one. A discovery call is thirty minutes
                of plain conversation about where you are — and if the honest
                answer is that you need something I do not offer, I will tell
                you that and point you somewhere better.
              </p>

              <div className="mt-12 grid gap-px border-t border-olive-950/15 sm:grid-cols-3">
                {audiences.map((a, i) => (
                  <div
                    key={a.title}
                    className={`pt-7 sm:px-6 sm:first:pl-0 sm:last:pr-0 ${
                      i > 0 ? "border-olive-950/15 sm:border-l" : ""
                    }`}
                  >
                    <h3 className="text-lg leading-tight">{a.title}</h3>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-olive-900/70">
                      {a.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <ButtonLink href="/booking" variant="dark" arrow>
                  Book a Discovery Call
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
