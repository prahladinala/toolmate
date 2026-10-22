"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const ESLINT_OPTIONS: ConfigOption[] = [
  // Environment & Language
  {
    id: "typescript",
    name: "TypeScript Support",
    key: "@typescript-eslint",
    category: "Environment",
    description: "Enable TypeScript AST parser and dedicated TypeScript linting rules.",
    whyItHelps: "Catches type-level errors, unhandled promises, and syntax bugs before compilation.",
    example: "import tseslint from 'typescript-eslint';",
    defaultChecked: true,
  },
  {
    id: "browser",
    name: "Browser Environment",
    key: "env.browser: true",
    category: "Environment",
    description: "Predefine browser global variables (window, document, fetch, navigator).",
    whyItHelps: "Prevents 'window is not defined' lint errors on client-side frontend code.",
    example: "globals: { ...globals.browser }",
    defaultChecked: true,
  },
  {
    id: "node",
    name: "Node.js Environment",
    key: "env.node: true",
    category: "Environment",
    description: "Predefine Node.js global variables and scoping (process, Buffer, __dirname).",
    whyItHelps: "Prevents false-positive 'process is not defined' errors on server or build scripts.",
    example: "globals: { ...globals.node }",
    defaultChecked: true,
  },

  // Frameworks
  {
    id: "react",
    name: "React & JSX Linting",
    key: "eslint-plugin-react",
    category: "Frameworks",
    description: "Enforce standard React best practices, JSX syntax rules, and component patterns.",
    whyItHelps: "Detects missing display names, invalid props, missing keys in array mappings, and deprecated React APIs.",
    example: "{items.map(item => <Item key={item.id} />)}",
    defaultChecked: true,
  },
  {
    id: "reactHooks",
    name: "React Hooks Rules",
    key: "eslint-plugin-react-hooks",
    category: "Frameworks",
    description: "Enforce the Rules of Hooks (calls at top level) and exhaustive dependency arrays.",
    whyItHelps: "Guarantees hook ordering stability across renders and eliminates stale closure bugs in useEffect/useCallback.",
    example: "useEffect(() => { ... }, [dependency]);",
    defaultChecked: true,
  },
  {
    id: "nextjs",
    name: "Next.js Linting",
    key: "@next/eslint-plugin-next",
    category: "Frameworks",
    description: "Enforce Next.js specific optimizations (Image component, font loader, link prefetching).",
    whyItHelps: "Stops large unoptimized images, layout shift, and SEO metadata mistakes on Next.js projects.",
    example: "import Image from 'next/image';",
    defaultChecked: true,
  },
  {
    id: "jsxA11y",
    name: "Accessibility (a11y) Audit",
    key: "eslint-plugin-jsx-a11y",
    category: "Frameworks",
    description: "Lint JSX elements for web accessibility standards (alt tags, aria attributes, tab indices).",
    whyItHelps: "Ensures screen-reader compatibility and WCAG AA compliance across all components.",
    example: "<img src=\"logo.png\" alt=\"ToolMate Logo\" />",
    defaultChecked: false,
  },

  // Code Quality Rules
  {
    id: "noConsole",
    name: "Disallow console.log",
    key: "no-console: 'warn'",
    category: "Code Quality",
    description: "Warn or error when debug console statements (console.log, console.debug) are left in code.",
    whyItHelps: "Prevents sensitive user tokens or noisy debug data from leaking into production browser consoles.",
    example: "// Warning: Unexpected console statement\nconsole.log(data);",
    defaultChecked: true,
  },
  {
    id: "noDebugger",
    name: "Disallow debugger",
    key: "no-debugger: 'error'",
    category: "Code Quality",
    description: "Disallow the use of the debugger keyword in source code.",
    whyItHelps: "Stops forgotten debugger statements from halting execution in client browsers.",
    example: "debugger; // Error",
    defaultChecked: true,
  },
  {
    id: "eqeqeq",
    name: "Enforce Strict Equality (===)",
    key: "eqeqeq: ['error', 'always']",
    category: "Code Quality",
    description: "Require the use of === and !== instead of loose == and != operators.",
    whyItHelps: "Eliminates dangerous JavaScript type coercion bugs (such as false == 0 being true).",
    example: "if (status === 'success') { ... }",
    defaultChecked: true,
  },
  {
    id: "preferConst",
    name: "Prefer const over let",
    key: "prefer-const: 'error'",
    category: "Code Quality",
    description: "Require const declarations for variables that are never reassigned after declared.",
    whyItHelps: "Significantly clarifies code intent and communicates immutability to team members and compilers.",
    example: "const MAX_LIMIT = 50;  // Never reassigned",
    defaultChecked: true,
  },
  {
    id: "noVar",
    name: "Disallow var declarations",
    key: "no-var: 'error'",
    category: "Code Quality",
    description: "Require let or const instead of function-scoped var.",
    whyItHelps: "Prevents accidental variable hoisting bugs and variable leakage outside block scopes.",
    example: "const total = 10; // instead of var total = 10;",
    defaultChecked: true,
  },
  {
    id: "curly",
    name: "Require Curly Braces",
    key: "curly: ['error', 'all']",
    category: "Code Quality",
    description: "Enforce curly braces for all control statements (if, else, for, while).",
    whyItHelps: "Prevents critical security vulnerabilities caused by indentation illusions (like Apple's famous 'goto fail' bug).",
    example: "if (isValid) {\n  execute();\n}",
    defaultChecked: true,
  },
  {
    id: "noUnusedVars",
    name: "Disallow Unused Variables",
    key: "no-unused-vars: 'error'",
    category: "Code Quality",
    description: "Flag variables, imports, and functions that are declared but never used in the module.",
    whyItHelps: "Keeps bundle sizes lean and alerts you immediately to unfinished refactors or leftover dead code.",
    example: "const [active, setActive] = useState(); // 'active' flagged if unused",
    defaultChecked: true,
  },

  // TypeScript Strictness
  {
    id: "tsNoExplicitAny",
    name: "Disallow 'any' Type",
    key: "@typescript-eslint/no-explicit-any: 'warn'",
    category: "TypeScript",
    description: "Warn against using the escape-hatch 'any' type in TypeScript files.",
    whyItHelps: "Forces developers to type variables accurately (`unknown`, generic, or specific interfaces), maintaining type safety.",
    example: "function parse(data: unknown) { ... } // instead of data: any",
    defaultChecked: false,
  },
  {
    id: "tsConsistentTypeImports",
    name: "Enforce 'import type'",
    key: "@typescript-eslint/consistent-type-imports",
    category: "TypeScript",
    description: "Enforce using 'import type' for type-only imports.",
    whyItHelps: "Guarantees type-only imports are completely erased during compilation, avoiding circular dependency errors and bloat.",
    example: "import type { User } from './types';",
    defaultChecked: true,
  },

  // Formatting & Prettier
  {
    id: "prettierIntegration",
    name: "Prettier Conflict Resolver",
    key: "eslint-config-prettier",
    category: "Formatting",
    description: "Turn off all ESLint rules that are unnecessary or might conflict with Prettier.",
    whyItHelps: "Prevents frustrating battles where ESLint and Prettier fight over quotes, commas, and line length.",
    example: "extends: ['prettier']",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Modern React/Next.js",
    description: "Standard Next.js + React + TypeScript + Prettier setup",
    optionIds: [
      "typescript",
      "browser",
      "node",
      "react",
      "reactHooks",
      "nextjs",
      "noConsole",
      "noDebugger",
      "eqeqeq",
      "preferConst",
      "noVar",
      "curly",
      "noUnusedVars",
      "tsConsistentTypeImports",
      "prettierIntegration",
    ],
  },
  {
    id: "strict",
    name: "Strict Enterprise",
    description: "Full strictness with accessibility, no-explicit-any, and hooks enforcement",
    optionIds: [
      "typescript",
      "browser",
      "node",
      "react",
      "reactHooks",
      "nextjs",
      "jsxA11y",
      "noConsole",
      "noDebugger",
      "eqeqeq",
      "preferConst",
      "noVar",
      "curly",
      "noUnusedVars",
      "tsNoExplicitAny",
      "tsConsistentTypeImports",
      "prettierIntegration",
    ],
  },
  {
    id: "minimal",
    name: "Minimalist JS",
    description: "Lightweight base config for standard JavaScript",
    optionIds: ["browser", "node", "eqeqeq", "preferConst", "noVar", "noDebugger"],
  },
];

export function EslintConfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("flat");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    ESLINT_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return ESLINT_OPTIONS.filter((opt) => {
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

  // Packages to install based on options
  const installPackages = useMemo(() => {
    const pkgs = ["eslint@^9.0.0"];
    if (selectedIds.has("typescript")) {
      pkgs.push("typescript", "typescript-eslint");
    }
    if (selectedIds.has("react")) {
      pkgs.push("eslint-plugin-react");
    }
    if (selectedIds.has("reactHooks")) {
      pkgs.push("eslint-plugin-react-hooks");
    }
    if (selectedIds.has("nextjs")) {
      pkgs.push("@next/eslint-plugin-next");
    }
    if (selectedIds.has("jsxA11y")) {
      pkgs.push("eslint-plugin-jsx-a11y");
    }
    if (selectedIds.has("prettierIntegration")) {
      pkgs.push("eslint-config-prettier");
    }
    return pkgs;
  }, [selectedIds]);

  // Formats Generation
  const formats: OutputFormat[] = useMemo(() => {
    // 1. Modern Flat Config (eslint.config.mjs)
    const imports: string[] = ["import js from '@eslint/js';"];
    if (selectedIds.has("browser") || selectedIds.has("node")) {
      imports.push("import globals from 'globals';");
    }
    if (selectedIds.has("typescript")) {
      imports.push("import tseslint from 'typescript-eslint';");
    }
    if (selectedIds.has("react")) {
      imports.push("import reactPlugin from 'eslint-plugin-react';");
    }
    if (selectedIds.has("reactHooks")) {
      imports.push("import reactHooks from 'eslint-plugin-react-hooks';");
    }
    if (selectedIds.has("nextjs")) {
      imports.push("import nextPlugin from '@next/eslint-plugin-next';");
    }
    if (selectedIds.has("jsxA11y")) {
      imports.push("import jsxA11y from 'eslint-plugin-jsx-a11y';");
    }
    if (selectedIds.has("prettierIntegration")) {
      imports.push("import prettierConfig from 'eslint-config-prettier';");
    }

    const rulesObj: Record<string, any> = {};
    if (selectedIds.has("noConsole")) rulesObj["no-console"] = "warn";
    if (selectedIds.has("noDebugger")) rulesObj["no-debugger"] = "error";
    if (selectedIds.has("eqeqeq")) rulesObj["eqeqeq"] = ["error", "always"];
    if (selectedIds.has("preferConst")) rulesObj["prefer-const"] = "error";
    if (selectedIds.has("noVar")) rulesObj["no-var"] = "error";
    if (selectedIds.has("curly")) rulesObj["curly"] = ["error", "all"];
    if (selectedIds.has("noUnusedVars")) {
      if (selectedIds.has("typescript")) {
        rulesObj["no-unused-vars"] = "off";
        rulesObj["@typescript-eslint/no-unused-vars"] = [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ];
      } else {
        rulesObj["no-unused-vars"] = "error";
      }
    }
    if (selectedIds.has("tsNoExplicitAny")) {
      rulesObj["@typescript-eslint/no-explicit-any"] = "warn";
    }
    if (selectedIds.has("tsConsistentTypeImports")) {
      rulesObj["@typescript-eslint/consistent-type-imports"] = [
        "error",
        { prefer: "type-imports" },
      ];
    }
    if (selectedIds.has("reactHooks")) {
      rulesObj["react-hooks/rules-of-hooks"] = "error";
      rulesObj["react-hooks/exhaustive-deps"] = "warn";
    }

    const flatConfigContent = `${imports.join("\n")}\n\nexport default [\n  js.configs.recommended,\n${
      selectedIds.has("typescript") ? "  ...tseslint.configs.recommended,\n" : ""
    }  {\n    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],\n    languageOptions: {\n      ecmaVersion: 'latest',\n      sourceType: 'module',\n      globals: {\n${
      selectedIds.has("browser") ? "        ...globals.browser,\n" : ""
    }${selectedIds.has("node") ? "        ...globals.node,\n" : ""}      },\n    },\n${
      selectedIds.has("react") || selectedIds.has("reactHooks")
        ? `    plugins: {\n${
            selectedIds.has("react") ? "      react: reactPlugin,\n" : ""
          }${
            selectedIds.has("reactHooks")
              ? "      'react-hooks': reactHooks,\n"
              : ""
          }${selectedIds.has("nextjs") ? "      '@next/next': nextPlugin,\n" : ""}${
            selectedIds.has("jsxA11y") ? "      'jsx-a11y': jsxA11y,\n" : ""
          }    },\n`
        : ""
    }    rules: ${JSON.stringify(rulesObj, null, 6).replace(/\n/g, "\n    ")},\n  },\n${
      selectedIds.has("prettierIntegration") ? "  prettierConfig,\n" : ""
    }];\n`;

    // 2. Legacy Config (.eslintrc.json)
    const legacyObj: Record<string, any> = {
      root: true,
      env: {
        es2024: true,
        browser: selectedIds.has("browser"),
        node: selectedIds.has("node"),
      },
      extends: ["eslint:recommended"],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: rulesObj,
    };

    if (selectedIds.has("typescript")) {
      legacyObj.parser = "@typescript-eslint/parser";
      legacyObj.plugins = legacyObj.plugins || [];
      legacyObj.plugins.push("@typescript-eslint");
      legacyObj.extends.push("plugin:@typescript-eslint/recommended");
    }
    if (selectedIds.has("react")) {
      legacyObj.plugins = legacyObj.plugins || [];
      legacyObj.plugins.push("react");
      legacyObj.extends.push("plugin:react/recommended", "plugin:react/jsx-runtime");
      legacyObj.settings = { react: { version: "detect" } };
    }
    if (selectedIds.has("reactHooks")) {
      legacyObj.plugins = legacyObj.plugins || [];
      legacyObj.plugins.push("react-hooks");
      legacyObj.extends.push("plugin:react-hooks/recommended");
    }
    if (selectedIds.has("nextjs")) {
      legacyObj.extends.push("plugin:@next/next/recommended");
    }
    if (selectedIds.has("jsxA11y")) {
      legacyObj.extends.push("plugin:jsx-a11y/recommended");
    }
    if (selectedIds.has("prettierIntegration")) {
      legacyObj.extends.push("prettier");
    }

    const legacyContent = JSON.stringify(legacyObj, null, 2);

    // 3. .eslintignore
    const eslintIgnoreContent = `# Build outputs & caches\nnode_modules/\n.next/\ndist/\nbuild/\ncoverage/\n\n# Public assets\npublic/\n*.min.js\n`;

    return [
      {
        id: "flat",
        label: "eslint.config.mjs (Flat)",
        filename: "eslint.config.mjs",
        language: "javascript",
        content: flatConfigContent,
      },
      {
        id: "legacy",
        label: ".eslintrc.json (Legacy)",
        filename: ".eslintrc.json",
        language: "json",
        content: legacyContent,
      },
      {
        id: "ignore",
        label: ".eslintignore",
        filename: ".eslintignore",
        language: "text",
        content: eslintIgnoreContent,
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
              totalCount={ESLINT_OPTIONS.length}
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
            installPackages={installPackages}
            configTip="ESLint 9+ uses Modern Flat Config (eslint.config.mjs). If your project is still on ESLint 8 or uses tools requiring legacy syntax, select .eslintrc.json."
          />
        }
      />
    </ToolWorkspace>
  );
}
