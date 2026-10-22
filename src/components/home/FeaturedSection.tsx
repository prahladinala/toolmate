import React from "react";
import Link from "next/link";
import { TOOLS } from "@/features/tools/registry";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const featured = TOOLS.slice(0, 6);

const ECOSYSTEM_CAROUSEL_ITEMS = [
  {
    title: "Toolmate UI",
    badge: "Ecosystem",
    badgeClasses: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
    gradient: "from-indigo-500/10 to-purple-500/10",
    description: "Beautifully designed, accessible, and customizable React components and templates.",
    cta: "Explore UI Library",
    url: "https://ui.toolmate.co.in",
  },
  {
    title: "Toolmate Resume",
    badge: "Ecosystem",
    badgeClasses: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
    gradient: "from-emerald-500/10 to-teal-500/10",
    description: "Build ATS-friendly, professional resumes in minutes with our drag-and-drop builder.",
    cta: "Build Your Resume",
    url: "https://resume.toolmate.co.in",
  },
  {
    title: "Toolmate Interview",
    badge: "Ecosystem",
    badgeClasses: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
    gradient: "from-blue-500/10 to-indigo-500/10",
    description: "Master your interview preparation with curated questions, detailed answers, and guides.",
    cta: "Prepare for Interviews",
    url: "https://interview.toolmate.co.in",
  },
  {
    title: "Toolmate Finance",
    badge: "Coming Soon",
    badgeClasses: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    gradient: "from-amber-500/10 to-orange-500/10",
    description: "Smart calculators for loans, taxes, investments, compound interest, and finance calculations.",
    cta: "Coming Soon",
    url: "https://finance.toolmate.co.in",
  },
];

export default function FeaturedSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
          width: max-content;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
      <section className="relative mx-auto max-w-6xl px-4 py-20 overflow-hidden">
        {/* Subtle background glow for this section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <ScrollReveal className="relative z-10 flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Featured Tools
          </h2>
          <p className="text-lg text-[rgb(var(--muted))] max-w-xl">
            Polished utilities you’ll actually use. Built for speed and reliability.
          </p>
          <Link
            href="/tools"
            className="group inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors mt-2"
          >
            Explore all tools <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </ScrollReveal>

        {/* EXTERNAL TOOLS MARQUEE */}
        <div className="mb-20 relative py-4 flex overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-6 animate-infinite-scroll pl-6">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                {ECOSYSTEM_CAROUSEL_ITEMS.map((item) => (
                  <a
                    key={`${i}-${item.title}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-[320px] md:w-[400px] shrink-0 outline-none"
                  >
                    <div className="group relative overflow-hidden p-6 h-full transition-all duration-500 bg-[rgb(var(--card))] shadow-[0_4px_24px_rgba(0,0,0,0.03)] ring-1 ring-[rgba(var(--fg),0.04)] hover:ring-[rgba(var(--fg),0.1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] rounded-3xl">
                      <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${item.gradient} pointer-events-none`} />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-bold text-xl tracking-tight">{item.title}</div>
                          <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${item.badgeClasses}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="mt-3 text-[15px] text-[rgb(var(--muted))] leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-6 flex items-center text-sm font-bold text-[rgb(var(--fg))] opacity-70 group-hover:opacity-100 transition-opacity">
                          {item.cta} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* INTERNAL TOOLS GRID */}
        <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, idx) => (
            <ScrollReveal key={t.slug} delay={idx * 0.05} className="h-full">
              <Link href={`/tools/${t.slug}`} className="block h-full outline-none">
                <div className="group relative flex flex-col h-full overflow-hidden p-6 transition-all duration-500 bg-[rgb(var(--card))] shadow-[0_4px_24px_rgba(0,0,0,0.03)] ring-1 ring-[rgba(var(--fg),0.04)] hover:ring-[rgba(var(--fg),0.1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] rounded-3xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-bold text-xl tracking-tight leading-snug">{t.name}</div>
                    <span className="shrink-0 rounded-full bg-[rgba(var(--fg),0.05)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                      {t.category}
                    </span>
                  </div>
                  
                  <p className="mt-4 text-[15px] text-[rgb(var(--muted))] leading-relaxed flex-1">
                    {t.shortDescription}
                  </p>

                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <div className="flex gap-2 overflow-hidden">
                      {t.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="truncate rounded-md bg-[rgba(var(--fg),0.06)] px-2.5 py-1 text-[11px] font-semibold text-[rgb(var(--fg))] opacity-75">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <span className="shrink-0 text-[13px] font-bold text-indigo-500 dark:text-indigo-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Open <span className="ml-0.5">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* QUICK CATEGORY DIRECTORY */}
        <div className="relative z-10 mt-16 pt-12 border-t border-[rgba(var(--fg),0.06)]">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-[rgb(var(--fg))]">
              Browse 100+ Developer Tools by Category
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--muted))] mt-1">
              Fast, privacy-focused browser utilities designed for daily development workflows.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { name: "Developer Tools", count: 38 },
              { name: "Converters", count: 16 },
              { name: "Design & CSS", count: 18 },
              { name: "PDF Utilities", count: 10 },
              { name: "Image Processing", count: 7 },
              { name: "Security & Crypto", count: 2 },
              { name: "Generators", count: 3 },
              { name: "Information & Specs", count: 6 },
            ].map((cat) => (
              <Link
                key={cat.name}
                href="/tools"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[rgb(var(--card))] border border-[rgba(var(--fg),0.08)] text-xs font-semibold text-[rgb(var(--fg))] hover:border-indigo-500/40 hover:text-indigo-500 transition-all shadow-sm"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(var(--fg),0.05)] text-[rgb(var(--muted))]">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
