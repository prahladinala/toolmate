import React from "react";
import Link from "next/link";

type Tool = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  tags?: string[];
};

export function ToolNotImplemented({
  tool,
  suggestions,
}: {
  tool: Tool;
  suggestions: Tool[];
}) {
  return (
    <div className="py-6 space-y-16">
      {/* Status banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(var(--fg),0.08)] bg-[rgba(var(--card),0.5)] p-8 md:p-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-500 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          In Development
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          {tool.name} is on the roadmap
        </h2>

        <p className="text-[16px] text-[rgb(var(--muted))] leading-relaxed max-w-xl mb-8">
          This utility is currently being crafted for maximum speed and privacy. In the meantime, explore similar tools in the {tool.category} collection below.
        </p>

        <Link
          href="/tools"
          className="inline-flex items-center justify-center rounded-full bg-indigo-500 text-white px-7 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all duration-300"
        >
          Explore All Tools →
        </Link>
      </div>

      {/* Recommended Alternatives */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-xl font-extrabold tracking-tight">Recommended Alternatives</h3>
            <Link
              href="/tools"
              className="text-xs font-bold text-indigo-500 hover:underline"
            >
              View directory →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((t) => (
              <Link 
                key={t.slug} 
                href={`/tools/${t.slug}`} 
                className="group relative overflow-hidden p-6 rounded-2xl border border-[rgba(var(--fg),0.08)] bg-[rgba(var(--card),0.4)] hover:border-[rgba(var(--fg),0.2)] hover:bg-[rgba(var(--fg),0.03)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-bold text-base tracking-tight group-hover:text-indigo-500 transition-colors">
                      {t.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(var(--fg),0.05)] text-[rgb(var(--muted))]">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-xs text-[rgb(var(--muted))] line-clamp-2 leading-relaxed">
                    {t.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(var(--fg),0.05)] flex items-center justify-end text-xs font-bold text-indigo-500">
                  Launch →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
