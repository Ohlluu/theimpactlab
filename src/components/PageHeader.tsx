import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * Shared opener for interior pages. Keeps the bracket-and-rule language from
 * the home hero so inner pages feel like the same site, at lower volume.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden field-deep pt-32 md:pt-40 lg:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-16 hidden h-96 w-96 border-r border-t border-paper/[0.07] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-olive-600/18 blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-16 md:px-10 md:pb-24 lg:px-16">
        <Reveal>
          <p className="label flex items-center gap-4 text-brass-400">
            <span className="h-px w-10 bg-brass-400/60" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={90}>
          <h1 className="mt-8 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] text-paper">
            {title}
          </h1>
        </Reveal>
        {lede && (
          <Reveal delay={170}>
            <p className="mt-9 max-w-2xl text-pretty text-lg leading-[1.75] text-paper/65 md:text-xl md:leading-[1.7]">
              {lede}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
