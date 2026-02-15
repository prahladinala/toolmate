"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { safeStorage } from "@/lib/storage/safe-storage";

type Tool = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  tags?: string[];
};

const INTEREST_KEY = "toolmate:interest:v1";

function addInterest(slug: string) {
  const raw = safeStorage.get(INTEREST_KEY);
  const list = raw ? (JSON.parse(raw) as string[]) : [];
  const next = Array.from(new Set([slug, ...list])).slice(0, 50);
  safeStorage.set(INTEREST_KEY, JSON.stringify(next));
  return next;
}

function shimmerStyle() {
  return {
    background:
      "linear-gradient(90deg, rgba(var(--accent),0.10), rgba(var(--accent),0.28), rgba(var(--accent),0.10))",
    backgroundSize: "200% 100%",
    animation: "toolmateShimmer 2.2s ease-in-out infinite",
  } as React.CSSProperties;
}

export function ToolNotImplemented({
  tool,
  suggestions,
}: {
  tool: Tool;
  suggestions: Tool[];
}) {
  const [saved, setSaved] = React.useState(false);

  const copyRequest = async () => {
    const text = `Tool request: ${tool.name}
Slug: ${tool.slug}
Category: ${tool.category}

What I want:
- Inputs:
- Outputs:
- Edge cases:
- UX preferences:
- Example:
`;
    await navigator.clipboard.writeText(text);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const notifyMe = () => {
    addInterest(tool.slug);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Keyframes */}
      <style>{`
        @keyframes toolmateShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-[var(--shadow-lg)]">
        {/* glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(var(--accent),0.30), transparent 70%)",
          }}
        />

        {/* top shimmer bar */}
        <div className="h-1.5 w-full" style={shimmerStyle()} />

        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--fg),0.03)] px-3 py-1 text-xs">
              <span className="font-medium">Coming soon</span>
              <span className="opacity-60">•</span>
              <span className="text-[rgb(var(--muted))]">{tool.category}</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {tool.name}
            </h1>

            <p className="mt-3 text-sm text-[rgb(var(--muted))] sm:text-base">
              This tool is on the roadmap. Meanwhile, you can request priority
              features or jump to similar tools.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {/* <Button onClick={copyRequest}>
                {saved ? "Copied ✅" : "Request this tool"}
              </Button>

              <Button variant="secondary" onClick={notifyMe}>
                {saved ? "Saved ✅" : "Notify me (local)"}
              </Button> */}

              <Link
                href="/tools"
                className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 text-sm font-medium hover:bg-[rgb(var(--card-2))] transition"
              >
                Browse tools
              </Link>
            </div>

            {tool.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {tool.tags.map((t) => (
                  <Badge key={t} className="opacity-80">
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          {/* Illustration */}
          {/* <div className="relative">
            <div
              className="mx-auto aspect-square w-full max-w-[320px] rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] shadow-[var(--shadow-md)]"
              style={{ animation: "floaty 3.2s ease-in-out infinite" }}
            >
              <div className="p-5">
                <div className="h-3 w-24 rounded-full bg-[rgba(var(--fg),0.10)]" />
                <div className="mt-3 h-10 rounded-[var(--radius)] bg-[rgba(var(--fg),0.06)]" />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-[var(--radius)] bg-[rgba(var(--accent),0.16)]" />
                  <div className="h-16 rounded-[var(--radius)] bg-[rgba(var(--fg),0.06)]" />
                </div>
                <div className="mt-3 h-24 rounded-[var(--radius)] bg-[rgba(var(--fg),0.06)]" />
                <div className="mt-3 h-2 w-2/3 rounded-full bg-[rgba(var(--accent),0.30)]" />
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-[rgb(var(--muted))]">
              Theme-aware preview • works with light/dark/look/palette
            </div>
          </div> */}
        </div>
      </section>

      {/* Suggestions */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Try these instead</h2>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Similar tools you can use right now.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm underline text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`}>
              <Card className="group p-4 transition hover:shadow-[var(--shadow-md)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium leading-snug">{t.name}</div>
                  <Badge>{t.category}</Badge>
                </div>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                  {t.shortDescription}
                </p>
                <div className="mt-4 text-sm underline opacity-0 transition group-hover:opacity-80">
                  Open →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
