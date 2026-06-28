"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function GitCommandBuilderTool({ tool }: { tool: ToolDef }) {
  const [tab, setTab] = useState<"commit" | "branch" | "reset">("commit");
  
  // Commit
  const [commitMsg, setCommitMsg] = useState("");
  const [commitAll, setCommitAll] = useState(false);
  const [commitAmend, setCommitAmend] = useState(false);

  // Branch
  const [branchName, setBranchName] = useState("");
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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Git Command Builder</h1>
        <p className="text-sm text-[rgb(var(--muted))]">
          Interactively build common git commands with flags.
        </p>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex gap-3 overflow-x-auto">
          <Button variant={tab === "commit" ? "primary" : "secondary"} onClick={() => setTab("commit")}>Commit</Button>
          <Button variant={tab === "branch" ? "primary" : "secondary"} onClick={() => setTab("branch")}>Branch</Button>
          <Button variant={tab === "reset" ? "primary" : "secondary"} onClick={() => setTab("reset")}>Reset</Button>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        {tab === "commit" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Commit Message</label>
              <input
                type="text"
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                placeholder="Fix bug in header"
                className="mt-2 w-full rounded border p-2 bg-[rgb(var(--card-2))]"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={commitAll} onChange={(e) => setCommitAll(e.target.checked)} />
                Stage all modified files (-a)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={commitAmend} onChange={(e) => setCommitAmend(e.target.checked)} />
                Amend previous commit (--amend)
              </label>
            </div>
          </div>
        )}

        {tab === "branch" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Branch Name</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value.replace(/\s+/g, "-"))}
                placeholder="feature/new-button"
                className="mt-2 w-full rounded border p-2 bg-[rgb(var(--card-2))]"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={branchCheckout} onChange={(e) => setBranchCheckout(e.target.checked)} />
                Checkout new branch immediately (-b)
              </label>
            </div>
          </div>
        )}

        {tab === "reset" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reset Mode</label>
              <select
                value={resetMode}
                onChange={(e) => setResetMode(e.target.value as any)}
                className="mt-2 w-full rounded border p-2 bg-[rgb(var(--card-2))]"
              >
                <option value="--soft">--soft (Keep working tree & index)</option>
                <option value="--mixed">--mixed (Keep working tree, reset index)</option>
                <option value="--hard">--hard (Discard all changes)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Target Commit / Ref</label>
              <input
                type="text"
                value={resetTarget}
                onChange={(e) => setResetTarget(e.target.value)}
                placeholder="HEAD~1"
                className="mt-2 w-full rounded border p-2 bg-[rgb(var(--card-2))]"
              />
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium">Generated Command</div>
          <Button size="sm" onClick={copyToClipboard}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {copied ? "Copied ✓" : "Copy Command"}
            </motion.span>
          </Button>
        </div>
        <div className="rounded border bg-[rgb(var(--card-2))] p-4 font-mono text-lg">
          {command}
        </div>
      </Card>
    </main>
  );
}
