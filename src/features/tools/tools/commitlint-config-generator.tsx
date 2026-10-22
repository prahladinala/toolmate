"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const COMMITLINT_OPTIONS: ConfigOption[] = [
  // Commit Types
  {
    id: "typeFeat",
    name: "feat: Features",
    key: "type-enum: 'feat'",
    category: "Commit Types",
    description: "A new feature, UI component, or functional addition for the user.",
    whyItHelps: "Triggers a MINOR version bump (1.x.0) in automated semantic-release workflows.",
    example: "feat(auth): support social login with Google",
    defaultChecked: true,
  },
  {
    id: "typeFix",
    name: "fix: Bug Fixes",
    key: "type-enum: 'fix'",
    category: "Commit Types",
    description: "A bug fix or patch resolving unexpected behavior.",
    whyItHelps: "Triggers a PATCH version bump (1.0.x) in automated changelog generators.",
    example: "fix(cart): prevent double charging on click",
    defaultChecked: true,
  },
  {
    id: "typeDocs",
    name: "docs: Documentation",
    key: "type-enum: 'docs'",
    category: "Commit Types",
    description: "Documentation only changes (README, guides, JSDoc).",
    whyItHelps: "Documents additions without triggering unwanted release versions or CI re-builds.",
    example: "docs: update API authentication guide",
    defaultChecked: true,
  },
  {
    id: "typeRefactor",
    name: "refactor: Code Restructuring",
    key: "type-enum: 'refactor'",
    category: "Commit Types",
    description: "A code change that neither fixes a bug nor adds a user-facing feature.",
    whyItHelps: "Categorizes architecture cleanup clearly in release notes.",
    example: "refactor(database): extract query building helper",
    defaultChecked: true,
  },
  {
    id: "typePerf",
    name: "perf: Performance",
    key: "type-enum: 'perf'",
    category: "Commit Types",
    description: "A code change that improves CPU, memory, or rendering performance.",
    whyItHelps: "Flags performance-critical changes during regression investigations.",
    example: "perf(table): virtualize row rendering for 10k items",
    defaultChecked: true,
  },
  {
    id: "typeTest",
    name: "test: Tests & Mocks",
    key: "type-enum: 'test'",
    category: "Commit Types",
    description: "Adding missing tests or correcting existing test suites.",
    whyItHelps: "Highlights test coverage improvements separate from product feature diffs.",
    example: "test(auth): add unit tests for token expiry",
    defaultChecked: true,
  },
  {
    id: "typeBuild",
    name: "build: Build System",
    key: "type-enum: 'build'",
    category: "Commit Types",
    description: "Changes that affect the build system, webpack, vite, or external dependencies.",
    whyItHelps: "Signals tooling or dependency version updates across team checkouts.",
    example: "build(deps): bump tailwindcss from 3.4 to 4.0",
    defaultChecked: true,
  },
  {
    id: "typeCi",
    name: "ci: CI/CD Pipelines",
    key: "type-enum: 'ci'",
    category: "Commit Types",
    description: "Changes to continuous integration scripts (GitHub Actions, Docker, Vercel).",
    whyItHelps: "Prevents pipeline tweaks from cluttering user-facing product changelogs.",
    example: "ci: configure automated Cypress test runner",
    defaultChecked: true,
  },
  {
    id: "typeChore",
    name: "chore: Chores & Maintenance",
    key: "type-enum: 'chore'",
    category: "Commit Types",
    description: "Maintenance tasks that don't modify src or test files (e.g. .gitignore updates).",
    whyItHelps: "Standard catch-all for housekeeping tasks without version bumps.",
    example: "chore: prune obsolete icons and temp files",
    defaultChecked: true,
  },
  {
    id: "typeRevert",
    name: "revert: Reverting Commits",
    key: "type-enum: 'revert'",
    category: "Commit Types",
    description: "Reverts a previous commit when a regression or incident is discovered.",
    whyItHelps: "Makes emergency rollback commits immediately identifiable in git history.",
    example: "revert: revert 'feat(search): enable vector index'",
    defaultChecked: true,
  },

  // Subject & Casing Rules
  {
    id: "subjectCaseLower",
    name: "Lowercase Subject",
    key: "subject-case: ['error', 'always', 'lower-case']",
    category: "Subject Rules",
    description: "Disallow uppercase letters at the beginning of the commit subject.",
    whyItHelps: "Enforces consistent grammar: 'feat: add button' instead of 'feat: Add button'.",
    example: "feat: add button // Flags feat: Add button",
    defaultChecked: true,
  },
  {
    id: "subjectNoPeriod",
    name: "Disallow Trailing Period",
    key: "subject-full-stop: ['error', 'never', '.']",
    category: "Subject Rules",
    description: "Disallow trailing punctuation or full stop at the end of the subject.",
    whyItHelps: "Saves header space and aligns with standard Git imperative mood conventions.",
    example: "feat: add user profile // Flags ...profile.",
    defaultChecked: true,
  },
  {
    id: "subjectNotEmpty",
    name: "Subject Cannot Be Empty",
    key: "subject-empty: ['error', 'never']",
    category: "Subject Rules",
    description: "Requires a non-empty message subject describing the change.",
    whyItHelps: "Prevents accidental commits like 'feat:' or 'fix:' with no explanation.",
    example: "Flags: feat(auth):",
    defaultChecked: true,
  },

  // Length Rules
  {
    id: "headerMax72",
    name: "Header Max Length (72 chars)",
    key: "header-max-length: ['error', 'always', 72]",
    category: "Length Rules",
    description: "Enforce a maximum commit header length of 72 characters.",
    whyItHelps: "Ensures commit titles fit cleanly on GitHub, GitLab, and terminal git log pagers without being truncated.",
    example: "feat(core): keep first line under 72 chars",
    defaultChecked: true,
  },
  {
    id: "bodyMax100",
    name: "Body Max Line Length (100 chars)",
    key: "body-max-line-length: ['error', 'always', 100]",
    category: "Length Rules",
    description: "Enforce a maximum line width of 100 characters in commit bodies.",
    whyItHelps: "Prevents massive unbroken paragraphs that require horizontal scrolling in git log.",
    example: "Wrap commit body explanations at 100 characters",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Conventional Commits",
    description: "The official Conventional Commits specification with standard types & 72-char header",
    optionIds: [
      "typeFeat",
      "typeFix",
      "typeDocs",
      "typeRefactor",
      "typePerf",
      "typeTest",
      "typeBuild",
      "typeCi",
      "typeChore",
      "typeRevert",
      "subjectCaseLower",
      "subjectNoPeriod",
      "subjectNotEmpty",
      "headerMax72",
      "bodyMax100",
    ],
  },
  {
    id: "strict",
    name: "Strict Enterprise",
    description: "Strict commit rules with enforced 72-char headers and full type validation",
    optionIds: [
      "typeFeat",
      "typeFix",
      "typeDocs",
      "typeRefactor",
      "typePerf",
      "typeTest",
      "typeBuild",
      "typeCi",
      "typeChore",
      "typeRevert",
      "subjectCaseLower",
      "subjectNoPeriod",
      "subjectNotEmpty",
      "headerMax72",
      "bodyMax100",
    ],
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Basic feat, fix, chore types with empty subject prevention",
    optionIds: ["typeFeat", "typeFix", "typeChore", "subjectNotEmpty"],
  },
];

export function CommitlintConfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("js");
  const [testCommit, setTestCommit] = useState("feat(auth): implement oauth login");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    COMMITLINT_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return COMMITLINT_OPTIONS.filter((opt) => {
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
    return ["@commitlint/cli", "@commitlint/config-conventional", "husky"];
  }, []);

  // Allowed types calculation
  const allowedTypes = useMemo(() => {
    const types: string[] = [];
    if (selectedIds.has("typeFeat")) types.push("feat");
    if (selectedIds.has("typeFix")) types.push("fix");
    if (selectedIds.has("typeDocs")) types.push("docs");
    if (selectedIds.has("typeRefactor")) types.push("refactor");
    if (selectedIds.has("typePerf")) types.push("perf");
    if (selectedIds.has("typeTest")) types.push("test");
    if (selectedIds.has("typeBuild")) types.push("build");
    if (selectedIds.has("typeCi")) types.push("ci");
    if (selectedIds.has("typeChore")) types.push("chore");
    if (selectedIds.has("typeRevert")) types.push("revert");
    return types;
  }, [selectedIds]);

  // Test commit validation feedback
  const validationResult = useMemo(() => {
    if (!testCommit.trim()) {
      return { valid: false, message: "Commit message cannot be empty" };
    }
    const match = testCommit.match(/^([a-z]+)(?:\([a-z0-9-_]+\))?!?: (.+)$/);
    if (!match) {
      return {
        valid: false,
        message: "Must match format: <type>(<scope>): <subject> (e.g. feat(auth): add login)",
      };
    }
    const [, type, subject] = match;
    if (allowedTypes.length > 0 && !allowedTypes.includes(type)) {
      return {
        valid: false,
        message: `Type '${type}' is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      };
    }
    if (selectedIds.has("subjectCaseLower") && subject[0] && subject[0] === subject[0].toUpperCase()) {
      return {
        valid: false,
        message: "Subject must start with a lowercase letter",
      };
    }
    if (selectedIds.has("subjectNoPeriod") && subject.endsWith(".")) {
      return {
        valid: false,
        message: "Subject must not end with a period",
      };
    }
    if (selectedIds.has("headerMax72") && testCommit.length > 72) {
      return {
        valid: false,
        message: `Header length (${testCommit.length}) exceeds 72 characters`,
      };
    }
    return { valid: true, message: "Valid Conventional Commit message!" };
  }, [testCommit, allowedTypes, selectedIds]);

  // Formats Generation
  const formats: OutputFormat[] = useMemo(() => {
    const rulesObj: Record<string, any> = {
      "type-enum": [2, "always", allowedTypes],
    };

    if (selectedIds.has("subjectCaseLower")) {
      rulesObj["subject-case"] = [2, "always", "lower-case"];
    }
    if (selectedIds.has("subjectNoPeriod")) {
      rulesObj["subject-full-stop"] = [2, "never", "."];
    }
    if (selectedIds.has("subjectNotEmpty")) {
      rulesObj["subject-empty"] = [2, "never"];
    }
    if (selectedIds.has("headerMax72")) {
      rulesObj["header-max-length"] = [2, "always", 72];
    }
    if (selectedIds.has("bodyMax100")) {
      rulesObj["body-max-line-length"] = [2, "always", 100];
    }

    const jsContent = `module.exports = {\n  extends: ['@commitlint/config-conventional'],\n  rules: ${JSON.stringify(
      rulesObj,
      null,
      4
    )},\n};\n`;

    const jsonContent = JSON.stringify(
      {
        extends: ["@commitlint/config-conventional"],
        rules: rulesObj,
      },
      null,
      2
    );

    const huskyScript = `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no -- commitlint --edit "\${1}"\n`;

    return [
      {
        id: "js",
        label: "commitlint.config.js",
        filename: "commitlint.config.js",
        language: "javascript",
        content: jsContent,
      },
      {
        id: "json",
        label: ".commitlintrc.json",
        filename: ".commitlintrc.json",
        language: "json",
        content: jsonContent,
      },
      {
        id: "husky",
        label: ".husky/commit-msg",
        filename: "commit-msg",
        language: "text",
        content: huskyScript,
      },
    ];
  }, [allowedTypes, selectedIds]);

  return (
    <ToolWorkspace maxWidth="wide">
      {/* Live Interactive Commit Message Validator */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-semibold text-[rgb(var(--fg))]">
            Test Commit Message Against Your Rules
          </label>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {validationResult.valid ? (
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Passes</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-500">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Invalid</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={testCommit}
            onChange={(e) => setTestCommit(e.target.value)}
            placeholder="e.g. feat(auth): add google login button"
            className="h-9 font-mono text-xs"
          />
        </div>
        <p className="text-[11px] text-[rgb(var(--muted))]">
          {validationResult.message}
        </p>
      </div>

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
              totalCount={COMMITLINT_OPTIONS.length}
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
            configTip="Integrate Commitlint with Husky by running 'npx husky init' and placing the commit-msg hook into your .husky/ directory."
          />
        }
      />
    </ToolWorkspace>
  );
}
