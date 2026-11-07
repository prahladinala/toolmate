"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowDownAZ,
  Layers,
  AlertTriangle,
  RotateCcw,
  Download,
  FileCode,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type EnvEntry = {
  raw: string;
  key?: string;
  value?: string;
  comment?: string;
  isDuplicate?: boolean;
  hasError?: boolean;
  errorMessage?: string;
};

const SAMPLE_ENV = `# Application Configuration
PORT=3000
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://toolmate.co.in

# Database credentials
DATABASE_URL=postgresql://admin:super_secret_db_pass_123@db.prod.internal:5432/main_db
DATABASE_POOL_SIZE=20

# Authentication & JWT
AUTH_SECRET=super_secret_jwt_hmac_key_998127391
NEXTAUTH_URL=https://toolmate.co.in

# Third-party APIs
STRIPE_SECRET_KEY=your_stripe_secret_key_placeholder
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_placeholder
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID_PLACEHOLDER
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY_PLACEHOLDER
AWS_REGION=us-east-1

# Duplicate test
DATABASE_URL=postgresql://admin:new_pass@localhost:5432/replica_db
`;

type ExportFormat = "env" | "json" | "shell" | "docker" | "k8s";

export function EnvVaultTool({ tool }: { tool: ToolDef }) {
  const [rawEnv, setRawEnv] = useState(SAMPLE_ENV);
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [sortBy, setSortBy] = useState<"none" | "az" | "group">("group");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("env");

  // Parse .env lines
  const parsed = useMemo(() => {
    const lines = rawEnv.split(/\r?\n/);
    const entries: EnvEntry[] = [];
    const seenKeys = new Map<string, number>();

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        entries.push({ raw: "" });
        return;
      }
      if (trimmed.startsWith("#")) {
        entries.push({ raw: line, comment: trimmed });
        return;
      }

      const match = line.match(/^([^=]+)=(.*)$/);
      if (!match) {
        entries.push({
          raw: line,
          hasError: true,
          errorMessage: "Invalid syntax: Missing '=' delimiter",
        });
        return;
      }

      const key = match[1].trim();
      let value = match[2];

      // Strip outer quotes if matched
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      const count = seenKeys.get(key) || 0;
      seenKeys.set(key, count + 1);

      entries.push({
        raw: line,
        key,
        value,
        isDuplicate: count > 0,
      });
    });

    return { entries, seenKeys };
  }, [rawEnv]);

  // Mask sensitive values
  const maskValue = (key: string, val: string): string => {
    if (!maskSecrets) return val;
    const isSensitive =
      /secret|password|key|token|auth|pwd|cred|private|pass/i.test(key);
    if (!isSensitive) return val;

    if (val.length <= 8) return "••••••••";
    return val.slice(0, 4) + "••••••••" + val.slice(-4);
  };

  // Processed Output Generator
  const processedOutput = useMemo(() => {
    const keyValEntries = parsed.entries.filter(
      (e): e is EnvEntry & { key: string; value: string } =>
        Boolean(e.key && e.value !== undefined)
    );

    // Deduplicate: keep last
    const uniqueMap = new Map<string, string>();
    keyValEntries.forEach((e) => {
      uniqueMap.set(e.key, e.value);
    });

    let keys = Array.from(uniqueMap.keys());

    if (sortBy === "az") {
      keys.sort();
    } else if (sortBy === "group") {
      // Group by prefix (e.g. DATABASE_, NEXT_PUBLIC_, AWS_, etc.)
      keys.sort((a, b) => {
        const prefixA = a.split("_")[0];
        const prefixB = b.split("_")[0];
        if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
        return a.localeCompare(b);
      });
    }

    if (exportFormat === "env") {
      let lastPrefix = "";
      const lines: string[] = [];

      keys.forEach((k) => {
        const prefix = k.split("_")[0];
        if (sortBy === "group" && prefix !== lastPrefix && lastPrefix !== "") {
          lines.push("");
        }
        lastPrefix = prefix;

        const val = maskValue(k, uniqueMap.get(k) || "");
        const formattedVal = val.includes(" ") ? `"${val}"` : val;
        lines.push(`${k}=${formattedVal}`);
      });

      return lines.join("\n");
    }

    if (exportFormat === "json") {
      const obj: Record<string, string> = {};
      keys.forEach((k) => {
        obj[k] = maskValue(k, uniqueMap.get(k) || "");
      });
      return JSON.stringify(obj, null, 2);
    }

    if (exportFormat === "shell") {
      return keys
        .map((k) => {
          const val = maskValue(k, uniqueMap.get(k) || "");
          return `export ${k}="${val}"`;
        })
        .join("\n");
    }

    if (exportFormat === "docker") {
      return keys
        .map((k) => {
          const val = maskValue(k, uniqueMap.get(k) || "");
          return `-e ${k}="${val}"`;
        })
        .join(" \\\n  ");
    }

    if (exportFormat === "k8s") {
      const stringData = keys
        .map((k) => {
          const val = maskValue(k, uniqueMap.get(k) || "");
          return `  ${k}: "${val}"`;
        })
        .join("\n");

      return `apiVersion: v1
kind: Secret
metadata:
  name: app-environment-secrets
type: Opaque
stringData:
${stringData}`;
    }

    return "";
  }, [parsed, sortBy, exportFormat, maskSecrets]);

  const duplicateCount = useMemo(() => {
    let count = 0;
    parsed.seenKeys.forEach((v) => {
      if (v > 1) count += v - 1;
    });
    return count;
  }, [parsed]);

  const handleDownload = () => {
    const ext = exportFormat === "json" ? "json" : exportFormat === "k8s" ? "yaml" : "env";
    const filename = `.env.${ext}`;
    const blob = new Blob([processedOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mask secrets toggle */}
          <Button
            type="button"
            variant={maskSecrets ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMaskSecrets(!maskSecrets)}
            className="h-8 text-xs gap-1.5"
          >
            {maskSecrets ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-emerald-500" />
                Secrets Masked
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                Secrets Visible
              </>
            )}
          </Button>

          {/* Sort selector */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
            <Button
              type="button"
              variant={sortBy === "none" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("none")}
              className="h-7 px-2.5 text-xs"
            >
              Original Order
            </Button>
            <Button
              type="button"
              variant={sortBy === "az" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("az")}
              className="h-7 px-2.5 text-xs"
            >
              <ArrowDownAZ className="w-3.5 h-3.5 mr-1" />
              A to Z
            </Button>
            <Button
              type="button"
              variant={sortBy === "group" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("group")}
              className="h-7 px-2.5 text-xs"
            >
              <Layers className="w-3.5 h-3.5 mr-1" />
              Group by Prefix
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {duplicateCount > 0 ? (
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {duplicateCount} duplicates resolved
            </Badge>
          ) : (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Syntax Valid
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setRawEnv(SAMPLE_ENV)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw .env Input Pane */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-primary" /> Source .env Input
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {parsed.entries.filter((e) => e.key).length} keys parsed
            </span>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <Textarea
              value={rawEnv}
              onChange={(e) => setRawEnv(e.target.value)}
              placeholder="Paste raw .env file contents..."
              rows={18}
              className="w-full flex-1 resize-y font-mono text-xs leading-relaxed border-border/60 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right: Sanitized / Formatted Output Pane */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex flex-wrap items-center justify-between gap-2">
            {/* Format Selector */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
              {(
                [
                  { id: "env", label: ".env" },
                  { id: "json", label: "JSON" },
                  { id: "shell", label: "Shell export" },
                  { id: "docker", label: "Docker -e" },
                  { id: "k8s", label: "K8s Secret" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setExportFormat(tab.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                    exportFormat === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <CopyButton value={processedOutput} />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="h-8 text-xs gap-1"
                title="Download formatted file"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-auto bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre">
            {processedOutput}
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
