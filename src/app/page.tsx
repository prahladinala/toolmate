import HomePageSections from "@/components/home/HomePageSections";
import StructuredData from "@/components/seo/StructuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "ToolMate — Free Online Developer Tools & Browser Utilities",
  },
  description:
    "100+ free, fast, and privacy-first online tools for developers, designers, and creators. JSON formatters, code converters, generators, PDF & image utilities running 100% in your browser.",
  alternates: {
    canonical: "https://toolmate.co.in",
  },
  openGraph: {
    title: "ToolMate — Free Online Developer Tools & Browser Utilities",
    description:
      "100+ free, fast, and privacy-first online tools for developers. Run JSON formatters, converters, generators, and PDF utilities directly in your browser.",
    url: "https://toolmate.co.in",
    siteName: "ToolMate",
    type: "website",
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
