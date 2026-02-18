"use client";
import Link from "next/link";
import { motion } from "@/components/motion/motion";
import { QuickActionsCard } from "@/components/home/QuickActionsCard";
import { TryLastToolCta } from "@/components/home/TryLastToolCta";

export default function HeroSection() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[rgb(var(--border))]">
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 0%, rgba(var(--accent), 0.20), transparent 60%)",
          }}
        />

        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-grid" />

        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 relative">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--fg),0.03)] px-3 py-1 text-xs"
            >
              <span className="font-medium">ToolMate</span>
              <span className="opacity-60">•</span>
              <span className="text-[rgb(var(--muted))]">
                Everyday tools, in one place.
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
              className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Fast browser tools.
              <span className="block text-[rgb(var(--muted))] font-medium">
                Built for devs — friendly for everyone.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.14 }}
              className="mt-4 text-base text-[rgb(var(--muted))] sm:text-lg"
            >
              Format, convert, generate, and inspect — with a clean UI,
              mobile-first design, and SEO-friendly pages.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/tools"
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius)] bg-[rgb(var(--accent))] px-5 text-sm font-medium text-[rgb(var(--on-accent))] shadow-[var(--shadow-sm)] hover:bg-[rgb(var(--accent-2))] transition"
              >
                Browse tools
              </Link>

              <TryLastToolCta
                fallbackHref="/tools/json-formatter"
                fallbackLabel="Try JSON Formatter →"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.28 }}
              className="mt-8 flex flex-wrap gap-2 text-xs text-[rgb(var(--muted))]"
            >
              {["Mobile-first", "Accessible", "Local-first", "SEO-ready"].map(
                (x) => (
                  <span
                    key={x}
                    className="rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--fg),0.03)] px-3 py-1"
                  >
                    {x}
                  </span>
                ),
              )}
            </motion.div>
          </div>
          {/* Floating preview card */}
          <motion.div
            initial={{ opacity: 0, y: 18, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
            className="hidden lg:block absolute right-4 top-16 w-[360px]"
          >
            <QuickActionsCard />
          </motion.div>
        </div>
      </section>
    </>
  );
}
