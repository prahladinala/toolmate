"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, Download, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Settings = {
  count: number;
  uppercase: boolean;
  removeHyphens: boolean;
  prefix: string;
  suffix: string;
};

export default function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    count: 5,
    uppercase: false,
    removeHyphens: false,
    prefix: "",
    suffix: "",
  });

  const generate = useCallback(() => {
    const list = Array.from({ length: Math.min(100, Math.max(1, settings.count)) }).map(() => {
      let id = crypto.randomUUID();
      if (settings.removeHyphens) id = id.replace(/-/g, "");
      if (settings.uppercase) id = id.toUpperCase();
      return `${settings.prefix}${id}${settings.suffix}`;
    });
    setUuids(list);
  }, [settings]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copySingle = async (val: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedIndex(idx);
      toast.success("UUID copied!");
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const copyAll = async () => {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopiedAll(true);
      toast.success(`Copied all ${uuids.length} UUIDs!`);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadTxt = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={generate}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Generate New
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyAll}
            className="text-xs"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied All
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy All ({uuids.length})
              </>
            )}
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={downloadTxt}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Export TXT
        </Button>
      </ToolToolbar>

      {/* Options Card */}
      <div className="w-full p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Quantity (1 - 100)
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={settings.count}
              onChange={(e) =>
                setSettings({ ...settings, count: Number(e.target.value) })
              }
              className="text-xs h-9 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Custom Prefix
            </label>
            <Input
              value={settings.prefix}
              onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
              placeholder="e.g. usr_"
              className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Custom Suffix
            </label>
            <Input
              value={settings.suffix}
              onChange={(e) => setSettings({ ...settings, suffix: e.target.value })}
              placeholder="e.g. _test"
              className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2 border-t border-[rgb(var(--border))] flex-wrap text-xs font-medium">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.uppercase}
              onChange={(e) => setSettings({ ...settings, uppercase: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.removeHyphens}
              onChange={(e) => setSettings({ ...settings, removeHyphens: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
            />
            <span>Remove Hyphens (-)</span>
          </label>
        </div>
      </div>

      {/* Generated List */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Generated UUID v4 Pool ({uuids.length})
          </span>
          <button
            type="button"
            onClick={() => setUuids([])}
            className="text-xs text-[rgb(var(--muted))] hover:text-red-500 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        <div className="divide-y divide-[rgb(var(--border))] max-h-[460px] overflow-y-auto scrollbar-refined">
          {uuids.map((id, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 flex items-center justify-between gap-2 hover:bg-[rgb(var(--card-2))]/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="font-mono text-xs text-[rgb(var(--muted))] w-6 text-right shrink-0">
                  {idx + 1}
                </span>
                <span className="font-mono text-xs sm:text-sm text-[rgb(var(--fg))] break-all select-all font-medium">
                  {id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => copySingle(id, idx)}
                className="p-1.5 rounded-lg text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--card-2))] transition-colors shrink-0"
                title="Copy UUID"
              >
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}

          {uuids.length === 0 && (
            <div className="p-8 text-center text-xs text-[rgb(var(--muted))]">
              No UUIDs generated. Click &ldquo;Generate New&rdquo; above.
            </div>
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
