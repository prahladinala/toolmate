"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_SQL = `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INT NOT NULL,
  published_at TIMESTAMP
);`;

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
    const columns = columnsStr.split(/,\s*\n/).map((c) => c.trim()).filter(Boolean);

    columns.forEach((col) => {
      if (/^(PRIMARY|FOREIGN|UNIQUE|KEY|CONSTRAINT)/i.test(col)) return;

      const colParts = col.split(/\s+/);
      const colName = colParts[0].replace(/["']/g, "");
      const colTypeRaw = colParts[1]?.toUpperCase() || "";

      let type = "String";
      if (colTypeRaw.includes("INT")) type = "Int";
      else if (
        colTypeRaw.includes("FLOAT") ||
        colTypeRaw.includes("DOUBLE") ||
        colTypeRaw.includes("DECIMAL") ||
        colTypeRaw.includes("NUMERIC")
      )
        type = "Float";
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

    if (modelName !== rawName) {
      prismaSchema += `\n  @@map("${rawName}")\n`;
    }

    prismaSchema += `}\n\n`;
  });

  return prismaSchema.trim();
}

export function SqlToPrismaTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_SQL);
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
      toast.success("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Convert SQL <code>CREATE TABLE</code> statements into Prisma <code>model</code> definitions
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(DEFAULT_SQL)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Sample
        </Button>
      </ToolToolbar>

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Input SQL DDL
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Prisma Schema Models
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
                  Copy
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="sql"
            minHeight="min-h-[300px] sm:min-h-[420px]"
          />
        }
        output={
          <CodeEditor
            value={output}
            language="graphql"
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
          />
        }
      />
    </ToolWorkspace>
  );
}
