"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const STYLELINT_OPTIONS: ConfigOption[] = [
  // Syntax & Frameworks
  {
    id: "scss",
    name: "SCSS / Sass Support",
    key: "stylelint-config-standard-scss",
    category: "Syntax",
    description: "Support Sass / SCSS syntax, nested rules, variables ($var), and @mixins.",
    whyItHelps: "Prevents false-positive parsing errors when using SCSS features and enforces SCSS best practices.",
    example: "@use 'variables' as *;\n.btn { color: $primary; }",
    defaultChecked: false,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS Support",
    key: "@apply, @theme allowed",
    category: "Syntax",
    description: "Allow Tailwind at-rules (@apply, @theme, @utility, @tailwind, screen) without warnings.",
    whyItHelps: "Prevents Stylelint from reporting 'unknown at-rule' errors on standard Tailwind directives.",
    example: ".card {\n  @apply p-4 rounded-xl shadow-md;\n}",
    defaultChecked: true,
  },
  {
    id: "recessOrder",
    name: "Recess Property Ordering",
    key: "stylelint-config-recess-order",
    category: "Ordering",
    description: "Sort CSS properties logically (Positioning -> Box Model -> Typography -> Visual -> Animation).",
    whyItHelps: "Makes CSS files dramatically faster to read, debug, and review during team PRs.",
    example: ".box {\n  position: absolute;\n  display: flex;\n  color: #fff;\n}",
    defaultChecked: true,
  },

  // Colors & Units
  {
    id: "colorNoInvalidHex",
    name: "Disallow Invalid Hex Colors",
    key: "color-no-invalid-hex: true",
    category: "Colors & Values",
    description: "Disallow invalid hex color values (invalid length or non-hex characters).",
    whyItHelps: "Catches typos like #fffff or #z1z1z1 before they render as transparent or broken styles.",
    example: "color: #fff; // Disallows #ffffff1",
    defaultChecked: true,
  },
  {
    id: "colorHexLength",
    name: "Enforce Short Hex Colors",
    key: "color-hex-length: 'short'",
    category: "Colors & Values",
    description: "Specify short hexadecimal notation where applicable (#fff instead of #ffffff).",
    whyItHelps: "Enforces consistent color styling and saves bytes in production CSS bundles.",
    example: "background: #000; // not #000000",
    defaultChecked: true,
  },
  {
    id: "unitNoUnknown",
    name: "Disallow Unknown Units",
    key: "unit-no-unknown: true",
    category: "Colors & Values",
    description: "Disallow unknown or misspelled CSS units (e.g. 10pxx, 2remm).",
    whyItHelps: "Browsers discard entire style declarations containing invalid units. This catches them during development.",
    example: "width: 100px; // Flags 100pxx",
    defaultChecked: true,
  },

  // Specificity & Structure
  {
    id: "declarationNoImportant",
    name: "Disallow !important",
    key: "declaration-no-important: true",
    category: "Specificity",
    description: "Disallow !important inside style rule declarations.",
    whyItHelps: "Stops toxic specificity wars where engineers constantly use !important to override other !important rules.",
    example: "/* Disallows */ color: red !important;",
    defaultChecked: true,
  },
  {
    id: "maxNestingDepth",
    name: "Limit Nesting Depth (Max 3)",
    key: "max-nesting-depth: 3",
    category: "Specificity",
    description: "Restrict selector nesting to at most 3 levels deep.",
    whyItHelps: "Deep nesting creates over-specific selectors (.nav .list .item .link .icon) that hurt rendering performance and break modularity.",
    example: ".card { .body { .title { /* max 3 */ } } }",
    defaultChecked: true,
  },
  {
    id: "selectorClassPattern",
    name: "Kebab-Case Class Names",
    key: "selector-class-pattern: 'kebab-case'",
    category: "Specificity",
    description: "Enforce kebab-case or BEM format for all CSS class selectors.",
    whyItHelps: "Prevents random mixtures of camelCase, snake_case, and kebab-case in stylesheets.",
    example: ".btn-primary { ... } // Flags .btnPrimary",
    defaultChecked: true,
  },

  // Code Hygiene
  {
    id: "blockNoEmpty",
    name: "Disallow Empty Blocks",
    key: "block-no-empty: true",
    category: "Hygiene",
    description: "Disallow empty style blocks.",
    whyItHelps: "Eliminates leftover skeleton rules that bloat stylesheets without styling any element.",
    example: "/* Flags */ .empty-card { }",
    defaultChecked: true,
  },
  {
    id: "noDuplicateSelectors",
    name: "Disallow Duplicate Selectors",
    key: "no-duplicate-selectors: true",
    category: "Hygiene",
    description: "Disallow duplicate selectors within a stylesheet.",
    whyItHelps: "Prevents fragmented styles spread across a file that make maintenance confusing.",
    example: "/* Flags multiple .button { ... } blocks */",
    defaultChecked: true,
  },
  {
    id: "fontFamilyGeneric",
    name: "Require Generic Font Family",
    key: "font-family-no-missing-generic-family-keyword: true",
    category: "Hygiene",
    description: "Require a generic font family fallback (sans-serif, serif, monospace) in font declarations.",
    whyItHelps: "Guarantees a clean, predictable system fallback if a custom web font fails to load or download over slow connections.",
    example: "font-family: 'Inter', system-ui, sans-serif;",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Recommended Standard",
    description: "Modern CSS with Tailwind compatibility, recess ordering, and error prevention",
    optionIds: [
      "tailwind",
      "recessOrder",
      "colorNoInvalidHex",
      "colorHexLength",
      "unitNoUnknown",
      "declarationNoImportant",
      "maxNestingDepth",
      "selectorClassPattern",
      "blockNoEmpty",
      "noDuplicateSelectors",
      "fontFamilyGeneric",
    ],
  },
  {
    id: "strict",
    name: "Strict SCSS / Sass",
    description: "SCSS-first configuration with strict nesting and property ordering",
    optionIds: [
      "scss",
      "recessOrder",
      "colorNoInvalidHex",
      "colorHexLength",
      "unitNoUnknown",
      "declarationNoImportant",
      "maxNestingDepth",
      "selectorClassPattern",
      "blockNoEmpty",
      "noDuplicateSelectors",
      "fontFamilyGeneric",
    ],
  },
  {
    id: "minimal",
    name: "Minimalist CSS",
    description: "Core syntax error prevention with minimal constraints",
    optionIds: ["colorNoInvalidHex", "unitNoUnknown", "blockNoEmpty", "noDuplicateSelectors"],
  },
];

export function StylelintConfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("json");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    STYLELINT_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return STYLELINT_OPTIONS.filter((opt) => {
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

  // Packages to install
  const installPackages = useMemo(() => {
    const pkgs = ["stylelint@^16.0.0", "stylelint-config-standard"];
    if (selectedIds.has("scss")) {
      pkgs.push("stylelint-config-standard-scss");
    }
    if (selectedIds.has("recessOrder")) {
      pkgs.push("stylelint-config-recess-order");
    }
    return pkgs;
  }, [selectedIds]);

  // Formats Generation
  const formats: OutputFormat[] = useMemo(() => {
    const configObj: Record<string, any> = {
      extends: ["stylelint-config-standard"],
    };

    if (selectedIds.has("scss")) {
      configObj.extends.push("stylelint-config-standard-scss");
    }
    if (selectedIds.has("recessOrder")) {
      configObj.extends.push("stylelint-config-recess-order");
    }

    const rules: Record<string, any> = {};

    if (selectedIds.has("tailwind")) {
      rules["at-rule-no-unknown"] = [
        true,
        {
          ignoreAtRules: [
            "tailwind",
            "apply",
            "variants",
            "responsive",
            "screen",
            "layer",
            "utility",
            "theme",
          ],
        },
      ];
    }

    if (selectedIds.has("colorNoInvalidHex")) {
      rules["color-no-invalid-hex"] = true;
    }
    if (selectedIds.has("colorHexLength")) {
      rules["color-hex-length"] = "short";
    }
    if (selectedIds.has("unitNoUnknown")) {
      rules["unit-no-unknown"] = true;
    }
    if (selectedIds.has("declarationNoImportant")) {
      rules["declaration-no-important"] = true;
    }
    if (selectedIds.has("maxNestingDepth")) {
      rules["max-nesting-depth"] = 3;
    }
    if (selectedIds.has("selectorClassPattern")) {
      rules["selector-class-pattern"] = "^[a-z0-9]+(-[a-z0-9]+)*$";
    }
    if (selectedIds.has("blockNoEmpty")) {
      rules["block-no-empty"] = true;
    }
    if (selectedIds.has("noDuplicateSelectors")) {
      rules["no-duplicate-selectors"] = true;
    }
    if (selectedIds.has("fontFamilyGeneric")) {
      rules["font-family-no-missing-generic-family-keyword"] = true;
    }

    configObj.rules = rules;

    const jsonContent = JSON.stringify(configObj, null, 2);

    const jsContent = `/** @type {import('stylelint').Config} */\nmodule.exports = ${JSON.stringify(
      configObj,
      null,
      2
    )};\n`;

    const stylelintIgnoreContent = `# Build & Dependency directories\nnode_modules/\n.next/\ndist/\nbuild/\ncoverage/\n\n# Vendor styles\npublic/\n*.min.css\n`;

    return [
      {
        id: "json",
        label: ".stylelintrc.json",
        filename: ".stylelintrc.json",
        language: "json",
        content: jsonContent,
      },
      {
        id: "js",
        label: ".stylelintrc.js",
        filename: ".stylelintrc.js",
        language: "javascript",
        content: jsContent,
      },
      {
        id: "ignore",
        label: ".stylelintignore",
        filename: ".stylelintignore",
        language: "text",
        content: stylelintIgnoreContent,
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
              totalCount={STYLELINT_OPTIONS.length}
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
            configTip="Create a .stylelintrc.json in your project root. To test your styles, run 'npx stylelint **/*.css'."
          />
        }
      />
    </ToolWorkspace>
  );
}
