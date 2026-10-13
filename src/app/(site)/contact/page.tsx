import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { contact } from "@/content/placeholder";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with The Impact Lab. Email, phone, and a direct line to Andrea Porter for consulting enquiries, speaking requests, and workshop bookings.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Tell us what
            <br />
            you&rsquo;re <span className="text-brass-400">working on</span>.
          </>
        }
        lede="Andrea reads every message herself. If your question is really a conversation, booking a call will get you further, faster."
      />

      <section className="relative field-deep pb-24 md:pb-32 lg:pb-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={120} className="lg:pt-2">
              <div className="space-y-10">
                <div>
                  <h2 className="label mb-6 flex items-center gap-4 text-brass-400">
                    <span className="h-px w-10 bg-brass-400/60" />
                    Direct
                  </h2>
                  <ul className="space-y-5">
                    <li>
                      <p className="text-xs uppercase tracking-wider text-paper/40">
                        Email
                      </p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="mt-1.5 block text-lg text-paper transition-colors hover:text-brass-300"
                      >
                        {contact.email}
                      </a>
                    </li>
                    <li>
                      <p className="text-xs uppercase tracking-wider text-paper/40">
                        Phone
                      </p>
                      <a
                        href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                        className="mt-1.5 block text-lg text-paper transition-colors hover:text-brass-300"
                      >
                        {contact.phone}
                      </a>
                    </li>
                    <li>
                      <p className="text-xs uppercase tracking-wider text-paper/40">
                        LinkedIn
                      </p>
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 block text-lg text-paper transition-colors hover:text-brass-300"
                      >
                        Andrea Porter
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-paper/10 pt-8">
                  <h2 className="label mb-5 text-paper/40">Based in</h2>
                  <p className="text-lg text-paper">{contact.basedIn}</p>
                  <p className="mt-2.5 text-pretty text-sm leading-relaxed text-paper/55">
                    {contact.serving}
                  </p>
                </div>

                <div className="relative border border-paper/15 p-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-2 h-8 w-8 border-r-2 border-t-2 border-brass-400"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-brass-400"
                  />
                  <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                    Rather just talk?
                  </h2>
                  <p className="mt-3.5 text-pretty text-sm leading-relaxed text-paper/60">
                    A thirty-minute discovery call is free, and you will get a
                    straight answer about whether this is a fit.
                  </p>
                  <Link
                    href="/booking"
                    className="group mt-6 inline-flex items-center gap-2.5 label text-brass-300 transition-colors hover:text-brass-200"
                  >
                    Book a Call
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </Link>
                </div>

                <p className="text-xs leading-relaxed text-paper/35">
                  Typical reply time is two business days. For press or speaking
                  enquiries, please include your date and audience.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
