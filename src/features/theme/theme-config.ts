import type { Look } from "./looks";
import type { Palette } from "./palettes";

export type Mode = "system" | "light" | "dark";

export type ThemeState = {
  look: Look;
  palette: Palette;
  mode: Mode;
};

export const THEME_STORAGE_KEY = "toolmate:theme:v1";

export const DEFAULT_THEME: ThemeState = {
  look: "modern",
  palette: "slate",
  mode: "system",
};
