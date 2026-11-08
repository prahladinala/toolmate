"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  Code2,
  Lock,
  Layers,
  AlertTriangle,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type CspDirectiveKey =
  | "default-src"
  | "script-src"
  | "style-src"
  | "img-src"
  | "connect-src"
  | "font-src"
  | "frame-ancestors"
  | "object-src"
  | "base-uri"
  | "form-action";

type DirectiveConfig = {
  self: boolean;
  none: boolean;
  unsafeInline: boolean;
  unsafeEval: boolean;
  data: boolean;
  https: boolean;
  customDomains: string;
};

const DEFAULT_CONFIG: Record<CspDirectiveKey, DirectiveConfig> = {
  "default-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
  "script-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "https://www.google-analytics.com" },
  "style-src": { self: true, none: false, unsafeInline: true, unsafeEval: false, data: false, https: false, customDomains: "https://fonts.googleapis.com" },
  "img-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: true, https: true, customDomains: "" },
  "connect-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: true, customDomains: "https://api.toolmate.co.in" },
  "font-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: true, https: false, customDomains: "https://fonts.gstatic.com" },
  "frame-ancestors": { self: false, none: true, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
  "object-src": { self: false, none: true, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
  "base-uri": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
  "form-action": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
};

const PRESETS = [
  {
    name: "Modern Next.js & Analytics",
    config: DEFAULT_CONFIG,
  },
  {
    name: "Strict Hardened (A+ Grade)",
    config: {
      "default-src": { self: false, none: true, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "script-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "style-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "img-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "connect-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "font-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "frame-ancestors": { self: false, none: true, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "object-src": { self: false, none: true, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "base-uri": { self: false, none: true, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
      "form-action": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "" },
    },
  },
  {
    name: "Stripe & External APIs",
    config: {
      ...DEFAULT_CONFIG,
      "script-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "https://js.stripe.com" },
      "frame-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "https://js.stripe.com" } as any,
      "connect-src": { self: true, none: false, unsafeInline: false, unsafeEval: false, data: false, https: false, customDomains: "https://api.stripe.com" },
    },
  },
];

type ExportFormat = "header" | "nextjs" | "html" | "nginx" | "apache";

export function CspGeneratorTool({ tool }: { tool: ToolDef }) {
  const [directives, setDirectives] =
    useState<Record<CspDirectiveKey, DirectiveConfig>>(DEFAULT_CONFIG);
  const [upgradeInsecure, setUpgradeInsecure] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("header");

  const updateDirective = (key: CspDirectiveKey, updates: Partial<DirectiveConfig>) => {
    setDirectives((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  };

  // Compile full CSP string
  const cspString = useMemo(() => {
    const parts: string[] = [];

    (Object.keys(directives) as CspDirectiveKey[]).forEach((dirKey) => {
      const cfg = directives[dirKey];
      if (!cfg) return;

      const sources: string[] = [];
      if (cfg.none) {
        sources.push("'none'");
      } else {
        if (cfg.self) sources.push("'self'");
        if (cfg.unsafeInline) sources.push("'unsafe-inline'");
        if (cfg.unsafeEval) sources.push("'unsafe-eval'");
        if (cfg.data) sources.push("data:");
        if (cfg.https) sources.push("https:");
        if (cfg.customDomains.trim()) {
          const domains = cfg.customDomains.split(/[\s,]+/).filter(Boolean);
          sources.push(...domains);
        }
      }

      if (sources.length > 0) {
        parts.push(`${dirKey} ${sources.join(" ")}`);
      }
    });

    if (upgradeInsecure) {
      parts.push("upgrade-insecure-requests");
    }

    return parts.join("; ");
  }, [directives, upgradeInsecure]);

  // Security Audit Warnings
  const auditWarnings = useMemo(() => {
    const list: { level: "danger" | "warning" | "info"; message: string }[] = [];

    // Check script-src
    const scriptCfg = directives["script-src"];
    if (scriptCfg?.unsafeInline) {
      list.push({
        level: "danger",
        message: "'unsafe-inline' in script-src exposes the site to Cross-Site Scripting (XSS). Use nonces or hashes.",
      });
    }
    if (scriptCfg?.unsafeEval) {
      list.push({
        level: "danger",
        message: "'unsafe-eval' enables string-to-code execution (eval(), new Function()) which attackers can hijack.",
      });
    }

    // Check object-src
    const objCfg = directives["object-src"];
    if (!objCfg?.none) {
      list.push({
        level: "warning",
        message: "object-src should be 'none' to block Flash, Java applets, and malicious browser plugins.",
      });
    }

    // Check frame-ancestors
    const frameAncCfg = directives["frame-ancestors"];
    if (!frameAncCfg?.none && !frameAncCfg?.self) {
      list.push({
        level: "warning",
        message: "frame-ancestors is unrestricted. The site may be vulnerable to UI redressing (Clickjacking).",
      });
    }

    // Check base-uri
    const baseUriCfg = directives["base-uri"];
    if (!baseUriCfg?.self && !baseUriCfg?.none) {
      list.push({
        level: "info",
        message: "base-uri should be restricted to 'self' to prevent attackers from injecting <base> tags.",
      });
    }

    return list;
  }, [directives]);

  // Code Export formats
  const formattedCode = useMemo(() => {
    if (exportFormat === "header") {
      return `Content-Security-Policy: ${cspString}`;
    }
    if (exportFormat === "html") {
      return `<meta http-equiv="Content-Security-Policy" content="${cspString}">`;
    }
    if (exportFormat === "nextjs") {
      return `// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "${cspString.replace(/"/g, '\\"')}",
          },
        ],
      },
    ];
  },
};`;
    }
    if (exportFormat === "nginx") {
      return `# Nginx server block
add_header Content-Security-Policy "${cspString.replace(/"/g, '\\"')}" always;`;
    }
    if (exportFormat === "apache") {
      return `# Apache .htaccess
<IfModule mod_headers.c>
  Header set Content-Security-Policy "${cspString.replace(/"/g, '\\"')}"
</IfModule>`;
    }
    return cspString;
  }, [exportFormat, cspString]);

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
            onClick={() => setDirectives(p.config as any)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Security Auditor Banner */}
      <Card
        className={cn(
          "p-4 border shadow-xs flex items-center justify-between gap-3 flex-wrap",
          auditWarnings.some((w) => w.level === "danger")
            ? "border-rose-500/30 bg-rose-500/5"
            : auditWarnings.length > 0
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-emerald-500/30 bg-emerald-500/5"
        )}
      >
        <div className="flex items-center gap-2.5">
          {auditWarnings.some((w) => w.level === "danger") ? (
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          ) : auditWarnings.length > 0 ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          )}

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
              {auditWarnings.some((w) => w.level === "danger")
                ? "Security Audit: High Risk Directives Detected"
                : auditWarnings.length > 0
                ? "Security Audit: Potential Warnings Found"
                : "Security Audit: Strong Hardened Configuration"}
            </span>
            <span className="text-xs text-muted-foreground">
              {auditWarnings.length > 0
                ? auditWarnings[0].message
                : "No high-risk wildcard or inline execution flags detected."}
            </span>
          </div>
        </div>

        <Badge
          className={cn(
            "text-xs font-mono uppercase px-2.5 py-0.5",
            auditWarnings.some((w) => w.level === "danger")
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              : auditWarnings.length > 0
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          )}
        >
          {auditWarnings.some((w) => w.level === "danger") ? "Grade C" : auditWarnings.length > 0 ? "Grade B" : "Grade A+"}
        </Badge>
      </Card>

      {/* Main Grid: Directives Checklist on Left, Generated Code on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Directives Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" /> Directive Configurations
            </span>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                checked={upgradeInsecure}
                onChange={(e) => setUpgradeInsecure(e.target.checked)}
                className="rounded border-border text-primary h-3.5 w-3.5"
              />
              <span>upgrade-insecure-requests</span>
            </label>
          </div>

          <div className="space-y-3">
            {(Object.keys(directives) as CspDirectiveKey[]).map((key) => {
              const cfg = directives[key];
              return (
                <Card key={key} className="p-3.5 bg-card border-border/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {key}
                    </span>

                    {/* Sources Checkboxes */}
                    <div className="flex items-center gap-2 text-xs">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cfg.self}
                          disabled={cfg.none}
                          onChange={(e) => updateDirective(key, { self: e.target.checked })}
                          className="rounded border-border text-primary h-3 w-3"
                        />
                        <span className="text-[11px] font-mono">'self'</span>
                      </label>

                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cfg.none}
                          onChange={(e) => updateDirective(key, { none: e.target.checked })}
                          className="rounded border-border text-rose-500 h-3 w-3"
                        />
                        <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400">'none'</span>
                      </label>

                      {key === "script-src" || key === "style-src" ? (
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cfg.unsafeInline}
                            disabled={cfg.none}
                            onChange={(e) => updateDirective(key, { unsafeInline: e.target.checked })}
                            className="rounded border-border text-amber-500 h-3 w-3"
                          />
                          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">'unsafe-inline'</span>
                        </label>
                      ) : null}

                      {key === "script-src" ? (
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cfg.unsafeEval}
                            disabled={cfg.none}
                            onChange={(e) => updateDirective(key, { unsafeEval: e.target.checked })}
                            className="rounded border-border text-rose-500 h-3 w-3"
                          />
                          <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400">'unsafe-eval'</span>
                        </label>
                      ) : null}

                      {key === "img-src" || key === "font-src" ? (
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cfg.data}
                            disabled={cfg.none}
                            onChange={(e) => updateDirective(key, { data: e.target.checked })}
                            className="rounded border-border text-primary h-3 w-3"
                          />
                          <span className="text-[11px] font-mono">data:</span>
                        </label>
                      ) : null}
                    </div>
                  </div>

                  {/* Custom Domains input */}
                  {!cfg.none ? (
                    <Input
                      value={cfg.customDomains}
                      onChange={(e) => updateDirective(key, { customDomains: e.target.value })}
                      placeholder="Custom domains, e.g. https://*.stripe.com https://fonts.gstatic.com"
                      className="h-7 text-xs font-mono"
                    />
                  ) : null}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Code Generation Pane (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
              {(
                [
                  { id: "header", label: "Header" },
                  { id: "nextjs", label: "Next.js" },
                  { id: "html", label: "HTML" },
                  { id: "nginx", label: "Nginx" },
                  { id: "apache", label: "Apache" },
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

            <CopyButton value={formattedCode} />
          </div>

          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs min-h-[440px] flex flex-col">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Security Policy Directive String</span>
              <span>{cspString.length} chars</span>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre">
              {formattedCode}
            </div>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
