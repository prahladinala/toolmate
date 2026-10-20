"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CommandDialog = dynamic(
  () => import("./CommandDialog").then((mod) => mod.CommandDialog),
  { ssr: false }
);

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return <CommandDialog onClose={() => setOpen(false)} />;
}
