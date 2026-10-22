"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Download, Terminal, FileCode2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import type { OutputFormat, PackageManager } from "./types";

interface ConfigPreviewPaneProps {
  formats: OutputFormat[];
  activeFormatId: string;
  onSelectFormat: (formatId: string) => void;
  installPackages?: string[];
  configTip?: string;
  className?: string;
}

export function ConfigPreviewPane({
  formats,
  activeFormatId,
  onSelectFormat,
  installPackages = [],
  configTip,
  className,
}: ConfigPreviewPaneProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");
  const [copiedCmd, setCopiedCmd] = useState(false);

  const activeFormat = formats.find((f) => f.id === activeFormatId) || formats[0];

  const handleDownload = () => {
    if (!activeFormat?.content) return;
    try {
      const blob = new Blob([activeFormat.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = activeFormat.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${activeFormat.filename}`);
    } catch {
      toast.error("Download failed");
    }
  };

  const getInstallCommand = () => {
    if (installPackages.length === 0) return "";
    const pkgs = installPackages.join(" ");
    switch (packageManager) {
      case "pnpm":
        return `pnpm add -D ${pkgs}`;
      case "yarn":
        return `yarn add -D ${pkgs}`;
      case "bun":
        return `bun add -d ${pkgs}`;
      case "npm":
      default:
        return `npm install --save-dev ${pkgs}`;
    }
  };

  const installCommand = getInstallCommand();

  const handleCopyCommand = async () => {
    if (!installCommand) return;
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopiedCmd(true);
      toast.success("Install command copied!");
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      toast.error("Failed to copy command");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Top Bar: Format Selector & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 sm:px-4 sm:py-3 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))]">
        {/* Format Selector Pills */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {formats.map((f) => {
            const isSelected = f.id === activeFormat?.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelectFormat(f.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium font-mono whitespace-nowrap transition-all",
                  isSelected
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-sm border border-[rgb(var(--border))]"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.04)]"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <CopyButton
            value={activeFormat?.content || ""}
            size="sm"
            variant="secondary"
            toastMessage={`Copied ${activeFormat?.filename || "config"} to clipboard`}
          />

          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownload}
            className="h-8 text-xs gap-1.5"
            title={`Download ${activeFormat?.filename}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Filename and Meta Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgba(var(--card),0.5)] text-xs text-[rgb(var(--muted))]">
        <div className="flex items-center gap-1.5">
          <FileCode2 className="w-3.5 h-3.5 text-[rgb(var(--accent))]" />
          <span className="font-mono font-medium text-[rgb(var(--fg))]">
            {activeFormat?.filename}
          </span>
        </div>
        <span className="text-[11px]">
          {activeFormat?.content.split("\n").length || 0} lines
        </span>
      </div>

      {/* Code Editor Preview */}
      <div className="flex-1 min-h-[300px] lg:min-h-[420px] bg-[rgb(var(--card))]">
        <CodeEditor
          value={activeFormat?.content || ""}
          language={activeFormat?.language || "json"}
          className="h-full min-h-[300px] lg:min-h-[420px] font-mono text-xs"
          options={{
            readOnly: true,
            lineNumbers: true,
            lineWrapping: true,
          }}
        />
      </div>

      {/* CLI Installation Bar (if packages needed) */}
      {installPackages.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--card-2))] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--fg))]">
              <Terminal className="w-3.5 h-3.5 text-[rgb(var(--accent))]" />
              <span>Install Dependencies</span>
            </div>

            {/* Package Manager Pills */}
            <div className="flex items-center gap-1 bg-[rgba(var(--fg),0.06)] p-0.5 rounded-lg border border-[rgb(var(--border))]">
              {(["npm", "pnpm", "yarn", "bun"] as PackageManager[]).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPackageManager(pm)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors",
                    packageManager === pm
                      ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-xs"
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  )}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Command display */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] font-mono text-xs text-[rgb(var(--fg))]">
            <code className="truncate select-all">{installCommand}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyCommand}
              className="h-6 px-2 text-[11px] gap-1 shrink-0"
            >
              {copiedCmd ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedCmd ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Optional Pro Tip */}
      {configTip && (
        <div className="px-4 py-2.5 border-t border-[rgb(var(--border))] bg-[rgba(var(--accent),0.04)] text-[11px] text-[rgb(var(--muted))] leading-relaxed">
          <span className="font-semibold text-[rgb(var(--fg))]">Pro Tip: </span>
          {configTip}
        </div>
      )}
    </div>
  );
}
