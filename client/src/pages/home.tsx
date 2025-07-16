import { Helmet } from "react-helmet";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import ArtStylesSection from "@/components/art-styles-section";
import MarketplaceSection from "@/components/marketplace-section";
import TestimonialsSection from "@/components/testimonials-section";
import PricingSection from "@/components/pricing-section";
import CTASection from "@/components/cta-section";

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>ComicAI - Create, Share & Sell AI-Generated Comics</title>
        <meta name="description" content="Create stunning digital comics and graphic novels in minutes with our AI-powered platform. Turn your stories into amazing comics instantly." />
        <meta property="og:title" content="ComicAI - Create, Share & Sell AI-Generated Comics" />
        <meta property="og:description" content="Create stunning digital comics and graphic novels in minutes with our AI-powered platform. Turn your stories into amazing comics instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" />
      </Helmet>

      <HeroSection />
      <FeaturesSection />
      <ArtStylesSection />
      <MarketplaceSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}
