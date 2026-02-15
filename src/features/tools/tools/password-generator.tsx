"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function calculateStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(score, 5);
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = React.useState(16);
  const [lower, setLower] = React.useState(true);
  const [upper, setUpper] = React.useState(true);
  const [numbers, setNumbers] = React.useState(true);
  const [symbols, setSymbols] = React.useState(true);
  const [excludeSimilar, setExcludeSimilar] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const generate = React.useCallback(() => {
    let pool = "";
    if (lower) pool += LOWER;
    if (upper) pool += UPPER;
    if (numbers) pool += NUMBERS;
    if (symbols) pool += SYMBOLS;

    if (excludeSimilar) {
      pool = pool.replace(/[0OIl]/g, "");
    }

    if (!pool) return;

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += pool[array[i] % pool.length];
    }

    setPassword(result);
  }, [length, lower, upper, numbers, symbols, excludeSimilar]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const strength = calculateStrength(password);
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
    "Excellent",
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Controls */}
      <Card className="mt-6 p-6 space-y-6">
        <div>
          <label className="text-sm">Length: {length}</label>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <Checkbox checked={lower} onChange={setLower} label="Lowercase" />
          <Checkbox checked={upper} onChange={setUpper} label="Uppercase" />
          <Checkbox checked={numbers} onChange={setNumbers} label="Numbers" />
          <Checkbox checked={symbols} onChange={setSymbols} label="Symbols" />
          <Checkbox
            checked={excludeSimilar}
            onChange={setExcludeSimilar}
            label="Exclude Similar"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={generate}>Generate</Button>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="md"
              onClick={copy}
              className={`
    transition
    ${
      copied
        ? "border-[rgba(var(--accent),0.5)] bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]"
        : "hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent),0.08)]"
    }
  `}
            >
              {copied ? "Copied ✓" : "Copy"}
            </Button>
          </motion.div>
        </div>
      </Card>

      {/* Output */}
      <Card className="mt-6 p-6 space-y-4">
        <div className="font-mono text-lg break-all">{password}</div>

        {/* Strength Meter */}
        <div>
          <div className="flex justify-between text-sm">
            <span>Strength</span>
            <span>{strengthLabels[strength]}</span>
          </div>

          <div className="mt-2 h-2 rounded bg-[rgb(var(--card-2))] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(strength / 5) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-[rgb(var(--accent))]"
            />
          </div>
        </div>
      </Card>
    </main>
  );
}
