"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis",
  "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function generateParagraph(wordCount = 60) {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  const str = words.join(" ");
  return str.charAt(0).toUpperCase() + str.slice(1) + ".";
}

export function LoremIpsumGeneratorTool({ tool }: { tool: ToolDef }) {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    if (type === "words") {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      result = words.join(" ");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateParagraph(12));
      }
      result = sentences.join(" ");
    } else {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph(60));
      }
      result = paragraphs.join("\n\n");
    }
    setOutput(result);
  };

  useEffect(() => {
    generate();
  }, [count, type]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Lorem ipsum text copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
              Count:
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className="w-20 h-8 text-xs bg-[rgb(var(--card-2))]"
            />
          </div>

          <Select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-36 h-8 text-xs bg-[rgb(var(--card-2))]"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={generate}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyToClipboard}
            disabled={!output}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy Text
              </>
            )}
          </Button>
        </div>
      </ToolToolbar>

      <div className="space-y-2 w-full min-w-0">
        <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
          Generated Placeholder Copy
        </span>
        <CodeEditor
          value={output}
          language="plaintext"
          editable={false}
          minHeight="min-h-[350px] sm:min-h-[460px]"
          options={{ wordWrap: "on" }}
        />
      </div>
    </ToolWorkspace>
  );
}
