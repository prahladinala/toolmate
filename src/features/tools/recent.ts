"use client";

import { safeStorage } from "@/lib/storage/safe-storage";

const KEY = "toolmate:recent:v1";
const MAX = 12;

export type RecentTool = {
  shortDescription: string;
  slug: string;
  name: string;
  category: string;
  at: number; // timestamp
};

function read(): RecentTool[] {
  const raw = safeStorage.get(KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as RecentTool[];
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x?.slug && x?.name)
      .sort((a, b) => (b.at ?? 0) - (a.at ?? 0))
      .slice(0, MAX);
  } catch {
    return [];
  }
}

function write(list: RecentTool[]) {
  safeStorage.set(KEY, JSON.stringify(list.slice(0, MAX)));
}

export function addRecentTool(item: Omit<RecentTool, "at">) {
  const list = read();
  const next: RecentTool[] = [
    { ...item, at: Date.now() },
    ...list.filter((x) => x.slug !== item.slug),
  ];
  write(next);
}

export function getRecentTools() {
  return read();
}
