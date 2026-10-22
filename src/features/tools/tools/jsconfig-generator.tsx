"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const JSCONFIG_OPTIONS: ConfigOption[] = [
  // Type Checking & Analysis
  {
    id: "checkJs",
    name: "Type-Check JavaScript (checkJs)",
    key: "compilerOptions.checkJs: true",
    category: "Type Checking",
    description: "Enable TypeScript type checking in plain JavaScript files using JSDoc annotations.",
    whyItHelps: "Catches typos, wrong parameter counts, and property access errors in plain JS without compiling with tsc.",
    example: "/** @param {string} name */\nfunction greet(name) { ... }",
    defaultChecked: false,
  },
  {
    id: "pathAliases",
    name: "Root Path Aliases (@/*)",
    key: "compilerOptions.paths: { '@/*': ['./src/*'] }",
    category: "Paths & Resolution",
    description: "Map '@/*' path aliases to './src/*' for VS Code autocomplete and Go To Definition.",
    whyItHelps: "Enables instant auto-import and code navigation for aliased imports without broken module warnings.",
    example: "import { Header } from '@/components/Header';",
    defaultChecked: true,
  },
  {
    id: "baseUrl",
    name: "Base URL Resolution",
    key: "compilerOptions.baseUrl: '.'",
    category: "Paths & Resolution",
    description: "Base directory to resolve non-absolute module names.",
    whyItHelps: "Required when specifying path mappings or resolving imports relative to root.",
    example: "baseUrl: '.'",
    defaultChecked: true,
  },
  {
    id: "jsxReact",
    name: "React JSX Support",
    key: "compilerOptions.jsx: 'react-jsx'",
    category: "Frameworks",
    description: "Enable modern React JSX syntax parsing and IntelliSense.",
    whyItHelps: "Ensures VS Code recognizes JSX tags and props inside .jsx and .js files with full autocomplete.",
    example: "<Button variant=\"primary\" onClick={handleClick} />",
    defaultChecked: true,
  },
  {
    id: "targetES2022",
    name: "Target ES2022 Syntax",
    key: "compilerOptions.target: 'ES2022'",
    category: "Compiler",
    description: "Specify ECMAScript target version for autocomplete and language features.",
    whyItHelps: "Tells VS Code your runtime supports modern syntax like top-level await, optional chaining, and private fields.",
    example: "const data = await fetch('/api')?.json();",
    defaultChecked: true,
  },
  {
    id: "moduleResolutionBundler",
    name: "Bundler Module Resolution",
    key: "compilerOptions.moduleResolution: 'bundler'",
    category: "Compiler",
    description: "Use bundler resolution matching Vite, Next.js, and Webpack 5.",
    whyItHelps: "Matches the resolution algorithm used by modern frontend toolchains.",
    example: "moduleResolution: 'bundler'",
    defaultChecked: true,
  },
  {
    id: "includeSrc",
    name: "Include 'src' Directory",
    key: "include: ['src/**/*']",
    category: "Scope",
    description: "Limit language server scanning to files in your src folder.",
    whyItHelps: "Prevents editor lag by stopping VS Code from indexing non-code assets and build outputs.",
    example: "include: ['src/**/*']",
    defaultChecked: true,
  },
  {
    id: "excludeNodeModules",
    name: "Exclude node_modules & Build Dirs",
    key: "exclude: ['node_modules', 'dist']",
    category: "Scope",
    description: "Exclude third-party dependency folders from type-checking and search.",
    whyItHelps: "Saves massive amounts of memory and prevents IDE slowdowns in large projects.",
    example: "exclude: ['node_modules', 'dist', '.next']",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Modern React / Vite JS",
    description: "Standard configuration for modern React, Vite, and Next.js JavaScript projects",
    optionIds: [
      "pathAliases",
      "baseUrl",
      "jsxReact",
      "targetES2022",
      "moduleResolutionBundler",
      "includeSrc",
      "excludeNodeModules",
    ],
  },
  {
    id: "strict",
    name: "Type-Checked JS (JSDoc)",
    description: "Brings TypeScript-level safety to JavaScript using checkJs and strict JSDoc",
    optionIds: [
      "checkJs",
      "pathAliases",
      "baseUrl",
      "jsxReact",
      "targetES2022",
      "moduleResolutionBundler",
      "includeSrc",
      "excludeNodeModules",
    ],
  },
  {
    id: "minimal",
    name: "Clean Node.js",
    description: "Minimal setup for Node.js backends and API scripts",
    optionIds: ["targetES2022", "baseUrl", "pathAliases", "excludeNodeModules"],
  },
];

export function JsconfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("standard");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    JSCONFIG_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return JSCONFIG_OPTIONS.filter((opt) => {
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

  const formats: OutputFormat[] = useMemo(() => {
    const compilerOptions: Record<string, any> = {
      target: selectedIds.has("targetES2022") ? "ES2022" : "ES2020",
      module: "esnext",
      moduleResolution: selectedIds.has("moduleResolutionBundler")
        ? "bundler"
        : "node",
    };

    if (selectedIds.has("checkJs")) {
      compilerOptions.checkJs = true;
    }

    if (selectedIds.has("jsxReact")) {
      compilerOptions.jsx = "react-jsx";
    }

    if (selectedIds.has("baseUrl")) {
      compilerOptions.baseUrl = ".";
    }

    if (selectedIds.has("pathAliases")) {
      compilerOptions.paths = {
        "@/*": ["./src/*"],
      };
    }

    const configObj: Record<string, any> = {
      compilerOptions,
    };

    if (selectedIds.has("includeSrc")) {
      configObj.include = ["src/**/*"];
    }

    if (selectedIds.has("excludeNodeModules")) {
      configObj.exclude = ["node_modules", "dist", ".next", "build"];
    }

    return [
      {
        id: "standard",
        label: "jsconfig.json",
        filename: "jsconfig.json",
        language: "json",
        content: JSON.stringify(configObj, null, 2),
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
              totalCount={JSCONFIG_OPTIONS.length}
            />

            {/* Options List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto scrollbar-refined pr-2">
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
            configTip="Place jsconfig.json in your project root. VS Code will immediately recognize your path aliases (@/*) and provide accurate auto-complete and navigation across all JavaScript files."
          />
        }
      />
    </ToolWorkspace>
  );
}
