"use client";

import React from "react";
import Link from "next/link";
import { getRecentTools } from "@/features/tools/recent";
import { TOOLS } from "@/features/tools/registry";

type QuickTool = {
  slug: string;
  name: string;
  category: string;
  shortDescription?: string;
};

function buildQuickList(max = 2): QuickTool[] {
  const recent = getRecentTools();
  console.log("Recent tools:", recent);
  // Skip most recent (index 0) because CTA button uses it.
  // Take only next two: 2nd and 3rd most recent.
  const recentPicks: QuickTool[] = (recent ?? []).slice(1, 3).map((r) => ({
    slug: r.slug,
    name: r.name,
    category: r.category,
    shortDescription: r.shortDescription,
  }));

  const used = new Set<string>();
  if (recent?.[0]?.slug) used.add(recent[0].slug);
  recentPicks.forEach((t) => used.add(t.slug));

  const needed = Math.max(0, max - recentPicks.length);

  const fallbacks: QuickTool[] = TOOLS.filter((t) => !used.has(t.slug))
    .slice(0, needed)
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      category: t.category,
      shortDescription: t.shortDescription,
    }));

  return [...recentPicks, ...fallbacks].slice(0, max);
}

export function QuickActionsCard() {
  const [items, setItems] = React.useState<QuickTool[]>([]);

  const refresh = React.useCallback(() => {
    setItems(buildQuickList(2));
  }, []);
  console.log("QuickActionsCard rendered with items:", items);
  React.useEffect(() => {
    refresh();

    // Update if another tab changes localStorage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "toolmate:recent:v1") refresh();
    };
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-[var(--shadow-lg)] p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-[rgb(var(--muted))]">Quick actions</div>
        <Link
          href="/tools"
          className="text-xs underline text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition"
        >
          View all
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {items.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="group">
            <div
              className="
                rounded-[var(--radius)] border border-[rgb(var(--border))]
                bg-[rgb(var(--card-2))] p-3 transition
                hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent),0.08)]
                group-hover:shadow-[var(--shadow-md)]
              "
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium leading-snug">{t.name}</div>
                <span className="rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--fg),0.03)] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">
                  {t.category}
                </span>
              </div>

              <div className="mt-1 text-xs text-[rgb(var(--muted))] line-clamp-2">
                {t.shortDescription ?? "Open tool"}
              </div>

              <div className="mt-2 text-xs underline opacity-0 transition group-hover:opacity-80 group-hover:text-[rgb(var(--accent))]">
                Open →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
