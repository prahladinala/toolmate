"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { getRecentTools, type RecentTool } from "@/features/tools/recent";

type Tool = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  tags?: string[];
};

const ALL = "All";

function uniqCategories(tools: Tool[]) {
  const set = new Set<string>();
  tools.forEach((t) => set.add(t.category));
  return [ALL, ...Array.from(set).sort()];
}

function useDebounced<T>(value: T, ms = 120) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

function scoreMatch(tool: Tool, q: string) {
  if (!q) return 1;
  const s = q.toLowerCase();
  const name = tool.name.toLowerCase();
  const slug = tool.slug.toLowerCase();
  const cat = tool.category.toLowerCase();
  const desc = tool.shortDescription.toLowerCase();
  const tags = (tool.tags ?? []).join(" ").toLowerCase();

  let score = 0;
  if (name.includes(s)) score += 5;
  if (slug.includes(s)) score += 3;
  if (cat.includes(s)) score += 2;
  if (tags.includes(s)) score += 2;
  if (desc.includes(s)) score += 1;
  return score;
}

export function ToolsExplorer({ tools }: { tools: Tool[] }) {
  const categories = React.useMemo(() => uniqCategories(tools), [tools]);

  const [query, setQuery] = React.useState("");
  const q = useDebounced(query, 120);

  const [category, setCategory] = React.useState<string>(ALL);
  const [recent, setRecent] = React.useState<RecentTool[]>([]);
  
  const [contextMenu, setContextMenu] = React.useState<{
    open: boolean;
    x: number;
    y: number;
    tool: Tool | null;
  }>({ open: false, x: 0, y: 0, tool: null });

  React.useEffect(() => {
    setRecent(getRecentTools());
    const closeMenu = () => setContextMenu((prev) => ({ ...prev, open: false }));
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, { passive: true });
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu);
    };
  }, []);

  const filtered = React.useMemo(() => {
    const base = category === ALL ? tools : tools.filter((t) => t.category === category);
    const scored = base
      .map((t) => ({ t, score: scoreMatch(t, q.trim()) }))
      .filter((x) => (q.trim() ? x.score > 0 : true))
      .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name))
      .map((x) => x.t);
    return scored;
  }, [tools, category, q]);

  const showRecent = recent.length > 0 && !q.trim() && category === ALL;

  return (
    <main className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--fg),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--fg),0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4">
        {/* Search Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Developer Arsenal
          </motion.h1>
          
          {/* Spotlight Search */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-2xl relative group z-20"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-[rgb(var(--bg))] ring-1 ring-[rgba(var(--fg),0.1)] rounded-full px-6 py-4 shadow-2xl">
              <svg className="w-6 h-6 text-[rgb(var(--muted))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools (e.g. JSON, Base64, UUID...)"
                className="w-full bg-transparent outline-none border-none text-lg text-[rgb(var(--fg))] placeholder-[rgb(var(--muted))] ml-4"
              />
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden sm:flex text-xs font-bold text-[rgb(var(--muted))] px-2 py-1 rounded bg-[rgba(var(--fg),0.05)]">
                  {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Minimalist Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-6 mt-10 w-full max-w-4xl"
          >
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "text-[14px] font-semibold transition-all duration-300 px-3 py-1.5 rounded-full",
                    active
                      ? "text-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.03)]"
                  )}
                >
                  {c}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Recently visited */}
        {showRecent ? (
          <section className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight">Jump back in</h2>
              <button
                className="text-[13px] font-semibold text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors"
                onClick={() => {
                  localStorage.removeItem("toolmate:recent:v1");
                  setRecent([]);
                }}
              >
                Clear history
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.slice(0, 3).map((r) => (
                <Link 
                  key={r.slug} 
                  href={`/tools/${r.slug}`} 
                  className="outline-none block h-full"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      open: true,
                      x: Math.min(e.clientX, window.innerWidth - 224),
                      y: Math.min(e.clientY, window.innerHeight - 200),
                      tool: r as Tool,
                    });
                  }}
                >
                  <div className="group relative overflow-hidden p-6 h-full transition-all duration-500 border border-[rgba(var(--fg),0.08)] bg-[rgba(var(--card),0.4)] backdrop-blur-sm hover:border-[rgba(var(--fg),0.2)] hover:bg-[rgba(var(--fg),0.03)] rounded-3xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)]">
                    <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="font-bold text-lg tracking-tight">{r.name}</div>
                        <span className="shrink-0 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                          Recent
                        </span>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-[rgba(var(--fg),0.05)]">
                        <span className="text-[12px] font-bold text-[rgb(var(--muted))]">{r.category}</span>
                        <span className="text-[13px] font-bold text-indigo-500 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                          Launch <span className="ml-0.5">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Tool grid */}
        <section>
          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(var(--fg),0.03)] mb-6 ring-1 ring-[rgba(var(--fg),0.05)]">
                <svg className="w-10 h-10 text-[rgb(var(--muted))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">No tools found</h3>
              <p className="text-[16px] text-[rgb(var(--muted))] max-w-md mx-auto mb-10">
                We couldn't find any tools matching your criteria. Try adjusting your search or switching categories.
              </p>
              <button 
                onClick={() => { setQuery(""); setCategory(ALL); }}
                className="rounded-full px-8 py-3 bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Clear all filters
              </button>
            </div>
          ) : (
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
                {filtered.map((t) => (
                  <motion.div
                    key={t.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full"
                  >
                    <Link 
                      href={`/tools/${t.slug}`} 
                      className="block h-full outline-none"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          open: true,
                          x: Math.min(e.clientX, window.innerWidth - 224),
                          y: Math.min(e.clientY, window.innerHeight - 200),
                          tool: t,
                        });
                      }}
                    >
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
                            <div className="flex gap-2 overflow-hidden">
                              {t.tags?.slice(0, 2).map((tag) => (
                                <span key={tag} className="truncate rounded-md bg-[rgba(var(--fg),0.06)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--fg))] opacity-75">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <span className="shrink-0 text-[13px] font-bold text-indigo-500 dark:text-indigo-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                              Open <span className="ml-0.5">→</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>
      
      {/* Custom Context Menu */}
      <AnimatePresence>
        {contextMenu.open && contextMenu.tool && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 w-56 bg-[rgb(var(--card))] border border-[rgba(var(--fg),0.1)] shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden py-1.5"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="px-3 py-2 border-b border-[rgba(var(--fg),0.05)] mb-1">
               <div className="font-bold text-[13px] truncate">{contextMenu.tool.name}</div>
               <div className="text-[11px] text-[rgb(var(--muted))]">{contextMenu.tool.category}</div>
            </div>
            
            <button
              onClick={() => {
                window.open(`/tools/${contextMenu.tool?.slug}`, "_blank");
                setContextMenu(prev => ({ ...prev, open: false }));
              }}
              className="w-full text-left px-3 py-2 text-[13px] font-semibold text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.05)] hover:text-indigo-500 transition-colors flex items-center gap-2.5 group"
            >
              <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Open in New Tab
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://toolmate.co.in/tools/${contextMenu.tool?.slug}`);
                setContextMenu(prev => ({ ...prev, open: false }));
              }}
              className="w-full text-left px-3 py-2 text-[13px] font-semibold text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.05)] hover:text-indigo-500 transition-colors flex items-center gap-2.5 group"
            >
              <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copy Link
            </button>

            <button
              onClick={() => {
                 window.location.href = `/tools/${contextMenu.tool?.slug}`;
              }}
              className="w-full text-left px-3 py-2 text-[13px] font-semibold text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.05)] hover:text-indigo-500 transition-colors flex items-center gap-2.5 group"
            >
              <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Launch Tool
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
