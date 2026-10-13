import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { contact } from "@/content/placeholder";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How The Impact Lab handles the information you share through this website.",
  robots: { index: false, follow: true },
};

/**
 * PLACEHOLDER. Plain-language and accurate to what the site actually does, but
 * it is not legal advice and has not been reviewed by a lawyer. Flagged in
 * REPLACE-BEFORE-LAUNCH.md.
 */
const sections = [
  {
    title: "What we collect",
    body: "When you book an appointment or send a message, we collect the information you type into the form: your name, email address, phone number if you give one, your organization and role, and whatever you tell us about what you would like to discuss. We do not collect anything else, and there is no advertising tracking on this site.",
  },
  {
    title: "Why we collect it",
    body: "To hold your appointment, to prepare for it, and to reply to you. That is the whole list. Your details are not sold, rented, or shared with anyone, and you will not be added to a mailing list because you booked a call.",
  },
  {
    title: "How long we keep it",
    body: "Appointment records are retained while there is an active or prospective working relationship, and removed on request at any time.",
  },
  {
    title: "Text notifications",
    body: "When you book, an automated text is sent to Andrea with your name, organization, and chosen time so she knows the appointment exists. No marketing texts are ever sent to you.",
  },
  {
    title: "Your choices",
    body: "You can ask to see what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to us and we will act on it.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title={
          <>
            What we do with
            <br />
            your <span className="text-brass-400">information</span>.
          </>
        }
        lede="Short version: we use what you give us to talk to you, and nothing else."
      />

      <section className="relative field-deep pb-24 md:pb-32 lg:pb-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl">
            <div className="border-t border-paper/10">
              {sections.map((s) => (
                <section
                  key={s.title}
                  className="border-b border-paper/10 py-9 md:py-11"
                >
                  <h2 className="text-2xl leading-tight text-paper md:text-[1.75rem]">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-pretty leading-[1.8] text-paper/65">
                    {s.body}
                  </p>
                </section>
              ))}
            </div>

            <p className="mt-12 text-pretty leading-relaxed text-paper/55">
              Questions about any of this? Write to{" "}
              <a
                href={`mailto:${contact.email}`}
                className="text-brass-300 underline underline-offset-4 transition-colors hover:text-brass-200"
              >
                {contact.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
