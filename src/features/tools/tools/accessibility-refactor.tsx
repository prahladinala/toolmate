"use client";

import React from "react";
import { motion } from "framer-motion";
import { analyzeAccessibility } from "@/features/accessibility/engine";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function AccessibilityRefactorTool() {
  const [input, setInput] = React.useState("");
  const [autoFix, setAutoFix] = React.useState(true);
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;

    setLoading(true);
    const res = analyzeAccessibility(input, autoFix);
    setResult(res);
    setLoading(false);
  };

  const severityCounts = result?.issues?.reduce((acc: any, issue: any) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  const severityVariant = (severity: string) => {
    if (severity === "critical") return "destructive";
    if (severity === "moderate") return "warning";
    if (severity === "minor") return "accent";
    return "default";
  };

  const categoryGroups = result?.issues?.reduce((acc: any, issue: any) => {
    acc[issue.category] = acc[issue.category] || [];
    acc[issue.category].push(issue);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      {/* Input */}
      <Card className="p-5 space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste HTML or JSX here..."
          size="lg"
        />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Checkbox
            checked={autoFix}
            onChange={setAutoFix}
            label="Auto Apply Fixes"
          />

          <Button onClick={handleAnalyze} loading={loading}>
            Analyze
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Score Section */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Accessibility Score</div>
              <Badge
                variant={
                  result.score >= 80
                    ? "accent"
                    : result.score >= 50
                      ? "secondary"
                      : "destructive"
                }
              >
                {result.score} / 100
              </Badge>
            </div>

            <div className="mt-4 h-2 bg-[rgb(var(--card-2))] rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${result.score}%`,
                }}
                transition={{ duration: 0.4 }}
                className="h-full bg-[rgb(var(--accent))]"
              />
            </div>

            <div className="mt-4 flex gap-4 text-sm">
              {["critical", "moderate", "minor"].map((level) => (
                <div key={level}>
                  <Badge variant={severityVariant(level)}>{level}</Badge>{" "}
                  {severityCounts?.[level] || 0}
                </div>
              ))}
            </div>
          </Card>

          {/* Issues by Category */}
          <Card className="p-5">
            <div className="font-semibold mb-4">
              Issues ({result.issues.length})
            </div>

            {result.issues.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-[rgb(var(--muted))]"
              >
                🎉 No accessibility issues detected.
              </motion.div>
            ) : (
              <div className="space-y-6">
                {Object.entries(categoryGroups).map(
                  ([category, issues]: any) => (
                    <div key={category}>
                      <div className="mb-2 text-sm font-semibold capitalize">
                        {category}
                      </div>

                      <div className="space-y-3">
                        {issues.map((issue: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{
                              opacity: 0,
                              y: 4,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay: index * 0.02,
                            }}
                            className="border-b pb-2"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant={severityVariant(issue.severity)}>
                                {issue.severity}
                              </Badge>

                              <span className="font-medium">
                                {issue.message}
                              </span>
                            </div>

                            <div className="text-sm text-[rgb(var(--muted))] mt-1">
                              {issue.suggestion}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </Card>

          {/* Output */}
          <Card className="p-5">
            <div className="font-semibold mb-3">Accessible Output</div>

            <Textarea value={result.fixedCode} readOnly size="lg" />
          </Card>
        </div>
      )}
    </main>
  );
}
