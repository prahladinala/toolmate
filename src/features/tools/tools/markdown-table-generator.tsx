"use client";
import { Input } from "@/components/ui/input";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { toast } from "sonner";

type Align = "left" | "center" | "right";

export default function MarkdownTableGenerator() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>(Array(3).fill("").map(() => Array(3).fill("")));
  const [alignments, setAlignments] = useState<Align[]>(Array(3).fill("left"));
  const [markdown, setMarkdown] = useState("");

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
    setData(data.map(row => [...row, ""]));
    setAlignments([...alignments, "left"]);
    setCols(cols + 1);
  };

  const removeCol = (c: number) => {
    if (cols <= 1) return;
    setData(data.map(row => {
      const newRow = [...row];
      newRow.splice(c, 1);
      return newRow;
    }));
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
    // Generate Markdown
    let md = "";
    
    // Helper to pad strings for neatness
    const colWidths = Array(cols).fill(3);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        colWidths[c] = Math.max(colWidths[c], (data[r][c] || "").length);
      }
    }

    // Headers
    md += "|";
    for (let c = 0; c < cols; c++) {
      md += ` ${(data[0][c] || "").padEnd(colWidths[c], " ")} |`;
    }
    md += "\n|";

    // Separator
    for (let c = 0; c < cols; c++) {
      let sep = "-".repeat(colWidths[c]);
      if (alignments[c] === "left") sep = ":" + sep + "-";
      else if (alignments[c] === "center") sep = ":" + sep + ":";
      else if (alignments[c] === "right") sep = "-" + sep + ":";
      md += ` ${sep} |`;
    }
    md += "\n";

    // Body
    for (let r = 1; r < rows; r++) {
      md += "|";
      for (let c = 0; c < cols; c++) {
        md += ` ${(data[r][c] || "").padEnd(colWidths[c], " ")} |`;
      }
      md += "\n";
    }

    setMarkdown(md);
  }, [data, rows, cols, alignments]);

  return (
    <main className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <Card className="p-4 space-y-4 shadow-sm border border-[rgba(var(--fg),0.1)] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b">
            <h2 className="font-semibold">Visual Table Editor</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={addRow}><Plus className="w-4 h-4 mr-1" /> Row</Button>
              <Button size="sm" variant="secondary" onClick={addCol}><Plus className="w-4 h-4 mr-1" /> Col</Button>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 flex-1">
            <div className="inline-block min-w-full space-y-1">
              
              {/* Alignment Controls */}
              <div className="flex">
                <div className="w-10 flex-shrink-0" />
                {Array(cols).fill(0).map((_, c) => (
                  <div key={`align-${c}`} className="w-40 flex-shrink-0 px-1 flex items-center justify-between mb-2">
                    <div className="flex gap-1 bg-muted rounded p-1">
                      <Button onClick={() => updateAlign(c, "left")} className={`p-1 rounded ${alignments[c] === "left" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}><AlignLeft className="w-3 h-3" /></Button>
                      <Button onClick={() => updateAlign(c, "center")} className={`p-1 rounded ${alignments[c] === "center" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}><AlignCenter className="w-3 h-3" /></Button>
                      <Button onClick={() => updateAlign(c, "right")} className={`p-1 rounded ${alignments[c] === "right" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}><AlignRight className="w-3 h-3" /></Button>
                    </div>
                    <Button onClick={() => removeCol(c)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors" disabled={cols <= 1}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {Array(rows).fill(0).map((_, r) => (
                <div key={`row-${r}`} className="flex group items-center">
                  <div className="w-10 flex-shrink-0 flex justify-center">
                    <Button 
                      onClick={() => removeRow(r)} 
                      disabled={rows <= 1}
                      className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {Array(cols).fill(0).map((_, c) => (
                    <div key={`cell-${r}-${c}`} className="w-40 flex-shrink-0 px-1">
                      <Input
                        value={data[r][c]}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        placeholder={r === 0 ? `Header ${c + 1}` : `Data`}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background ${r === 0 ? "font-semibold bg-muted/30" : ""}`}
                        style={{ textAlign: alignments[c] }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4 shadow-sm border border-[rgba(var(--fg),0.1)] h-full flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b">
            <h2 className="font-semibold">Markdown Output</h2>
            <Button size="sm" onClick={() => navigator.clipboard.writeText(markdown)}>Copy</Button>
          </div>
          <CodeEditor 
            value={markdown} 
            editable={false} 
            language="markdown" 
            className="flex-1 !min-h-[300px]"
          />
        </Card>

      </div>
    </main>
  );
}
