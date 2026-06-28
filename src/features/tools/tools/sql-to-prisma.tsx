"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";

function parseSqlToPrisma(sql: string): string {
  if (!sql.trim()) return "";

  const tables = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_"']+)\s*\(([\s\S]*?)\);?/gi);
  if (!tables) return "// No CREATE TABLE statements found.";

  let prismaSchema = "";

  tables.forEach((tableDef) => {
    const tableMatch = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_"']+)\s*\(([\s\S]*?)\);?/i.exec(tableDef);
    if (!tableMatch) return;

    const rawName = tableMatch[1].replace(/["']/g, "");
    const modelName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    
    prismaSchema += `model ${modelName} {\n`;

    const columnsStr = tableMatch[2];
    const columns = columnsStr.split(/,\s*\n/).map(c => c.trim()).filter(Boolean);

    columns.forEach(col => {
      // Ignore keys for this simple parser
      if (/^(PRIMARY|FOREIGN|UNIQUE|KEY|CONSTRAINT)/i.test(col)) return;

      const colParts = col.split(/\s+/);
      const colName = colParts[0].replace(/["']/g, "");
      const colTypeRaw = colParts[1]?.toUpperCase() || "";

      let type = "String";
      if (colTypeRaw.includes("INT")) type = "Int";
      else if (colTypeRaw.includes("FLOAT") || colTypeRaw.includes("DOUBLE") || colTypeRaw.includes("DECIMAL") || colTypeRaw.includes("NUMERIC")) type = "Float";
      else if (colTypeRaw.includes("BOOL") || colTypeRaw.includes("BIT")) type = "Boolean";
      else if (colTypeRaw.includes("DATE") || colTypeRaw.includes("TIME")) type = "DateTime";

      let modifiers = "";
      const isPrimaryKey = /PRIMARY\s+KEY/i.test(col);
      if (isPrimaryKey) modifiers += " @id";
      
      const isUnique = /UNIQUE/i.test(col);
      if (isUnique) modifiers += " @unique";
      
      const isNullable = !/NOT\s+NULL/i.test(col);
      if (isNullable && !isPrimaryKey) type += "?";

      const hasDefault = /DEFAULT\s+([^,\s]+)/i.exec(col);
      if (hasDefault) {
        let defVal = hasDefault[1].replace(/['"]/g, "");
        if (defVal.toUpperCase() === "CURRENT_TIMESTAMP" || defVal.toUpperCase() === "NOW()") {
          modifiers += " @default(now())";
        } else if (type === "Int" || type === "Float") {
          modifiers += ` @default(${defVal})`;
        } else if (type === "Boolean") {
          modifiers += ` @default(${defVal === "1" || defVal.toUpperCase() === "TRUE" ? "true" : "false"})`;
        } else {
          modifiers += ` @default("${defVal}")`;
        }
      }

      prismaSchema += `  ${colName} ${type}${modifiers}\n`;
    });

    // Map table if the model name differs
    if (modelName !== rawName) {
      prismaSchema += `\n  @@map("${rawName}")\n`;
    }

    prismaSchema += `}\n\n`;
  });

  return prismaSchema.trim();
}

export function SqlToPrismaTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    const res = parseSqlToPrisma(input.value);
    setOutput(res);
  }, [input.value]);

  useEffect(() => {
    convert();
  }, [convert]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">SQL to Prisma Schema</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Convert basic SQL <code>CREATE TABLE</code> statements into Prisma <code>model</code> definitions. Note: This is a basic regex parser and may not support complex SQL constraints or relations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="font-medium mb-3">Input SQL</div>
          <CodeEditor
            className="min-h-[500px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="sql"
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Prisma Schema</div>
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
            language="graphql" // Monaco doesn't have prisma by default without extra setup, graphql looks close enough for highlighting
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </main>
  );
}
