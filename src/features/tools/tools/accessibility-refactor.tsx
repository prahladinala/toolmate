"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeAccessibility } from "@/features/accessibility/engine";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/ui/code-editor";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const SAMPLE_HTML = `<!-- Sample HTML with Accessibility Issues -->
<div class="user-card">
  <img src="avatar.png" />
  <div onclick="submitForm()">Click here to submit</div>
  
  <form>
    First Name: <input type="text" name="fname" />
    <br/>
    <button style="background: red; color: darkred;">Submit</button>
  </form>
</div>`;

export default function AccessibilityRefactorTool() {
  const [input, setInput] = useState(SAMPLE_HTML);
  const [autoFix, setAutoFix] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = analyzeAccessibility(input, autoFix);
      setResult(res);
    } catch (e) {
      console.error("Analysis error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput(SAMPLE_HTML);
    setResult(null);
  };

  const handleCopy = () => {
    if (!result?.fixedCode) return;
    navigator.clipboard.writeText(result.fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityCounts = result?.issues?.reduce((acc: any, issue: any) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {}) || {};

  const getSeverityBadge = (severity: string) => {
    if (severity === "critical") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-500 border border-red-500/30">
          <AlertCircle className="w-3 h-3" /> Critical
        </span>
      );
    }
    if (severity === "moderate") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" /> Moderate
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-500 border border-blue-500/30">
        <Info className="w-3 h-3" /> Minor
      </span>
    );
  };

  const categoryGroups = result?.issues?.reduce((acc: any, issue: any) => {
    acc[issue.category] = acc[issue.category] || [];
    acc[issue.category].push(issue);
    return acc;
  }, {}) || {};

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        {/* Top Controls Toolbar */}
        <ToolToolbar>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-[rgb(var(--foreground))] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoFix}
                onChange={(e) => setAutoFix(e.target.checked)}
                className="rounded border-[rgb(var(--border))] text-[rgb(var(--accent))] focus:ring-[rgb(var(--accent))]"
              />
              <span className="font-medium text-xs sm:text-sm">Auto Apply Fixes</span>
            </label>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="h-9 gap-1.5 text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="h-9 gap-1.5 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Analyzing..." : "Analyze Code"}
            </Button>
          </div>
        </ToolToolbar>

        {/* Code Input */}
        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              Source Code (HTML / JSX)
            </span>
            <span className="text-xs text-[rgb(var(--muted))]">
              {input.length} characters
            </span>
          </div>
          <div className="p-2 sm:p-4 min-w-0">
            <CodeEditor
              value={input}
              onChange={(v) => setInput(v || "")}
              language="html"
              minHeight="280px"
            />
          </div>
        </div>

        {/* Analysis Results */}
        {result && (
          <div className="space-y-6">
            {/* Score & Summary Card */}
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[rgb(var(--accent))]" />
                    Accessibility Score
                  </h3>
                  <p className="text-xs sm:text-sm text-[rgb(var(--muted))] mt-0.5">
                    Evaluated against standard WCAG 2.1 / 2.2 guidelines
                  </p>
                </div>
                <div className="flex items-baseline gap-1 self-start sm:self-auto">
                  <span
                    className={`text-3xl font-extrabold ${
                      result.score >= 80
                        ? "text-emerald-500"
                        : result.score >= 50
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                  >
                    {result.score}
                  </span>
                  <span className="text-sm text-[rgb(var(--muted))]">/ 100</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full bg-[rgb(var(--card-2))] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    result.score >= 80
                      ? "bg-emerald-500"
                      : result.score >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />
              </div>

              {/* Severity breakdown pills */}
              <div className="mt-4 flex flex-wrap gap-2.5 pt-2 border-t border-[rgb(var(--border))]">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[rgb(var(--card-2))] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Critical: {severityCounts["critical"] || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[rgb(var(--card-2))] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Moderate: {severityCounts["moderate"] || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[rgb(var(--card-2))] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Minor: {severityCounts["minor"] || 0}</span>
                </div>
              </div>
            </div>

            {/* Issues List Card */}
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-[rgb(var(--foreground))]">
                  Issues Found ({result.issues.length})
                </h4>
              </div>

              {result.issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-[rgb(var(--foreground))]">
                    No accessibility issues detected!
                  </h4>
                  <p className="text-xs sm:text-sm text-[rgb(var(--muted))] mt-1">
                    Your code adheres to the configured accessibility checks.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(categoryGroups).map(
                    ([category, issues]: any) => (
                      <div key={category} className="space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))] pb-1 border-b border-[rgb(var(--border))]">
                          {category}
                        </div>
                        <div className="space-y-2.5">
                          {issues.map((issue: any, index: number) => (
                            <div
                              key={index}
                              className="p-3.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card-2))]/50 hover:bg-[rgb(var(--card-2))] transition-colors"
                            >
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                {getSeverityBadge(issue.severity)}
                                <span className="text-xs font-semibold text-[rgb(var(--foreground))]">
                                  {issue.message}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-[rgb(var(--muted))] leading-relaxed">
                                {issue.suggestion}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Accessible Output */}
            {result.fixedCode && (
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
                <div className="px-4 py-2.5 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
                    Refactored Accessible Output
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 gap-1.5 text-xs font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-2 sm:p-4 min-w-0">
                  <CodeEditor
                    value={result.fixedCode}
                    language="html"
                    editable={false}
                    minHeight="280px"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
