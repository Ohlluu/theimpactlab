import Image from "next/image";
import Link from "next/link";
import { brand, services } from "@/content/copy";
import { contact } from "@/content/placeholder";

const year = 2026;

export function SiteFooter() {
  return (
    <footer className="relative border-t border-paper/10 field-deep">
      {/* Closing call to action */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-14 border-b border-paper/10 py-20 md:py-28 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <p className="label mb-6 text-brass-400">Start here</p>
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] text-paper">
              Most of this work
              <br />
              starts with a
              <span className="text-brass-400"> conversation</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-7">
            <p className="max-w-md text-pretty text-base leading-relaxed text-paper/65">
              Thirty minutes, no preparation, no pitch. Tell me where your
              organization is and what you are trying to build, and I will tell
              you honestly whether I am the right help.
            </p>
            <Link
              href="/booking"
              className="group inline-flex w-fit items-center gap-3 bg-brass-400 px-8 py-4 label text-olive-950 transition-colors duration-300 hover:bg-brass-300"
            >
              Book a Discovery Call
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M1 8h13M9 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Directory */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Image
              src="/img/logo-wordmark-white.png"
              alt={brand.name}
              width={476}
              height={158}
              className="h-9 w-auto"
            />
            <p className="mt-6 max-w-xs text-pretty text-sm leading-relaxed text-paper/50">
              {brand.tagline}
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h3 id="footer-explore" className="label mb-5 text-paper/40">
              Explore
            </h3>
            <ul className="space-y-3.5 text-sm">
              {[
                ["/", "Home"],
                ["/about", "About Andrea"],
                ["/services", "Services"],
                ["/booking", "Book a Call"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-paper/60 transition-colors duration-200 hover:text-brass-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h3 id="footer-services" className="label mb-5 text-paper/40">
              Practice Areas
            </h3>
            <ul className="space-y-3.5 text-sm">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services#${s.id}`}
                    className="text-paper/60 transition-colors duration-200 hover:text-brass-300"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-brass-400/80 transition-colors duration-200 hover:text-brass-300"
                >
                  All seven →
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="label mb-5 text-paper/40">Get in touch</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-paper/60 transition-colors duration-200 hover:text-brass-300"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                  className="text-paper/60 transition-colors duration-200 hover:text-brass-300"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="text-paper/60">{contact.basedIn}</li>
              <li className="pt-2">
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-paper/60 transition-colors duration-200 hover:text-brass-300"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-col gap-4 border-t border-paper/10 py-8 text-xs text-paper/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-7">
            <Link href="/privacy" className="transition-colors hover:text-paper/60">
              Privacy
            </Link>
            <Link href="/admin" className="transition-colors hover:text-paper/60">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
