"use client";

import React, { useState, useMemo } from "react";
import * as yaml from "js-yaml";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const SAMPLE_YAML = `# Kubernetes Deployment Config
apiVersion: apps/v1
kind: Deployment
metadata:
  name: toolmate-api
  labels:
    app: toolmate
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: toolmate
  template:
    metadata:
      labels:
        app: toolmate
    spec:
      containers:
        - name: web
          image: toolmate/api:v2.4.0
          ports:
            - containerPort: 8080
          resources:
            limits:
              cpu: "500m"
              memory: "512Mi"
`;

export function YamlValidatorTool() {
  const [input, setInput] = useState(SAMPLE_YAML);
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => {
    if (!input.trim()) {
      return { isValid: true, error: null, parsedJson: "", formattedYaml: "" };
    }

    try {
      const parsed = yaml.load(input);
      const jsonStr = JSON.stringify(parsed, null, 2);
      const dumped = yaml.dump(parsed, { indent: 2, lineWidth: -1 });
      return {
        isValid: true,
        error: null,
        parsedJson: jsonStr,
        formattedYaml: dumped,
      };
    } catch (err: any) {
      return {
        isValid: false,
        error: {
          message: err.message,
          line: err.mark?.line != null ? err.mark.line + 1 : null,
          column: err.mark?.column != null ? err.mark.column + 1 : null,
          snippet: err.mark?.snippet || null,
        },
        parsedJson: "",
        formattedYaml: "",
      };
    }
  }, [input]);

  const handleFormat = () => {
    if (validation.isValid && validation.formattedYaml) {
      setInput(validation.formattedYaml);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3">
            {validation.isValid ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid YAML Syntax
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                Syntax Error {validation.error?.line ? `at Line ${validation.error.line}, Col ${validation.error.column}` : ""}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setInput(SAMPLE_YAML)}
              className="h-8 gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Sample
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!validation.isValid}
              onClick={handleFormat}
              className="h-8 gap-1.5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Format YAML
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy YAML
                </>
              )}
            </Button>
          </div>
        </ToolToolbar>

        {validation.error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-xs space-y-2">
            <div className="font-semibold text-red-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>YAML Parsing Error: {validation.error.message.split("\n")[0]}</span>
            </div>
            {validation.error.snippet && (
              <pre className="p-3 rounded-lg bg-[rgb(var(--card))] border border-red-500/20 font-mono text-[11px] overflow-x-auto text-red-400">
                {validation.error.snippet}
              </pre>
            )}
          </div>
        )}

        <ToolSplitPane
          inputHeader={
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              YAML EDITOR
            </span>
          }
          outputHeader={
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              EQUIVALENT JSON PREVIEW
            </span>
          }
          input={
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-2">
              <CodeEditor
                value={input}
                onChange={(v) => setInput(v || "")}
                language="yaml"
                minHeight="420px"
              />
            </div>
          }
          output={
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-2">
              <CodeEditor
                value={validation.parsedJson || "// Valid JSON output will appear here"}
                editable={false}
                language="json"
                minHeight="420px"
              />
            </div>
          }
        />
      </div>
    </ToolWorkspace>
  );
}
