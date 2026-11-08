"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  GitCommit,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Code2,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PRESETS = [
  {
    name: "Email Address",
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    flags: "i",
    test: "hello.world@toolmate.co.in",
  },
  {
    name: "SemVer Version",
    pattern: "^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(-[a-zA-Z0-9.-]+)?$",
    flags: "",
    test: "v2.14.0-rc.1",
  },
  {
    name: "IPv4 Address",
    pattern: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    flags: "",
    test: "192.168.1.254",
  },
  {
    name: "ISO 8601 Date",
    pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
    flags: "",
    test: "2026-11-08",
  },
];

type RailroadNode = {
  id: string;
  type: "literal" | "set" | "group" | "quantifier" | "anchor" | "or";
  label: string;
  sublabel?: string;
  color: string;
};

// Resilient Regex Parser into Visual Blocks
function parseRegexToNodes(pattern: string): RailroadNode[] {
  const nodes: RailroadNode[] = [];
  let i = 0;

  while (i < pattern.length) {
    const char = pattern[i];

    // Anchors
    if (char === "^") {
      nodes.push({ id: `n_${i}`, type: "anchor", label: "Start of Line (^)", color: "rose" });
      i++;
    } else if (char === "$") {
      nodes.push({ id: `n_${i}`, type: "anchor", label: "End of Line ($)", color: "rose" });
      i++;
    }
    // Character Set [a-z0-9]
    else if (char === "[") {
      const closeIdx = pattern.indexOf("]", i);
      if (closeIdx !== -1) {
        const setContent = pattern.slice(i, closeIdx + 1);
        nodes.push({
          id: `n_${i}`,
          type: "set",
          label: setContent,
          sublabel: "Character Class",
          color: "indigo",
        });
        i = closeIdx + 1;
      } else {
        nodes.push({ id: `n_${i}`, type: "literal", label: char, color: "slate" });
        i++;
      }
    }
    // Groups (...)
    else if (char === "(") {
      let depth = 1;
      let j = i + 1;
      while (j < pattern.length && depth > 0) {
        if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++;
        if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--;
        j++;
      }
      const groupContent = pattern.slice(i, j);
      nodes.push({
        id: `n_${i}`,
        type: "group",
        label: groupContent.length > 25 ? groupContent.slice(0, 22) + "..." : groupContent,
        sublabel: "Group",
        color: "emerald",
      });
      i = j;
    }
    // Quantifiers +, *, ?, {m,n}
    else if (char === "+" || char === "*" || char === "?") {
      const prev = nodes[nodes.length - 1];
      if (prev) {
        const desc = char === "+" ? "One or more (+)" : char === "*" ? "Zero or more (*)" : "Optional (?)";
        prev.sublabel = (prev.sublabel ? `${prev.sublabel} ` : "") + desc;
      }
      i++;
    } else if (char === "{") {
      const closeIdx = pattern.indexOf("}", i);
      if (closeIdx !== -1) {
        const qContent = pattern.slice(i, closeIdx + 1);
        const prev = nodes[nodes.length - 1];
        if (prev) {
          prev.sublabel = (prev.sublabel ? `${prev.sublabel} ` : "") + qContent;
        }
        i = closeIdx + 1;
      } else {
        i++;
      }
    }
    // Alternation |
    else if (char === "|") {
      nodes.push({ id: `n_${i}`, type: "or", label: "OR (|)", color: "amber" });
      i++;
    }
    // Escaped chars
    else if (char === "\\") {
      const next = pattern[i + 1] || "";
      let label = `\\${next}`;
      if (next === "d") label = "Digit (\\d)";
      if (next === "w") label = "Word char (\\w)";
      if (next === "s") label = "Whitespace (\\s)";
      nodes.push({ id: `n_${i}`, type: "literal", label, color: "sky" });
      i += 2;
    } else {
      nodes.push({ id: `n_${i}`, type: "literal", label: JSON.stringify(char), color: "slate" });
      i++;
    }
  }

  return nodes;
}

export function RegexRailroadTool({ tool }: { tool: ToolDef }) {
  const [pattern, setPattern] = useState(PRESETS[0].pattern);
  const [flags, setFlags] = useState(PRESETS[0].flags);
  const [testString, setTestString] = useState(PRESETS[0].test);

  // Railroad Nodes
  const nodes = useMemo(() => parseRegexToNodes(pattern), [pattern]);

  // Match Execution
  const matchResult = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const isMatch = re.test(testString);

      // Collect all matches
      const matches: { text: string; index: number; groups?: string[] }[] = [];
      const globalRe = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      let m: RegExpExecArray | null;

      while ((m = globalRe.exec(testString)) !== null) {
        matches.push({
          text: m[0],
          index: m.index,
          groups: m.slice(1),
        });
        if (!globalRe.global) break;
      }

      return {
        error: null,
        isMatch,
        matches,
      };
    } catch (err: any) {
      return {
        error: err?.message || "Invalid regular expression",
        isMatch: false,
        matches: [],
      };
    }
  }, [pattern, flags, testString]);

  // Flag toggle handler
  const toggleFlag = (f: string) => {
    if (flags.includes(f)) {
      setFlags(flags.replace(f, ""));
    } else {
      setFlags(flags + f);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Presets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              setPattern(p.pattern);
              setFlags(p.flags);
              setTestString(p.test);
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Regex Input Bar */}
      <Card className="p-4 bg-card/90 border-border/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base text-muted-foreground">/</span>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regular expression pattern..."
            className="font-mono text-sm h-10 flex-1"
          />
          <span className="font-mono text-base text-muted-foreground">/</span>

          {/* Flag Toggle Pills */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
            {[
              { id: "g", label: "global" },
              { id: "i", label: "insensitive" },
              { id: "m", label: "multiline" },
              { id: "s", label: "dotAll" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFlag(f.id)}
                className={cn(
                  "px-2 py-0.5 rounded-md text-xs font-mono font-semibold transition-all",
                  flags.includes(f.id)
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={f.label}
              >
                {f.id}
              </button>
            ))}
          </div>
        </div>

        {matchResult.error ? (
          <span className="text-xs font-mono text-rose-500 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            {matchResult.error}
          </span>
        ) : null}
      </Card>

      {/* Visual Railroad Diagram Strip */}
      <Card className="p-6 bg-card/90 border-border/80 shadow-xs space-y-3 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-primary" /> Visual Railroad Sequence Track
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {nodes.length} structural elements parsed
          </span>
        </div>

        {/* Horizontal Track Flow */}
        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 overflow-x-auto scrollbar-none flex items-center gap-2 py-6 min-h-[120px]">
          {/* Start Circle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-xs" title="Start" />
            <div className="w-4 h-0.5 bg-border" />
          </div>

          {nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <div
                className={cn(
                  "px-3 py-2 rounded-xl border shadow-xs text-xs font-mono flex flex-col items-center justify-center shrink-0 transition-all",
                  node.type === "anchor"
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold"
                    : node.type === "set"
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : node.type === "group"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : node.type === "or"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                    : "bg-card border-border text-foreground"
                )}
              >
                <span>{node.label}</span>
                {node.sublabel ? (
                  <span className="text-[9px] text-muted-foreground font-sans mt-0.5">
                    {node.sublabel}
                  </span>
                ) : null}
              </div>

              {i < nodes.length - 1 ? (
                <div className="w-3 h-0.5 bg-border shrink-0" />
              ) : null}
            </React.Fragment>
          ))}

          {/* End Circle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-4 h-0.5 bg-border" />
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-xs" title="End" />
          </div>
        </div>
      </Card>

      {/* Test String & Match Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test String Input */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Test String
            </span>
            <Badge
              className={cn(
                "font-mono text-xs",
                matchResult.isMatch
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              )}
            >
              {matchResult.isMatch ? "Match Found" : "No Match"}
            </Badge>
          </div>
          <div className="p-3 flex-1 flex flex-col">
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter test text to match against..."
              rows={8}
              className="font-mono text-xs leading-relaxed resize-y border-border/60"
            />
          </div>
        </div>

        {/* Match Breakdown & Groups */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Match Details ({matchResult.matches.length} captured)
            </span>
            <CopyButton value={pattern} text="Copy Pattern" />
          </div>

          <div className="p-4 flex-1 overflow-auto bg-muted/10 font-mono text-xs space-y-2">
            {matchResult.matches.length === 0 ? (
              <span className="text-muted-foreground italic">
                Pattern does not match the test string.
              </span>
            ) : (
              matchResult.matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5"
                >
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-bold text-foreground">
                      Match #{idx + 1}: "{m.text}"
                    </span>
                    <span className="text-[10px]">Index: {m.index}</span>
                  </div>

                  {m.groups && m.groups.length > 0 ? (
                    <div className="pt-1.5 border-t border-border/60 space-y-1">
                      <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                        Capture Groups:
                      </span>
                      {m.groups.map((grp, gIdx) => (
                        <div key={gIdx} className="text-[11px] text-muted-foreground pl-2">
                          Group ${gIdx + 1}: <span className="text-foreground font-semibold">{grp ?? "undefined"}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
