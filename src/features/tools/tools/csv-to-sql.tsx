"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { toast } from "sonner";

export function CsvToSqlTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [tableName, setTableName] = useState("my_table");
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
            return `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")});`;
          });

          setOutput(sqlStatements.join("\n"));
          setError(null);
        } catch (err: any) {
          setError(err.message || "Failed to generate SQL.");
        }
      },
      error: (err: any) => {
        setError(err.message);
      }
    });
  }, [input.value, tableName]);

  useEffect(() => {
    convert();
  }, [convert]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <Label className="text-sm font-medium">Table Name:</Label>
        <Input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="rounded border p-1.5 text-sm bg-[rgb(var(--card-2))]"
          placeholder="my_table"
        />
        <Button size="sm" onClick={convert}>Convert</Button>
      </div>

      {error && (
        <div className="mb-4 rounded-[var(--radius)] border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.08)] p-4 text-sm text-red-500 whitespace-pre-wrap font-mono">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col h-full">
          <div className="font-medium mb-3">Input CSV (with headers)</div>
          <CodeEditor
            className="min-h-[500px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="csv"
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Output SQL</div>
            <Button size="sm" variant="secondary" onClick={copyToClipboard} disabled={!output}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </motion.span>
            </Button>
          </div>
          <CodeEditor
            className="min-h-[500px]"
            value={output}
            language="sql"
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </main>
  );
}
