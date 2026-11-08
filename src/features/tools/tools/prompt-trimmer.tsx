"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Scissors,
  Sparkles,
  TrendingDown,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Cpu,
  FileCheck,
  Zap,
  Split,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MODELS, MODEL_LIST } from "@/lib/tokenizer/models";
import { tokenizeText } from "@/lib/tokenizer/tokenizer-engine";
import type { ModelId } from "@/lib/tokenizer/types";

interface TrimmerRule {
  id: string;
  name: string;
  category: "filler" | "conciseness" | "formatting" | "imperative";
  description: string;
  pattern: RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
}

const RULES: TrimmerRule[] = [
  // 1. Politeness & Conversational Filler
  {
    id: "filler-polite-please",
    name: "Strip Polite Greetings & Pleases",
    category: "filler",
    description: "Removes please, kindly, and courtesy greetings that waste system prompt tokens.",
    pattern: /\b(?:please\s+(?:note\s+that\s+|make\s+sure\s+(?:that\s+)?|ensure\s+(?:that\s+)?|remember\s+(?:to\s+)?)|kindly\s+(?:note|ensure|make\s+sure)\b|please\s+)/gi,
    replacement: "",
  },
  {
    id: "filler-ai-disclaimers",
    name: "Remove AI Self-References",
    category: "filler",
    description: "Strips 'As an AI language model', 'As an assistant', etc.",
    pattern: /\b(?:as\s+an\s+ai(?:\s+language\s+model)?,\s*|as\s+a\s+(?:helpful\s+)?assistant,\s*)/gi,
    replacement: "",
  },
  {
    id: "filler-task-preambles",
    name: "Trim Wordy Task Preambles",
    category: "filler",
    description: "Removes 'Your task is to', 'You are expected to', 'You are required to'.",
    pattern: /\b(?:your\s+(?:primary\s+)?task\s+is\s+to\s+|you\s+are\s+(?:expected|required|instructed)\s+to\s+|it\s+is\s+(?:critical|essential|crucial)\s+that\s+you\s+)/gi,
    replacement: "",
  },
  {
    id: "filler-empty-closings",
    name: "Strip Closing Courtesy Bloat",
    category: "filler",
    description: "Removes 'Thank you for your assistance', 'Always do your best', etc.",
    pattern: /\b(?:thank\s+you\s+(?:very\s+much\s+)?for\s+(?:your\s+)?(?:help|assistance|time)[.!]?|always\s+prioritize\s+doing\s+your\s+best[.!]?)/gi,
    replacement: "",
  },

  // 2. Concise Vocabulary Replacements
  {
    id: "concise-in-order-to",
    name: "'in order to' ➔ 'to'",
    category: "conciseness",
    description: "Simplifies wordy infinitive phrases.",
    pattern: /\bin order to\b/gi,
    replacement: "to",
  },
  {
    id: "concise-due-to",
    name: "'due to the fact that' ➔ 'because'",
    category: "conciseness",
    description: "Replaces 5-word causal idiom with a single direct conjunction.",
    pattern: /\bdue to the fact that\b/gi,
    replacement: "because",
  },
  {
    id: "concise-utilize",
    name: "'utilize' ➔ 'use'",
    category: "conciseness",
    description: "Replaces pretentious jargon with clear monosyllabic verbs.",
    pattern: /\butilize(s|d|ing)?\b/gi,
    replacement: (m) => {
      const lower = m.toLowerCase();
      if (lower === "utilizes") return "uses";
      if (lower === "utilized") return "used";
      if (lower === "utilizing") return "using";
      return "use";
    },
  },
  {
    id: "concise-at-this-time",
    name: "'at the present time' ➔ 'now'",
    category: "conciseness",
    description: "Simplifies temporal expressions.",
    pattern: /\b(?:at\s+the\s+present\s+time|at\s+this\s+point\s+in\s+time)\b/gi,
    replacement: "now",
  },
  {
    id: "concise-prior-to",
    name: "'prior to' / 'subsequent to' ➔ 'before' / 'after'",
    category: "conciseness",
    description: "Replaces formal multi-word prepositions.",
    pattern: /\b(?:prior to|subsequent to)\b/gi,
    replacement: (m) => (m.toLowerCase().startsWith("prior") ? "before" : "after"),
  },
  {
    id: "concise-capable-of",
    name: "'is capable of' ➔ 'can'",
    category: "conciseness",
    description: "Converts wordy modal constructions into concise verbs.",
    pattern: /\b(?:is\s+capable\s+of|has\s+the\s+ability\s+to)\b/gi,
    replacement: "can",
  },

  // 3. Formatting & Markdown Bloat
  {
    id: "fmt-trailing-spaces",
    name: "Strip Trailing Whitespace",
    category: "formatting",
    description: "Removes useless invisible spaces and tabs at the ends of lines.",
    pattern: /[ \t]+$/gm,
    replacement: "",
  },
  {
    id: "fmt-excess-newlines",
    name: "Collapse Excess Blank Lines",
    category: "formatting",
    description: "Limits vertical gaps to at most one blank line.",
    pattern: /\n{3,}/g,
    replacement: "\n\n",
  },
  {
    id: "fmt-html-comments",
    name: "Strip HTML/Markdown Comments",
    category: "formatting",
    description: "Strips out invisible <!-- ... --> comments that consume prompt tokens.",
    pattern: /<!--[\s\S]*?-->/g,
    replacement: "",
  },

  // 4. Imperative Mood Optimization
  {
    id: "imp-should-ensure",
    name: "'You should ensure' ➔ 'Ensure'",
    category: "imperative",
    description: "Converts weak suggestions into direct imperative directives.",
    pattern: /\byou\s+(?:should|must|ought\s+to)\s+(?:always\s+)?(ensure|provide|verify|return|include|format|check)\b/gi,
    replacement: (_: string, verb?: string) => verb ? (verb.charAt(0).toUpperCase() + verb.slice(1)) : "",
  },
];

const PRESETS = [
  {
    name: "Customer Support Agent (Wordy)",
    prompt: `You are a helpful, courteous, and polite customer support AI assistant for our SaaS company.
Please note that you should always make sure to greet the customer warmly.
As an AI language model, your primary task is to resolve tickets accurately and politely.
Due to the fact that customers may be frustrated, you should always utilize a patient tone.
In order to assist the user effectively, please make sure that you check their order ID prior to issuing a refund.
It is critical that you never share internal database IDs with external users at the present time.
Thank you for your assistance and always prioritize customer satisfaction!`,
  },
  {
    name: "Code Reviewer Prompt (Verbose)",
    prompt: `Act as a senior software architect. 
<!-- Internal guidelines version 2.4 -->
You are instructed to review the following code snippet.
You should ensure that you inspect the code for OWASP security vulnerabilities.
In order to improve performance, you are required to utilize Big-O analysis to find algorithmic bottlenecks.
It is important to remember that subsequent to reviewing the code, you must provide a clean refactored block.
Please note that you should always explain your reasoning step by step.


Thank you very much for your time and assistance.`,
  },
  {
    name: "JSON Extraction Schema",
    prompt: `Your primary task is to extract product entities from the unstructured text below.
You should make sure that you output valid JSON only, with no introductory text or conversational pleasantries.
Please note that in the event that a field is missing, you are required to set its value to null.
Prior to generating the final response, verify that all property keys are enclosed in double quotes.
In order to reduce output latency, do not include markdown backticks or commentary outside the JSON payload.`,
  },
];

export function PromptTrimmerTool({ tool }: { tool: ToolDef }) {
  const [inputPrompt, setInputPrompt] = useState(PRESETS[0].prompt);
  const [selectedModel, setSelectedModel] = useState<ModelId>("gpt-4o");
  const [activeRules, setActiveRules] = useState<Record<string, boolean>>(() =>
    RULES.reduce((acc, r) => ({ ...acc, [r.id]: true }), {})
  );
  const [viewMode, setViewMode] = useState<"side-by-side" | "diff">("side-by-side");

  const toggleRule = (id: string) => {
    setActiveRules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllRules = (enable: boolean) => {
    setActiveRules(RULES.reduce((acc, r) => ({ ...acc, [r.id]: enable }), {}));
  };

  // Compression Engine
  const { compressedPrompt, ruleStats } = useMemo(() => {
    let text = inputPrompt;
    const stats: Record<string, number> = {};

    RULES.forEach((rule) => {
      if (!activeRules[rule.id]) {
        stats[rule.id] = 0;
        return;
      }

      // Count matches
      const matches = text.match(rule.pattern);
      stats[rule.id] = matches ? matches.length : 0;

      // Apply replacement
      if (typeof rule.replacement === "function") {
        text = text.replace(rule.pattern, rule.replacement as any);
      } else {
        text = text.replace(rule.pattern, rule.replacement);
      }
    });

    // Final clean trim
    text = text.trim();

    return { compressedPrompt: text, ruleStats: stats };
  }, [inputPrompt, activeRules]);

  // Tokenize & Metrics
  const tokensOriginal = useMemo(
    () => tokenizeText(inputPrompt, selectedModel),
    [inputPrompt, selectedModel]
  );
  const tokensCompressed = useMemo(
    () => tokenizeText(compressedPrompt, selectedModel),
    [compressedPrompt, selectedModel]
  );

  const modelInfo = MODELS[selectedModel];
  const tokenDelta = tokensOriginal.totalTokens - tokensCompressed.totalTokens;
  const tokenPercentSaved =
    tokensOriginal.totalTokens > 0 ? (tokenDelta / tokensOriginal.totalTokens) * 100 : 0;

  const costSavingsPer1M = (tokenDelta / 1_000_000) * modelInfo.costPer1MInput;
  const totalTrimsApplied = Object.values(ruleStats).reduce((a, b) => a + b, 0);

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tokenizer Engine:
          </span>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as ModelId)}
            className="w-48 text-xs font-medium h-8 bg-background"
          >
            {MODEL_LIST.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.badge})
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setInputPrompt("")}
            className="text-xs h-8"
          >
            Clear
          </Button>
          <CopyButton value={compressedPrompt} />
        </div>
      </div>
      {/* Top Metric KPI Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-3.5 flex flex-col justify-between border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
            <span>Original Tokens</span>
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {tokensOriginal.totalTokens.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">tokens</span>
          </div>
        </Card>

        <Card className="p-3.5 flex flex-col justify-between border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
            <span>Compressed Tokens</span>
            <Scissors className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {tokensCompressed.totalTokens.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">tokens</span>
          </div>
        </Card>

        <Card className="p-3.5 flex flex-col justify-between border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
            <span>Token Reduction</span>
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {tokenPercentSaved > 0 ? `-${tokenPercentSaved.toFixed(1)}%` : "0%"}
            </span>
            <span className="text-xs text-muted-foreground">
              ({tokenDelta > 0 ? `-${tokenDelta}` : "0"} tokens)
            </span>
          </div>
        </Card>

        <Card className="p-3.5 flex flex-col justify-between border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
            <span>Est. Cost Saved / 1M Calls</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              ${costSavingsPer1M.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">saved / 1M</span>
          </div>
        </Card>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Sample Prompts:
        </span>
        {PRESETS.map((preset) => (
          <Button
            key={preset.name}
            size="sm"
            variant="secondary"
            className="text-xs h-7 whitespace-nowrap"
            onClick={() => setInputPrompt(preset.prompt)}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rules & Optimization Toggles (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Trimming Rules</h3>
              </div>
              <Badge variant="secondary" className="text-[11px] font-mono">
                {totalTrimsApplied} edits applied
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs mb-3 text-muted-foreground border-b pb-2">
              <span>Optimization Passes</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => selectAllRules(true)}
                  className="hover:text-primary transition-colors text-[11px]"
                >
                  Enable All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectAllRules(false)}
                  className="hover:text-primary transition-colors text-[11px]"
                >
                  Disable All
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {RULES.map((rule) => {
                const count = ruleStats[rule.id] || 0;
                return (
                  <label
                    key={rule.id}
                    className={cn(
                      "flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all",
                      activeRules[rule.id]
                        ? "bg-accent/40 border-accent text-foreground"
                        : "bg-muted/20 border-border/60 text-muted-foreground opacity-60"
                    )}
                  >
                    <Checkbox
                      checked={activeRules[rule.id]}
                      onChange={() => toggleRule(rule.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-foreground truncate">
                          {rule.name}
                        </span>
                        {count > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono py-0 px-1.5"
                          >
                            -{count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {rule.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Editor & Compressed Result (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Prompt */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>Input System Prompt</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {tokensOriginal.totalTokens} tokens
                  </Badge>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {tokensOriginal.totalCharacters} chars
                </span>
              </div>
              <Textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Paste your verbose system prompt or instructions here..."
                rows={16}
                className="font-mono text-xs leading-relaxed resize-y bg-background"
              />
            </div>

            {/* Compressed Output */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Compressed Output</span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    {tokensCompressed.totalTokens} tokens
                  </Badge>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {tokensCompressed.totalCharacters} chars
                </span>
              </div>
              <Textarea
                value={compressedPrompt}
                readOnly
                placeholder="Compressed prompt will appear here automatically..."
                rows={16}
                className="font-mono text-xs leading-relaxed resize-y bg-muted/20 border-emerald-500/30"
              />
            </div>
          </div>

          {/* Action Footer Bar */}
          <Card className="p-3 bg-muted/30 border-border flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">
                Compression is computed <strong className="text-foreground">100% locally</strong> in your browser.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setInputPrompt(compressedPrompt)}
                disabled={compressedPrompt === inputPrompt || !compressedPrompt}
                className="text-xs h-8"
              >
                Apply as Input (Re-compress)
              </Button>
              <CopyButton value={compressedPrompt} />
            </div>
          </Card>
        </div>
      </div>
    </ToolWorkspace>
  );
}

export default PromptTrimmerTool;
