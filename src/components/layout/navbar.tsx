"use client";

import Link from "next/link";
import { ThemePanel } from "@/features/theme/theme-panel";
import React, { useState, useEffect } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[rgba(var(--bg),0.8)] backdrop-blur-xl border-b border-[rgba(var(--fg),0.06)] shadow-sm" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 transition-all duration-300">
        <Link href="/" className="font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            T
          </span>
          <span className="text-[rgb(var(--fg))]">ToolMate<span className="text-indigo-500">.</span></span>
        </Link>

        <nav className="flex items-center gap-2.5 sm:gap-6">
          <Link href="/tools" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity px-2.5 py-1.5 rounded-lg hover:bg-[rgba(var(--fg),0.04)]">
            Tools
          </Link>
          <a 
            href="https://resume.toolmate.co.in" 
            target="_blank" 
            rel="noopener" 
            title="ToolMate Resume — Free Resume Builder"
            className="hidden sm:inline-flex items-center text-sm font-medium opacity-70 hover:opacity-100 hover:text-indigo-500 transition-all px-2.5 py-1.5 rounded-lg hover:bg-[rgba(var(--fg),0.04)]"
          >
            Resume
          </a>
          <a 
            href="https://ui.toolmate.co.in" 
            target="_blank" 
            rel="noopener" 
            title="ToolMate UI — Modern Component Library"
            className="hidden sm:inline-flex items-center text-sm font-medium opacity-70 hover:opacity-100 hover:text-indigo-500 transition-all px-2.5 py-1.5 rounded-lg hover:bg-[rgba(var(--fg),0.04)]"
          >
            UI Kit
          </a>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-[rgba(var(--fg),0.04)] hover:bg-[rgba(var(--fg),0.08)] transition-colors border border-[rgba(var(--fg),0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Toggle theme"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>

            {open && (
              <div
                className="absolute right-0 mt-3 z-50 max-w-[calc(100vw-2rem)]"
                onMouseLeave={() => setOpen(false)}
              >
                <ThemePanel />
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
