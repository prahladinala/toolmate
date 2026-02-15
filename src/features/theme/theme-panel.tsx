"use client";

import React from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "./theme-provider";
import { LOOKS } from "./looks";
import { PALETTES } from "./palettes";
import { Button } from "@/components/ui/button";
import type { Mode } from "./theme-config";

export function ThemePanel() {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-[300px] rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-md)]"
    >
      <div className="text-sm font-semibold">Theme</div>

      {/* LOOK */}
      <motion.div
        className="mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <div className="text-xs text-[rgb(var(--muted))]">Look</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOOKS.filter((l) => l.enabled).map((l) => (
            <motion.div
              key={l.id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <Button
                size="sm"
                variant={theme.look === l.id ? "primary" : "secondary"}
                onClick={() => setTheme({ ...theme, look: l.id })}
              >
                {l.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PALETTE */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-xs text-[rgb(var(--muted))]">Palette</div>

        <div className="mt-2 flex flex-wrap gap-2">
          {PALETTES.map((p) => (
            <motion.div
              key={p.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              className="w-[calc(50%-4px)]"
            >
              <Button
                size="sm"
                className="w-full"
                variant={theme.palette === p.id ? "primary" : "secondary"}
                onClick={() => setTheme({ ...theme, palette: p.id })}
              >
                {p.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MODE */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="text-xs text-[rgb(var(--muted))]">Mode</div>
        <div className="mt-2 flex gap-2">
          {(["system", "light", "dark"] as Mode[]).map((m) => (
            <motion.div
              key={m}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <Button
                size="sm"
                variant={theme.mode === m ? "primary" : "secondary"}
                onClick={() => setTheme({ ...theme, mode: m })}
              >
                {m}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PREVIEW */}
      <motion.div
        className="mt-4 rounded-[var(--radius)] border border-[rgb(var(--border))] p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-xs text-[rgb(var(--muted))]">Preview</div>
        <div className="mt-2 flex gap-2">
          <motion.span
            layout
            className="h-8 w-8 rounded-[var(--radius)] bg-[rgb(var(--accent))]"
          />
          <motion.span
            layout
            className="h-8 w-8 rounded-[var(--radius)] bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
