"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { AlertCircle, Play, Check } from "lucide-react";

type Flags = {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
  u: boolean;
};

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b");
  const [flags, setFlags] = useState<Flags>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
  });

  const [testString, setTestString] = useState(
    "Contact our support team at support@toolmate.co.in or contact sales@example.com for inquiries.\nInvalid email: user@domain."
  );

  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);

  const flagString = Object.entries(flags)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join("");

  const toggleFlag = (flag: keyof Flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const run = useCallback(() => {
    setError(null);
    setMatches([]);

    if (!pattern) return;

    try {
      const regex = new RegExp(pattern, flagString);
      const results: RegExpExecArray[] = [];

      if (flags.g) {
        let m;
        let count = 0;
        while ((m = regex.exec(testString)) !== null && count < 1000) {
          results.push(m);
          count++;
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const m = regex.exec(testString);
        if (m) results.push(m);
      }

      setMatches(results);
    } catch (e: any) {
      setError(e.message);
    }
  }, [pattern, flagString, testString, flags.g]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <ToolWorkspace maxWidth="wide">
      {/* Pattern & Flags Bar */}
      <div className="w-full p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[rgb(var(--muted))]">
              /
            </span>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regular expression pattern..."
              className="pl-7 pr-7 font-mono text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[rgb(var(--muted))]">
              /{flagString}
            </span>
          </div>

          {/* Flags Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["g", "i", "m", "s", "u"] as const).map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-150 ${
                  flags[flag]
                    ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] shadow-sm"
                    : "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))] hover:text-[rgb(var(--fg))]"
                }`}
                title={`Flag /${flag}`}
              >
                {flag}
              </button>
            ))}

            <Button type="button" size="sm" onClick={run} className="text-xs h-9 ml-auto sm:ml-2">
              <Play className="w-3.5 h-3.5 mr-1" />
              Test
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Grid Inputs & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        <div className="flex flex-col min-w-0 w-full space-y-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Test String
          </span>
          <CodeEditor
            value={testString}
            onChange={(v) => setTestString(v || "")}
            language="plaintext"
            minHeight="min-h-[260px] sm:min-h-[360px]"
            options={{ wordWrap: "on" }}
          />
        </div>

        <div className="flex flex-col min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Match Highlight ({matches.length})
            </span>
          </div>

          <div className="w-full min-w-0 min-h-[260px] sm:min-h-[360px] p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-auto scrollbar-refined font-mono text-xs leading-relaxed whitespace-pre-wrap break-words-safe">
            <SafeHighlight text={testString} pattern={pattern} flags={flagString} />
          </div>
        </div>
      </div>

      {/* Matches List */}
      {matches.length > 0 && (
        <div className="w-full min-w-0 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[rgb(var(--border))] flex items-center justify-between bg-[rgb(var(--card-2))]">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Match Details ({matches.length} found)
            </span>
          </div>
          <div className="p-3 sm:p-4 space-y-2 max-h-64 overflow-y-auto scrollbar-refined">
            {matches.map((m, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-semibold">
                    #{i + 1}
                  </span>
                  <span className="break-all font-medium text-[rgb(var(--fg))]">
                    {m[0]}
                  </span>
                </div>
                <div className="text-[rgb(var(--muted))] text-[11px] sm:text-right">
                  Index: {m.index} {m.length > 1 && `| Groups: [${m.slice(1).join(", ")}]`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}

function SafeHighlight({
  text,
  pattern,
  flags,
}: {
  text: string;
  pattern: string;
  flags: string;
}) {
  if (!pattern) return <span>{text}</span>;

  try {
    const regex = new RegExp(`(${pattern})`, flags.includes("g") ? flags : flags + "g");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) => {
          let isMatch = false;
          try {
            isMatch = new RegExp(`^${pattern}$`, flags.replace("g", "")).test(part);
          } catch {
            isMatch = false;
          }

          if (isMatch) {
            return (
              <mark
                key={i}
                className="bg-amber-400/30 text-amber-900 dark:text-amber-200 px-1 py-0.5 rounded border border-amber-500/40 font-semibold"
              >
                {part}
              </mark>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  } catch {
    return <span>{text}</span>;
  }
}
