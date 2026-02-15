"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Flags = {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
  u: boolean;
};

export default function RegexTesterTool() {
  const [pattern, setPattern] = React.useState("");
  const [flags, setFlags] = React.useState<Flags>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
  });

  const [testString, setTestString] = React.useState(
    "Sample text\nAnother line\n12345",
  );

  const [error, setError] = React.useState<string | null>(null);
  const [matches, setMatches] = React.useState<RegExpExecArray[]>([]);

  const flagString = Object.entries(flags)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join("");

  /* ----------------------------------
     SAFE EXECUTION WITH LOOP PROTECTION
  ---------------------------------- */
  const run = React.useCallback(() => {
    setError(null);
    setMatches([]);

    if (!pattern) return;

    try {
      const regex = new RegExp(pattern, flagString);
      const results: RegExpExecArray[] = [];

      if (flags.g) {
        let m;
        while ((m = regex.exec(testString)) !== null) {
          results.push(m);

          // 🔥 Critical infinite loop fix
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

  React.useEffect(() => {
    run();
  }, [run]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Regex Tester</h1>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Test regular expressions live with highlighting and flags.
        </p>
      </div>

      {/* Pattern + Flags */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="flex-1 min-w-[220px] rounded border p-2"
          />

          {(["g", "i", "m", "s", "u"] as const).map((flag) => (
            <label key={flag} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={flags[flag]}
                onChange={(e) =>
                  setFlags({ ...flags, [flag]: e.target.checked })
                }
              />
              {flag}
            </label>
          ))}

          <Button onClick={run}>Run</Button>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Test String */}
        <Card className="p-4">
          <div className="font-medium">Test String</div>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="mt-3 h-[350px] w-full rounded border p-3 font-mono text-sm"
          />
        </Card>

        {/* Result Highlight */}
        <Card className="p-4">
          <div className="flex justify-between">
            <div className="font-medium">Matches ({matches.length})</div>
          </div>

          <div className="mt-3 h-[350px] overflow-auto rounded border p-3 font-mono text-sm">
            <SafeHighlight
              text={testString}
              pattern={pattern}
              flags={flagString}
            />
          </div>
        </Card>
      </div>

      {/* Match Details */}
      {matches.length > 0 && (
        <Card className="p-4 mt-6">
          <div className="font-medium">Match Details</div>
          <div className="mt-3 space-y-2 text-sm">
            {matches.map((m, i) => (
              <div key={i} className="rounded border p-2">
                <div>
                  Match {i + 1}: {m[0]}
                </div>
                {m.length > 1 && (
                  <div className="text-[rgb(var(--muted))]">
                    Groups: {m.slice(1).join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
}

/* ----------------------------------
   SAFE HIGHLIGHT COMPONENT
---------------------------------- */
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
    const regex = new RegExp(pattern, flags);

    const parts = text.split(regex);
    const matches = text.match(regex);

    if (!matches) return <span>{text}</span>;

    const result: React.ReactNode[] = [];

    parts.forEach((part, i) => {
      result.push(<span key={`text-${i}`}>{part}</span>);
      if (matches[i]) {
        result.push(
          <mark
            key={`match-${i}`}
            className="bg-yellow-300 text-black px-1 rounded"
          >
            {matches[i]}
          </mark>,
        );
      }
    });

    return <>{result}</>;
  } catch {
    return <span>{text}</span>;
  }
}
