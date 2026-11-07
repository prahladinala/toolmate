"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Plus,
  Trash2,
  Sparkles,
  Code2,
  Check,
  Sliders,
  Braces,
  FileJson,
  Layers,
  ArrowRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ParamType = "string" | "number" | "integer" | "boolean" | "array" | "object";

type ToolParam = {
  id: string;
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
  enumValues: string; // comma separated
  arrayItemType?: "string" | "number" | "integer" | "boolean" | "object";
};

type SchemaFormat = "openai" | "claude" | "json-schema" | "typescript";

const PRESETS: {
  name: string;
  toolName: string;
  description: string;
  strict: boolean;
  params: ToolParam[];
}[] = [
  {
    name: "Weather Forecast",
    toolName: "get_current_weather",
    description: "Get the current weather conditions and temperature forecast for a given city.",
    strict: true,
    params: [
      {
        id: "p1",
        name: "location",
        type: "string",
        description: "The city and state or country, e.g. San Francisco, CA or Tokyo, Japan",
        required: true,
        enumValues: "",
      },
      {
        id: "p2",
        name: "unit",
        type: "string",
        description: "Temperature unit format",
        required: false,
        enumValues: "celsius, fahrenheit",
      },
      {
        id: "p3",
        name: "include_hourly",
        type: "boolean",
        description: "Whether to return the 24-hour hourly forecast breakdown",
        required: false,
        enumValues: "",
      },
    ],
  },
  {
    name: "Database Query Tool",
    toolName: "execute_sql_query",
    description: "Execute a read-only SQL query against the analytics replica database.",
    strict: true,
    params: [
      {
        id: "p1",
        name: "query",
        type: "string",
        description: "The sanitized SELECT SQL query string to execute",
        required: true,
        enumValues: "",
      },
      {
        id: "p2",
        name: "max_rows",
        type: "integer",
        description: "Maximum number of rows to return (default: 100, max: 1000)",
        required: false,
        enumValues: "",
      },
      {
        id: "p3",
        name: "timeout_ms",
        type: "integer",
        description: "Query execution timeout in milliseconds",
        required: false,
        enumValues: "",
      },
    ],
  },
  {
    name: "Send Notification / Email",
    toolName: "send_email_notification",
    description: "Send an automated transactional email or notification to a recipient list.",
    strict: false,
    params: [
      {
        id: "p1",
        name: "recipients",
        type: "array",
        description: "List of destination email addresses",
        required: true,
        enumValues: "",
        arrayItemType: "string",
      },
      {
        id: "p2",
        name: "subject",
        type: "string",
        description: "Email subject line",
        required: true,
        enumValues: "",
      },
      {
        id: "p3",
        name: "body_markdown",
        type: "string",
        description: "Email body formatted in clean markdown",
        required: true,
        enumValues: "",
      },
      {
        id: "p4",
        name: "priority",
        type: "string",
        description: "Dispatch priority level",
        required: false,
        enumValues: "low, normal, urgent",
      },
    ],
  },
];

export function LlmToolBuilderTool({ tool }: { tool: ToolDef }) {
  const [toolName, setToolName] = useState(PRESETS[0].toolName);
  const [description, setDescription] = useState(PRESETS[0].description);
  const [strictMode, setStrictMode] = useState(true);
  const [format, setFormat] = useState<SchemaFormat>("openai");
  const [params, setParams] = useState<ToolParam[]>(PRESETS[0].params);

  // Add new parameter
  const handleAddParam = () => {
    const newId = `p_${Date.now()}`;
    setParams([
      ...params,
      {
        id: newId,
        name: "",
        type: "string",
        description: "",
        required: true,
        enumValues: "",
      },
    ]);
  };

  // Update parameter
  const handleUpdateParam = (id: string, updates: Partial<ToolParam>) => {
    setParams(params.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Delete parameter
  const handleDeleteParam = (id: string) => {
    setParams(params.filter((p) => p.id !== id));
  };

  // Load preset
  const handleLoadPreset = (preset: (typeof PRESETS)[0]) => {
    setToolName(preset.toolName);
    setDescription(preset.description);
    setStrictMode(preset.strict);
    setParams(preset.params);
  };

  // Build JSON Schema object
  const schemaProperties = useMemo(() => {
    const props: Record<string, any> = {};
    const requiredList: string[] = [];

    params.forEach((p) => {
      if (!p.name.trim()) return;

      const propDef: Record<string, any> = {
        type: p.type,
        description: p.description || undefined,
      };

      if (p.enumValues.trim()) {
        const enums = p.enumValues
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (enums.length > 0) {
          propDef.enum = enums;
        }
      }

      if (p.type === "array") {
        propDef.items = {
          type: p.arrayItemType || "string",
        };
      }

      props[p.name.trim()] = propDef;

      if (p.required) {
        requiredList.push(p.name.trim());
      }
    });

    return { props, requiredList };
  }, [params]);

  // Formatted Output Code
  const outputCode = useMemo(() => {
    const { props, requiredList } = schemaProperties;

    // OpenAI Format
    if (format === "openai") {
      const openAiObj = {
        type: "function",
        function: {
          name: toolName || "my_tool",
          description: description || undefined,
          strict: strictMode ? true : undefined,
          parameters: {
            type: "object",
            properties: props,
            required: requiredList,
            additionalProperties: strictMode ? false : undefined,
          },
        },
      };
      return JSON.stringify(openAiObj, null, 2);
    }

    // Anthropic Claude Format
    if (format === "claude") {
      const claudeObj = {
        name: toolName || "my_tool",
        description: description || undefined,
        input_schema: {
          type: "object",
          properties: props,
          required: requiredList,
        },
      };
      return JSON.stringify(claudeObj, null, 2);
    }

    // Standard JSON Schema (Draft-07)
    if (format === "json-schema") {
      const jsonSchemaObj = {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: toolName || "ToolParameters",
        description: description || undefined,
        type: "object",
        properties: props,
        required: requiredList,
        additionalProperties: strictMode ? false : true,
      };
      return JSON.stringify(jsonSchemaObj, null, 2);
    }

    // TypeScript Interface
    if (format === "typescript") {
      const typeName =
        toolName
          .split(/[^a-zA-Z0-9]/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("") + "Params";

      const lines: string[] = [];
      lines.push(`/**`);
      if (description) lines.push(` * ${description}`);
      lines.push(` */`);
      lines.push(`export interface ${typeName || "ToolParams"} {`);

      params.forEach((p) => {
        if (!p.name.trim()) return;
        if (p.description) {
          lines.push(`  /** ${p.description} */`);
        }
        let tsType: string = p.type;
        if (p.type === "integer") tsType = "number";
        if (p.type === "array") tsType = `${p.arrayItemType || "string"}[]`;
        if (p.enumValues.trim()) {
          const enums = p.enumValues
            .split(",")
            .map((s) => JSON.stringify(s.trim()))
            .filter(Boolean);
          if (enums.length > 0) tsType = enums.join(" | ");
        }

        const optionalMark = p.required ? "" : "?";
        lines.push(`  ${p.name.trim()}${optionalMark}: ${tsType};`);
      });

      lines.push(`}`);
      return lines.join("\n");
    }

    return "";
  }, [format, toolName, description, strictMode, schemaProperties, params]);

  const handleDownload = () => {
    const ext = format === "typescript" ? "ts" : "json";
    const filename = `${toolName || "tool-schema"}.${ext}`;
    const blob = new Blob([outputCode], {
      type: format === "typescript" ? "text/plain" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Preset Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Examples:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleLoadPreset(preset)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Tool Configuration & Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tool Identity Card */}
          <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" /> Function Metadata
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={strictMode}
                  onChange={(e) => setStrictMode(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Strict Structured Outputs
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Tool Function Name
                </label>
                <Input
                  value={toolName}
                  onChange={(e) =>
                    setToolName(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")
                    )
                  }
                  placeholder="e.g. get_weather"
                  className="font-mono text-sm h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Parameters Count
                </label>
                <div className="h-9 px-3 flex items-center rounded-md border border-border bg-muted/40 font-mono text-xs text-muted-foreground">
                  {params.length} defined parameters ({schemaProperties.requiredList.length} required)
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Tool Purpose / Description (Informs LLM when to call this tool)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this function does and when the model should trigger it..."
                rows={2}
                className="text-sm border-border/60"
              />
            </div>
          </Card>

          {/* Parameters List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Braces className="w-3.5 h-3.5 text-primary" /> Parameters Schema
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddParam}
                className="h-7 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Parameter
              </Button>
            </div>

            {params.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-muted/20 text-muted-foreground text-xs">
                No parameters added. Click "Add Parameter" to define arguments for this tool.
              </div>
            ) : (
              params.map((param, index) => (
                <Card
                  key={param.id}
                  className="p-4 bg-card border-border/80 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-5">
                      #{index + 1}
                    </span>

                    {/* Param Name */}
                    <Input
                      value={param.name}
                      onChange={(e) =>
                        handleUpdateParam(param.id, {
                          name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                        })
                      }
                      placeholder="param_name"
                      className="font-mono text-xs h-8 flex-1"
                    />

                    {/* Param Type */}
                    <Select
                      value={param.type}
                      onChange={(e) =>
                        handleUpdateParam(param.id, {
                          type: e.target.value as ParamType,
                        })
                      }
                      className="h-8 text-xs font-mono w-28 bg-background"
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="integer">integer</option>
                      <option value="boolean">boolean</option>
                      <option value="array">array</option>
                      <option value="object">object</option>
                    </Select>

                    {/* Required Checkbox */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs px-2 py-1 rounded bg-muted/40 hover:bg-muted border border-border">
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) =>
                          handleUpdateParam(param.id, {
                            required: e.target.checked,
                          })
                        }
                        className="rounded border-border text-primary h-3.5 w-3.5"
                      />
                      <span className="text-[11px] font-medium">Req</span>
                    </label>

                    {/* Delete */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteParam(param.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Param Description */}
                  <Input
                    value={param.description}
                    onChange={(e) =>
                      handleUpdateParam(param.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Description explaining this argument to the LLM..."
                    className="text-xs h-8"
                  />

                  {/* Enum or Array details if applicable */}
                  {param.type === "string" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        Enum options:
                      </span>
                      <Input
                        value={param.enumValues}
                        onChange={(e) =>
                          handleUpdateParam(param.id, {
                            enumValues: e.target.value,
                          })
                        }
                        placeholder="e.g. low, medium, high (comma separated)"
                        className="text-xs h-7 font-mono flex-1"
                      />
                    </div>
                  ) : null}

                  {param.type === "array" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        Array items type:
                      </span>
                      <Select
                        value={param.arrayItemType || "string"}
                        onChange={(e) =>
                          handleUpdateParam(param.id, {
                            arrayItemType: e.target.value as any,
                          })
                        }
                        className="h-7 text-xs font-mono w-32 bg-background"
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="integer">integer</option>
                        <option value="boolean">boolean</option>
                        <option value="object">object</option>
                      </Select>
                    </div>
                  ) : null}
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Output: Format Selector & Generated Schema (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Format Pills */}
            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
              <Button
                type="button"
                variant={format === "openai" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFormat("openai")}
                className="h-7 px-2.5 text-xs font-medium"
              >
                OpenAI
              </Button>
              <Button
                type="button"
                variant={format === "claude" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFormat("claude")}
                className="h-7 px-2.5 text-xs font-medium"
              >
                Claude
              </Button>
              <Button
                type="button"
                variant={format === "json-schema" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFormat("json-schema")}
                className="h-7 px-2.5 text-xs font-medium"
              >
                JSON Schema
              </Button>
              <Button
                type="button"
                variant={format === "typescript" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFormat("typescript")}
                className="h-7 px-2.5 text-xs font-medium"
              >
                TypeScript
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              <CopyButton value={outputCode} />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="h-8 text-xs gap-1"
                title="Download Schema File"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Generated Code Pane */}
          <div className="flex-1 flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs min-h-[460px]">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-mono">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                {format === "typescript" ? `${toolName}.d.ts` : `${toolName}-schema.json`}
              </div>
              <span>{outputCode.split("\n").length} lines</span>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre">
              {outputCode}
            </div>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
