import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTool } from "@/features/tools/registry";
import { ToolRenderer } from "@/features/tools/tool-renderer";
import { ToolVisitTracker } from "@/features/tools/ToolVisitTracker";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "Not found — ToolMate" };

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: { canonical: `https://toolmate.co.in/tools/${tool.slug}` },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `https://toolmate.co.in/tools/${tool.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.title,
      description: tool.seo.description,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.seo.title,
    description: tool.seo.description,
    url: `https://toolmate.co.in/tools/${tool.slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolVisitTracker
        slug={tool.slug}
        name={tool.name}
        category={tool.category}
        shortDescription={tool.shortDescription}
      />
      <ToolRenderer tool={tool} />
    </>
  );
}
