"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const PRETTIER_OPTIONS: ConfigOption[] = [
  {
    id: "semi",
    name: "Semicolons",
    key: "semi: true",
    category: "Formatting",
    description: "Print semicolons at the ends of statements.",
    whyItHelps: "Prevents subtle Automatic Semicolon Insertion (ASI) runtime bugs when lines begin with parentheses or array brackets.",
    example: "const a = 1;\nconst b = 2;",
    defaultChecked: true,
  },
  {
    id: "singleQuote",
    name: "Single Quotes (JS/TS)",
    key: "singleQuote: true",
    category: "Quotes",
    description: "Use single quotes instead of double quotes in JavaScript and TypeScript files.",
    whyItHelps: "Reduces visual noise, matches standard JavaScript idioms, and avoids escaping single quotes in HTML strings.",
    example: "const message = 'Hello world';",
    defaultChecked: true,
  },
  {
    id: "jsxSingleQuote",
    name: "Single Quotes in JSX",
    key: "jsxSingleQuote: false",
    category: "Quotes",
    description: "Use single quotes instead of double quotes in JSX attributes.",
    whyItHelps: "Most React style guides prefer double quotes in JSX to mirror standard HTML attribute conventions (e.g., class=\"btn\").",
    example: "<Button variant=\"primary\" />",
    defaultChecked: false,
  },
  {
    id: "trailingCommaAll",
    name: "Trailing Commas (All)",
    key: "trailingComma: 'all'",
    category: "Formatting",
    description: "Print trailing commas wherever possible in multiline arrays, objects, function parameters, and imports.",
    whyItHelps: "Produces clean git diffs when reordering or adding new properties, eliminating merge conflicts on preceding lines.",
    example: "const obj = {\n  a: 1,\n  b: 2,\n};",
    defaultChecked: true,
  },
  {
    id: "bracketSpacing",
    name: "Bracket Spacing",
    key: "bracketSpacing: true",
    category: "Spacing",
    description: "Print spaces between brackets in object literals.",
    whyItHelps: "Significantly enhances code scanability and readability for nested data structures.",
    example: "{ foo: bar }  // vs {foo: bar}",
    defaultChecked: true,
  },
  {
    id: "bracketSameLine",
    name: "Bracket Same Line (JSX)",
    key: "bracketSameLine: false",
    category: "Formatting",
    description: "Put the > of a multi-line HTML/JSX element at the end of the last line instead of being on a new line alone.",
    whyItHelps: "Standard React conventions place the closing bracket on a new line to clearly distinguish element tags from child content.",
    example: "<Component\n  propA=\"1\"\n  propB=\"2\"\n>",
    defaultChecked: false,
  },
  {
    id: "arrowParensAlways",
    name: "Arrow Function Parentheses",
    key: "arrowParens: 'always'",
    category: "Syntax",
    description: "Always include parentheses around arrow function parameters, even with a single argument.",
    whyItHelps: "Prevents diff churn when adding TypeScript types or a second argument to an arrow function later.",
    example: "const fn = (x) => x * 2;  // vs x => x * 2",
    defaultChecked: true,
  },
  {
    id: "tabWidth4",
    name: "4-Space Indentation",
    key: "tabWidth: 4",
    category: "Spacing",
    description: "Use 4 spaces for indentation instead of the default 2 spaces.",
    whyItHelps: "Helpful for backend teams, enterprise style guides, or developers who find 2-space nesting harder to visually parse.",
    example: "function test() {\n    return true;\n}",
    defaultChecked: false,
  },
  {
    id: "useTabs",
    name: "Use Hard Tabs",
    key: "useTabs: true",
    category: "Spacing",
    description: "Indent lines with tabs instead of spaces.",
    whyItHelps: "Allows individual team members to customize their perceived indentation width in their own editor without altering repo files.",
    example: "Indent with \\t characters",
    defaultChecked: false,
  },
  {
    id: "singleAttributePerLine",
    name: "Single Attribute Per Line (JSX/HTML)",
    key: "singleAttributePerLine: true",
    category: "Formatting",
    description: "Enforce one attribute per line in HTML, Vue, and JSX templates.",
    whyItHelps: "Drastically simplifies code reviews and git diffs for components with multiple properties.",
    example: "<Card\n  id=\"card-1\"\n  title=\"Overview\"\n  variant=\"dark\"\n/>",
    defaultChecked: false,
  },
  {
    id: "endOfLineLf",
    name: "Enforce Unix Line Endings (LF)",
    key: "endOfLine: 'lf'",
    category: "System",
    description: "Enforce LF (\\n) line endings across all files.",
    whyItHelps: "Stops annoying Windows vs Linux/macOS line-ending conflicts (CRLF vs LF) from dirtying git status across teams.",
    example: "endOfLine: 'lf'",
    defaultChecked: true,
  },
  {
    id: "proseWrapAlways",
    name: "Prose Wrap (Markdown)",
    key: "proseWrap: 'always'",
    category: "Formatting",
    description: "Wrap prose in markdown documents to the configured print width.",
    whyItHelps: "Prevents infinite horizontal lines in documentation and ensures clean viewing in terminal pagers or mobile devices.",
    example: "Word wrap applied at 80/100 characters in .md files",
    defaultChecked: false,
  },
  {
    id: "printWidth100",
    name: "100-Char Print Width",
    key: "printWidth: 100",
    category: "Formatting",
    description: "Set maximum line length to 100 characters instead of 80.",
    whyItHelps: "80 characters is historically suited for punch cards. 100 characters accommodates modern wide-screen monitors comfortably.",
    example: "printWidth: 100",
    defaultChecked: true,
  },
  {
    id: "pluginTailwind",
    name: "Tailwind CSS Plugin",
    key: "prettier-plugin-tailwindcss",
    category: "Plugins",
    description: "Include prettier-plugin-tailwindcss to automatically sort CSS utility classes.",
    whyItHelps: "Enforces the official Tailwind class ordering (layout -> flexbox -> sizing -> colors), preventing debates in pull requests.",
    example: "class=\"flex items-center justify-between p-4 bg-white\"",
    defaultChecked: true,
  },
  {
    id: "pluginSortImports",
    name: "Sort Imports Plugin",
    key: "@ianvs/prettier-plugin-sort-imports",
    category: "Plugins",
    description: "Automatically sort, group, and organize import statements upon save.",
    whyItHelps: "Eliminates messy import headers by cleanly separating 3rd-party node_modules from local application modules.",
    example: "import React from 'react';\nimport { Button } from './Button';",
    defaultChecked: false,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Recommended",
    description: "Standard industry configuration (semicolons, single quotes, trailing commas, 100 print width, LF line endings)",
    optionIds: ["semi", "singleQuote", "trailingCommaAll", "bracketSpacing", "arrowParensAlways", "endOfLineLf", "printWidth100", "pluginTailwind"],
  },
  {
    id: "strict",
    name: "Strict Enterprise",
    description: "Enterprise grade with single attribute per line, sorting plugins, and LF enforcement",
    optionIds: [
      "semi",
      "singleQuote",
      "trailingCommaAll",
      "bracketSpacing",
      "arrowParensAlways",
      "endOfLineLf",
      "printWidth100",
      "singleAttributePerLine",
      "pluginTailwind",
      "pluginSortImports",
    ],
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Lightweight formatting with semicolons and trailing commas only",
    optionIds: ["semi", "trailingCommaAll", "bracketSpacing", "endOfLineLf"],
  },
];

export function PrettierConfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("json");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    PRETTIER_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return PRETTIER_OPTIONS.filter((opt) => {
      const matchesSearch =
        searchQuery === "" ||
        opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.key && opt.key.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" || opt.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const toggleOption = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedIds(new Set(preset.optionIds));
    }
  };

  const handleReset = () => {
    setSelectedIds(new Set());
  };

  // Determine active preset (if current selection matches any preset)
  const activePresetId = useMemo(() => {
    for (const p of PRESETS) {
      if (
        p.optionIds.length === selectedIds.size &&
        p.optionIds.every((id) => selectedIds.has(id))
      ) {
        return p.id;
      }
    }
    return null;
  }, [selectedIds]);

  // Packages to install based on options
  const installPackages = useMemo(() => {
    const pkgs = ["prettier"];
    if (selectedIds.has("pluginTailwind")) {
      pkgs.push("prettier-plugin-tailwindcss");
    }
    if (selectedIds.has("pluginSortImports")) {
      pkgs.push("@ianvs/prettier-plugin-sort-imports");
    }
    return pkgs;
  }, [selectedIds]);

  // Formats Generation
  const formats: OutputFormat[] = useMemo(() => {
    const configObj: Record<string, any> = {};

    if (selectedIds.has("printWidth100")) {
      configObj.printWidth = 100;
    } else {
      configObj.printWidth = 80;
    }

    if (selectedIds.has("tabWidth4")) {
      configObj.tabWidth = 4;
    } else {
      configObj.tabWidth = 2;
    }

    configObj.useTabs = selectedIds.has("useTabs");
    configObj.semi = selectedIds.has("semi");
    configObj.singleQuote = selectedIds.has("singleQuote");
    configObj.jsxSingleQuote = selectedIds.has("jsxSingleQuote");
    configObj.trailingComma = selectedIds.has("trailingCommaAll") ? "all" : "es5";
    configObj.bracketSpacing = selectedIds.has("bracketSpacing");
    configObj.bracketSameLine = selectedIds.has("bracketSameLine");
    configObj.arrowParens = selectedIds.has("arrowParensAlways") ? "always" : "avoid";

    if (selectedIds.has("endOfLineLf")) {
      configObj.endOfLine = "lf";
    }
    if (selectedIds.has("singleAttributePerLine")) {
      configObj.singleAttributePerLine = true;
    }
    if (selectedIds.has("proseWrapAlways")) {
      configObj.proseWrap = "always";
    }

    const plugins: string[] = [];
    if (selectedIds.has("pluginTailwind")) {
      plugins.push("prettier-plugin-tailwindcss");
    }
    if (selectedIds.has("pluginSortImports")) {
      plugins.push("@ianvs/prettier-plugin-sort-imports");
    }
    if (plugins.length > 0) {
      configObj.plugins = plugins;
    }

    const jsonContent = JSON.stringify(configObj, null, 2);

    const jsContent = `/** @type {import("prettier").Config} */\nconst config = ${JSON.stringify(
      configObj,
      null,
      2
    )};\n\nmodule.exports = config;\n`;

    const yamlLines = Object.entries(configObj).map(([k, v]) => {
      if (Array.isArray(v)) {
        return `${k}:\n${v.map((item) => `  - ${item}`).join("\n")}`;
      }
      return `${k}: ${typeof v === "string" ? `"${v}"` : v}`;
    });
    const yamlContent = yamlLines.join("\n") + "\n";

    const packageJsonSnippet = JSON.stringify(
      {
        name: "my-project",
        prettier: configObj,
      },
      null,
      2
    );

    const prettierIgnoreContent = `# Build & Dependency directories\nnode_modules\n.next\ndist\nbuild\ncoverage\n\n# Lockfiles\npackage-lock.json\npnpm-lock.yaml\nyarn.lock\nbun.lockb\n\n# Cache & Environment files\n.turbo\n.env*\n`;

    return [
      {
        id: "json",
        label: ".prettierrc",
        filename: ".prettierrc",
        language: "json",
        content: jsonContent,
      },
      {
        id: "js",
        label: ".prettierrc.js",
        filename: ".prettierrc.js",
        language: "javascript",
        content: jsContent,
      },
      {
        id: "yaml",
        label: ".prettierrc.yaml",
        filename: ".prettierrc.yaml",
        language: "yaml",
        content: yamlContent,
      },
      {
        id: "packagejson",
        label: "package.json",
        filename: "package.json",
        language: "json",
        content: packageJsonSnippet,
      },
      {
        id: "ignore",
        label: ".prettierignore",
        filename: ".prettierignore",
        language: "text",
        content: prettierIgnoreContent,
      },
    ];
  }, [selectedIds]);

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolSplitPane
        defaultMobileView="input"
        hasOutput={true}
        input={
          <div className="space-y-4">
            <ConfigPresetsBar
              presets={PRESETS}
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onReset={handleReset}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedCount={selectedIds.size}
              totalCount={PRETTIER_OPTIONS.length}
            />

            {/* Options List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredOptions.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-[rgb(var(--border))] text-[rgb(var(--muted))] text-xs">
                  No matching options found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <ConfigOptionCard
                    key={opt.id}
                    option={opt}
                    checked={selectedIds.has(opt.id)}
                    onToggle={toggleOption}
                  />
                ))
              )}
            </div>
          </div>
        }
        output={
          <ConfigPreviewPane
            formats={formats}
            activeFormatId={activeFormatId}
            onSelectFormat={setActiveFormatId}
            installPackages={installPackages}
            configTip="Place this .prettierrc file in the root directory of your project alongside package.json. Prettier CLI and editor extensions will automatically detect it."
          />
        }
      />
    </ToolWorkspace>
  );
}
