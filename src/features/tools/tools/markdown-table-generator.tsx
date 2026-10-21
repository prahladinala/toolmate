"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

type Align = "left" | "center" | "right";

export default function MarkdownTableGenerator() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>([
    ["Header 1", "Header 2", "Header 3"],
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
  ]);
  const [alignments, setAlignments] = useState<Align[]>(["left", "left", "left"]);
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);

  const updateCell = (r: number, c: number, val: string) => {
    const newData = [...data];
    newData[r][c] = val;
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array(cols).fill("")]);
    setRows(rows + 1);
  };

  const removeRow = (r: number) => {
    if (rows <= 1) return;
    const newData = [...data];
    newData.splice(r, 1);
    setData(newData);
    setRows(rows - 1);
  };

  const addCol = () => {
    setData(data.map((row) => [...row, ""]));
    setAlignments([...alignments, "left"]);
    setCols(cols + 1);
  };

  const removeCol = (c: number) => {
    if (cols <= 1) return;
    setData(
      data.map((row) => {
        const newRow = [...row];
        newRow.splice(c, 1);
        return newRow;
      })
    );
    const newAlign = [...alignments];
    newAlign.splice(c, 1);
    setAlignments(newAlign);
    setCols(cols - 1);
  };

  const updateAlign = (c: number, align: Align) => {
    const newAlign = [...alignments];
    newAlign[c] = align;
    setAlignments(newAlign);
  };

  useEffect(() => {
    const colWidths = Array(cols).fill(3);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        colWidths[c] = Math.max(colWidths[c], (data[r]?.[c] || "").length);
      }
    }

    let md = "|";
    for (let c = 0; c < cols; c++) {
      md += ` ${(data[0]?.[c] || "").padEnd(colWidths[c], " ")} |`;
    }
    md += "\n|";

    for (let c = 0; c < cols; c++) {
      let sep = "-".repeat(colWidths[c]);
      if (alignments[c] === "left") sep = ":" + sep + "-";
      else if (alignments[c] === "center") sep = ":" + sep + ":";
      else if (alignments[c] === "right") sep = "-" + sep + ":";
      md += ` ${sep} |`;
    }
    md += "\n";

    for (let r = 1; r < rows; r++) {
      md += "|";
      for (let c = 0; c < cols; c++) {
        md += ` ${(data[r]?.[c] || "").padEnd(colWidths[c], " ")} |`;
      }
      md += "\n";
    }

    setMarkdown(md);
  }, [data, rows, cols, alignments]);

  const copyToClipboard = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Markdown copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={addRow} className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Row
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={addCol} className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Column
          </Button>
        </div>
        <div className="text-xs text-[rgb(var(--muted))]">
          {rows} rows × {cols} columns
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full min-w-0">
        {/* Table Editor Card */}
        <div className="flex flex-col min-w-0 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[rgb(var(--border))] flex items-center justify-between bg-[rgb(var(--card-2))]">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Visual Table Grid
            </span>
          </div>

          <div className="p-4 overflow-x-auto scrollbar-refined flex-1">
            <div className="inline-block min-w-full space-y-2">
              {/* Column Alignments & Delete Column Header */}
              <div className="flex items-center gap-2 pb-2">
                <div className="w-8 shrink-0" />
                {Array(cols).fill(0).map((_, c) => (
                  <div key={`align-${c}`} className="w-36 shrink-0 flex items-center justify-between gap-1 p-1 rounded-lg bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => updateAlign(c, "left")}
                        title="Align Left"
                        className={`p-1 rounded text-xs transition-colors ${
                          alignments[c] === "left"
                            ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-sm"
                            : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                        }`}
                      >
                        <AlignLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAlign(c, "center")}
                        title="Align Center"
                        className={`p-1 rounded text-xs transition-colors ${
                          alignments[c] === "center"
                            ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-sm"
                            : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                        }`}
                      >
                        <AlignCenter className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAlign(c, "right")}
                        title="Align Right"
                        className={`p-1 rounded text-xs transition-colors ${
                          alignments[c] === "right"
                            ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-sm"
                            : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                        }`}
                      >
                        <AlignRight className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCol(c)}
                      disabled={cols <= 1}
                      title="Delete Column"
                      className="p-1 text-[rgb(var(--muted))] hover:text-red-500 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {Array(rows).fill(0).map((_, r) => (
                <div key={`row-${r}`} className="flex items-center gap-2 group">
                  <div className="w-8 shrink-0 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeRow(r)}
                      disabled={rows <= 1}
                      title="Delete Row"
                      className="p-1 text-[rgb(var(--muted))] hover:text-red-500 disabled:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {Array(cols).fill(0).map((_, c) => (
                    <div key={`cell-${r}-${c}`} className="w-36 shrink-0">
                      <Input
                        value={data[r]?.[c] || ""}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        placeholder={r === 0 ? `Header ${c + 1}` : `Data`}
                        className={`text-xs h-9 ${
                          r === 0 ? "font-semibold bg-[rgb(var(--card-2))]" : ""
                        }`}
                        style={{ textAlign: alignments[c] }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Markdown Output Card */}
        <div className="flex flex-col min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Generated Markdown Table
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              className="text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Markdown
                </>
              )}
            </Button>
          </div>
          <CodeEditor
            value={markdown}
            editable={false}
            language="markdown"
            minHeight="min-h-[300px] sm:min-h-[420px]"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
