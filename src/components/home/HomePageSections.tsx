import { DeveloperSection } from "@/components/home/DeveloperSection";
import HeroSection from "./HeroSection";
import FeaturedSection from "./FeaturedSection";
import TrustSection from "./TrustSection";

export default function HomePageSections() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* HERO */}
      <HeroSection />

      {/* FEATURED */}
      <FeaturedSection />

      {/* DEVELOPER */}
      <DeveloperSection />

      {/* TRUST */}
      <TrustSection />
    </main>
  );
}
