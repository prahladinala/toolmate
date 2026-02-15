"use client";

import React from "react";
import { diff_match_patch } from "diff-match-patch";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const dmp = new diff_match_patch();

export default function TextDiffTool() {
  const [left, setLeft] = React.useState("");
  const [right, setRight] = React.useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = React.useState(false);
  const [diffHtml, setDiffHtml] = React.useState("");
  const [diffCount, setDiffCount] = React.useState(0);

  const computeDiff = React.useCallback(() => {
    let text1 = left;
    let text2 = right;

    if (ignoreWhitespace) {
      text1 = text1.replace(/\s+/g, " ");
      text2 = text2.replace(/\s+/g, " ");
    }

    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs);

    let count = 0;
    diffs.forEach(([type]) => {
      if (type !== 0) count++;
    });

    setDiffCount(count);
    function escapeHtml(text: string) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    const html = diffs
      .map(([type, text]) => {
        if (type === 1) {
          return `<mark class="diff-add">${escapeHtml(text)}</mark>`;
        }
        if (type === -1) {
          return `<mark class="diff-remove">${escapeHtml(text)}</mark>`;
        }
        return `<span>${text}</span>`;
      })
      .join("");

    setDiffHtml(html);
  }, [left, right, ignoreWhitespace]);

  React.useEffect(() => {
    computeDiff();
  }, [computeDiff]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <style>{`
  .diff-add {
    background-color: rgba(var(--accent), 0.25);
    border-radius: 4px;
    padding: 0 2px;
  }

  .diff-remove {
    background-color: rgba(var(--danger), 0.20);
    border-radius: 4px;
    padding: 0 2px;
    text-decoration: line-through;
  }
`}</style>

      {/* Toolbar */}
      <Card className="mt-6 p-4 flex flex-wrap items-center gap-4">
        <span className="text-sm">
          Differences: <strong>{diffCount}</strong>
        </span>

        <Checkbox
          checked={ignoreWhitespace}
          onChange={setIgnoreWhitespace}
          label="Ignore Whitespace"
        />

        <Button
          variant="secondary"
          onClick={() => {
            const temp = left;
            setLeft(right);
            setRight(temp);
          }}
        >
          Swap
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            setLeft("");
            setRight("");
          }}
        >
          Clear
        </Button>
      </Card>

      {/* Inputs */}
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card className="p-4">
          <div className="font-medium">Original</div>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="mt-3 h-[300px] w-full rounded border p-3 font-mono text-sm"
          />
        </Card>

        <Card className="p-4">
          <div className="font-medium">Modified</div>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="mt-3 h-[300px] w-full rounded border p-3 font-mono text-sm"
          />
        </Card>
      </div>

      {/* Diff Output */}
      <Card className="mt-6 p-4">
        <div className="font-medium mb-3">Diff Result</div>
        <div
          className="font-mono text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: diffHtml }}
        />
      </Card>
    </main>
  );
}
