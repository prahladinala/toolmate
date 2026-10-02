"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/features/tools/registry";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-card rounded-xl shadow-2xl border border-[rgba(var(--fg),0.1)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <Command className="flex flex-col w-full bg-card" label="Global Command Menu">
          <div className="flex items-center border-b px-4" cmdk-input-wrapper="">
            <span className="text-muted-foreground mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <Command.Input 
              autoFocus 
              placeholder="Search for tools... (e.g., json, jwt, regex)" 
              className="flex-1 h-14 bg-transparent outline-none placeholder:text-muted-foreground text-lg"
            />
            <kbd className="hidden sm:inline-flex bg-muted px-2 py-1 rounded text-xs font-mono font-bold text-muted-foreground border">ESC</kbd>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-none">
            <Command.Empty className="p-4 text-center text-sm text-muted-foreground">
              No tools found.
            </Command.Empty>

            <Command.Group heading="All Tools" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest p-2">
              {TOOLS.map((tool) => (
                <Command.Item
                  key={tool.slug}
                  value={tool.name + " " + tool.category + " " + tool.tags.join(" ")}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/tools/${tool.slug}`);
                  }}
                  className="flex flex-col p-3 rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground data-[selected=true]:bg-muted hover:bg-muted"
                >
                  <div className="font-semibold text-sm text-foreground">{tool.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{tool.shortDescription}</div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
