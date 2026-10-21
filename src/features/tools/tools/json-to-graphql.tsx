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
import { toast } from "sonner";

const DEFAULT_JSON = JSON.stringify(
  {
    id: "usr_101",
    name: "Alex Morgan",
    age: 28,
    isVerified: true,
    profile: {
      bio: "Software Architect",
      website: "https://example.com",
    },
    tags: ["developer", "typescript", "react"],
  },
  null,
  2
);

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
    if (types.has(typeName)) return;
    const fields: string[] = [];
    types.set(typeName, fields);

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
  const input = usePersistedState<string>(inputKey, DEFAULT_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [rootName, setRootName] = useState("User");

  const convert = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input.value);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Input must be a valid JSON object.");
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
      toast.success("Copied GraphQL schema to clipboard!");
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
            Root Type:
          </label>
          <Input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="w-32 h-8 text-xs font-mono bg-[rgb(var(--card-2))]"
            placeholder="User"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => input.setValue(DEFAULT_JSON)}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Sample
          </Button>
        </div>
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
            JSON Input
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              GraphQL Schema
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
                  Copy Schema
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="json"
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
