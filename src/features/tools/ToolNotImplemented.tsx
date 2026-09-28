"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    <main className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--fg),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--fg),0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center text-[13px] font-semibold text-[rgb(var(--muted))]">
          <Link href="/tools" className="hover:text-indigo-500 transition-colors">
            Tools
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span aria-current="page" className="text-[rgb(var(--fg))]">{tool.name}</span>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[rgba(var(--fg),0.08)] bg-[rgba(var(--card),0.4)] backdrop-blur-sm shadow-[0_8px_40px_rgba(0,0,0,0.04)] mb-20 p-8 md:p-16">
          <div className="absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 blur-3xl opacity-30 pointer-events-none bg-[radial-gradient(closest-side,rgba(99,102,241,0.30),transparent_70%)]" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--fg),0.05)] bg-[rgba(var(--fg),0.03)] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-500 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Coming Soon
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {tool.name}
            </h1>

            <p className="text-[16px] text-[rgb(var(--muted))] leading-relaxed mb-8">
              This tool is currently on our development roadmap. In the meantime, you can explore similar utilities below or head back to the main workspace.
            </p>

            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 text-white px-6 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 hover:scale-105 transition-all duration-300"
            >
              Browse other tools
            </Link>

            {tool.tags?.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {tool.tags.map((t) => (
                  <span key={t} className="rounded-md bg-[rgba(var(--fg),0.04)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--fg))] opacity-60">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Suggestions */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Try these instead</h2>
            <Link
              href="/tools"
              className="text-[13px] font-semibold text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors"
            >
              View all tools →
            </Link>
          </div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
          >
            <AnimatePresence mode="popLayout">
              {suggestions.map((t) => (
                <motion.div
                  key={t.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full"
                >
                  <Link href={`/tools/${t.slug}`} className="block h-full outline-none">
                    <div className="group relative overflow-hidden p-8 h-full transition-all duration-500 border border-[rgba(var(--fg),0.08)] bg-[rgba(var(--card),0.4)] backdrop-blur-sm hover:border-[rgba(var(--fg),0.2)] hover:bg-[rgba(var(--fg),0.03)] rounded-3xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] flex flex-col">
                      <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-extrabold text-xl tracking-tight leading-snug">{t.name}</div>
                          <span className="shrink-0 rounded-full bg-[rgba(var(--fg),0.05)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                            {t.category}
                          </span>
                        </div>
                        
                        <p className="mt-4 text-[15px] text-[rgb(var(--muted))] leading-relaxed flex-1">
                          {t.shortDescription}
                        </p>

                        <div className="mt-8 pt-6 flex items-center justify-between border-t border-[rgba(var(--fg),0.05)]">
                          <span className="text-[13px] font-bold text-indigo-500 dark:text-indigo-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                            Launch <span className="ml-0.5">→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
