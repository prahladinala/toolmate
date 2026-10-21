"use client";

import React, { useState, useMemo } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import {
  GitCompare,
  RotateCcw,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const SAMPLE_LEFT = `{
  "app": "ToolMate",
  "version": "2.4.0",
  "features": {
    "auth": true,
    "darkMode": true,
    "maxUploadMb": 25
  },
  "database": {
    "host": "db.prod.internal",
    "port": 5432,
    "ssl": true
  },
  "maintainers": ["Alex", "Sara"]
}`;

const SAMPLE_RIGHT = `{
  "app": "ToolMate",
  "version": "2.5.0",
  "features": {
    "auth": true,
    "darkMode": true,
    "maxUploadMb": 50,
    "aiTools": true
  },
  "database": {
    "host": "db.prod.internal",
    "port": 5433,
    "ssl": true
  },
  "maintainers": ["Alex", "Sara", "David"]
}`;

interface DiffEntry {
  path: string;
  type: "added" | "removed" | "modified";
  oldVal?: any;
  newVal?: any;
}

function compareObjects(obj1: any, obj2: any, path = ""): DiffEntry[] {
  const diffs: DiffEntry[] = [];

  const keys1 = typeof obj1 === "object" && obj1 !== null ? Object.keys(obj1) : [];
  const keys2 = typeof obj2 === "object" && obj2 !== null ? Object.keys(obj2) : [];
  const allKeys = Array.from(new Set([...keys1, ...keys2]));

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const has1 = obj1 && Object.prototype.hasOwnProperty.call(obj1, key);
    const has2 = obj2 && Object.prototype.hasOwnProperty.call(obj2, key);

    if (has1 && !has2) {
      diffs.push({ path: currentPath, type: "removed", oldVal: obj1[key] });
    } else if (!has1 && has2) {
      diffs.push({ path: currentPath, type: "added", newVal: obj2[key] });
    } else {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
        diffs.push(...compareObjects(val1, val2, currentPath));
      } else if (val1 !== val2) {
        diffs.push({ path: currentPath, type: "modified", oldVal: val1, newVal: val2 });
      }
    }
  }

  return diffs;
}

export function JsonDiffTool() {
  const [leftJson, setLeftJson] = useState(SAMPLE_LEFT);
  const [rightJson, setRightJson] = useState(SAMPLE_RIGHT);
  const [filterType, setFilterType] = useState<"all" | "added" | "removed" | "modified">("all");

  const diffResult = useMemo(() => {
    try {
      const o1 = JSON.parse(leftJson);
      const o2 = JSON.parse(rightJson);
      const diffs = compareObjects(o1, o2);
      return { isValid: true, diffs, error: null };
    } catch (err: any) {
      return { isValid: false, diffs: [], error: err.message };
    }
  }, [leftJson, rightJson]);

  const counts = useMemo(() => {
    const res = { added: 0, removed: 0, modified: 0 };
    diffResult.diffs.forEach((d) => {
      res[d.type]++;
    });
    return res;
  }, [diffResult.diffs]);

  const filteredDiffs = useMemo(() => {
    if (filterType === "all") return diffResult.diffs;
    return diffResult.diffs.filter((d) => d.type === filterType);
  }, [diffResult.diffs, filterType]);

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[rgb(var(--foreground))]">Changes:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    filterType === "all"
                      ? "border-[rgb(var(--accent))] bg-[rgb(var(--card-2))] text-[rgb(var(--foreground))]"
                      : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                  }`}
                >
                  All ({diffResult.diffs.length})
                </button>
                <button
                  onClick={() => setFilterType("added")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    filterType === "added"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                      : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                  }`}
                >
                  +{counts.added} Added
                </button>
                <button
                  onClick={() => setFilterType("removed")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    filterType === "removed"
                      ? "border-red-500 bg-red-500/10 text-red-500"
                      : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                  }`}
                >
                  -{counts.removed} Removed
                </button>
                <button
                  onClick={() => setFilterType("modified")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    filterType === "modified"
                      ? "border-amber-500 bg-amber-500/10 text-amber-500"
                      : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                  }`}
                >
                  ~{counts.modified} Modified
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setLeftJson(SAMPLE_LEFT);
                setRightJson(SAMPLE_RIGHT);
              }}
              className="h-8 gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Sample Diff
            </Button>
          </div>
        </ToolToolbar>

        {/* Diff summary breakdown cards */}
        {diffResult.isValid && diffResult.diffs.length > 0 && (
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              Detected Structural Discrepancies ({filteredDiffs.length})
            </div>
            <div className="divide-y divide-[rgb(var(--border))] max-h-[300px] overflow-y-auto">
              {filteredDiffs.map((d, index) => (
                <div key={index} className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {d.type === "added" && <PlusCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {d.type === "removed" && <MinusCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    {d.type === "modified" && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                    <span className="font-mono font-semibold text-[rgb(var(--foreground))]">{d.path}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    {d.type === "modified" && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 line-through">
                          {JSON.stringify(d.oldVal)}
                        </span>
                        <span>→</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                          {JSON.stringify(d.newVal)}
                        </span>
                      </div>
                    )}
                    {d.type === "added" && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                        {JSON.stringify(d.newVal)}
                      </span>
                    )}
                    {d.type === "removed" && (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 line-through">
                        {JSON.stringify(d.oldVal)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ToolSplitPane
          inputHeader={
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              ORIGINAL JSON
            </span>
          }
          outputHeader={
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              MODIFIED JSON
            </span>
          }
          input={
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-2">
              <CodeEditor
                value={leftJson}
                onChange={(v) => setLeftJson(v || "")}
                language="json"
                minHeight="380px"
              />
            </div>
          }
          output={
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-2">
              <CodeEditor
                value={rightJson}
                onChange={(v) => setRightJson(v || "")}
                language="json"
                minHeight="380px"
              />
            </div>
          }
        />
      </div>
    </ToolWorkspace>
  );
}
