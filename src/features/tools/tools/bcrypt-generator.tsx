"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, ShieldCheck, ShieldAlert, KeyRound } from "lucide-react";
import bcrypt from "bcryptjs";
import { toast } from "sonner";

type Mode = "generate" | "check";

export function BcryptGeneratorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "supersecretpassword");

  const [mode, setMode] = useState<Mode>("generate");
  const [rounds, setRounds] = useState(10);
  const [hashInput, setHashInput] = useState("");
  const [output, setOutput] = useState("");
  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput("");
    setMatchResult(null);
  }, [mode, input.value, rounds, hashInput]);

  const handleGenerate = async () => {
    if (!input.value.trim()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 40));
      const salt = bcrypt.genSaltSync(rounds);
      const hash = bcrypt.hashSync(input.value, salt);
      setOutput(hash);
    } catch {
      setOutput("Error generating bcrypt hash.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!input.value.trim() || !hashInput.trim()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 40));
      const isMatch = bcrypt.compareSync(input.value, hashInput);
      setMatchResult(isMatch);
    } catch {
      setMatchResult(false);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Bcrypt hash copied!");
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
            variant={mode === "generate" ? "primary" : "secondary"}
            onClick={() => setMode("generate")}
            className="text-xs"
          >
            Generate Hash
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "check" ? "primary" : "secondary"}
            onClick={() => setMode("check")}
            className="text-xs"
          >
            Verify Password
          </Button>
        </div>
      </ToolToolbar>

      <div className="p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Plaintext Password
          </label>
          <Input
            type="text"
            value={input.value}
            onChange={(e) => input.setValue(e.target.value)}
            placeholder="Enter plaintext password string..."
            className="text-xs sm:text-sm font-mono h-11 bg-[rgb(var(--card-2))]"
          />
        </div>

        {mode === "generate" ? (
          <div className="space-y-4 pt-2 border-t border-[rgb(var(--border))]">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                  Salt Work Factor Rounds
                </span>
                <span className="font-mono font-bold text-sm text-[rgb(var(--fg))]">{rounds}</span>
              </div>
              <input
                type="range"
                min={4}
                max={14}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[11px] text-[rgb(var(--muted))] block">
                Standard industry cost factor is 10 to 12 rounds. Higher values increase computational safety.
              </span>
            </div>

            <Button
              type="button"
              onClick={handleGenerate}
              loading={loading}
              className="text-xs h-10 px-5"
            >
              <KeyRound className="w-3.5 h-3.5 mr-1" />
              Compute Bcrypt Hash
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2 border-t border-[rgb(var(--border))]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Target Bcrypt Hash to Verify Against
              </label>
              <Input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="$2a$10$..."
                className="text-xs sm:text-sm font-mono h-11 bg-[rgb(var(--card-2))]"
              />
            </div>

            <Button
              type="button"
              onClick={handleCheck}
              loading={loading}
              className="text-xs h-10 px-5"
            >
              Verify Match
            </Button>
          </div>
        )}
      </div>

      {/* Results Box */}
      {output && mode === "generate" && (
        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Generated Bcrypt Hash
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyHash}
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
                  Copy Hash
                </>
              )}
            </Button>
          </div>
          <div className="p-3.5 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] font-mono text-xs sm:text-sm break-all select-all text-indigo-500">
            {output}
          </div>
        </div>
      )}

      {matchResult !== null && mode === "check" && (
        <div
          className={`p-5 rounded-2xl border shadow-sm flex items-center gap-3 ${
            matchResult
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          {matchResult ? (
            <ShieldCheck className="w-6 h-6 shrink-0" />
          ) : (
            <ShieldAlert className="w-6 h-6 shrink-0" />
          )}
          <div>
            <div className="font-bold text-sm">
              {matchResult ? "Password Matches Hash!" : "Verification Failed: Passwords Do Not Match"}
            </div>
            <p className="text-xs opacity-85 mt-0.5">
              {matchResult
                ? "The provided plaintext password generates a matching cryptographic digest."
                : "The provided string cannot produce the target hash with the stored salt."}
            </p>
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
