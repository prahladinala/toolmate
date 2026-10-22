"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const EDITORCONFIG_OPTIONS: ConfigOption[] = [
  // General Defaults
  {
    id: "rootTrue",
    name: "Root Config Marker",
    key: "root = true",
    category: "General",
    description: "Declares this file as the top-most EditorConfig file in the repository hierarchy.",
    whyItHelps: "Prevents IDE plugins from scanning up the parent folder hierarchy looking for conflicting configs.",
    example: "root = true",
    defaultChecked: true,
  },
  {
    id: "charsetUtf8",
    name: "UTF-8 Character Set",
    key: "charset = utf-8",
    category: "General",
    description: "Enforce UTF-8 encoding across all text files in the project.",
    whyItHelps: "Guarantees international characters, emojis, and symbols are parsed without corruption.",
    example: "charset = utf-8",
    defaultChecked: true,
  },

  // Indentation & Whitespace
  {
    id: "indentStyleSpace",
    name: "Space Indentation",
    key: "indent_style = space",
    category: "Indentation",
    description: "Use spaces instead of tab characters for indentation.",
    whyItHelps: "Spaces render identically across all browsers, terminals, GitHub PR views, and text editors.",
    example: "indent_style = space",
    defaultChecked: true,
  },
  {
    id: "indentSize2",
    name: "2-Space Indent Size",
    key: "indent_size = 2",
    category: "Indentation",
    description: "Set default indentation width to 2 spaces.",
    whyItHelps: "Standard convention for modern JavaScript, TypeScript, React, HTML, and JSON files.",
    example: "indent_size = 2",
    defaultChecked: true,
  },
  {
    id: "endOfLineLf",
    name: "Unix Line Endings (LF)",
    key: "endOfLine = lf",
    category: "Line Endings",
    description: "Enforce LF (\\n) line endings on all operating systems.",
    whyItHelps: "Stops git from converting line endings to CRLF on Windows, preventing full-file diff conflicts.",
    example: "end_of_line = lf",
    defaultChecked: true,
  },
  {
    id: "trimTrailingWhitespace",
    name: "Trim Trailing Whitespace",
    key: "trim_trailing_whitespace = true",
    category: "Line Endings",
    description: "Remove unnecessary whitespace characters at the ends of lines on save.",
    whyItHelps: "Stops invisible trailing whitespace from creating phantom changes in code reviews.",
    example: "trim_trailing_whitespace = true",
    defaultChecked: true,
  },
  {
    id: "insertFinalNewline",
    name: "Insert Final Newline",
    key: "insert_final_newline = true",
    category: "Line Endings",
    description: "Ensure saved files end with a blank newline character.",
    whyItHelps: "POSIX standard compliance; prevents 'No newline at end of file' warnings in git diffs and POSIX tools.",
    example: "insert_final_newline = true",
    defaultChecked: true,
  },

  // Language Overrides
  {
    id: "markdownOverride",
    name: "Markdown Whitespace Preservation",
    key: "[*.md] trim_trailing_whitespace = false",
    category: "Overrides",
    description: "Allow trailing whitespace in Markdown files.",
    whyItHelps: "In Markdown syntax, two trailing spaces create a manual line break (<br>). Trimming them breaks document formatting.",
    example: "[*.md]\ntrim_trailing_whitespace = false",
    defaultChecked: true,
  },
  {
    id: "pythonOverride",
    name: "Python 4-Space Indent",
    key: "[*.py] indent_size = 4",
    category: "Overrides",
    description: "Set indentation for Python (.py) files to 4 spaces.",
    whyItHelps: "Complies with official PEP 8 Python formatting standards.",
    example: "[*.py]\nindent_size = 4",
    defaultChecked: true,
  },
  {
    id: "makefileOverride",
    name: "Makefile Tab Requirement",
    key: "[Makefile] indent_style = tab",
    category: "Overrides",
    description: "Enforce hard tab characters for Makefiles.",
    whyItHelps: "GNU Make strictly requires hard tab characters for command recipes; spaces cause fatal make build errors.",
    example: "[Makefile]\nindent_style = tab",
    defaultChecked: true,
  },
  {
    id: "yamlOverride",
    name: "YAML 2-Space Indent",
    key: "[*.{yml,yaml}] indent_size = 2",
    category: "Overrides",
    description: "Enforce strict 2-space indentation for YAML workflow files.",
    whyItHelps: "YAML prohibits tabs and requires uniform 2-space nesting for GitHub Actions and Docker Compose files.",
    example: "[*.{yml,yaml}]\nindent_size = 2",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Fullstack Web",
    description: "Standard web project setup with UTF-8, 2 spaces, LF line endings, and file overrides",
    optionIds: [
      "rootTrue",
      "charsetUtf8",
      "indentStyleSpace",
      "indentSize2",
      "endOfLineLf",
      "trimTrailingWhitespace",
      "insertFinalNewline",
      "markdownOverride",
      "pythonOverride",
      "makefileOverride",
      "yamlOverride",
    ],
  },
  {
    id: "strict",
    name: "Strict Monorepo",
    description: "All overrides enabled with strict whitespace & line ending hygiene",
    optionIds: [
      "rootTrue",
      "charsetUtf8",
      "indentStyleSpace",
      "indentSize2",
      "endOfLineLf",
      "trimTrailingWhitespace",
      "insertFinalNewline",
      "markdownOverride",
      "pythonOverride",
      "makefileOverride",
      "yamlOverride",
    ],
  },
  {
    id: "minimal",
    name: "Minimal Defaults",
    description: "Basic UTF-8 and 2-space indentation only",
    optionIds: ["rootTrue", "charsetUtf8", "indentStyleSpace", "indentSize2", "endOfLineLf"],
  },
];

export function EditorconfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("editorconfig");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    EDITORCONFIG_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return EDITORCONFIG_OPTIONS.filter((opt) => {
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

  // Formats Generation
  const formats: OutputFormat[] = useMemo(() => {
    const lines: string[] = ["# EditorConfig helps maintain consistent coding styles across different IDEs and editors"];
    lines.push("# https://editorconfig.org\n");

    if (selectedIds.has("rootTrue")) {
      lines.push("root = true\n");
    }

    lines.push("[*]");
    if (selectedIds.has("charsetUtf8")) {
      lines.push("charset = utf-8");
    }
    if (selectedIds.has("indentStyleSpace")) {
      lines.push("indent_style = space");
    }
    if (selectedIds.has("indentSize2")) {
      lines.push("indent_size = 2");
    }
    if (selectedIds.has("endOfLineLf")) {
      lines.push("end_of_line = lf");
    }
    if (selectedIds.has("trimTrailingWhitespace")) {
      lines.push("trim_trailing_whitespace = true");
    }
    if (selectedIds.has("insertFinalNewline")) {
      lines.push("insert_final_newline = true");
    }

    if (selectedIds.has("markdownOverride")) {
      lines.push("\n[*.md]");
      lines.push("trim_trailing_whitespace = false");
    }

    if (selectedIds.has("pythonOverride")) {
      lines.push("\n[*.py]");
      lines.push("indent_size = 4");
    }

    if (selectedIds.has("makefileOverride")) {
      lines.push("\n[Makefile]");
      lines.push("indent_style = tab");
    }

    if (selectedIds.has("yamlOverride")) {
      lines.push("\n[*.{yml,yaml}]");
      lines.push("indent_size = 2");
    }

    const content = lines.join("\n") + "\n";

    return [
      {
        id: "editorconfig",
        label: ".editorconfig",
        filename: ".editorconfig",
        language: "text",
        content,
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
              totalCount={EDITORCONFIG_OPTIONS.length}
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
            configTip="Place this .editorconfig file in your project root. VS Code, JetBrains WebStorm, Sublime Text, and GitHub automatically respect these rules without extra npm dependencies."
          />
        }
      />
    </ToolWorkspace>
  );
}
