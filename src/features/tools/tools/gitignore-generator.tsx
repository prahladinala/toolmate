"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, Download, Search, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const POPULAR_TEMPLATES = [
  "Node", "React", "Nextjs", "Python", "macOS", "Windows", "VisualStudioCode", "JetBrains"
];

export function GitignoreGeneratorTool({ tool }: { tool: ToolDef }) {
  const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(["Node", "VisualStudioCode", "macOS"]);
  const [search, setSearch] = useState("");
  const [loadingOutput, setLoadingOutput] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("https://www.toptal.com/developers/gitignore/api/list")
      .then((res) => res.text())
      .then((text) => {
        if (!isMounted) return;
        const rawItems = text.replace(/\n/g, ",").split(",");
        const cleanItems = rawItems.map((i) => i.trim()).filter(Boolean);
        setAvailableTemplates(cleanItems);
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to load global template catalogue. Using offline presets.");
          setAvailableTemplates(POPULAR_TEMPLATES);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const generate = useCallback(async () => {
    if (selectedTemplates.length === 0) {
      setOutput("");
      return;
    }
    setLoadingOutput(true);
    setError(null);
    try {
      const param = selectedTemplates.join(",");
      const res = await fetch(`https://www.toptal.com/developers/gitignore/api/${param}`);
      if (!res.ok) throw new Error("Failed to fetch gitignore rules.");
      let text = await res.text();
      text = text.replace(/# Created by https:\/\/www\.toptal\.com[^\n]*\n/g, "");
      setOutput(text.trim());
    } catch {
      setError("Network error fetching gitignore rules.");
    } finally {
      setLoadingOutput(false);
    }
  }, [selectedTemplates]);

  useEffect(() => {
    generate();
  }, [generate]);

  const addTemplate = (name: string) => {
    if (!selectedTemplates.includes(name)) {
      setSelectedTemplates([...selectedTemplates, name]);
      setSearch("");
    }
  };

  const removeTemplate = (name: string) => {
    setSelectedTemplates(selectedTemplates.filter((t) => t !== name));
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(".gitignore rules copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".gitignore";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded .gitignore!");
  };

  const searchResults = search.trim()
    ? availableTemplates
        .filter((t) => t.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 12)
    : [];

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Search and combine official .gitignore templates for OS, IDEs, and languages
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyToClipboard}
            disabled={!output}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={downloadFile}
            disabled={!output}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download .gitignore
          </Button>
        </div>
      </ToolToolbar>

      {/* Selected Tags & Search Input */}
      <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-2">
            Selected Targets:
          </span>
          {selectedTemplates.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTemplate(t)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {selectedTemplates.length === 0 && (
            <span className="text-xs text-[rgb(var(--muted))] italic">
              No templates selected. Add one below.
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[rgb(var(--muted))] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates (e.g. Node, Python, Next, macOS)..."
            className="pl-9 text-xs sm:text-sm h-11 bg-[rgb(var(--card-2))]"
          />

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-xl z-20 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto scrollbar-refined">
              {searchResults.map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => addTemplate(res)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[rgb(var(--card-2))] hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  + {res}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[rgb(var(--border))]">
          <span className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Quick Add:
          </span>
          {POPULAR_TEMPLATES.map((p) => (
            <button
              key={p}
              type="button"
              disabled={selectedTemplates.includes(p)}
              onClick={() => addTemplate(p)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] disabled:opacity-30 transition-colors"
            >
              +{p}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Output Editor */}
      <div className="space-y-2 w-full min-w-0">
        <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
          Generated .gitignore Content
        </span>
        <CodeEditor
          value={output}
          language="shell"
          editable={false}
          minHeight="min-h-[350px] sm:min-h-[460px]"
        />
      </div>
    </ToolWorkspace>
  );
}
