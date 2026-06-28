"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import bcrypt from "bcryptjs";

type Mode = "generate" | "check";

export function BcryptGeneratorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  
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
    if (!input.value) return;
    setLoading(true);
    try {
      // Small timeout to allow UI update before blocking thread
      await new Promise((r) => setTimeout(r, 50));
      const salt = bcrypt.genSaltSync(rounds);
      const hash = bcrypt.hashSync(input.value, salt);
      setOutput(hash);
    } catch (e) {
      setOutput("Error generating hash.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!input.value || !hashInput) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 50));
      const isMatch = bcrypt.compareSync(input.value, hashInput);
      setMatchResult(isMatch);
    } catch (e) {
      setMatchResult(false);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Mode Toggle */}
      <Card className="mb-6 p-4">
        <div className="flex gap-3">
          <Button
            variant={mode === "generate" ? "primary" : "secondary"}
            onClick={() => setMode("generate")}
          >
            Generate Hash
          </Button>
          <Button
            variant={mode === "check" ? "primary" : "secondary"}
            onClick={() => setMode("check")}
          >
            Check Hash
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <Card className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium">String to Hash/Check</label>
            <input
              type="text"
              value={input.value}
              onChange={(e) => input.setValue(e.target.value)}
              placeholder="Enter your password or string..."
              className="mt-2 w-full rounded border p-2 bg-[rgb(var(--card-2))]"
            />
          </div>

          {mode === "generate" && (
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium">Cost Factor (Rounds): {rounds}</label>
              </div>
              <input
                type="range"
                min={4}
                max={20}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                Higher cost is more secure but takes exponentially longer to compute.
              </p>
            </div>
          )}

          {mode === "check" && (
            <div>
              <label className="text-sm font-medium">Bcrypt Hash</label>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="$2a$10$..."
                className="mt-2 w-full rounded border p-2 bg-[rgb(var(--card-2))] font-mono"
              />
            </div>
          )}

          <Button
            onClick={mode === "generate" ? handleGenerate : handleCheck}
            disabled={!input.value || (mode === "check" && !hashInput) || loading}
            loading={loading}
            className="w-full"
          >
            {mode === "generate" ? "Generate Hash" : "Compare"}
          </Button>
        </Card>

        {/* Right Column */}
        {mode === "generate" ? (
          <Card className="p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">Output Hash</div>
              <Button size="sm" variant="secondary" onClick={copyToClipboard} disabled={!output}>
                <motion.span
                  key={copied ? "copied" : "copy"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </motion.span>
              </Button>
            </div>
            <textarea
              readOnly
              value={output}
              className="h-[120px] w-full rounded border p-3 font-mono text-sm bg-[rgb(var(--card-2))]"
              placeholder="Hash will appear here..."
            />
          </Card>
        ) : (
          <Card className="p-5 flex flex-col justify-center items-center min-h-[200px]">
            {matchResult === null ? (
              <div className="text-[rgb(var(--muted))] text-sm">
                Enter a string and hash, then click Compare.
              </div>
            ) : matchResult ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-2 text-green-600"
              >
                <div className="rounded-full bg-green-100 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className="text-xl font-bold">Match Found!</div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-2 text-red-500"
              >
                <div className="rounded-full bg-red-100 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
                <div className="text-xl font-bold">Does Not Match</div>
              </motion.div>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}
