"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "./theme-provider";
import type { Mode } from "./theme-config";

export function ThemePanel() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  
  const modes: { id: Mode; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )
    },
    {
      id: "dark",
      label: "Dark",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    },
    {
      id: "system",
      label: "System",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-36 rounded-2xl border border-[rgba(var(--fg),0.08)] bg-[rgb(var(--card))] p-1.5 shadow-xl backdrop-blur-xl"
    >
      <div className="flex flex-col gap-0.5">
        {modes.map((m) => {
          const isActive = theme.mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setTheme({ ...theme, mode: m.id })}
              className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive 
                  ? "bg-[rgba(var(--fg),0.05)] text-[rgb(var(--fg))]" 
                  : "text-[rgb(var(--muted))] hover:bg-[rgba(var(--fg),0.03)] hover:text-[rgb(var(--fg))]"
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
