import { DeveloperSection } from "@/components/home/DeveloperSection";
import HeroSection from "./HeroSection";
import FeaturedSection from "./FeaturedSection";
import { EcosystemSection } from "./EcosystemSection";
import TrustSection from "./TrustSection";

export default function HomePageSections() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* HERO */}
      <HeroSection />

      {/* FEATURED TOOLS */}
      <FeaturedSection />

      {/* ECOSYSTEM SUBDOMAINS */}
      <EcosystemSection />

      {/* DEVELOPER PROMISE */}
      <DeveloperSection />

      {/* TRUST */}
      <TrustSection />
    </main>
  );
}
