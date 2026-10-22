import type { Metadata } from "next";
import { TOOLS } from "@/features/tools/registry";
import { ToolsExplorer } from "@/features/tools/tools-explorer/ToolsExplorer";

export const metadata: Metadata = {
  title: {
    absolute: "All Developer Tools & Online Utilities — Free & Private | ToolMate",
  },
  description:
    "Explore 100+ free online developer tools: JSON formatters, code converters, regex testers, generators, image & PDF utilities. 100% client-side and privacy-friendly.",
  alternates: {
    canonical: "https://toolmate.co.in/tools",
  },
  openGraph: {
    title: "All Developer Tools & Online Utilities — ToolMate",
    description:
      "Explore 100+ free online developer tools. Fast, private, browser-based utilities with zero server uploads.",
    url: "https://toolmate.co.in/tools",
    siteName: "ToolMate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Developer Tools & Online Utilities — ToolMate",
    description:
      "Explore 100+ free online developer tools. Fast, private, browser-based utilities with zero server uploads.",
  },
};

export default function ToolsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ToolMate Developer Tools Directory",
    description: "Curated collection of 100+ browser-based utilities for developers and designers.",
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://toolmate.co.in/tools/${tool.slug}`,
      name: tool.name,
      description: tool.shortDescription,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://toolmate.co.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://toolmate.co.in/tools",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolsExplorer tools={TOOLS} />
    </>
  );
}
