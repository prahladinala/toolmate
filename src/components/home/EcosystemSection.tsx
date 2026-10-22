import React from "react";
import { FileText, Layout, ExternalLink, Sparkles, CheckCircle2, GraduationCap, Calculator } from "lucide-react";

export function EcosystemSection() {
  const products = [
    {
      title: "ToolMate Resume",
      subtitle: "Free ATS-Friendly Resume Builder",
      description:
        "Craft sleek, recruiter-ready developer resumes in minutes. Features live real-time previews, customizable modern templates, and one-click PDF export.",
      url: "https://resume.toolmate.co.in",
      icon: FileText,
      badge: "Free & Private",
      features: ["ATS Score Optimization", "Real-time Live Preview", "Export to PDF & JSON"],
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      accent: "text-emerald-500",
      borderHover: "hover:border-emerald-500/40",
      cta: "Open Resume Builder",
    },
    {
      title: "ToolMate UI",
      subtitle: "Modern Component Library",
      description:
        "A premium library of responsive, accessible, copy-paste Tailwind CSS & React UI components designed for developer speed and aesthetic excellence.",
      url: "https://ui.toolmate.co.in",
      icon: Layout,
      badge: "Design System",
      features: ["Tailwind CSS Ready", "Light & Dark Mode Native", "Zero Config Copy-Paste"],
      gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
      accent: "text-indigo-500",
      borderHover: "hover:border-indigo-500/40",
      cta: "Explore UI Library",
    },
    {
      title: "ToolMate Interview",
      subtitle: "Interview Questions & Preparation",
      description:
        "Ace tech and coding interviews with curated interview questions and answers, system design discussions, and structured preparation tracks.",
      url: "https://interview.toolmate.co.in",
      icon: GraduationCap,
      badge: "Interview Prep",
      features: ["Curated Q&A Banks", "Coding & System Design", "Step-by-Step Solutions"],
      gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
      accent: "text-blue-500",
      borderHover: "hover:border-blue-500/40",
      cta: "Start Interview Prep",
    },
    {
      title: "ToolMate Finance",
      subtitle: "Finance Calculations & Tools",
      description:
        "Streamline your financial calculations with intuitive tools for loans, EMIs, investments, compounding, taxes, and smart wealth planning.",
      url: "https://finance.toolmate.co.in",
      icon: Calculator,
      badge: "Coming Soon",
      features: ["Loan & EMI Calculators", "Investment & ROI Models", "Tax & Wealth Estimates"],
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      accent: "text-amber-500",
      borderHover: "hover:border-amber-500/40",
      cta: "Coming Soon",
    },
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(var(--fg),0.04)] border border-[rgba(var(--fg),0.08)] text-[12px] font-semibold text-[rgb(var(--fg))] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>The ToolMate Ecosystem</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[rgb(var(--fg))]">
            More Powerful Apps Built for Developers
          </h2>
          <p className="mt-3 text-[16px] text-[rgb(var(--muted))] leading-relaxed">
            Expand your workflow beyond everyday utilities with dedicated developer productivity platforms in the ToolMate ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <a
                key={product.title}
                href={product.url}
                target="_blank"
                rel="noopener"
                className={`group relative rounded-3xl border border-[rgba(var(--fg),0.08)] bg-[rgb(var(--card))] p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${product.borderHover}`}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${product.gradient} pointer-events-none opacity-50`} />
                <div className="relative flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(var(--fg),0.04)] border border-[rgba(var(--fg),0.08)] text-[rgb(var(--fg))] shadow-inner group-hover:scale-110 transition-transform">
                        <Icon className={`w-6 h-6 ${product.accent}`} />
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        product.badge === "Coming Soon"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-[rgba(var(--fg),0.04)] text-[rgb(var(--muted))] border-[rgba(var(--fg),0.06)]"
                      }`}>
                        {product.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-[rgb(var(--fg))] group-hover:text-indigo-500 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm font-semibold text-[rgb(var(--muted))] mt-1">
                      {product.subtitle}
                    </p>
                    <p className="mt-4 text-[14px] text-[rgb(var(--muted))] leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-6 space-y-2 border-t border-[rgba(var(--fg),0.05)] pt-6">
                      {product.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2.5 text-[13px] font-medium text-[rgb(var(--fg))] opacity-90">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${product.accent}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-8 pt-4 flex items-center gap-2 text-sm font-bold ${product.accent} group-hover:translate-x-1 transition-transform`}>
                    <span>{product.cta}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
