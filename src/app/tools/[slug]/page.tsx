import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTool } from "@/features/tools/registry";
import { ToolRenderer } from "@/features/tools/tool-renderer";
import { ToolVisitTracker } from "@/features/tools/ToolVisitTracker";
import { ShareButton } from "@/features/tools/ShareButton";

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

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://toolmate.co.in"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://toolmate.co.in/tools"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `https://toolmate.co.in/tools/${tool.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      
      <main className="relative min-h-screen pt-32 pb-24 overflow-hidden">
        {/* Ambient Grid Background - Pure CSS, no hydration needed */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--fg),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--fg),0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
        <div className="absolute top-0 inset-x-0 h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-6xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center text-[13px] font-semibold text-[rgb(var(--muted))]">
            <a href="/tools" className="hover:text-indigo-500 transition-colors">
              Tools
            </a>
            <span className="mx-2 opacity-50">/</span>
            <span aria-current="page" className="text-[rgb(var(--fg))]">{tool.name}</span>
          </nav>

          {/* TOOL HEADER - Statically rendered for instantaneous SEO payload */}
          <header className="mb-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl -z-10 rounded-full opacity-50" />
                <h1 className="text-4xl md:text-[56px] font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[rgb(var(--fg))] to-[rgba(var(--fg),0.6)] leading-tight">
                  {tool.name}
                </h1>
                <p className="text-[17px] text-[rgb(var(--muted))] leading-relaxed max-w-2xl font-medium">
                  {tool.seo.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden sm:flex rounded-full bg-[rgba(var(--fg),0.03)] border border-[rgba(var(--fg),0.06)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-[rgb(var(--fg))] shadow-sm">
                  {tool.category}
                </span>

                {/* Client Component Island for interactivity */}
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

          {/* TOOL BODY - Client Component boundary */}
          <section className="rounded-[2.5rem] bg-[rgb(var(--card))] shadow-2xl shadow-black/5 ring-1 ring-[rgba(var(--fg),0.03)] p-6 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both border border-[rgba(var(--fg),0.02)] relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--fg),0.1)] to-transparent" />
            <ToolRenderer tool={tool} />
          </section>
        </div>
      </main>
    </>
  );
}
