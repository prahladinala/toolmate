import { TOOLS } from "@/features/tools/registry";
import { ToolsExplorer } from "@/features/tools/tools-explorer/ToolsExplorer";

export const metadata = {
  title: "Tools | ToolMate",
  description:
    "Browse ToolMate’s collection of everyday tools: developer utilities, converters, generators, and info tools.",
  alternates: {
    canonical: "https://toolmate.co.in/tools",
  },
};

export default function ToolsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": TOOLS.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://toolmate.co.in/tools/${tool.slug}`,
      "name": tool.name
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ToolsExplorer tools={TOOLS} />
    </>
  );
}
