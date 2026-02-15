"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { getRecentTools, type RecentTool } from "@/features/tools/recent";

type Tool = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  tags?: string[];
};

const ALL = "All";

function uniqCategories(tools: Tool[]) {
  const set = new Set<string>();
  tools.forEach((t) => set.add(t.category));
  return [ALL, ...Array.from(set).sort()];
}

function useDebounced<T>(value: T, ms = 120) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

function scoreMatch(tool: Tool, q: string) {
  if (!q) return 1;
  const s = q.toLowerCase();
  const name = tool.name.toLowerCase();
  const slug = tool.slug.toLowerCase();
  const cat = tool.category.toLowerCase();
  const desc = tool.shortDescription.toLowerCase();
  const tags = (tool.tags ?? []).join(" ").toLowerCase();

  // Simple relevance scoring
  let score = 0;
  if (name.includes(s)) score += 5;
  if (slug.includes(s)) score += 3;
  if (cat.includes(s)) score += 2;
  if (tags.includes(s)) score += 2;
  if (desc.includes(s)) score += 1;
  return score;
}

export function ToolsExplorer({ tools }: { tools: Tool[] }) {
  const categories = React.useMemo(() => uniqCategories(tools), [tools]);

  const [query, setQuery] = React.useState("");
  const q = useDebounced(query, 120);

  const [category, setCategory] = React.useState<string>(ALL);
  const [recent, setRecent] = React.useState<RecentTool[]>([]);

  React.useEffect(() => {
    setRecent(getRecentTools());
  }, []);

  const filtered = React.useMemo(() => {
    const base =
      category === ALL ? tools : tools.filter((t) => t.category === category);

    const scored = base
      .map((t) => ({ t, score: scoreMatch(t, q.trim()) }))
      .filter((x) => (q.trim() ? x.score > 0 : true))
      .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name))
      .map((x) => x.t);

    return scored;
  }, [tools, category, q]);

  const showRecent = recent.length > 0 && !q.trim() && category === ALL;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tools</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Search, filter by category, and pick up where you left off.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setQuery("");
              setCategory(ALL);
            }}
          >
            Reset
          </Button>

          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 text-sm font-medium hover:bg-[rgb(var(--card-2))] transition"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card className="mt-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="text-xs text-[rgb(var(--muted))]">Search</div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools (json, base64, uuid, password...)"
              className="mt-1"
            />
          </div>

          <div className="min-w-[180px]">
            <div className="text-xs text-[rgb(var(--muted))]">Results</div>
            <div className="mt-1 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-3 py-2 text-sm">
              {filtered.length} tools
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  "border-[rgb(var(--border))]",
                  active
                    ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-accent))]"
                    : "bg-[rgba(var(--fg),0.03)] text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.06)]",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Recently visited */}
      {showRecent ? (
        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recently visited</h2>
              <p className="text-sm text-[rgb(var(--muted))]">
                Quick access to tools you opened recently.
              </p>
            </div>

            <button
              className="text-sm underline text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              onClick={() => {
                // soft clear: just clear local storage key
                localStorage.removeItem("toolmate:recent:v1");
                setRecent([]);
              }}
            >
              Clear
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.slice(0, 6).map((r) => (
              <Link key={r.slug} href={`/tools/${r.slug}`}>
                <Card className="p-4 hover:shadow-[var(--shadow-md)] transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium leading-snug">{r.name}</div>
                    <Badge>{r.category}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-[rgb(var(--muted))]">
                    Opened recently
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Tool grid */}
      <section className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {q.trim()
                ? `Search results for “${q.trim()}”`
                : category === ALL
                  ? "All tools"
                  : category}
            </h2>
            <p className="text-sm text-[rgb(var(--muted))]">
              {q.trim()
                ? "Refined matches, ordered by relevance."
                : "Pick a tool to open its dedicated page."}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <Card className="mt-4 p-6">
            <div className="text-lg font-semibold">No matches</div>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Try a different keyword (e.g. “json”, “encode”, “generator”), or
              reset filters.
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => setQuery("")}>Clear search</Button>
              <Button variant="secondary" onClick={() => setCategory(ALL)}>
                Show all
              </Button>
            </div>
          </Card>
        ) : (
          <motion.div
            className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((t) => (
                <motion.div
                  key={t.slug}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Link href={`/tools/${t.slug}`}>
                    <Card className="group p-4 transition hover:shadow-[var(--shadow-md)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium leading-snug">{t.name}</div>
                        <Badge>{t.category}</Badge>
                      </div>

                      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                        {t.shortDescription}
                      </p>

                      {t.tags?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {t.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} className="opacity-80">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm underline opacity-0 transition group-hover:opacity-80">
                          Open →
                        </span>
                        <span className="h-8 w-8 rounded-[var(--radius)] bg-[rgba(var(--accent),0.16)] transition group-hover:scale-105" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* SEO footer text */}
      <section className="mt-10 border-t border-[rgb(var(--border))] pt-6">
        <p className="text-sm text-[rgb(var(--muted))]">
          ToolMate tools run in your browser. Most utilities work locally
          without uploading your data.
        </p>
      </section>
    </main>
  );
}
