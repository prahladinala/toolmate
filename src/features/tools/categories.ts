export const CATEGORIES = [
  "Developer",
  "Converters",
  "Generators",
  "Information",
  "Design",
  "Security",
] as const;
export type Category = (typeof CATEGORIES)[number];
