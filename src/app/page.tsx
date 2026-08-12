import HomePageSections from "@/components/home/HomePageSections";
import StructuredData from "@/components/seo/StructuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://toolmate.co.in",
  },
};

export default function HomePage() {
  return (
    <>
      <HomePageSections />
      <StructuredData />
    </>
  );
}
