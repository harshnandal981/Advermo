import Hero from "@/components/sections/hero";
import WhyUs from "@/components/sections/why-us";
import FeaturedSpaces from "@/components/sections/featured-spaces";
import Metrics from "@/components/sections/metrics";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSpaces />
      <WhyUs />
      <Metrics />
    </>
  );
}
