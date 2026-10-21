export const CATEGORIES = [
  "Developer",
  "Converters",
  "Generators",
  "Information",
  "Design",
  "Security",
  "PDF",
  "Images",
] as const;
export type Category = (typeof CATEGORIES)[number];
