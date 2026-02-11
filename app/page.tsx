import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Features from "@/components/landing/features";
import StatsCounter from "@/components/landing/stats-counter";
import FeaturedSpaces from "@/components/landing/featured-spaces";
import Testimonials from "@/components/landing/testimonials";
import BrandLogos from "@/components/landing/brand-logos";
import PricingPreview from "@/components/landing/pricing-preview";
import FAQ from "@/components/landing/faq";
import FinalCTA from "@/components/landing/final-cta";

export const metadata = {
  title: 'Advermo - Book Premium Ad Spaces in Cafes, Gyms & More',
  description: 'Discover and book verified advertising spaces across 500+ venues in 50+ cities. Instant booking, secure payments, real-time analytics.',
  keywords: 'advertising spaces, ad spaces, venue advertising, cafe advertising, gym advertising, local advertising',
  openGraph: {
    title: 'Advermo - Premium Advertising Spaces Marketplace',
    description: 'Connect brands with perfect advertising venues',
    images: ['/og-image.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <StatsCounter />
      <FeaturedSpaces />
      <Testimonials />
      <BrandLogos />
      <PricingPreview />
      <FAQ />
      <FinalCTA />
    </>
  );
}
