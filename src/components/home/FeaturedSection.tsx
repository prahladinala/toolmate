"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { TOOLS } from "@/features/tools/registry";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/motion/motion";

const featured = TOOLS.slice(0, 6);

export default function FeaturedSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    const scrollStep = 0.8;

    const renderLoop = () => {
      if (!isHovered.current) {
        el.scrollLeft += scrollStep;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Featured tools</h2>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Polished utilities you’ll actually use.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm underline text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition"
          >
            View all
          </Link>
        </div>

        {/* EXTERNAL TOOLS MARQUEE */}
        <div className="mt-8 mb-8 relative border-y border-[rgb(var(--border))] py-6 bg-[rgba(var(--card-2),0.5)]">
          <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent z-10 pointer-events-none" />
          
          <div
            ref={scrollRef}
            className="flex gap-6 w-full overflow-x-auto snap-x px-8 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
            onTouchStart={() => (isHovered.current = true)}
            onTouchEnd={() => (isHovered.current = false)}
          >
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <a href="https://ui.toolmate.co.in" target="_blank" rel="noopener noreferrer" className="block min-w-[320px] md:min-w-[400px] snap-center shrink-0">
                  <Card className="p-5 h-full transition hover:shadow-[var(--shadow-md)] border-[rgba(var(--accent),0.3)] bg-[rgba(var(--accent),0.02)] group hover:border-[rgba(var(--accent),0.6)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-lg">Toolmate UI</div>
                      <Badge className="bg-[rgb(var(--accent))] text-white border-transparent">Featured</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))] line-clamp-2">
                      Beautifully designed, accessible, and customizable React components and templates.
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-[rgb(var(--accent))] group-hover:underline">
                      Explore Toolmate UI ↗
                    </div>
                  </Card>
                </a>
                
                <a href="https://resume.toolmate.co.in" target="_blank" rel="noopener noreferrer" className="block min-w-[320px] md:min-w-[400px] snap-center shrink-0">
                  <Card className="p-5 h-full transition hover:shadow-[var(--shadow-md)] border-[rgba(var(--accent),0.3)] bg-[rgba(var(--accent),0.02)] group hover:border-[rgba(var(--accent),0.6)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-lg">Toolmate Resume Builder</div>
                      <Badge className="bg-[rgb(var(--accent))] text-white border-transparent">Featured</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))] line-clamp-2">
                      Build ATS-friendly, professional resumes in minutes with our drag-and-drop builder.
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-[rgb(var(--accent))] group-hover:underline">
                      Build Your Resume ↗
                    </div>
                  </Card>
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.05 },
            },
          }}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((t) => (
            <motion.div
              key={t.slug}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: "easeOut" },
                },
              }}
            >
              <Link href={`/tools/${t.slug}`}>
                <Card className="group p-4 transition hover:shadow-[var(--shadow-md)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium leading-snug">{t.name}</div>
                    <Badge>{t.category}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                    {t.shortDescription}
                  </p>

                  {t.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {t.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} className="opacity-80">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm underline opacity-0 transition group-hover:opacity-80">
                      Open →
                    </span>
                    <motion.span
                      className="h-8 w-8 rounded-[var(--radius)] bg-[rgba(var(--accent),0.16)]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
