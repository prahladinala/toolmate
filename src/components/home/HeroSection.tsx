"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "@/components/motion/motion";
import { TryLastToolCta } from "@/components/home/TryLastToolCta";

const WORDS = [
  "Developer Arsenal",
  "Frontend Utilities",
  "Backend Swiss Knife",
  "Design Sandbox"
];

function Typewriter() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[index];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length <= 1) {
          setIsDeleting(false);
          setIndex((index + 1) % WORDS.length);
        }
      }, 30); // slightly faster deletion
    } else {
      if (text === currentWord) {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, 70); // slightly faster typing
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  return (
    <>
      {text}
      <span className="inline-block w-[3px] h-[0.9em] bg-indigo-500 ml-1 align-middle animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-sm relative -top-[2px]"></span>
    </>
  );
}

export default function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[rgb(var(--border))] min-h-[85vh] flex flex-col justify-center bg-[rgb(var(--bg))]">
        
        {/* Modern Background Grid & Glow Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          {/* Subtle Grid */}
          <div 
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(var(--fg), 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--fg), 0.1) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
            }}
          />
          {/* Ambient Glows */}
          <div className="absolute top-0 -translate-y-12 w-[600px] h-[400px] bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-0 translate-x-1/3 w-[400px] h-[400px] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-24 relative z-10 text-center flex flex-col items-center w-full">
          
          {/* Modern Glassy Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group inline-flex items-center gap-2.5 rounded-full border border-[rgba(var(--fg),0.1)] bg-[rgba(var(--card),0.4)] px-4 py-1.5 text-xs font-medium backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-[rgba(var(--fg),0.2)] transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[rgb(var(--fg))] opacity-80 group-hover:opacity-100 transition-opacity">
              All your everyday tools in one place
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-8 text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-[rgb(var(--fg))]"
            style={{ lineHeight: 1.1 }}
          >
            Hi, I'm ToolMate <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
              <Typewriter />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-[rgb(var(--muted))] max-w-2xl mx-auto font-medium"
          >
            Format, convert, generate, and inspect — with a minimal UI,
            mobile-first design, and lightning-fast performance.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/tools"
              className="group relative w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-[rgb(var(--fg))] px-8 text-sm font-semibold text-[rgb(var(--bg))] transition-all duration-300 hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--fg),0.5)] hover:scale-[1.02]"
            >
              <span>Browse all tools</span>
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            {/* Force the TryLastToolCta to look like a modern secondary pill button */}
            <div className="w-full sm:w-auto [&>a]:h-12 [&>a]:flex [&>a]:items-center [&>a]:justify-center [&>a]:rounded-full [&>a]:px-8 [&>a]:bg-transparent [&>a]:border [&>a]:border-[rgba(var(--fg),0.1)] [&>a]:text-[rgb(var(--fg))] [&>a]:hover:bg-[rgba(var(--fg),0.03)] [&>a]:shadow-none [&>a]:transition-all [&>a]:duration-300 [&>a]:hover:border-[rgba(var(--fg),0.2)]">
              <TryLastToolCta
                fallbackHref="/tools/json-formatter"
                fallbackLabel="Try JSON Formatter ↓"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-[rgb(var(--muted))] font-medium tracking-wide"
          >
            {["Mobile-first", "Accessible", "Local-first", "SEO-ready"].map(
              (x) => (
                <span
                  key={x}
                  className="rounded-full border border-[rgba(var(--fg),0.08)] bg-[rgba(var(--fg),0.02)] px-4 py-1.5 backdrop-blur-md"
                >
                  {x}
                </span>
              ),
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
