import React from "react";
import Link from "next/link";
import type { ToolDef } from "@/features/tools/registry";
import type { ToolSeoData } from "@/features/tools/seo-content";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  ListOrdered,
  Layers,
} from "lucide-react";

interface Props {
  tool: ToolDef;
  seoData: ToolSeoData;
  relatedTools: ToolDef[];
}

export function ToolSeoSection({ tool, seoData, relatedTools }: Props) {
  return (
    <div className="mt-16 sm:mt-24 space-y-16 sm:space-y-20 border-t border-[rgba(var(--fg),0.06)] pt-12 sm:pt-16">
      {/* 1. OVERVIEW & HOW TO USE */}
      <section aria-labelledby="how-to-use-heading">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
          <ListOrdered className="w-4 h-4" />
          <span>Step-by-Step Guide</span>
        </div>
        <h2
          id="how-to-use-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[rgb(var(--fg))]"
        >
          How to Use {tool.name}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[rgb(var(--muted))] leading-relaxed max-w-3xl">
          {seoData.overview}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {seoData.howTo.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-[rgba(var(--fg),0.08)] bg-[rgb(var(--card))] p-5 shadow-sm transition-all hover:border-[rgba(var(--fg),0.15)] hover:shadow-md"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 font-extrabold text-sm mb-4">
                {step.step}
              </div>
              <h3 className="font-bold text-base text-[rgb(var(--fg))] mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[rgb(var(--muted))] leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. KEY FEATURES & CAPABILITIES */}
      <section aria-labelledby="features-heading">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Performance & Privacy</span>
        </div>
        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[rgb(var(--fg))]"
        >
          Key Features of {tool.name}
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {seoData.features.map((feat, idx) => {
            const icons = [ShieldCheck, Zap, Layers, CheckCircle2];
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={feat.title}
                className="rounded-2xl border border-[rgba(var(--fg),0.08)] bg-[rgb(var(--card))] p-5 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(var(--fg),0.04)] text-indigo-500 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[rgb(var(--fg))] mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[rgb(var(--muted))] leading-relaxed">
                  {feat.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRACTICAL USE CASES */}
      <section aria-labelledby="use-cases-heading">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
          <Layers className="w-4 h-4" />
          <span>Real-World Applications</span>
        </div>
        <h2
          id="use-cases-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[rgb(var(--fg))]"
        >
          Common Use Cases & Workflows
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {seoData.useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-2xl border border-[rgba(var(--fg),0.06)] bg-[rgba(var(--card),0.5)] p-5"
            >
              <h3 className="font-bold text-sm sm:text-base text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>{uc.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[rgb(var(--muted))] leading-relaxed">
                {uc.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section aria-labelledby="faq-heading">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Got Questions?</span>
        </div>
        <h2
          id="faq-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[rgb(var(--fg))]"
        >
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Everything you need to know about using {tool.name} on ToolMate.
        </p>

        <div className="mt-8 space-y-3">
          {seoData.faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-[rgba(var(--fg),0.08)] bg-[rgb(var(--card))] px-5 py-4 transition-all [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between font-bold text-sm sm:text-base text-[rgb(var(--fg))] select-none">
                <span>{faq.question}</span>
                <span className="ml-4 shrink-0 rounded-full bg-[rgba(var(--fg),0.05)] p-1 text-[rgb(var(--muted))] group-open:rotate-180 transition-transform">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-[rgb(var(--muted))] leading-relaxed pr-6">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 5. RELATED TOOLS (INTERNAL LINKING) */}
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-tools-heading" className="pt-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
                <span>Discover More</span>
              </div>
              <h2
                id="related-tools-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[rgb(var(--fg))]"
              >
                Related Developer Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              <span>View all tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={`/tools/${rel.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-[rgba(var(--fg),0.08)] bg-[rgb(var(--card))] p-5 shadow-sm transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-base text-[rgb(var(--fg))] group-hover:text-indigo-500 transition-colors">
                      {rel.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[rgba(var(--fg),0.04)] text-[rgb(var(--muted))] shrink-0">
                      {rel.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[rgb(var(--muted))] leading-relaxed line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(var(--fg),0.04)] flex items-center justify-between text-xs font-bold text-indigo-500">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-500 hover:text-indigo-400"
            >
              <span>Explore all developer tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
