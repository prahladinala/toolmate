export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export type ConfigOption = {
  id: string;
  name: string;
  key?: string;
  category: string;
  description: string;
  whyItHelps: string;
  example?: string;
  defaultChecked?: boolean;
  strictOnly?: boolean;
  tags?: string[];
};

export type ConfigPreset = {
  id: string;
  name: string;
  description: string;
  optionIds: string[];
};

export type OutputFormat = {
  id: string;
  label: string;
  filename: string;
  language: "json" | "javascript" | "typescript" | "yaml" | "css" | "markdown" | "text";
  content: string;
};
