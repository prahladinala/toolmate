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
          ? "bg-[rgba(var(--bg),0.7)] backdrop-blur-xl border-b border-[rgba(var(--fg),0.05)] shadow-sm" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 transition-all duration-300">
        <Link href="/" className="font-extrabold text-lg tracking-tight">
          ToolMate.
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/tools" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            Tools
          </Link>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-[rgba(var(--fg),0.04)] hover:bg-[rgba(var(--fg),0.08)] transition-colors border border-[rgba(var(--fg),0.1)]"
              aria-label="Toggle theme"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>

            {open && (
              <div
                className="absolute right-0 mt-3"
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
