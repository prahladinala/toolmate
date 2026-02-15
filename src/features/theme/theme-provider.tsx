"use client";

import React from "react";
import { safeStorage } from "@/lib/storage/safe-storage";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ThemeState,
} from "./theme-config";

function applyTheme(state: ThemeState) {
  const html = document.documentElement;

  html.dataset.look = state.look;
  html.dataset.palette = state.palette;

  const mode =
    state.mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : state.mode;

  html.classList.toggle("dark", mode === "dark");
}

export const ThemeContext = React.createContext<{
  theme: ThemeState;
  setTheme: (next: ThemeState) => void;
}>({ theme: DEFAULT_THEME, setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeState>(DEFAULT_THEME);

  React.useEffect(() => {
    const raw = safeStorage.get(THEME_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ThemeState) : DEFAULT_THEME;
    setThemeState(parsed);
  }, []);

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    if (theme.mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(theme);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [theme]);

  const setTheme = (next: ThemeState) => {
    setThemeState(next);
    safeStorage.set(THEME_STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
