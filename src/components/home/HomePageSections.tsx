import { DeveloperSection } from "@/components/home/DeveloperSection";
import HeroSection from "./HeroSection";
import FeaturedSection from "./FeaturedSection";
import { EcosystemSection } from "./EcosystemSection";
import TrustSection from "./TrustSection";
import { DonationBanner } from "@/components/donation/DonationBanner";

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

      {/* SUPPORT & DONATION */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <DonationBanner />
        </div>
      </section>

      {/* TRUST */}
      <TrustSection />
    </main>
  );
}
