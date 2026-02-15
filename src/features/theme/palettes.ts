export type Palette =
  | "slate"
  | "ocean"
  | "forest"
  | "sunset"
  | "rose"
  | "grape"
  | "lime"
  | "mono";

export const PALETTES: { id: Palette; label: string }[] = [
  { id: "slate", label: "Slate" },
  { id: "ocean", label: "Ocean" },
  { id: "forest", label: "Forest" },
  { id: "sunset", label: "Sunset" },
  { id: "rose", label: "Rose" },
  { id: "grape", label: "Grape" },
  { id: "lime", label: "Lime" },
  { id: "mono", label: "Mono" },
];
