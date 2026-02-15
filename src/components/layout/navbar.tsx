"use client";

import Link from "next/link";
import { ThemePanel } from "@/features/theme/theme-panel";
import { Button } from "@/components/ui/button";
import React from "react";

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgba(var(--bg),0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          ToolMate
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/tools" className="text-sm opacity-80 hover:opacity-100">
            Tools
          </Link>

          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOpen((v) => !v)}
            >
              Theme
            </Button>

            {open && (
              <div
                className="absolute right-0 mt-2"
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
