"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [input, setInput] = React.useState("");
  const [dateInput, setDateInput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const convertFromTimestamp = () => {
    setError(null);
    const ms = detectTimestamp(input.trim());

    if (!ms) {
      setError("Invalid timestamp (use 10 or 13 digits)");
      setResult(null);
      return;
    }

    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setError("Invalid date value");
      setResult(null);
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
      setError("Select a date");
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError("Invalid date");
      return;
    }

    setResult({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: formatRelative(date),
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    });
  };

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const setNow = () => {
    const now = Date.now();
    setInput(String(now));
    convertFromTimestamp();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Input Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unix Input */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-5">
            <div className="font-medium">Unix Timestamp</div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter 10 or 13 digit timestamp"
              className="mt-3 w-full rounded border p-2 font-mono"
            />
            <div className="mt-3 flex gap-2">
              <Button onClick={convertFromTimestamp}>Convert</Button>
              <Button variant="secondary" onClick={setNow}>
                Use Now
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Date Input */}
        <motion.div
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-5">
            <div className="font-medium">Date Input</div>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="mt-3 w-full rounded border p-2"
            />
            <div className="mt-3">
              <Button onClick={convertFromDate}>Convert</Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mt-6 p-5 space-y-4">
            <div className="font-medium text-lg">Result</div>

            {Object.entries(result).map(([key, value]) => (
              <div
                key={key}
                className="
        border-b border-[rgb(var(--border))]
        pb-3
      "
              >
                {/* Mobile Layout */}
                <div className="flex flex-col gap-2 sm:hidden">
                  <span className="text-[rgb(var(--muted))] capitalize text-xs">
                    {key}
                  </span>

                  <span className="font-mono text-sm break-all">
                    {String(value)}
                  </span>

                  <motion.button
                    onClick={() => copy(String(value), key)}
                    whileTap={{ scale: 0.95 }}
                    className={`
            w-fit
            rounded-[var(--radius)]
            border px-3 py-1 text-xs transition
            ${
              copiedKey === key
                ? "border-[rgba(var(--accent),0.5)] bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]"
                : "border-[rgb(var(--border))] bg-[rgb(var(--card-2))] hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent),0.08)]"
            }
          `}
                  >
                    {copiedKey === key ? "Copied ✓" : "Copy"}
                  </motion.button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between gap-4">
                  <span className="text-[rgb(var(--muted))] capitalize text-sm">
                    {key}
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm break-all max-w-[400px]">
                      {String(value)}
                    </span>

                    <motion.button
                      onClick={() => copy(String(value), key)}
                      whileTap={{ scale: 0.95 }}
                      className={`
              rounded-[var(--radius)]
              border px-3 py-1 text-xs transition
              ${
                copiedKey === key
                  ? "border-[rgba(var(--accent),0.5)] bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]"
                  : "border-[rgb(var(--border))] bg-[rgb(var(--card-2))] hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent),0.08)]"
              }
            `}
                    >
                      {copiedKey === key ? "Copied ✓" : "Copy"}
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      )}
    </main>
  );
}
