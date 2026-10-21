"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

const DEFAULT_CSV = `id,name,role,department
1,Alice Johnson,Lead Engineer,Engineering
2,Bob Smith,Product Designer,Design
3,Charlie Brown,Developer,Engineering`;

export function CsvToSqlTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_CSV);
  const [output, setOutput] = useState("");
  const [tableName, setTableName] = useState("users");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    Papa.parse(input.value, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          setError("Failed to parse CSV: " + results.errors[0].message);
          return;
        }

        const data = results.data as Record<string, string>[];
        if (data.length === 0) {
          setOutput("");
          setError(null);
          return;
        }

        const columns = Object.keys(data[0]);
        if (columns.length === 0) {
          setError("No columns found in CSV.");
          return;
        }

        try {
          const sqlStatements = data.map((row) => {
            const values = columns.map((col) => {
              const val = row[col];
              if (val === null || val === undefined || val === "") return "NULL";
              if (!isNaN(Number(val)) && val.trim() !== "") return val;
              return `'${val.replace(/'/g, "''")}'`;
            });
            return `INSERT INTO ${tableName || "my_table"} (${columns.join(", ")}) VALUES (${values.join(", ")});`;
          });

          setOutput(sqlStatements.join("\n"));
          setError(null);
        } catch (err: any) {
          setError(err.message || "Failed to generate SQL.");
        }
      },
      error: (err: any) => {
        setError(err.message);
      },
    });
  }, [input.value, tableName]);

  useEffect(() => {
    convert();
  }, [convert]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied SQL queries to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
            Target Table Name:
          </label>
          <Input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-36 h-8 text-xs font-mono bg-[rgb(var(--card-2))]"
            placeholder="users"
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(DEFAULT_CSV)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Sample
        </Button>
      </ToolToolbar>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            CSV Input
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              SQL Insert Statements
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              disabled={!output}
              className="text-xs h-7 px-2"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy SQL
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="plaintext"
            minHeight="min-h-[300px] sm:min-h-[420px]"
          />
        }
        output={
          <CodeEditor
            value={output}
            language="sql"
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
          />
        }
      />
    </ToolWorkspace>
  );
}
