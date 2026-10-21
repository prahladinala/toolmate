"use client";

import React, { useState, useMemo } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import {
  Database,
  RotateCcw,
  AlertTriangle,
  Clock,
  Coins,
  Layers,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
} from "lucide-react";

interface ExplainNode {
  nodeType: string;
  relationName?: string;
  alias?: string;
  totalCost?: number;
  actualTotalTime?: number;
  actualRows?: number;
  planRows?: number;
  filter?: string;
  indexName?: string;
  plans?: ExplainNode[];
}

const SAMPLE_POSTGRES_EXPLAIN = `[
  {
    "Plan": {
      "Node Type": "Limit",
      "Parallel Aware": false,
      "Startup Cost": 1042.50,
      "Total Cost": 1042.75,
      "Plan Rows": 10,
      "Plan Width": 348,
      "Actual Startup Time": 12.450,
      "Actual Total Time": 12.455,
      "Actual Rows": 10,
      "Actual Loops": 1,
      "Plans": [
        {
          "Node Type": "Sort",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Startup Cost": 1042.50,
          "Total Cost": 1047.50,
          "Plan Rows": 2000,
          "Plan Width": 348,
          "Actual Startup Time": 12.449,
          "Actual Total Time": 12.452,
          "Actual Rows": 10,
          "Sort Key": ["users.created_at DESC"],
          "Plans": [
            {
              "Node Type": "Hash Join",
              "Parent Relationship": "Outer",
              "Parallel Aware": false,
              "Join Type": "Inner",
              "Startup Cost": 25.50,
              "Total Cost": 840.00,
              "Plan Rows": 2000,
              "Actual Startup Time": 1.120,
              "Actual Total Time": 9.850,
              "Actual Rows": 1850,
              "Hash Cond": "(orders.user_id = users.id)",
              "Plans": [
                {
                  "Node Type": "Seq Scan",
                  "Parent Relationship": "Outer",
                  "Relation Name": "orders",
                  "Alias": "orders",
                  "Startup Cost": 0.00,
                  "Total Cost": 450.00,
                  "Plan Rows": 5000,
                  "Actual Startup Time": 0.025,
                  "Actual Total Time": 4.120,
                  "Actual Rows": 4800,
                  "Filter": "(status = 'completed'::text)"
                },
                {
                  "Node Type": "Hash",
                  "Parent Relationship": "Inner",
                  "Relation Name": "users",
                  "Startup Cost": 15.00,
                  "Total Cost": 15.00,
                  "Plan Rows": 800,
                  "Actual Startup Time": 0.950,
                  "Actual Total Time": 0.950,
                  "Actual Rows": 750,
                  "Plans": [
                    {
                      "Node Type": "Index Scan",
                      "Relation Name": "users",
                      "Index Name": "idx_users_active",
                      "Startup Cost": 0.28,
                      "Total Cost": 15.00,
                      "Plan Rows": 800,
                      "Actual Startup Time": 0.015,
                      "Actual Total Time": 0.650,
                      "Actual Rows": 750
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
]`;

function normalizePlanNode(raw: any): ExplainNode {
  const node: ExplainNode = {
    nodeType: raw["Node Type"] || raw["type"] || "Operation",
    relationName: raw["Relation Name"] || raw["table_name"] || undefined,
    alias: raw["Alias"] || undefined,
    totalCost: raw["Total Cost"] != null ? raw["Total Cost"] : raw["cost"],
    actualTotalTime: raw["Actual Total Time"] != null ? raw["Actual Total Time"] : raw["time"],
    actualRows: raw["Actual Rows"] != null ? raw["Actual Rows"] : raw["rows"],
    planRows: raw["Plan Rows"] != null ? raw["Plan Rows"] : undefined,
    filter: raw["Filter"] || raw["filter"] || undefined,
    indexName: raw["Index Name"] || raw["key"] || undefined,
  };

  if (raw["Plans"] && Array.isArray(raw["Plans"])) {
    node.plans = raw["Plans"].map(normalizePlanNode);
  }

  return node;
}

export function ExplainVisualizerTool() {
  const [input, setInput] = useState(SAMPLE_POSTGRES_EXPLAIN);
  const [selectedNode, setSelectedNode] = useState<ExplainNode | null>(null);

  const planTree = useMemo<ExplainNode | null>(() => {
    try {
      const parsed = JSON.parse(input);
      const root = Array.isArray(parsed) ? parsed[0]?.Plan || parsed[0] : parsed.Plan || parsed;
      return normalizePlanNode(root);
    } catch {
      return null;
    }
  }, [input]);

  const renderTreeNode = (node: ExplainNode, depth = 0) => {
    const isScan = node.nodeType.toLowerCase().includes("seq scan");
    const isJoin = node.nodeType.toLowerCase().includes("join");
    const isIndex = node.nodeType.toLowerCase().includes("index");

    return (
      <div key={depth + (node.relationName || "") + node.nodeType} className="space-y-2">
        <div
          onClick={() => setSelectedNode(node)}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            selectedNode === node
              ? "border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.06)] shadow-xs"
              : "border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-2))]"
          }`}
          style={{ marginLeft: `${Math.min(depth * 20, 120)}px` }}
        >
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                isScan
                  ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                  : isIndex
                  ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                  : isJoin
                  ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                  : "bg-[rgb(var(--card-2))] text-[rgb(var(--foreground))]"
              }`}
            >
              {node.nodeType}
            </span>

            {node.relationName && (
              <span className="text-xs font-semibold text-[rgb(var(--foreground))]">
                on <span className="font-mono text-[rgb(var(--accent))]">{node.relationName}</span>
              </span>
            )}

            {isScan && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                <AlertTriangle className="w-3 h-3" /> Sequential Scan
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[rgb(var(--muted))]">
            {node.totalCost != null && (
              <div className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>Cost: {node.totalCost.toFixed(1)}</span>
              </div>
            )}
            {node.actualTotalTime != null && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{node.actualTotalTime.toFixed(2)} ms</span>
              </div>
            )}
            {node.actualRows != null && (
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[rgb(var(--accent))]" />
                <span>{node.actualRows.toLocaleString()} rows</span>
              </div>
            )}
          </div>
        </div>

        {node.plans && node.plans.length > 0 && (
          <div className="space-y-2">
            {node.plans.map((child, i) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[rgb(var(--foreground))] flex items-center gap-2">
              <Database className="w-4 h-4 text-[rgb(var(--accent))]" />
              EXPLAIN Plan Visualizer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setInput(SAMPLE_POSTGRES_EXPLAIN)}
              className="h-8 gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Sample Query Plan
            </Button>
          </div>
        </ToolToolbar>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* JSON Input panel */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Paste EXPLAIN (FORMAT JSON)
            </div>
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-2">
              <CodeEditor
                value={input}
                onChange={(v) => setInput(v || "")}
                language="json"
                minHeight="500px"
              />
            </div>
          </div>

          {/* Visual Execution Tree */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Execution Plan Hierarchy & Bottlenecks
            </div>

            {planTree ? (
              <div className="space-y-3 p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] min-h-[500px] overflow-x-auto">
                {renderTreeNode(planTree, 0)}

                {/* Selected Node Details Drawer */}
                {selectedNode && (
                  <div className="mt-4 p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] space-y-2 text-xs">
                    <div className="font-bold text-sm text-[rgb(var(--foreground))] flex items-center gap-2">
                      <Info className="w-4 h-4 text-[rgb(var(--accent))]" />
                      Node Details: {selectedNode.nodeType}
                    </div>
                    {selectedNode.relationName && (
                      <div>
                        Table: <span className="font-semibold text-[rgb(var(--foreground))]">{selectedNode.relationName}</span>
                      </div>
                    )}
                    {selectedNode.indexName && (
                      <div>
                        Index: <span className="font-semibold text-emerald-500">{selectedNode.indexName}</span>
                      </div>
                    )}
                    {selectedNode.filter && (
                      <div>
                        Filter: <code className="p-1 rounded bg-[rgb(var(--card))] text-[rgb(var(--accent))]">{selectedNode.filter}</code>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[rgb(var(--border))]">
                      <div>
                        <span className="text-[rgb(var(--muted))]">Total Cost:</span>{" "}
                        <span className="font-semibold">{selectedNode.totalCost ?? "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[rgb(var(--muted))]">Actual Time:</span>{" "}
                        <span className="font-semibold">{selectedNode.actualTotalTime ? `${selectedNode.actualTotalTime}ms` : "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[rgb(var(--muted))]">Rows:</span>{" "}
                        <span className="font-semibold">{selectedNode.actualRows?.toLocaleString() ?? "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[rgb(var(--muted))] rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                Paste valid EXPLAIN JSON on the left to visualize query plan tree.
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
