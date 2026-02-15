import { TOOLS } from "@/features/tools/registry";
import { ToolsExplorer } from "@/features/tools/tools-explorer/ToolsExplorer";

export const metadata = {
  title: "Tools | ToolMate",
  description:
    "Browse ToolMate’s collection of everyday tools: developer utilities, converters, generators, and info tools.",
};

export default function ToolsPage() {
  // Keep the initial render SEO friendly: static list is embedded in HTML.
  // Then the client component enhances with search/filter/animations.
  return <ToolsExplorer tools={TOOLS} />;
}
