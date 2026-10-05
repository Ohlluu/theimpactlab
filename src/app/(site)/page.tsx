import { Hero } from "@/components/home/Hero";
import { StatBand } from "@/components/home/StatBand";
import { Commitment } from "@/components/home/Commitment";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { Approach } from "@/components/home/Approach";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatBand />
      <Commitment />
      <ServicesIndex />
      <Approach />
      <Testimonials />
    </>
  );
}
