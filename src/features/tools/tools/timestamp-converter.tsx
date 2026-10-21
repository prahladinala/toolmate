"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, Clock, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function detectTimestamp(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (value.length === 13) return n;
  if (value.length === 10) return n * 1000;
  return null;
}

function formatRelative(date: Date) {
  const diff = date.getTime() - Date.now();
  const seconds = Math.floor(diff / 1000);
  const abs = Math.abs(seconds);

  const units = [
    { label: "year", sec: 31536000 },
    { label: "month", sec: 2592000 },
    { label: "day", sec: 86400 },
    { label: "hour", sec: 3600 },
    { label: "minute", sec: 60 },
    { label: "second", sec: 1 },
  ];

  for (const u of units) {
    if (abs >= u.sec) {
      const value = Math.floor(abs / u.sec);
      return diff > 0
        ? `In ${value} ${u.label}${value > 1 ? "s" : ""}`
        : `${value} ${u.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

export default function TimestampConverterTool() {
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const setNow = () => {
    const now = Date.now();
    setUnixInput(String(Math.floor(now / 1000)));
    const date = new Date(now);
    setResult({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: formatRelative(date),
      seconds: Math.floor(now / 1000),
      milliseconds: now,
    });
    setError(null);
  };

  useEffect(() => {
    setNow();
  }, []);

  const convertFromTimestamp = () => {
    setError(null);
    const ms = detectTimestamp(unixInput.trim());

    if (!ms) {
      setError("Please provide a valid 10-digit (seconds) or 13-digit (ms) Unix timestamp.");
      return;
    }

    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setError("Invalid date range calculated.");
      return;
    }

    setResult({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: formatRelative(date),
      seconds: Math.floor(ms / 1000),
      milliseconds: ms,
    });
  };

  const convertFromDate = () => {
    setError(null);
    if (!dateInput) {
      setError("Please select a date and time to convert.");
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError("Invalid date format entered.");
      return;
    }

    const ms = date.getTime();
    setResult({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: formatRelative(date),
      seconds: Math.floor(ms / 1000),
      milliseconds: ms,
    });
  };

  const copyVal = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedKey(key);
      toast.success(`Copied ${key}!`);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Convert epoch unix timestamps to readable human date times, UTC, ISO 8601, and relative offsets
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={setNow}
          className="text-xs"
        >
          <Clock className="w-3.5 h-3.5 mr-1" />
          Reset to Current Time
        </Button>
      </ToolToolbar>

      {/* Two Input Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-3">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Unix Timestamp (10 or 13 digits)
          </label>
          <div className="flex gap-2">
            <Input
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="e.g. 1711000000"
              className="flex-1 font-mono text-sm h-10 bg-[rgb(var(--card-2))]"
            />
            <Button
              type="button"
              size="sm"
              onClick={convertFromTimestamp}
              className="text-xs h-10 px-3"
            >
              Convert
            </Button>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-3">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Human Date & Time
          </label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-1 font-mono text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={convertFromDate}
              className="text-xs h-10 px-3"
            >
              Convert
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Cards */}
      {result && (
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Timestamp Breakdown
            </span>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              {result.relative}
            </span>
          </div>

          <div className="divide-y divide-[rgb(var(--border))]">
            {[
              { label: "Epoch Seconds", val: String(result.seconds) },
              { label: "Epoch Milliseconds", val: String(result.milliseconds) },
              { label: "Local Time", val: result.local },
              { label: "UTC / GMT String", val: result.utc },
              { label: "ISO 8601 String", val: result.iso },
            ].map((row) => (
              <div
                key={row.label}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[rgb(var(--card-2))]/50 transition-colors"
              >
                <span className="text-xs font-semibold text-[rgb(var(--muted))] sm:w-44 shrink-0">
                  {row.label}
                </span>
                <span className="font-mono text-xs sm:text-sm text-[rgb(var(--fg))] break-all flex-1 select-all">
                  {row.val}
                </span>
                <button
                  type="button"
                  onClick={() => copyVal(row.label, row.val)}
                  className="self-end sm:self-auto p-1.5 rounded-lg text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--card-2))] transition-colors"
                  title={`Copy ${row.label}`}
                >
                  {copiedKey === row.label ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
