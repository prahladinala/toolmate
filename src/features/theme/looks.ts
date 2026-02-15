export type Look = "modern" | "retro" | "neomorphism";

export const LOOKS: { id: Look; label: string; enabled: boolean }[] = [
  { id: "modern", label: "Modern", enabled: true },
  { id: "retro", label: "Retro", enabled: true },
  { id: "neomorphism", label: "Neomorphism", enabled: true },
];
