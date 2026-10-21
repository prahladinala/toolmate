"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function calculateStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 14) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 5);
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = "";
    if (lower) pool += LOWER;
    if (upper) pool += UPPER;
    if (numbers) pool += NUMBERS;
    if (symbols) pool += SYMBOLS;

    if (excludeSimilar) {
      pool = pool.replace(/[0OIl]/g, "");
    }

    if (!pool) {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += pool[array[i] % pool.length];
    }

    setPassword(result);
  }, [length, lower, upper, numbers, symbols, excludeSimilar]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const strength = calculateStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong", "Unbreakable"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600", "bg-indigo-600"];

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Cryptographically secure pseudo-random password generation using Web Crypto API
        </span>
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={generate}
          className="text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Regenerate
        </Button>
      </ToolToolbar>

      {/* Generated Password Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[rgb(var(--fg))] break-all select-all flex-1">
            {password || "Select at least one character type"}
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyPassword}
            disabled={!password}
            className="text-xs h-10 px-4 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Strength Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
              Entropy Strength:
            </span>
            <span className="font-bold text-[rgb(var(--fg))]">
              {strengthLabels[strength]}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 h-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                className={`h-full rounded-full transition-all duration-300 ${
                  strength >= lvl ? strengthColors[strength] : "bg-[rgb(var(--border))]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Sliders & Toggles */}
      <div className="p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
              Password Length
            </span>
            <span className="font-mono font-bold text-sm text-[rgb(var(--fg))]">{length} chars</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[rgb(var(--border))]">
          {[
            { label: "Lowercase (a-z)", checked: lower, set: setLower },
            { label: "Uppercase (A-Z)", checked: upper, set: setUpper },
            { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
            { label: "Symbols (!@#$)", checked: symbols, set: setSymbols },
            { label: "Exclude Ambiguous (0, O, I, l)", checked: excludeSimilar, set: setExcludeSimilar },
          ].map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] text-xs font-medium cursor-pointer select-none hover:bg-[rgb(var(--card-2))]/80 transition-colors"
            >
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.set(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </ToolWorkspace>
  );
}
