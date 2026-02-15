"use client";

import { safeStorage } from "@/lib/storage/safe-storage";

export function makeToolStorageKey(slug: string) {
  return `toolmate:tool:${slug}:v1`;
}

export function loadToolState<T>(slug: string, fallback: T): T {
  const raw = safeStorage.get(makeToolStorageKey(slug));
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToolState<T>(slug: string, state: T) {
  safeStorage.set(makeToolStorageKey(slug), JSON.stringify(state));
}
