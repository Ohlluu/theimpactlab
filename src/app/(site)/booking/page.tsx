import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { availability } from "@/content/placeholder";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a complimentary 30-minute discovery call with Andrea Porter, or schedule a strategy session or facilitation conversation. Choose a time that works for you.",
};

export default async function BookingPage({ searchParams }: PageProps<"/booking">) {
  const params = await searchParams;
  const topic = typeof params.topic === "string" ? params.topic : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Book a Consultation"
        title={
          <>
            Find a time
            <br />
            that <span className="text-brass-400">works</span>.
          </>
        }
        lede={`Pick an appointment type, choose an open slot, and tell Andrea a little about your organization. Times shown in ${availability.timezoneLabel}.`}
      />
      <section className="relative bg-olive-950">
        <BookingFlow initialTopic={topic} />
      </section>
    </>
  );
}
