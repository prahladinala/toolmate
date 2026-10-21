"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, GitCommit, GitBranch, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function GitCommandBuilderTool({ tool }: { tool: ToolDef }) {
  const [tab, setTab] = useState<"commit" | "branch" | "reset">("commit");

  // Commit
  const [commitMsg, setCommitMsg] = useState("feat: implement responsive layout architecture");
  const [commitAll, setCommitAll] = useState(false);
  const [commitAmend, setCommitAmend] = useState(false);

  // Branch
  const [branchName, setBranchName] = useState("feature/redesign");
  const [branchCheckout, setBranchCheckout] = useState(true);

  // Reset
  const [resetMode, setResetMode] = useState<"--soft" | "--mixed" | "--hard">("--mixed");
  const [resetTarget, setResetTarget] = useState("HEAD~1");

  const [copied, setCopied] = useState(false);

  let command = "";
  if (tab === "commit") {
    command = "git commit";
    if (commitAll) command += " -a";
    if (commitAmend) command += " --amend";
    if (commitMsg) command += ` -m "${commitMsg.replace(/"/g, '\\"')}"`;
  } else if (tab === "branch") {
    if (branchCheckout) {
      command = `git checkout -b ${branchName || "new-branch"}`;
    } else {
      command = `git branch ${branchName || "new-branch"}`;
    }
  } else if (tab === "reset") {
    command = `git reset ${resetMode} ${resetTarget || "HEAD~1"}`;
  }

  const copyToClipboard = async () => {
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
      toast.success("Git command copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={tab === "commit" ? "primary" : "secondary"}
            onClick={() => setTab("commit")}
            className="text-xs"
          >
            <GitCommit className="w-3.5 h-3.5 mr-1" />
            Commit Command
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "branch" ? "primary" : "secondary"}
            onClick={() => setTab("branch")}
            className="text-xs"
          >
            <GitBranch className="w-3.5 h-3.5 mr-1" />
            Branch Command
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "reset" ? "primary" : "secondary"}
            onClick={() => setTab("reset")}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset / Rollback
          </Button>
        </div>
      </ToolToolbar>

      {/* Configuration Card */}
      <div className="p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
        {tab === "commit" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Commit Message
              </label>
              <Input
                type="text"
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                placeholder="Commit message summary..."
                className="text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
              />
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-[rgb(var(--border))] flex-wrap text-xs font-medium">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={commitAll}
                  onChange={(e) => setCommitAll(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                />
                <span>Stage All Modified Files (-a)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={commitAmend}
                  onChange={(e) => setCommitAmend(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                />
                <span>Amend Previous Commit (--amend)</span>
              </label>
            </div>
          </div>
        )}

        {tab === "branch" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Branch Identifier Name
              </label>
              <Input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="feature/branch-name"
                className="text-xs sm:text-sm font-mono h-10 bg-[rgb(var(--card-2))]"
              />
            </div>

            <label className="flex items-center gap-2 pt-2 border-t border-[rgb(var(--border))] cursor-pointer select-none text-xs font-medium">
              <input
                type="checkbox"
                checked={branchCheckout}
                onChange={(e) => setBranchCheckout(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
              />
              <span>Checkout Branch Immediately (-b)</span>
            </label>
          </div>
        )}

        {tab === "reset" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                  Reset Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["--soft", "--mixed", "--hard"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setResetMode(m)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium transition-all ${
                        resetMode === m
                          ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] shadow-sm"
                          : "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))] hover:text-[rgb(var(--fg))]"
                      }`}
                    >
                      {m.replace("--", "")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                  Target Commit / Reference
                </label>
                <Input
                  type="text"
                  value={resetTarget}
                  onChange={(e) => setResetTarget(e.target.value)}
                  placeholder="HEAD~1 or commit hash"
                  className="text-xs sm:text-sm font-mono h-10 bg-[rgb(var(--card-2))]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated CLI Output */}
      <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Terminal Command
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyToClipboard}
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
                Copy Command
              </>
            )}
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] font-mono text-xs sm:text-sm text-indigo-500 break-all select-all font-semibold">
          {command}
        </div>
      </div>
    </ToolWorkspace>
  );
}
