"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Globe,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Terminal,
  Code2,
  Layers,
  Send,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

const PRESETS = [
  {
    name: "Classic API (JSON + Bearer Token)",
    desc: "Triggers preflight due to application/json and Authorization header.",
    origin: "http://localhost:3000",
    target: "https://api.example.com/v1/users",
    method: "POST" as HttpMethod,
    contentType: "application/json",
    headers: ["Authorization", "Content-Type"],
    credentials: true,
    serverOrigin: "http://localhost:3000",
    serverMethods: "GET, POST, PUT, DELETE, OPTIONS",
    serverHeaders: "Content-Type, Authorization",
    serverCredentials: true,
  },
  {
    name: "The Fatal Wildcard (*) with Credentials Bug",
    desc: "Common developer pitfall: Allow-Origin is * but request sends cookies/credentials.",
    origin: "https://my-frontend.vercel.app",
    target: "https://api.backend.com/auth/session",
    method: "GET" as HttpMethod,
    contentType: "application/json",
    headers: ["Authorization"],
    credentials: true,
    serverOrigin: "*", // Will trigger fatal CORS error!
    serverMethods: "GET, POST, OPTIONS",
    serverHeaders: "Authorization, Content-Type",
    serverCredentials: true,
  },
  {
    name: "Simple Request (No Preflight Needed)",
    desc: "GET request with standard headers skips the OPTIONS handshake.",
    origin: "https://client.site",
    target: "https://api.site/public/data",
    method: "GET" as HttpMethod,
    contentType: "text/plain",
    headers: ["Accept"],
    credentials: false,
    serverOrigin: "*",
    serverMethods: "GET",
    serverHeaders: "Accept",
    serverCredentials: false,
  },
];

export function CorsSimulatorTool({ tool }: { tool: ToolDef }) {
  // Request State
  const [origin, setOrigin] = useState("http://localhost:3000");
  const [targetUrl, setTargetUrl] = useState("https://api.example.com/v1/data");
  const [method, setMethod] = useState<HttpMethod>("POST");
  const [contentType, setContentType] = useState("application/json");
  const [customHeaderInput, setCustomHeaderInput] = useState("Authorization, Content-Type");
  const [withCredentials, setWithCredentials] = useState(true);

  // Server Headers State
  const [allowOrigin, setAllowOrigin] = useState("http://localhost:3000");
  const [allowMethods, setAllowMethods] = useState("GET, POST, PUT, DELETE, OPTIONS");
  const [allowHeaders, setAllowHeaders] = useState("Content-Type, Authorization");
  const [allowCredentials, setAllowCredentials] = useState(true);
  const [maxAge, setMaxAge] = useState("86400");

  const [activeTab, setActiveTab] = useState<"nextjs" | "express" | "nginx">("nextjs");

  // Determine if Preflight is Triggered
  const preflightAnalysis = useMemo(() => {
    const isSimpleMethod = ["GET", "HEAD", "POST"].includes(method);
    const simpleContentTypes = [
      "application/x-www-form-urlencoded",
      "multipart/form-data",
      "text/plain",
    ];
    const isSimpleContentType = simpleContentTypes.includes(contentType.toLowerCase().trim());

    const requestedHeaders = customHeaderInput
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    const simpleHeaders = ["accept", "accept-language", "content-language", "content-type"];
    const hasCustomHeaders = requestedHeaders.some((h) => !simpleHeaders.includes(h));

    const needsPreflight = !isSimpleMethod || !isSimpleContentType || hasCustomHeaders;

    return {
      needsPreflight,
      reason: !isSimpleMethod
        ? `Method ${method} is not a CORS-safelisted method.`
        : !isSimpleContentType
        ? `Content-Type '${contentType}' requires preflight.`
        : hasCustomHeaders
        ? `Custom headers require preflight approval.`
        : "Standard safelisted request (simple request).",
      requestedHeaders,
    };
  }, [method, contentType, customHeaderInput]);

  // Diagnosis Engine
  const diagnosis = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const checks: { title: string; passed: boolean; message: string }[] = [];

    const normOrigin = origin.trim();
    const normAllowOrigin = allowOrigin.trim();

    // 1. Origin Check
    let originMatches = false;
    if (normAllowOrigin === "*") {
      originMatches = true;
    } else if (normAllowOrigin.toLowerCase() === normOrigin.toLowerCase()) {
      originMatches = true;
    }

    if (!originMatches) {
      errors.push(
        `Access to fetch at '${targetUrl}' from origin '${normOrigin}' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource, or value '${normAllowOrigin}' does not match '${normOrigin}'.`
      );
      checks.push({
        title: "Origin Allowed",
        passed: false,
        message: `Allowed: '${normAllowOrigin}', but request sent: '${normOrigin}'`,
      });
    } else {
      checks.push({
        title: "Origin Allowed",
        passed: true,
        message: `Origin '${normOrigin}' successfully matched by '${normAllowOrigin}'.`,
      });
    }

    // 2. Fatal Wildcard Credentials Bug
    if (withCredentials && normAllowOrigin === "*") {
      errors.push(
        `The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The server must reflect the explicit origin '${normOrigin}'.`
      );
      checks.push({
        title: "Credentials with Wildcard (*)",
        passed: false,
        message: "Cannot use wildcard '*' when credentials mode is 'include'.",
      });
    } else if (withCredentials) {
      if (!allowCredentials) {
        errors.push(
          `Credentials mode is 'include', but the 'Access-Control-Allow-Credentials' header in the response is not 'true'.`
        );
        checks.push({
          title: "Allow-Credentials Header",
          passed: false,
          message: "Server did not return 'Access-Control-Allow-Credentials: true'.",
        });
      } else {
        checks.push({
          title: "Credentials Mode",
          passed: true,
          message: "Explicit origin specified and Allow-Credentials is true.",
        });
      }
    }

    // 3. Method Check (Preflight)
    if (preflightAnalysis.needsPreflight) {
      const allowedMethodsList = allowMethods
        .split(",")
        .map((m) => m.trim().toUpperCase());
      const methodAllowed = allowedMethodsList.includes(method);

      if (!methodAllowed) {
        errors.push(
          `Method '${method}' is not allowed by Access-Control-Allow-Methods in preflight response.`
        );
        checks.push({
          title: "HTTP Method Permitted",
          passed: false,
          message: `Method ${method} is missing from allowed methods (${allowMethods}).`,
        });
      } else {
        checks.push({
          title: "HTTP Method Permitted",
          passed: true,
          message: `Method '${method}' is approved in preflight response.`,
        });
      }

      // 4. Headers Check (Preflight)
      const allowedHeadersList = allowHeaders
        .split(",")
        .map((h) => h.trim().toLowerCase());
      const missingHeaders = preflightAnalysis.requestedHeaders.filter(
        (h) => !allowedHeadersList.includes(h) && h !== "content-type"
      );

      if (missingHeaders.length > 0) {
        errors.push(
          `Request header '${missingHeaders.join(", ")}' is not allowed by Access-Control-Allow-Headers in preflight response.`
        );
        checks.push({
          title: "Headers Permitted",
          passed: false,
          message: `Missing header approval: ${missingHeaders.join(", ")}`,
        });
      } else {
        checks.push({
          title: "Headers Permitted",
          passed: true,
          message: "All requested custom headers approved by server.",
        });
      }
    }

    const isSuccessful = errors.length === 0;

    return {
      isSuccessful,
      errors,
      warnings,
      checks,
    };
  }, [
    origin,
    targetUrl,
    method,
    withCredentials,
    allowOrigin,
    allowMethods,
    allowHeaders,
    allowCredentials,
    preflightAnalysis,
  ]);

  // Code Snippet Fixes
  const codeFixes = useMemo(() => {
    const originStr = withCredentials ? origin : allowOrigin || "*";

    const nextjs = `// app/api/example/route.ts
import { NextResponse } from 'next/server';

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '${originStr}',
      'Access-Control-Allow-Methods': '${allowMethods}',
      'Access-Control-Allow-Headers': '${allowHeaders}',
      ${withCredentials ? `'Access-Control-Allow-Credentials': 'true',` : ""}
      'Access-Control-Max-Age': '${maxAge}',
    },
  });
}

export async function ${method}(request: Request) {
  return NextResponse.json(
    { success: true, message: 'Data fetched successfully' },
    {
      headers: {
        'Access-Control-Allow-Origin': '${originStr}',
        ${withCredentials ? `'Access-Control-Allow-Credentials': 'true',` : ""}
      },
    }
  );
}`;

    const express = `// Express.js
import cors from 'cors';

app.use(cors({
  origin: '${originStr}',
  methods: [${allowMethods.split(",").map((m) => `'${m.trim()}'`).join(", ")}],
  allowedHeaders: [${allowHeaders.split(",").map((h) => `'${h.trim()}'`).join(", ")}],
  credentials: ${withCredentials},
  maxAge: ${maxAge},
}));`;

    const nginx = `# Nginx Server Block (location)
location /api/ {
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '${originStr}' always;
        add_header 'Access-Control-Allow-Methods' '${allowMethods}' always;
        add_header 'Access-Control-Allow-Headers' '${allowHeaders}' always;
        ${withCredentials ? `add_header 'Access-Control-Allow-Credentials' 'true' always;` : ""}
        add_header 'Access-Control-Max-Age' ${maxAge};
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    add_header 'Access-Control-Allow-Origin' '${originStr}' always;
    ${withCredentials ? `add_header 'Access-Control-Allow-Credentials' 'true' always;` : ""}
    proxy_pass http://localhost:8000;
}`;

    return { nextjs, express, nginx };
  }, [origin, allowOrigin, allowMethods, allowHeaders, withCredentials, maxAge, method]);

  const loadPreset = (p: (typeof PRESETS)[number]) => {
    setOrigin(p.origin);
    setTargetUrl(p.target);
    setMethod(p.method);
    setContentType(p.contentType);
    setCustomHeaderInput(p.headers.join(", "));
    setWithCredentials(p.credentials);
    setAllowOrigin(p.serverOrigin);
    setAllowMethods(p.serverMethods);
    setAllowHeaders(p.serverHeaders);
    setAllowCredentials(p.serverCredentials);
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            CORS Preflight Simulator & Debugger
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => loadPreset(PRESETS[0])}
            className="text-xs h-8"
          >
            Reset Default
          </Button>
        </div>
      </div>
      {/* Preset Pills */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Test Scenarios:
        </span>
        {PRESETS.map((preset) => (
          <Button
            key={preset.name}
            size="sm"
            variant="secondary"
            className="text-xs h-7 whitespace-nowrap"
            onClick={() => loadPreset(preset)}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Request & Server Configuration (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Client Request Spec */}
          <Card className="p-4 border-border bg-card space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-primary" />
                <span>1. Browser Fetch Request</span>
              </span>
              <Badge
                variant={preflightAnalysis.needsPreflight ? "secondary" : "outline"}
                className="text-[10px]"
              >
                {preflightAnalysis.needsPreflight ? "Preflight Required" : "Simple Request"}
              </Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-muted-foreground font-medium block mb-1">
                  Origin (Window / Page Origin)
                </label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="http://localhost:3000"
                  className="font-mono text-xs h-8"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">
                  Target API Endpoint
                </label>
                <Input
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://api.example.com/v1/resource"
                  className="font-mono text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">
                    HTTP Method
                  </label>
                  <Select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as HttpMethod)}
                    className="text-xs h-8"
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">
                    Content-Type
                  </label>
                  <Input
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    placeholder="application/json"
                    className="font-mono text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">
                  Custom Request Headers
                </label>
                <Input
                  value={customHeaderInput}
                  onChange={(e) => setCustomHeaderInput(e.target.value)}
                  placeholder="Authorization, X-Custom-Header"
                  className="font-mono text-xs h-8"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <Checkbox
                  checked={withCredentials}
                  onChange={(checked: boolean) => setWithCredentials(checked)}
                />
                <span className="text-foreground">
                  Credentials Mode: <strong className="font-mono">include</strong> (Cookies / Auth)
                </span>
              </label>
            </div>
          </Card>

          {/* Simulated Server Response Headers */}
          <Card className="p-4 border-border bg-card space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>2. Server Response Headers</span>
              </span>
              <span className="text-[10px] text-muted-foreground">OPTIONS / Actual</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-muted-foreground font-medium">
                    Access-Control-Allow-Origin
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setAllowOrigin("*")}
                      className="text-[10px] text-primary hover:underline"
                    >
                      *
                    </button>
                    <span className="text-muted-foreground text-[10px]">•</span>
                    <button
                      type="button"
                      onClick={() => setAllowOrigin(origin)}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Reflect Origin
                    </button>
                  </div>
                </div>
                <Input
                  value={allowOrigin}
                  onChange={(e) => setAllowOrigin(e.target.value)}
                  className="font-mono text-xs h-8"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">
                  Access-Control-Allow-Methods
                </label>
                <Input
                  value={allowMethods}
                  onChange={(e) => setAllowMethods(e.target.value)}
                  className="font-mono text-xs h-8"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">
                  Access-Control-Allow-Headers
                </label>
                <Input
                  value={allowHeaders}
                  onChange={(e) => setAllowHeaders(e.target.value)}
                  className="font-mono text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={allowCredentials}
                    onChange={(checked: boolean) => setAllowCredentials(checked)}
                  />
                  <span className="text-foreground">Allow-Credentials</span>
                </label>

                <div>
                  <label className="text-[11px] text-muted-foreground block mb-0.5">
                    Max-Age (seconds)
                  </label>
                  <Input
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="font-mono text-xs h-7"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Simulation Verdict & Diagnosis (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Verdict Card */}
          <Card
            className={cn(
              "p-4 border transition-all",
              diagnosis.isSuccessful
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                : "bg-red-500/10 border-red-500/30 text-red-950 dark:text-red-100"
            )}
          >
            <div className="flex items-center gap-3">
              {diagnosis.isSuccessful ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">
                  {diagnosis.isSuccessful
                    ? "CORS Preflight & Request Passed Successfully"
                    : "CORS Request Blocked by Browser"}
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  {diagnosis.isSuccessful
                    ? "The browser permits JavaScript access to the response body."
                    : `${diagnosis.errors.length} fatal CORS security policy failure(s) detected.`}
                </div>
              </div>
              <Badge
                variant={diagnosis.isSuccessful ? "default" : "destructive"}
                className="text-xs font-mono"
              >
                {diagnosis.isSuccessful ? "200 OK" : "CORS Error"}
              </Badge>
            </div>
          </Card>

          {/* Browser DevTools Simulated Console Log */}
          {!diagnosis.isSuccessful && (
            <Card className="p-3 bg-neutral-900 border-neutral-800 text-neutral-100 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-2 border-b border-neutral-800 pb-1.5 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                <span>Simulated Browser Console (Chrome / Safari / Firefox)</span>
              </div>
              <div className="space-y-1.5 text-red-400 text-[11px] leading-relaxed">
                {diagnosis.errors.map((err, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Security & Spec Checklist */}
          <Card className="p-4 border-border bg-card">
            <div className="text-xs font-semibold text-foreground mb-3 flex items-center justify-between">
              <span>W3C Fetch Specification Checklist</span>
              <span className="text-muted-foreground font-normal text-[11px]">
                {preflightAnalysis.reason}
              </span>
            </div>

            <div className="space-y-2">
              {diagnosis.checks.map((check, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-muted/30 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span className="font-semibold text-foreground">{check.title}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate max-w-xs">
                    {check.message}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Server Fix Code Generator */}
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Code2 className="w-4 h-4 text-primary" />
                <span>Ready Server Fix</span>
              </div>
              <div className="flex gap-1">
                {(["nextjs", "express", "nginx"] as const).map((tab) => (
                  <Button
                    key={tab}
                    size="sm"
                    variant={activeTab === tab ? "primary" : "ghost"}
                    onClick={() => setActiveTab(tab)}
                    className="text-[11px] h-6 px-2 capitalize"
                  >
                    {tab === "nextjs" ? "Next.js" : tab}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <CopyButton
                  value={
                    activeTab === "nextjs"
                      ? codeFixes.nextjs
                      : activeTab === "express"
                      ? codeFixes.express
                      : codeFixes.nginx
                  }
                />
              </div>
              <pre className="p-3 bg-muted/30 rounded-lg font-mono text-[11px] overflow-x-auto text-foreground leading-relaxed max-h-56">
                <code>
                  {activeTab === "nextjs"
                    ? codeFixes.nextjs
                    : activeTab === "express"
                    ? codeFixes.express
                    : codeFixes.nginx}
                </code>
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </ToolWorkspace>
  );
}

export default CorsSimulatorTool;
