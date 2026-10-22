import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getTool } from "@/features/tools/registry";
import { ToolRenderer } from "@/features/tools/tool-renderer";
import { ToolVisitTracker } from "@/features/tools/ToolVisitTracker";
import { ShareButton } from "@/features/tools/ShareButton";
import { DonationBanner } from "@/components/donation/DonationBanner";
import { EngagementModal } from "@/components/donation/EngagementModal";
import { DONATION_CONFIG } from "@/config/donation";
import {
  getToolSeoData,
  getRelatedTools,
  getApplicationCategory,
} from "@/features/tools/seo-content";
import { ToolSeoSection } from "@/components/tools/ToolSeoSection";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return TOOLS.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) {
    return {
      title: { absolute: "Not Found — ToolMate" },
    };
  }

  const keywords = [
    ...(tool.seo.keywords || []),
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    `free ${tool.name.toLowerCase()}`,
    `${tool.name.toLowerCase()} tool`,
    "toolmate",
    "online developer tool",
    "free developer utilities",
  ];

  const canonicalUrl = `https://toolmate.co.in/tools/${tool.slug}`;
  const seoTitle = tool.seo.title.includes("ToolMate")
    ? tool.seo.title
    : `${tool.seo.title} — ToolMate`;

  return {
    title: {
      absolute: seoTitle,
    },
    description: `${tool.seo.description} Fast, free, and 100% private in-browser utility on ToolMate. No server uploads or installation required.`,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: tool.seo.description,
      url: canonicalUrl,
      siteName: "ToolMate",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: tool.seo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const seoData = getToolSeoData(tool);
  const relatedTools = getRelatedTools(tool, 6);
  const appCategory = getApplicationCategory(tool.category);

  // 1. WebApplication Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — ToolMate`,
    alternateName: [`ToolMate ${tool.name}`, `${tool.name} ToolMate`],
    description: tool.seo.description,
    url: `https://toolmate.co.in/tools/${tool.slug}`,
    applicationCategory: appCategory,
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    featureList: seoData.features.map((f) => `${f.title}: ${f.text}`),
    provider: {
      "@type": "Organization",
      name: "ToolMate",
      url: "https://toolmate.co.in",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // 2. Breadcrumb Schema
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
      {
        "@type": "ListItem",
        position: 3,
        name: tool.category,
        item: `https://toolmate.co.in/tools`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.name,
        item: `https://toolmate.co.in/tools/${tool.slug}`,
      },
    ],
  };

  // 3. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seoData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // 4. HowTo Schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: seoData.overview,
    step: seoData.howTo.map((step) => ({
      "@type": "HowToStep",
      position: step.step,
      name: step.title,
      text: step.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <main className="relative min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-x-clip">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--fg),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--fg),0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
        <div className="absolute top-0 inset-x-0 h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 sm:mb-6 flex items-center text-xs sm:text-[13px] font-semibold text-[rgb(var(--muted))]"
          >
            <a href="/tools" className="hover:text-indigo-500 transition-colors">
              Tools
            </a>
            <span className="mx-2 opacity-40">/</span>
            <span className="opacity-75">{tool.category}</span>
            <span className="mx-2 opacity-40">/</span>
            <span
              aria-current="page"
              className="text-[rgb(var(--fg))] truncate max-w-[200px] sm:max-w-none"
            >
              {tool.name}
            </span>
          </nav>

          {/* TOOL HEADER */}
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl -z-10 rounded-full opacity-40" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-b from-[rgb(var(--fg))] to-[rgba(var(--fg),0.75)] leading-tight">
                  {tool.name}
                </h1>
                <p className="text-sm sm:text-base text-[rgb(var(--muted))] leading-relaxed max-w-2xl font-normal">
                  {tool.seo.description}
                </p>
              </div>

              <div className="flex flex-wrap shrink-0 items-center gap-2.5 sm:gap-3">
                <span className="inline-flex rounded-full bg-[rgba(var(--fg),0.04)] border border-[rgba(var(--fg),0.08)] px-3 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[rgb(var(--fg))] shadow-sm">
                  {tool.category}
                </span>

                <ToolVisitTracker
                  slug={tool.slug}
                  name={tool.name}
                  category={tool.category}
                  shortDescription={tool.shortDescription}
                />

                <ShareButton
                  toolName={tool.name}
                  toolSlug={tool.slug}
                  shortDescription={tool.shortDescription}
                />
              </div>
            </div>
          </header>

          {/* TOOL BODY */}
          <section className="rounded-2xl sm:rounded-3xl bg-[rgb(var(--card))] shadow-xl shadow-black/5 ring-1 ring-[rgba(var(--fg),0.04)] p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100 ease-out fill-mode-both border border-[rgba(var(--border),0.6)] relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--fg),0.1)] to-transparent" />
            <ToolRenderer tool={tool} />
          </section>

          {/* RICH SEO DOCUMENTATION & INTERNAL LINKING SECTION */}
          <ToolSeoSection
            tool={tool}
            seoData={seoData}
            relatedTools={relatedTools}
          />

          {/* STATIC DONATION BUTTONS / BANNER */}
          {DONATION_CONFIG.isEnabled && (
            <div className="mt-16">
              <DonationBanner />
            </div>
          )}

          {/* TIME-TRIGGERED ENGAGEMENT FEEDBACK & PAYMENT MODAL */}
          {DONATION_CONFIG.isEnabled && (
            <EngagementModal toolName={tool.name} />
          )}
        </div>
      </main>
    </>
  );
}
