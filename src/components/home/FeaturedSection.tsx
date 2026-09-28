"use client";
import React from "react";
import Link from "next/link";
import { TOOLS } from "@/features/tools/registry";
import { motion } from "@/components/motion/motion";

const featured = TOOLS.slice(0, 6);

export default function FeaturedSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
          width: max-content;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
      <section className="relative mx-auto max-w-6xl px-4 py-20 overflow-hidden">
        {/* Subtle background glow for this section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center gap-4 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
          >
            Featured Tools
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-[rgb(var(--muted))] max-w-xl"
          >
            Polished utilities you’ll actually use. Built for speed and reliability.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/tools"
              className="group inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors mt-2"
            >
              Explore all tools <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>

        {/* EXTERNAL TOOLS MARQUEE */}
        <div className="mb-20 relative py-4 flex overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-6 animate-infinite-scroll pl-6">
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <a href="https://ui.toolmate.co.in" target="_blank" rel="noopener noreferrer" className="block w-[320px] md:w-[400px] shrink-0 outline-none">
                  <div className="group relative overflow-hidden p-6 h-full transition-all duration-500 bg-[rgb(var(--card))] shadow-[0_4px_24px_rgba(0,0,0,0.03)] ring-1 ring-[rgba(var(--fg),0.04)] hover:ring-[rgba(var(--fg),0.1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] rounded-3xl">
                    <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-bold text-xl tracking-tight">Toolmate UI</div>
                        <span className="rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">Ecosystem</span>
                      </div>
                      <p className="mt-3 text-[15px] text-[rgb(var(--muted))] leading-relaxed line-clamp-2">
                        Beautifully designed, accessible, and customizable React components and templates.
                      </p>
                      <div className="mt-6 flex items-center text-sm font-bold text-[rgb(var(--fg))] opacity-70 group-hover:opacity-100 transition-opacity">
                        Explore UI Library <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </a>
                
                <a href="https://resume.toolmate.co.in" target="_blank" rel="noopener noreferrer" className="block w-[320px] md:w-[400px] shrink-0 outline-none">
                  <div className="group relative overflow-hidden p-6 h-full transition-all duration-500 bg-[rgb(var(--card))] shadow-[0_4px_24px_rgba(0,0,0,0.03)] ring-1 ring-[rgba(var(--fg),0.04)] hover:ring-[rgba(var(--fg),0.1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] rounded-3xl">
                    <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-bold text-xl tracking-tight">Toolmate Resume</div>
                        <span className="rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">Ecosystem</span>
                      </div>
                      <p className="mt-3 text-[15px] text-[rgb(var(--muted))] leading-relaxed line-clamp-2">
                        Build ATS-friendly, professional resumes in minutes with our drag-and-drop builder.
                      </p>
                      <div className="mt-6 flex items-center text-sm font-bold text-[rgb(var(--fg))] opacity-70 group-hover:opacity-100 transition-opacity">
                        Build Your Resume <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* INTERNAL TOOLS GRID */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((t) => (
            <motion.div
              key={t.slug}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="h-full"
            >
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
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
