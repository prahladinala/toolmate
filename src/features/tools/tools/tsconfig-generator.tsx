"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const TSCONFIG_OPTIONS: ConfigOption[] = [
  // Type Checking & Strictness
  {
    id: "strict",
    name: "Strict Mode (Recommended)",
    key: "compilerOptions.strict: true",
    category: "Type Checking",
    description: "Enable all strict type-checking options (noImplicitAny, strictNullChecks, strictFunctionTypes, etc.).",
    whyItHelps: "Forms the bedrock of TypeScript safety. Catches null/undefined dereferences and eliminates runtime surprises.",
    example: "let x: string; // Error if accessed before initialization",
    defaultChecked: true,
  },
  {
    id: "skipLibCheck",
    name: "Skip Library Check",
    key: "compilerOptions.skipLibCheck: true",
    category: "Performance",
    description: "Skip type checking of all declaration (.d.ts) files in node_modules.",
    whyItHelps: "Drastically accelerates compilation and build times. Avoids third-party typing conflicts between packages.",
    example: "compilerOptions: { skipLibCheck: true }",
    defaultChecked: true,
  },
  {
    id: "noUncheckedIndexedAccess",
    name: "Unchecked Indexed Access",
    key: "compilerOptions.noUncheckedIndexedAccess: true",
    category: "Type Checking",
    description: "Add 'undefined' to array lookups (arr[0]) and record access (obj[key]).",
    whyItHelps: "Prevents runtime crashes caused by assuming an array index or dictionary key is guaranteed to exist.",
    example: "const item = list[0]; // item is type: T | undefined",
    defaultChecked: true,
  },
  {
    id: "noImplicitOverride",
    name: "Require 'override' Keyword",
    key: "compilerOptions.noImplicitOverride: true",
    category: "Type Checking",
    description: "Ensure overriding class members are marked with the 'override' modifier.",
    whyItHelps: "Alerts you immediately if a parent class method is renamed or removed, preventing silent inheritance breakages.",
    example: "override render() { return super.render(); }",
    defaultChecked: false,
  },
  {
    id: "noFallthroughCasesInSwitch",
    name: "No Switch Fallthrough",
    key: "compilerOptions.noFallthroughCasesInSwitch: true",
    category: "Type Checking",
    description: "Report errors for fallthrough cases in switch statements.",
    whyItHelps: "Catches accidental omissions of 'break;' or 'return;' in complex switch-case control flows.",
    example: "case 1: doThing(); // Error: missing break",
    defaultChecked: true,
  },
  {
    id: "noUnusedLocals",
    name: "Disallow Unused Locals",
    key: "compilerOptions.noUnusedLocals: true",
    category: "Type Checking",
    description: "Report errors on unused local variables.",
    whyItHelps: "Alerts you to dead variables left behind after refactors, keeping codebase lean.",
    example: "const temp = 1; // Error if never read",
    defaultChecked: false,
  },
  {
    id: "noUnusedParameters",
    name: "Disallow Unused Parameters",
    key: "compilerOptions.noUnusedParameters: true",
    category: "Type Checking",
    description: "Report errors on unused function parameters.",
    whyItHelps: "Forces clean function contracts. Prefix with underscore (_arg) to intentionally ignore.",
    example: "function log(msg: string, _opts: any) { ... }",
    defaultChecked: false,
  },

  // Modules & Resolution
  {
    id: "moduleResolutionBundler",
    name: "Bundler Module Resolution",
    key: "compilerOptions.moduleResolution: 'bundler'",
    category: "Modules",
    description: "Use modern module resolution tailored for Vite, Next.js, Bun, and Webpack 5.",
    whyItHelps: "Supports modern package.json 'exports' maps and allows importing packages without specifying extensions.",
    example: "moduleResolution: 'bundler'",
    defaultChecked: true,
  },
  {
    id: "moduleESNext",
    name: "ESNext Module Syntax",
    key: "compilerOptions.module: 'esnext'",
    category: "Modules",
    description: "Generate standard ECMAScript module syntax (import / export).",
    whyItHelps: "Enables tree-shaking and modern bundle splitting across client and server runtimes.",
    example: "import { data } from './data';",
    defaultChecked: true,
  },
  {
    id: "targetES2022",
    name: "Target Modern ECMAScript (ES2022)",
    key: "compilerOptions.target: 'ES2022'",
    category: "Modules",
    description: "Emit modern ECMAScript features supported by all evergreen browsers and modern Node.js.",
    whyItHelps: "Avoids slow, bloated polyfills for features like async/await, optional chaining, and class fields.",
    example: "target: 'ES2022'",
    defaultChecked: true,
  },
  {
    id: "esModuleInterop",
    name: "ES Module Interop",
    key: "compilerOptions.esModuleInterop: true",
    category: "Modules",
    description: "Enables 'import x from y' for CommonJS dependencies instead of 'import * as x from y'.",
    whyItHelps: "Aligns TypeScript with the Babel and Node.js ecosystem for seamless package imports.",
    example: "import React from 'react'; // works with CommonJS",
    defaultChecked: true,
  },
  {
    id: "isolatedModules",
    name: "Isolated Modules",
    key: "compilerOptions.isolatedModules: true",
    category: "Modules",
    description: "Ensure each file can be safely transpiled by single-file compilers (Babel, SWC, esbuild).",
    whyItHelps: "Guarantees compatibility with Vite, Next.js Turbopack, and esbuild by disallowing ambient cross-file const enums.",
    example: "export type { User }; // required instead of export { User }",
    defaultChecked: true,
  },

  // Paths & Emits
  {
    id: "pathAliases",
    name: "Root Path Aliases (@/*)",
    key: "compilerOptions.paths: { '@/*': ['./src/*'] }",
    category: "Paths & Output",
    description: "Configure clean root path aliases mapped to the ./src directory.",
    whyItHelps: "Eliminates messy relative directory backtracking like '../../../../components/Button'.",
    example: "import { Button } from '@/components/Button';",
    defaultChecked: true,
  },
  {
    id: "jsxReactJsx",
    name: "Modern JSX Transform (react-jsx)",
    key: "compilerOptions.jsx: 'react-jsx'",
    category: "React & JSX",
    description: "Use React 17+ JSX transform that doesn't require importing React in scope.",
    whyItHelps: "Saves code bloat and works out of the box with React 18, React 19, and Next.js.",
    example: "const element = <div className=\"box\" />;",
    defaultChecked: true,
  },
  {
    id: "declaration",
    name: "Emit Declaration Files (.d.ts)",
    key: "compilerOptions.declaration: true",
    category: "Paths & Output",
    description: "Generate .d.ts files alongside output JavaScript.",
    whyItHelps: "Essential when building libraries, shared packages, or npm packages consumed by other developers.",
    example: "dist/index.js + dist/index.d.ts",
    defaultChecked: false,
  },
  {
    id: "sourceMap",
    name: "Emit Source Maps",
    key: "compilerOptions.sourceMap: true",
    category: "Paths & Output",
    description: "Create source map (.map) files for debugger navigation.",
    whyItHelps: "Enables line-by-line debugging in browser DevTools and VS Code directly against your original TypeScript code.",
    example: "sourceMap: true",
    defaultChecked: false,
  },
  {
    id: "forceConsistentCasing",
    name: "Consistent File Name Casing",
    key: "compilerOptions.forceConsistentCasingInFileNames: true",
    category: "Performance",
    description: "Disallow inconsistently-cased references to the same file.",
    whyItHelps: "Prevents elusive cross-platform bugs when developing on Windows/macOS (case-insensitive) and deploying to Linux (case-sensitive).",
    example: "Importing './Button' when file is 'button.tsx' triggers error",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Next.js & React 19",
    description: "Standard Next.js, React, and Vite setup with bundler resolution and strict typing",
    optionIds: [
      "strict",
      "skipLibCheck",
      "noUncheckedIndexedAccess",
      "noFallthroughCasesInSwitch",
      "moduleResolutionBundler",
      "moduleESNext",
      "targetES2022",
      "esModuleInterop",
      "isolatedModules",
      "pathAliases",
      "jsxReactJsx",
      "forceConsistentCasing",
    ],
  },
  {
    id: "strict",
    name: "Strict Enterprise Library",
    description: "Full strictness with declarations, source maps, and unused variable checks",
    optionIds: [
      "strict",
      "skipLibCheck",
      "noUncheckedIndexedAccess",
      "noImplicitOverride",
      "noFallthroughCasesInSwitch",
      "noUnusedLocals",
      "noUnusedParameters",
      "moduleResolutionBundler",
      "moduleESNext",
      "targetES2022",
      "esModuleInterop",
      "isolatedModules",
      "pathAliases",
      "declaration",
      "sourceMap",
      "forceConsistentCasing",
    ],
  },
  {
    id: "minimal",
    name: "Node.js Server",
    description: "Backend Node.js configuration for microservices and APIs",
    optionIds: [
      "strict",
      "skipLibCheck",
      "moduleESNext",
      "targetES2022",
      "esModuleInterop",
      "pathAliases",
      "forceConsistentCasing",
    ],
  },
];

export function TsconfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("standard");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    TSCONFIG_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return TSCONFIG_OPTIONS.filter((opt) => {
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
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: selectedIds.has("skipLibCheck"),
      strict: selectedIds.has("strict"),
      noEmit: !selectedIds.has("declaration"),
      esModuleInterop: selectedIds.has("esModuleInterop"),
      module: selectedIds.has("moduleESNext") ? "esnext" : "commonjs",
      moduleResolution: selectedIds.has("moduleResolutionBundler")
        ? "bundler"
        : "node",
      resolveJsonModule: true,
      isolatedModules: selectedIds.has("isolatedModules"),
    };

    if (selectedIds.has("jsxReactJsx")) {
      compilerOptions.jsx = "react-jsx";
    }

    if (selectedIds.has("noUncheckedIndexedAccess")) {
      compilerOptions.noUncheckedIndexedAccess = true;
    }

    if (selectedIds.has("noImplicitOverride")) {
      compilerOptions.noImplicitOverride = true;
    }

    if (selectedIds.has("noFallthroughCasesInSwitch")) {
      compilerOptions.noFallthroughCasesInSwitch = true;
    }

    if (selectedIds.has("noUnusedLocals")) {
      compilerOptions.noUnusedLocals = true;
    }

    if (selectedIds.has("noUnusedParameters")) {
      compilerOptions.noUnusedParameters = true;
    }

    if (selectedIds.has("declaration")) {
      compilerOptions.declaration = true;
      compilerOptions.outDir = "./dist";
    }

    if (selectedIds.has("sourceMap")) {
      compilerOptions.sourceMap = true;
    }

    if (selectedIds.has("forceConsistentCasing")) {
      compilerOptions.forceConsistentCasingInFileNames = true;
    }

    if (selectedIds.has("pathAliases")) {
      compilerOptions.paths = {
        "@/*": ["./src/*"],
      };
    }

    const configObj = {
      compilerOptions,
      include: ["src/**/*", "next-env.d.ts", ".next/types/**/*.ts"],
      exclude: ["node_modules", "dist", ".next"],
    };

    const nodeConfigObj = {
      compilerOptions: {
        ...compilerOptions,
        lib: ["esnext"],
        jsx: undefined,
        moduleResolution: "node",
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"],
    };

    return [
      {
        id: "standard",
        label: "tsconfig.json",
        filename: "tsconfig.json",
        language: "json",
        content: JSON.stringify(configObj, null, 2),
      },
      {
        id: "node",
        label: "tsconfig.node.json",
        filename: "tsconfig.node.json",
        language: "json",
        content: JSON.stringify(nodeConfigObj, null, 2),
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
              totalCount={TSCONFIG_OPTIONS.length}
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
            configTip="Place tsconfig.json in the root directory of your project. Modern tools like Next.js, Vite, and VS Code automatically detect and apply these compiler options."
          />
        }
      />
    </ToolWorkspace>
  );
}
