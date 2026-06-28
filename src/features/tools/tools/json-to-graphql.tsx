"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";

function generateGraphQLSchema(jsonObj: any, rootTypeName = "Root"): string {
  const types = new Map<string, string[]>();

  function capitalize(str: string) {
    if (!str) return "Unknown";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getType(value: any, key: string): string {
    if (value === null || value === undefined) return "String";
    if (typeof value === "string") return "String";
    if (typeof value === "number") {
      return Number.isInteger(value) ? "Int" : "Float";
    }
    if (typeof value === "boolean") return "Boolean";
    if (Array.isArray(value)) {
      if (value.length === 0) return "[String]";
      const itemType = getType(value[0], key);
      return `[${itemType}]`;
    }
    if (typeof value === "object") {
      const typeName = capitalize(key);
      parseObject(value, typeName);
      return typeName;
    }
    return "String";
  }

  function parseObject(obj: any, typeName: string) {
    if (types.has(typeName)) return; // Avoid circular/duplicate
    const fields: string[] = [];
    types.set(typeName, fields); // placeholder to avoid infinite recursion

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const type = getType(obj[key], key);
        fields.push(`  ${key}: ${type}`);
      }
    }
    types.set(typeName, fields);
  }

  parseObject(jsonObj, rootTypeName);

  let schema = "";
  for (const [typeName, fields] of types.entries()) {
    schema += `type ${typeName} {\n${fields.join("\n")}\n}\n\n`;
  }
  return schema.trim();
}

export function JsonToGraphqlTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [rootName, setRootName] = useState("RootType");

  const convert = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input.value);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Input must be a JSON object.");
      }
      const schema = generateGraphQLSchema(parsed, rootName || "Root");
      setOutput(schema);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to generate GraphQL schema.");
    }
  }, [input.value, rootName]);

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
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <label className="text-sm font-medium">Root Type Name:</label>
        <input
          type="text"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          className="rounded border p-1.5 text-sm bg-[rgb(var(--card-2))]"
          placeholder="RootType"
        />
        <Button size="sm" onClick={convert}>Generate</Button>
      </div>

      {error && (
        <div className="mb-4 rounded-[var(--radius)] border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.08)] p-4 text-sm text-red-500 whitespace-pre-wrap font-mono">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="font-medium mb-3">Input JSON</div>
          <CodeEditor
            className="min-h-[500px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="json"
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">GraphQL Schema</div>
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
            language="graphql"
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </main>
  );
}
