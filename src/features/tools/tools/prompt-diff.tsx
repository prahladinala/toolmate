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
import {
  Sparkles,
  ArrowRightLeft,
  Coins,
  Cpu,
  Layers,
  FileText,
  TrendingDown,
  TrendingUp,
  Columns2,
  Rows3,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MODELS, MODEL_LIST } from "@/lib/tokenizer/models";
import { tokenizeText } from "@/lib/tokenizer/tokenizer-engine";
import type { ModelId } from "@/lib/tokenizer/types";

const PROMPT_PRESETS = [
  {
    name: "System Prompt Compression",
    description: "Removing conversational filler and using concise imperatives.",
    v1: `You are a helpful and polite customer support AI assistant for ToolMate.
Please make sure that you are always polite, kind, and considerate when answering user queries.
If the user asks a question about JSON formatting or file conversions, you should explain the solution step by step in detail.
Do not provide incorrect information. If you do not know the answer, please tell the user that you don't know rather than hallucinating.
Thank you for your assistance and always prioritize customer satisfaction.`,
    v2: `You are ToolMate's AI support assistant.
Guidelines:
1. Be concise, polite, and accurate.
2. For JSON or file conversion queries, provide step-by-step solutions with code examples.
3. State "I don't know" rather than speculating.
4. Output Markdown formatting when explaining procedures.`,
  },
  {
    name: "Code Review Assistant",
    description: "Structuring rules into strict bullet points to reduce ambiguity.",
    v1: `Act as a senior software architect. When I paste code, you should review it and tell me what is wrong with it, especially performance problems, security vulnerabilities, or unclean code style. Try to provide the refactored code at the end so I can copy and paste it into my project.`,
    v2: `Role: Senior Software Architect & Code Reviewer.
Input: User code snippet.
Tasks:
- Identify security vulnerabilities (OWASP top 10).
- Identify algorithmic bottlenecks (Big-O analysis).
- Provide a drop-in refactored solution with explanation comments.
Format: Bulleted findings followed by a unified code block.`,
  },
  {
    name: "RAG Context Optimization",
    description: "Adding strict XML delimiters and minimizing token repetition.",
    v1: `Here is the context document:
Customer Order #9821
Total: $120.00
Status: Shipped via FedEx tracking #12345
Address: 123 Main St, Austin, TX

Please read the context above and answer the following question: Where is the package being shipped to? Make sure you only use the context provided.`,
    v2: `<context>
Order: #9821 | Total: $120.00 | Shipped: FedEx #12345 | Destination: 123 Main St, Austin, TX
</context>
Question: Where is the package being shipped?
Constraint: Use only facts from <context>. Respond with the destination address only.`,
  },
];

// Simple word-level diff implementation (pure JS, 0 external runtime bugs)
type DiffPart = {
  type: "same" | "added" | "removed";
  value: string;
};

function computeWordDiff(text1: string, text2: string): DiffPart[] {
  const words1 = text1.split(/(\s+)/);
  const words2 = text2.split(/(\s+)/);

  const dp: number[][] = Array(words1.length + 1)
    .fill(0)
    .map(() => Array(words2.length + 1).fill(0));

  for (let i = 1; i <= words1.length; i++) {
    for (let j = 1; j <= words2.length; j++) {
      if (words1[i - 1] === words2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffPart[] = [];
  let i = words1.length;
  let j = words2.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
      result.unshift({ type: "same", value: words1[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", value: words2[j - 1] });
      j--;
    } else if (i > 0) {
      result.unshift({ type: "removed", value: words1[i - 1] });
      i--;
    }
  }

  // Merge consecutive parts with same type
  const merged: DiffPart[] = [];
  for (const part of result) {
    if (merged.length > 0 && merged[merged.length - 1].type === part.type) {
      merged[merged.length - 1].value += part.value;
    } else {
      merged.push({ ...part });
    }
  }

  return merged;
}

export function PromptDiffTool({ tool }: { tool: ToolDef }) {
  const [promptV1, setPromptV1] = useState(PROMPT_PRESETS[0].v1);
  const [promptV2, setPromptV2] = useState(PROMPT_PRESETS[0].v2);
  const [selectedModel, setSelectedModel] = useState<ModelId>("gpt-4o");
  const [viewMode, setViewMode] = useState<"side-by-side" | "inline">("side-by-side");

  const modelInfo = MODELS[selectedModel];

  // Tokenize both versions
  const tokensV1 = useMemo(() => tokenizeText(promptV1, selectedModel), [promptV1, selectedModel]);
  const tokensV2 = useMemo(() => tokenizeText(promptV2, selectedModel), [promptV2, selectedModel]);

  // Diff calculation
  const diffParts = useMemo(() => computeWordDiff(promptV1, promptV2), [promptV1, promptV2]);

  // Metrics comparison
  const metrics = useMemo(() => {
    const tokenDelta = tokensV2.totalTokens - tokensV1.totalTokens;
    const tokenPercent =
      tokensV1.totalTokens > 0 ? (tokenDelta / tokensV1.totalTokens) * 100 : 0;

    const charDelta = tokensV2.totalCharacters - tokensV1.totalCharacters;
    const charPercent =
      tokensV1.totalCharacters > 0 ? (charDelta / tokensV1.totalCharacters) * 100 : 0;

    const costV1 = (tokensV1.totalTokens / 1_000_000) * modelInfo.costPer1MInput;
    const costV2 = (tokensV2.totalTokens / 1_000_000) * modelInfo.costPer1MInput;
    const costDelta = costV2 - costV1;
    const costSavingsPer1MCalls = (costV1 - costV2) * 1_000_000;

    return {
      tokenDelta,
      tokenPercent,
      charDelta,
      charPercent,
      costDelta,
      costSavingsPer1MCalls,
      isSavings: tokenDelta < 0,
      isIdentical: tokenDelta === 0 && promptV1 === promptV2,
    };
  }, [tokensV1, tokensV2, modelInfo, promptV1, promptV2]);

  const handleSwap = () => {
    const temp = promptV1;
    setPromptV1(promptV2);
    setPromptV2(temp);
  };

  const handleClear = () => {
    setPromptV1("");
    setPromptV2("");
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Header controls & Presets */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-[rgba(var(--fg),0.08)] shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tokenizer:
            </span>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              className="h-8 text-xs font-medium w-48 bg-background"
            >
              {MODEL_LIST.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.badge})
                </option>
              ))}
            </Select>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* View mode toggle */}
          <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border">
            <Button
              type="button"
              variant={viewMode === "side-by-side" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("side-by-side")}
              className="h-7 px-2.5 text-xs"
            >
              <Columns2 className="w-3.5 h-3.5 mr-1" />
              Side-by-Side
            </Button>
            <Button
              type="button"
              variant={viewMode === "inline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("inline")}
              className="h-7 px-2.5 text-xs"
            >
              <Rows3 className="w-3.5 h-3.5 mr-1" />
              Inline Diff
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSwap}
            className="h-8 text-xs gap-1.5"
            title="Swap V1 and V2"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Swap
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {PROMPT_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => {
              setPromptV1(preset.v1);
              setPromptV2(preset.v2);
            }}
            className="text-xs px-2.5 py-1 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Impact Metric Hero Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Token Count Delta */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Token Impact
            </span>
            {metrics.isIdentical ? (
              <Badge variant="outline" className="text-[10px]">Identical</Badge>
            ) : metrics.isSavings ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1">
                <TrendingDown className="w-3 h-3" />
                {Math.abs(metrics.tokenPercent).toFixed(1)}% Saved
              </Badge>
            ) : (
              <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] gap-1">
                <TrendingUp className="w-3 h-3" />
                +{Math.abs(metrics.tokenPercent).toFixed(1)}% Increase
              </Badge>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {metrics.tokenDelta > 0 ? `+${metrics.tokenDelta}` : metrics.tokenDelta}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              ({tokensV1.totalTokens} → {tokensV2.totalTokens} tokens)
            </span>
          </div>
        </Card>

        {/* Character Delta */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Characters
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {metrics.charDelta > 0 ? `+${metrics.charDelta}` : metrics.charDelta} chars
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {tokensV2.totalCharacters}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              vs {tokensV1.totalCharacters} original
            </span>
          </div>
        </Card>

        {/* Compression Efficiency */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Chars / Token
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {tokensV2.charsPerToken} c/t
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {tokensV2.totalWords}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              words in revised
            </span>
          </div>
        </Card>

        {/* Cost Delta per 1M Requests */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-500" /> Cost Delta (1M Calls)
            </span>
            <span className="text-[10px] text-muted-foreground">
              ${modelInfo.costPer1MInput}/1M
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-2xl font-bold font-mono tracking-tight",
                metrics.isSavings
                  ? "text-emerald-600 dark:text-emerald-400"
                  : metrics.tokenDelta > 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-foreground"
              )}
            >
              {metrics.isSavings
                ? `-$${Math.abs(metrics.costSavingsPer1MCalls).toFixed(2)}`
                : metrics.tokenDelta > 0
                ? `+$${Math.abs(metrics.costSavingsPer1MCalls).toFixed(2)}`
                : "$0.00"}
            </span>
            <span className="text-xs text-muted-foreground">
              {metrics.isSavings ? "saved / 1M" : "delta / 1M"}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Diff Workspaces */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Version 1 Pane */}
          <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Original Prompt (V1)
                </span>
                <Badge variant="outline" className="font-mono text-xs">
                  {tokensV1.totalTokens} tokens
                </Badge>
              </div>
              <CopyButton value={promptV1} />
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <Textarea
                value={promptV1}
                onChange={(e) => setPromptV1(e.target.value)}
                placeholder="Paste original prompt version..."
                rows={12}
                className="w-full flex-1 resize-y font-mono text-sm leading-relaxed border-border/60 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Version 2 Pane */}
          <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Revised Prompt (V2)
                </span>
                <Badge
                  className={cn(
                    "font-mono text-xs",
                    metrics.isSavings
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {tokensV2.totalTokens} tokens
                </Badge>
              </div>
              <CopyButton value={promptV2} />
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <Textarea
                value={promptV2}
                onChange={(e) => setPromptV2(e.target.value)}
                placeholder="Paste revised prompt version..."
                rows={12}
                className="w-full flex-1 resize-y font-mono text-sm leading-relaxed border-border/60 focus-visible:ring-1"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Semantic Inline Visual Diff Box */}
      <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Semantic Word & Token Diff
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500" />
              Added in V2
            </span>
            <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40 border border-rose-500" />
              Removed from V1
            </span>
          </div>
        </div>

        <div className="p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
          {diffParts.length === 0 ? (
            <span className="text-muted-foreground italic">No prompt text to compare.</span>
          ) : (
            diffParts.map((part, index) => {
              if (part.type === "added") {
                return (
                  <span
                    key={index}
                    className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-b-2 border-emerald-500 px-0.5 rounded-xs"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.type === "removed") {
                return (
                  <span
                    key={index}
                    className="bg-rose-500/20 text-rose-800 dark:text-rose-200 line-through border-b-2 border-rose-500 px-0.5 rounded-xs opacity-75"
                  >
                    {part.value}
                  </span>
                );
              }
              return <span key={index}>{part.value}</span>;
            })
          )}
        </div>
      </Card>
    </ToolWorkspace>
  );
}
