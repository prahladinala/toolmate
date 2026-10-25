"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Coins,
  Cpu,
  Layers,
  Calculator,
  ArrowUpDown,
  FileText,
  BookOpen,
  Code2,
  TrendingDown,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type LLMModelPricing = {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  inputCost1M: number;
  outputCost1M: number;
  badge: string;
  badgeClass: string;
};

const COMPARISON_MODELS: LLMModelPricing[] = [
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    contextWindow: 128000,
    inputCost1M: 0.14,
    outputCost1M: 0.28,
    badge: "Ultra Budget",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 (Reasoning)",
    provider: "DeepSeek",
    contextWindow: 128000,
    inputCost1M: 0.55,
    outputCost1M: 2.19,
    badge: "Reasoning",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    id: "gemini-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    contextWindow: 1000000,
    inputCost1M: 0.075,
    outputCost1M: 0.3,
    badge: "1M Context",
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o-mini",
    provider: "OpenAI",
    contextWindow: 128000,
    inputCost1M: 0.15,
    outputCost1M: 0.6,
    badge: "Fast & Light",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "claude-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCost1M: 0.8,
    outputCost1M: 4.0,
    badge: "Speed",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o (Flagship)",
    provider: "OpenAI",
    contextWindow: 128000,
    inputCost1M: 2.5,
    outputCost1M: 10.0,
    badge: "Multimodal",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "claude-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCost1M: 3.0,
    outputCost1M: 15.0,
    badge: "Best for Code",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "gemini-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    contextWindow: 2000000,
    inputCost1M: 1.25,
    outputCost1M: 5.0,
    badge: "2M Context",
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    id: "openai-o1",
    name: "OpenAI o1 (Full)",
    provider: "OpenAI",
    contextWindow: 200000,
    inputCost1M: 15.0,
    outputCost1M: 60.0,
    badge: "Deep Think",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    id: "claude-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCost1M: 15.0,
    outputCost1M: 75.0,
    badge: "Heavy Enterprise",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
];

const USE_CASE_PRESETS = [
  {
    name: "Conversational Chatbot",
    inputTokens: 1200,
    outputTokens: 400,
    monthlyRequests: 50000,
    description: "User customer service queries with brief conversational responses.",
  },
  {
    name: "Code Copilot / Review",
    inputTokens: 4500,
    outputTokens: 1200,
    monthlyRequests: 10000,
    description: "Multi-file code context with refactored solution output.",
  },
  {
    name: "RAG & Document Analysis",
    inputTokens: 25000,
    outputTokens: 800,
    monthlyRequests: 2500,
    description: "Heavy context injection (PDFs, docs) with synthesized answers.",
  },
  {
    name: "Autonomous Agent Workflows",
    inputTokens: 8000,
    outputTokens: 2000,
    monthlyRequests: 25000,
    description: "Multi-step agent loops executing tool calls and task plans.",
  },
];

export function LlmPricingCalculatorTool({ tool }: { tool: ToolDef }) {
  const [inputTokens, setInputTokens] = useState<number>(3000);
  const [outputTokens, setOutputTokens] = useState<number>(800);
  const [monthlyRequests, setMonthlyRequests] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<"cost" | "context" | "name">("cost");

  // Real-world equivalents
  const equivalents = useMemo(() => {
    const totalTokensPerCall = inputTokens + outputTokens;
    const estWords = Math.round(totalTokensPerCall * 0.75);
    const estPages = Math.max(1, Math.round(estWords / 450));
    const estLinesOfCode = Math.round(totalTokensPerCall / 4);

    return {
      estWords,
      estPages,
      estLinesOfCode,
      totalTokensPerCall,
    };
  }, [inputTokens, outputTokens]);

  // Model calculations
  const calculatedModels = useMemo(() => {
    return COMPARISON_MODELS.map((model) => {
      const costPerCall =
        (inputTokens / 1_000_000) * model.inputCost1M +
        (outputTokens / 1_000_000) * model.outputCost1M;

      const monthlyCost = costPerCall * monthlyRequests;
      const contextUsagePercent = Number(
        ((equivalents.totalTokensPerCall / model.contextWindow) * 100).toFixed(2)
      );

      return {
        ...model,
        costPerCall,
        monthlyCost,
        contextUsagePercent,
      };
    }).sort((a, b) => {
      if (sortBy === "cost") return a.monthlyCost - b.monthlyCost;
      if (sortBy === "context") return b.contextWindow - a.contextWindow;
      return a.name.localeCompare(b.name);
    });
  }, [inputTokens, outputTokens, monthlyRequests, equivalents.totalTokensPerCall, sortBy]);

  const cheapestModel = calculatedModels[0];
  const mostExpensiveModel = calculatedModels[calculatedModels.length - 1];

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* 1. Use Case Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))] mr-1">
            Presets:
          </span>
          {USE_CASE_PRESETS.map((preset) => (
            <Button
              key={preset.name}
              size="sm"
              variant={inputTokens === preset.inputTokens ? "primary" : "secondary"}
              onClick={() => {
                setInputTokens(preset.inputTokens);
                setOutputTokens(preset.outputTokens);
                setMonthlyRequests(preset.monthlyRequests);
              }}
              className="h-8 text-xs"
              title={preset.description}
            >
              <span>{preset.name}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="font-mono text-xs">
            {monthlyRequests.toLocaleString()} reqs / month
          </Badge>
        </div>
      </div>

      {/* 2. Interactive Sliders & Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input Tokens */}
        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg))]">
              Input Tokens / Request
            </label>
            <span className="font-mono text-xs font-bold text-[rgb(var(--accent))]">
              {inputTokens.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={50000}
            step={100}
            value={inputTokens}
            onChange={(e) => setInputTokens(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[rgb(var(--muted))] font-mono">
            <span>100</span>
            <span>25,000</span>
            <span>50,000</span>
          </div>
        </div>

        {/* Output Tokens */}
        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg))]">
              Output Tokens / Request
            </label>
            <span className="font-mono text-xs font-bold text-emerald-500">
              {outputTokens.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={8000}
            step={50}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[rgb(var(--muted))] font-mono">
            <span>50</span>
            <span>4,000</span>
            <span>8,000</span>
          </div>
        </div>

        {/* Monthly Volume */}
        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg))]">
              Monthly Request Volume
            </label>
            <span className="font-mono text-xs font-bold text-[rgb(var(--fg))]">
              {monthlyRequests.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={200000}
            step={1000}
            value={monthlyRequests}
            onChange={(e) => setMonthlyRequests(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[rgb(var(--muted))] font-mono">
            <span>1k</span>
            <span>100k</span>
            <span>200k</span>
          </div>
        </div>
      </div>

      {/* 3. Real-world Scale Breakdown Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(var(--accent),0.3)] bg-[rgba(var(--accent),0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg))] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Scale Equivalence Per Request</span>
          </h4>
          <p className="text-xs text-[rgb(var(--muted))]">
            Total {equivalents.totalTokensPerCall.toLocaleString()} tokens per API call
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
            <BookOpen className="w-3.5 h-3.5 text-[rgb(var(--accent))]" />
            <span>~{equivalents.estPages} book pages</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>~{equivalents.estWords.toLocaleString()} words</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span>~{equivalents.estLinesOfCode.toLocaleString()} lines of code</span>
          </div>
        </div>
      </div>

      {/* 4. Live Pricing & Context Capacity Comparison Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-[rgb(var(--fg))]">
              Multi-Model Cost & Context Comparison
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[rgb(var(--muted))] hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-xs font-semibold text-[rgb(var(--fg))]"
            >
              <option value="cost">Lowest Cost</option>
              <option value="context">Largest Context Window</option>
              <option value="name">Model Name</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs divide-y divide-[rgb(var(--border))]">
          {calculatedModels.map((m, index) => {
            const isLowest = m.id === cheapestModel.id;

            return (
              <div
                key={m.id}
                className={cn(
                  "p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 hover:bg-[rgba(var(--fg),0.02)] transition-colors",
                  isLowest && "bg-[rgba(16,185,129,0.03)]"
                )}
              >
                {/* Model Info */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="w-6 text-center font-mono text-xs text-[rgb(var(--muted))]">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[rgb(var(--fg))]">
                        {m.name}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          m.badgeClass
                        )}
                      >
                        {m.badge}
                      </span>
                    </div>
                    <div className="text-xs text-[rgb(var(--muted))] font-mono">
                      {m.provider} • ${(m.inputCost1M).toFixed(2)} in / ${(m.outputCost1M).toFixed(2)} out per 1M
                    </div>
                  </div>
                </div>

                {/* Context Capacity Bar */}
                <div className="flex-1 max-w-xs space-y-1">
                  <div className="flex justify-between text-[11px] text-[rgb(var(--muted))]">
                    <span>Context Window</span>
                    <span className="font-mono font-medium text-[rgb(var(--fg))]">
                      {(m.contextWindow / 1000).toLocaleString()}k ({m.contextUsagePercent}% used)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        m.contextUsagePercent > 80
                          ? "bg-rose-500"
                          : m.contextUsagePercent > 40
                          ? "bg-amber-500"
                          : "bg-[rgb(var(--accent))]"
                      )}
                      style={{
                        width: `${Math.min(100, Math.max(2, m.contextUsagePercent))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Monthly Cost KPI */}
                <div className="text-right shrink-0">
                  <div className="text-xs text-[rgb(var(--muted))]">Monthly Cost</div>
                  <div
                    className={cn(
                      "text-base sm:text-lg font-bold font-mono",
                      isLowest
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-[rgb(var(--fg))]"
                    )}
                  >
                    ${m.monthlyCost.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[rgb(var(--muted))] font-mono">
                    ${m.costPerCall.toFixed(5)} / req
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolWorkspace>
  );
}
