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
  Hash,
  Info,
  Check,
  Zap,
  TrendingDown,
  TrendingUp,
  X,
  Code2,
  Sliders,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MODELS, MODEL_LIST } from "@/lib/tokenizer/models";
import { tokenizeText, compareModels } from "@/lib/tokenizer/tokenizer-engine";
import { PROMPT_PRESETS } from "@/lib/tokenizer/presets";
import type { ModelId, Token, TokenizeResult } from "@/lib/tokenizer/types";

// 8 distinct, accessible token highlight color themes (light & dark mode compliant)
const TOKEN_COLOR_CLASSES = [
  "bg-indigo-500/15 text-indigo-700 dark:text-indigo-200 border-indigo-400/30 hover:bg-indigo-500/25",
  "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-400/30 hover:bg-emerald-500/25",
  "bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-400/30 hover:bg-amber-500/25",
  "bg-rose-500/15 text-rose-800 dark:text-rose-200 border-rose-400/30 hover:bg-rose-500/25",
  "bg-sky-500/15 text-sky-800 dark:text-sky-200 border-sky-400/30 hover:bg-sky-500/25",
  "bg-purple-500/15 text-purple-800 dark:text-purple-200 border-purple-400/30 hover:bg-purple-500/25",
  "bg-orange-500/15 text-orange-900 dark:text-orange-200 border-orange-400/30 hover:bg-orange-500/25",
  "bg-teal-500/15 text-teal-800 dark:text-teal-200 border-teal-400/30 hover:bg-teal-500/25",
];

export function LlmTokenizerTool({ tool }: { tool: ToolDef }) {
  const [inputText, setInputText] = useState(PROMPT_PRESETS[0].text);
  const [modelA, setModelA] = useState<ModelId>("gpt-4o");
  const [modelB, setModelB] = useState<ModelId>("gpt-4");
  const [compareMode, setCompareMode] = useState(true);
  const [viewMode, setViewMode] = useState<"visual" | "ids">("visual");
  const [selectedTokenA, setSelectedTokenA] = useState<Token | null>(null);
  const [selectedTokenB, setSelectedTokenB] = useState<Token | null>(null);

  // Tokenization computations
  const resultA: TokenizeResult = useMemo(() => {
    return tokenizeText(inputText, modelA);
  }, [inputText, modelA]);

  const resultB: TokenizeResult = useMemo(() => {
    return tokenizeText(inputText, modelB);
  }, [inputText, modelB]);

  const comparison = useMemo(() => {
    return compareModels(inputText, modelA, modelB);
  }, [inputText, modelA, modelB]);

  const swapModels = () => {
    const temp = modelA;
    setModelA(modelB);
    setModelB(temp);
  };

  const activeToken = selectedTokenA || resultA.tokens[0] || null;

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* 1. Header Toolbar & Quick-Load Presets */}
      <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))] mr-1">
              Sample Prompts:
            </span>
            {PROMPT_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                size="sm"
                variant={inputText === preset.text ? "primary" : "secondary"}
                onClick={() => {
                  setInputText(preset.text);
                  setSelectedTokenA(null);
                  setSelectedTokenB(null);
                }}
                className="h-8 text-xs gap-1.5"
                title={preset.description}
              >
                <span>{preset.title}</span>
              </Button>
            ))}
            {inputText && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setInputText("")}
                className="h-8 text-xs gap-1 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </Button>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
            <button
              type="button"
              onClick={() => setCompareMode(false)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none",
                !compareMode
                  ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-xs border border-[rgb(var(--border))]"
                  : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              )}
            >
              Single Model
            </button>
            <button
              type="button"
              onClick={() => setCompareMode(true)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none flex items-center gap-1",
                compareMode
                  ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-xs border border-[rgb(var(--border))]"
                  : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              )}
            >
              <ArrowRightLeft className="w-3 h-3 text-[rgb(var(--accent))]" />
              <span>Compare Models</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Model Selection & Quick KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
        {/* Model A Selector Card */}
        <div
          className={cn(
            "p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-3",
            compareMode ? "lg:col-span-5" : "lg:col-span-12"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg))]">
                {compareMode ? "Model A (Baseline)" : "Selected Model"}
              </label>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              {MODELS[modelA].badge}
            </Badge>
          </div>

          <Select
            value={modelA}
            onChange={(e) => setModelA(e.target.value as ModelId)}
            className="font-semibold text-xs"
          >
            {MODEL_LIST.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider})
              </option>
            ))}
          </Select>

          {/* Metric Chips */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
              <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-semibold">
                Tokens
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-[rgb(var(--fg))]">
                {resultA.totalTokens.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
              <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-semibold">
                Chars / Token
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-[rgb(var(--fg))]">
                {resultA.charsPerToken}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
              <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-semibold">
                Cost / 1k Calls
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ${(resultA.estimatedCostInput * 1000).toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Differential Card (Center / Swap) */}
        {compareMode && (
          <>
            <div className="lg:col-span-2 flex flex-col justify-center items-center gap-2 p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--accent),0.03)] text-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={swapModels}
                className="h-8 px-2.5 text-xs gap-1.5"
                title="Swap Model A and Model B"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap</span>
              </Button>

              {resultA.totalTokens > 0 && resultB.totalTokens > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                    Difference
                  </div>
                  <div
                    className={cn(
                      "text-sm font-bold font-mono flex items-center justify-center gap-1",
                      comparison.tokenDifference < 0
                        ? "text-rose-500"
                        : comparison.tokenDifference > 0
                        ? "text-emerald-500"
                        : "text-[rgb(var(--fg))]"
                    )}
                  >
                    {comparison.tokenDifference > 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : comparison.tokenDifference < 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : null}
                    <span>
                      {comparison.percentDifference > 0 ? "+" : ""}
                      {comparison.percentDifference}%
                    </span>
                  </div>
                  <p className="text-[10px] text-[rgb(var(--muted))] leading-tight">
                    {comparison.tokenDifference > 0
                      ? `${MODELS[modelA].name} uses ${Math.abs(
                          comparison.tokenDifference
                        )} fewer tokens`
                      : comparison.tokenDifference < 0
                      ? `${MODELS[modelB].name} uses ${Math.abs(
                          comparison.tokenDifference
                        )} fewer tokens`
                      : "Identical token count"}
                  </p>
                </div>
              )}
            </div>

            {/* Model B Selector Card */}
            <div className="lg:col-span-5 p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg))]">
                    Model B (Comparison)
                  </label>
                </div>
                <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                  {MODELS[modelB].badge}
                </Badge>
              </div>

              <Select
                value={modelB}
                onChange={(e) => setModelB(e.target.value as ModelId)}
                className="font-semibold text-xs"
              >
                {MODEL_LIST.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </Select>

              {/* Metric Chips */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
                  <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-semibold">
                    Tokens
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[rgb(var(--fg))]">
                    {resultB.totalTokens.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
                  <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-semibold">
                    Chars / Token
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[rgb(var(--fg))]">
                    {resultB.charsPerToken}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
                  <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-semibold">
                    Cost / 1k Calls
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    ${(resultB.estimatedCostInput * 1000).toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Text Input Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[rgb(var(--muted))]">
          <label className="font-semibold text-[rgb(var(--fg))]">
            Input Text / Prompt
          </label>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>{resultA.totalCharacters.toLocaleString()} characters</span>
            <span>•</span>
            <span>{resultA.totalWords.toLocaleString()} words</span>
          </div>
        </div>

        <Textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setSelectedTokenA(null);
            setSelectedTokenB(null);
          }}
          placeholder="Paste code, prompts, JSON, or text here to see real-time token visualization..."
          className="min-h-[140px] font-mono text-xs sm:text-sm leading-relaxed rounded-2xl bg-[rgb(var(--card))]"
        />
      </div>

      {/* 4. Token Inspector Ribbon (Shows selected token details) */}
      {activeToken && (
        <div className="p-3.5 sm:p-4 rounded-2xl border border-[rgba(var(--accent),0.3)] bg-[rgba(var(--accent),0.03)] space-y-2 shadow-xs animate-in fade-in-50 duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]">
                <Info className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-[rgb(var(--fg))]">
                Token Inspector
              </span>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Token #{activeToken.index + 1}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton
                value={String(activeToken.id)}
                text="Copy Token ID"
                size="sm"
                variant="secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
            <div className="p-2 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
              <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-sans font-semibold">
                Token ID
              </div>
              <div className="text-sm font-bold text-[rgb(var(--accent))]">
                {activeToken.id}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
              <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-sans font-semibold">
                String Piece
              </div>
              <div className="text-sm font-bold text-[rgb(var(--fg))] truncate">
                {JSON.stringify(activeToken.text)}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
              <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-sans font-semibold">
                Bytes ({activeToken.bytes.length})
              </div>
              <div className="text-xs font-medium text-[rgb(var(--muted))] truncate">
                {activeToken.bytes.length > 0 ? `[${activeToken.bytes.join(", ")}]` : "--"}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
              <div className="text-[10px] text-[rgb(var(--muted))] uppercase font-sans font-semibold">
                Hex Dump
              </div>
              <div className="text-xs font-medium text-[rgb(var(--muted))] truncate">
                {activeToken.hex}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Visual Token Display Streams */}
      <div className="space-y-4">
        {/* View Mode Controls */}
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[rgb(var(--accent))]" />
            <h3 className="text-sm font-bold text-[rgb(var(--fg))]">
              Visual Token Breakdown
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
              <button
                type="button"
                onClick={() => setViewMode("visual")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all select-none",
                  viewMode === "visual"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-xs border border-[rgb(var(--border))]"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                )}
              >
                Visual Chips
              </button>
              <button
                type="button"
                onClick={() => setViewMode("ids")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all select-none",
                  viewMode === "ids"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-xs border border-[rgb(var(--border))]"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                )}
              >
                Token IDs Array
              </button>
            </div>
          </div>
        </div>

        {/* Content View: Single or Side-by-side */}
        <div
          className={cn(
            "grid gap-4",
            compareMode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          )}
        >
          {/* Stream A */}
          <div className="flex flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))]">
              <div className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--fg))]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{MODELS[modelA].name}</span>
                <Badge variant="secondary" size="sm" className="font-mono text-[10px]">
                  {resultA.totalTokens} tokens
                </Badge>
              </div>

              <CopyButton
                value={
                  viewMode === "ids"
                    ? JSON.stringify(resultA.tokens.map((t) => t.id))
                    : resultA.tokens.map((t) => t.text).join("")
                }
                text={viewMode === "ids" ? "Copy IDs" : "Copy Text"}
                size="sm"
                variant="ghost"
              />
            </div>

            <div className="p-4 min-h-[220px] max-h-[460px] overflow-y-auto scrollbar-refined font-mono text-xs sm:text-sm leading-relaxed">
              {resultA.tokens.length === 0 ? (
                <div className="p-8 text-center text-[rgb(var(--muted))] text-xs font-sans">
                  Type or paste text above to generate visual tokens.
                </div>
              ) : viewMode === "visual" ? (
                <div className="flex flex-wrap items-baseline gap-y-1.5 gap-x-0.5">
                  {resultA.tokens.map((token) => {
                    const isSelected = selectedTokenA?.index === token.index;
                    const colorClass = TOKEN_COLOR_CLASSES[token.colorIndex];

                    return (
                      <span
                        key={`tok-a-${token.index}`}
                        onClick={() => setSelectedTokenA(token)}
                        onMouseEnter={() => setSelectedTokenA(token)}
                        className={cn(
                          "inline-block rounded-md px-1 py-0.5 cursor-pointer border transition-all duration-100 select-all whitespace-pre-wrap break-words",
                          colorClass,
                          isSelected &&
                            "ring-2 ring-[rgb(var(--accent))] shadow-sm scale-105 z-10 font-bold"
                        )}
                        title={`Token #${token.index + 1}\nID: ${token.id}\nChars: ${
                          token.text.length
                        }\nBytes: ${token.bytes.length}`}
                      >
                        {token.text}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <pre className="text-xs text-[rgb(var(--fg))] whitespace-pre-wrap select-all">
                  {`[\n  ${resultA.tokens.map((t) => t.id).join(", ")}\n]`}
                </pre>
              )}
            </div>
          </div>

          {/* Stream B (Only visible when Compare Mode is enabled) */}
          {compareMode && (
            <div className="flex flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))]">
                <div className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--fg))]">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{MODELS[modelB].name}</span>
                  <Badge variant="secondary" size="sm" className="font-mono text-[10px]">
                    {resultB.totalTokens} tokens
                  </Badge>
                </div>

                <CopyButton
                  value={
                    viewMode === "ids"
                      ? JSON.stringify(resultB.tokens.map((t) => t.id))
                      : resultB.tokens.map((t) => t.text).join("")
                  }
                  text={viewMode === "ids" ? "Copy IDs" : "Copy Text"}
                  size="sm"
                  variant="ghost"
                />
              </div>

              <div className="p-4 min-h-[220px] max-h-[460px] overflow-y-auto scrollbar-refined font-mono text-xs sm:text-sm leading-relaxed">
                {resultB.tokens.length === 0 ? (
                  <div className="p-8 text-center text-[rgb(var(--muted))] text-xs font-sans">
                    Type or paste text above to generate visual tokens.
                  </div>
                ) : viewMode === "visual" ? (
                  <div className="flex flex-wrap items-baseline gap-y-1.5 gap-x-0.5">
                    {resultB.tokens.map((token) => {
                      const isSelected = selectedTokenB?.index === token.index;
                      const colorClass = TOKEN_COLOR_CLASSES[token.colorIndex];

                      return (
                        <span
                          key={`tok-b-${token.index}`}
                          onClick={() => setSelectedTokenB(token)}
                          onMouseEnter={() => setSelectedTokenB(token)}
                          className={cn(
                            "inline-block rounded-md px-1 py-0.5 cursor-pointer border transition-all duration-100 select-all whitespace-pre-wrap break-words",
                            colorClass,
                            isSelected &&
                              "ring-2 ring-blue-500 shadow-sm scale-105 z-10 font-bold"
                          )}
                          title={`Token #${token.index + 1}\nID: ${token.id}\nChars: ${
                            token.text.length
                          }\nBytes: ${token.bytes.length}`}
                        >
                          {token.text}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <pre className="text-xs text-[rgb(var(--fg))] whitespace-pre-wrap select-all">
                    {`[\n  ${resultB.tokens.map((t) => t.id).join(", ")}\n]`}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Context Window & Pricing Insights Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-[rgb(var(--fg))]">
          <Cpu className="w-4 h-4 text-[rgb(var(--accent))]" />
          <span>Model Architecture & Efficiency Insights</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] space-y-1">
            <div className="text-[rgb(var(--muted))] font-medium">Vocabulary Size</div>
            <div className="text-sm font-bold text-[rgb(var(--fg))]">
              {MODELS[modelA].vocabSize.toLocaleString()} subwords
            </div>
            <p className="text-[11px] text-[rgb(var(--muted))]">
              Larger vocabulary compresses text and code into fewer tokens.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] space-y-1">
            <div className="text-[rgb(var(--muted))] font-medium">Max Context Window</div>
            <div className="text-sm font-bold text-[rgb(var(--fg))]">
              {(MODELS[modelA].contextWindow / 1000).toFixed(0)}k tokens
            </div>
            <p className="text-[11px] text-[rgb(var(--muted))]">
              Capacity for conversational memory and multi-document analysis.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] space-y-1">
            <div className="text-[rgb(var(--muted))] font-medium">Input Pricing</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ${MODELS[modelA].costPer1MInput.toFixed(2)} / 1M tokens
            </div>
            <p className="text-[11px] text-[rgb(var(--muted))]">
              Official API pricing for prompt tokens.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] space-y-1">
            <div className="text-[rgb(var(--muted))] font-medium">Output Pricing</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ${MODELS[modelA].costPer1MOutput.toFixed(2)} / 1M tokens
            </div>
            <p className="text-[11px] text-[rgb(var(--muted))]">
              Official API pricing for generated response tokens.
            </p>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
