"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Activity,
  Clock,
  HardDrive,
  FileCode,
  Search,
  Filter,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Built-in Sample HAR data for instant preview
const SAMPLE_HAR_ENTRIES = [
  {
    startedDateTime: "2026-11-08T00:00:00.000Z",
    time: 145,
    request: {
      method: "GET",
      url: "https://toolmate.co.in/",
      headers: [{ name: "Accept", value: "text/html" }],
    },
    response: {
      status: 200,
      statusText: "OK",
      content: { mimeType: "text/html", size: 14200 },
    },
    timings: { blocked: 2, dns: 12, connect: 28, ssl: 32, send: 1, wait: 48, receive: 22 },
  },
  {
    startedDateTime: "2026-11-08T00:00:00.150Z",
    time: 85,
    request: {
      method: "GET",
      url: "https://toolmate.co.in/_next/static/css/app.css",
      headers: [],
    },
    response: {
      status: 200,
      statusText: "OK",
      content: { mimeType: "text/css", size: 28400 },
    },
    timings: { blocked: 1, dns: 0, connect: 0, ssl: 0, send: 1, wait: 35, receive: 48 },
  },
  {
    startedDateTime: "2026-11-08T00:00:00.160Z",
    time: 120,
    request: {
      method: "GET",
      url: "https://toolmate.co.in/_next/static/chunks/main.js",
      headers: [],
    },
    response: {
      status: 200,
      statusText: "OK",
      content: { mimeType: "application/javascript", size: 94500 },
    },
    timings: { blocked: 1, dns: 0, connect: 0, ssl: 0, send: 1, wait: 55, receive: 63 },
  },
  {
    startedDateTime: "2026-11-08T00:00:00.220Z",
    time: 95,
    request: {
      method: "GET",
      url: "https://toolmate.co.in/api/v1/tools-meta",
      headers: [],
    },
    response: {
      status: 200,
      statusText: "OK",
      content: { mimeType: "application/json", size: 4800 },
    },
    timings: { blocked: 2, dns: 0, connect: 0, ssl: 0, send: 1, wait: 78, receive: 14 },
  },
  {
    startedDateTime: "2026-11-08T00:00:00.290Z",
    time: 65,
    request: {
      method: "GET",
      url: "https://toolmate.co.in/icons/logo.svg",
      headers: [],
    },
    response: {
      status: 200,
      statusText: "OK",
      content: { mimeType: "image/svg+xml", size: 3200 },
    },
    timings: { blocked: 1, dns: 0, connect: 0, ssl: 0, send: 1, wait: 28, receive: 35 },
  },
  {
    startedDateTime: "2026-11-08T00:00:00.320Z",
    time: 180,
    request: {
      method: "POST",
      url: "https://toolmate.co.in/api/analytics/track",
      headers: [],
    },
    response: {
      status: 204,
      statusText: "No Content",
      content: { mimeType: "application/json", size: 0 },
    },
    timings: { blocked: 1, dns: 0, connect: 0, ssl: 0, send: 1, wait: 175, receive: 3 },
  },
  {
    startedDateTime: "2026-11-08T00:00:00.360Z",
    time: 42,
    request: {
      method: "GET",
      url: "https://toolmate.co.in/missing-asset.png",
      headers: [],
    },
    response: {
      status: 404,
      statusText: "Not Found",
      content: { mimeType: "text/html", size: 450 },
    },
    timings: { blocked: 1, dns: 0, connect: 0, ssl: 0, send: 1, wait: 38, receive: 2 },
  },
];

type HarEntry = (typeof SAMPLE_HAR_ENTRIES)[0];

export function HarWaterfallVisualizerTool({ tool }: { tool: ToolDef }) {
  const [entries, setEntries] = useState<HarEntry[]>(SAMPLE_HAR_ENTRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<HarEntry | null>(null);

  // File upload reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const harEntries = json?.log?.entries || [];
        if (harEntries.length > 0) {
          setEntries(harEntries);
          setSelectedEntry(null);
        }
      } catch {
        alert("Invalid HAR file format. Please upload a valid JSON .har file.");
      }
    };
    reader.readAsText(file);
  };

  // Metrics
  const summary = useMemo(() => {
    let totalBytes = 0;
    let maxTime = 0;
    let errorCount = 0;

    const startTimes = entries
      .map((e) => new Date(e.startedDateTime).getTime())
      .filter((t) => !isNaN(t));

    const minStartTime = startTimes.length ? Math.min(...startTimes) : 0;

    entries.forEach((e) => {
      totalBytes += e.response.content.size || 0;
      const startOffset = new Date(e.startedDateTime).getTime() - minStartTime;
      const endOffset = startOffset + (e.time || 0);
      if (endOffset > maxTime) maxTime = endOffset;
      if (e.response.status >= 400) errorCount++;
    });

    return {
      totalRequests: entries.length,
      totalBytes,
      maxTime: Math.max(maxTime, 1),
      minStartTime,
      errorCount,
    };
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const url = e.request.url.toLowerCase();
      const mime = (e.response.content.mimeType || "").toLowerCase();

      // Search query
      if (searchQuery && !url.includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter === "js") return mime.includes("javascript") || url.endsWith(".js");
      if (typeFilter === "css") return mime.includes("css") || url.endsWith(".css");
      if (typeFilter === "img") return mime.includes("image") || /\.(png|jpg|svg|webp|gif)/.test(url);
      if (typeFilter === "xhr") return mime.includes("json") || url.includes("/api/");
      if (typeFilter === "doc") return mime.includes("html");
      if (typeFilter === "errors") return e.response.status >= 400;

      return true;
    });
  }, [entries, searchQuery, typeFilter]);

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
    if (status >= 300 && status < 400) {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
    if (status >= 400 && status < 500) {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Upload & Sample Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs transition-opacity">
            <Upload className="w-3.5 h-3.5" />
            Upload .HAR File
            <input
              type="file"
              accept=".har,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="text-xs text-muted-foreground hidden md:inline">
            100% private in-browser analysis (zero uploads to server)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setEntries(SAMPLE_HAR_ENTRIES);
              setSelectedEntry(null);
            }}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Reset to Sample Trace
          </Button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Requests
            </span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {summary.totalRequests}
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Transferred Size
            </span>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {formatBytes(summary.totalBytes)}
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Load Duration
            </span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {Math.round(summary.maxTime)} ms
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              HTTP Errors
            </span>
            {summary.errorCount > 0 ? (
              <XCircle className="w-4 h-4 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <div
            className={cn(
              "mt-2 text-2xl font-bold font-mono",
              summary.errorCount > 0 ? "text-rose-500" : "text-emerald-500"
            )}
          >
            {summary.errorCount}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter URLs or paths..."
            className="h-9 pl-8 text-xs font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All" },
            { id: "xhr", label: "Fetch/XHR" },
            { id: "js", label: "JS" },
            { id: "css", label: "CSS" },
            { id: "img", label: "Images" },
            { id: "doc", label: "Doc" },
            { id: "errors", label: "Errors" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                typeFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground flex-wrap pt-1">
        <span className="font-semibold uppercase text-xs">Waterfall Key:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" /> DNS / Connect
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-purple-500" /> SSL Handshake
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" /> Waiting (TTFB)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Content Download
        </span>
      </div>

      {/* Waterfall Table / Chart */}
      <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/70 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-4 w-20">Status</th>
                <th className="py-2.5 px-4 w-16">Method</th>
                <th className="py-2.5 px-4 min-w-[200px]">URL Request</th>
                <th className="py-2.5 px-4 w-24">Size</th>
                <th className="py-2.5 px-4 w-20">Time</th>
                <th className="py-2.5 px-4 min-w-[280px]">Waterfall Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-mono">
              {filteredEntries.map((entry, index) => {
                const startOffset =
                  new Date(entry.startedDateTime).getTime() - summary.minStartTime;
                const leftPercent = Math.max(
                  0,
                  Math.min(100, (startOffset / summary.maxTime) * 100)
                );
                const widthPercent = Math.max(
                  1,
                  Math.min(100 - leftPercent, ((entry.time || 1) / summary.maxTime) * 100)
                );

                const t = entry.timings;
                const totalTiming =
                  (t.dns || 0) +
                  (t.connect || 0) +
                  (t.ssl || 0) +
                  (t.wait || 0) +
                  (t.receive || 0);

                const dnsPct = totalTiming ? ((t.dns || 0) / totalTiming) * 100 : 0;
                const sslPct = totalTiming ? ((t.ssl || 0) / totalTiming) * 100 : 0;
                const waitPct = totalTiming ? ((t.wait || 0) / totalTiming) * 100 : 70;
                const recPct = totalTiming ? ((t.receive || 0) / totalTiming) * 100 : 30;

                return (
                  <tr
                    key={index}
                    onClick={() => setSelectedEntry(entry)}
                    className={cn(
                      "hover:bg-muted/30 cursor-pointer transition-colors",
                      selectedEntry === entry ? "bg-muted/50" : ""
                    )}
                  >
                    {/* Status */}
                    <td className="py-2.5 px-4">
                      <Badge
                        className={cn(
                          "font-mono text-[10px] px-1.5 py-0.5",
                          getStatusBadge(entry.response.status)
                        )}
                      >
                        {entry.response.status}
                      </Badge>
                    </td>

                    {/* Method */}
                    <td className="py-2.5 px-4 font-semibold text-muted-foreground">
                      {entry.request.method}
                    </td>

                    {/* URL */}
                    <td className="py-2.5 px-4 max-w-xs truncate text-foreground font-sans text-xs" title={entry.request.url}>
                      {entry.request.url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                    </td>

                    {/* Size */}
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {formatBytes(entry.response.content.size || 0)}
                    </td>

                    {/* Time */}
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {Math.round(entry.time)}ms
                    </td>

                    {/* Waterfall Bar */}
                    <td className="py-2.5 px-4">
                      <div className="w-full bg-muted/30 h-4 rounded-sm relative overflow-hidden">
                        <div
                          className="h-full absolute flex rounded-xs overflow-hidden shadow-xs"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            minWidth: "4px",
                          }}
                        >
                          {dnsPct > 0 ? (
                            <span
                              style={{ width: `${dnsPct}%` }}
                              className="bg-amber-400 h-full"
                              title={`DNS: ${t.dns}ms`}
                            />
                          ) : null}
                          {sslPct > 0 ? (
                            <span
                              style={{ width: `${sslPct}%` }}
                              className="bg-purple-500 h-full"
                              title={`SSL: ${t.ssl}ms`}
                            />
                          ) : null}
                          <span
                            style={{ width: `${waitPct}%` }}
                            className="bg-blue-500 h-full"
                            title={`TTFB: ${t.wait}ms`}
                          />
                          <span
                            style={{ width: `${recPct}%` }}
                            className="bg-emerald-500 h-full"
                            title={`Download: ${t.receive}ms`}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Selected Request Inspector Drawer */}
      {selectedEntry ? (
        <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "font-mono text-xs px-2 py-0.5",
                  getStatusBadge(selectedEntry.response.status)
                )}
              >
                {selectedEntry.response.status} {selectedEntry.response.statusText}
              </Badge>
              <span className="font-mono text-xs font-bold text-foreground truncate max-w-xl">
                {selectedEntry.request.url}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEntry(null)}
              className="h-7 text-xs"
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground block text-[10px]">DNS Lookup</span>
              <span className="font-bold text-foreground">{selectedEntry.timings.dns || 0} ms</span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground block text-[10px]">SSL Handshake</span>
              <span className="font-bold text-foreground">{selectedEntry.timings.ssl || 0} ms</span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground block text-[10px]">Server TTFB</span>
              <span className="font-bold text-foreground">{selectedEntry.timings.wait || 0} ms</span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground block text-[10px]">Content Download</span>
              <span className="font-bold text-foreground">{selectedEntry.timings.receive || 0} ms</span>
            </div>
          </div>
        </Card>
      ) : null}
    </ToolWorkspace>
  );
}
