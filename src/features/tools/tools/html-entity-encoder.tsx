"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw } from "lucide-react";
import * as he from "html-entities";
import { toast } from "sonner";

const DEFAULT_TEXT = `<div class="hero-banner">
  <h1>Welcome & Enjoy "Special Offers"!</h1>
  <p>© 2026 ToolMate™ — Fast, Free & Secure.</p>
</div>`;

export function HtmlEntityEncoderTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_TEXT);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (!input.value) {
      setOutput("");
      return;
    }
    if (mode === "encode") {
      setOutput(he.encode(input.value));
    } else {
      setOutput(he.decode(input.value));
    }
  }, [input.value, mode]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "encode" ? "primary" : "secondary"}
            onClick={() => setMode("encode")}
            className="text-xs"
          >
            Encode Entities
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "decode" ? "primary" : "secondary"}
            onClick={() => setMode("decode")}
            className="text-xs"
          >
            Decode Entities
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(DEFAULT_TEXT)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Sample
        </Button>
      </ToolToolbar>

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            {mode === "encode" ? "Raw HTML / Text" : "Encoded Entities Input"}
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              {mode === "encode" ? "Encoded Output" : "Decoded HTML / Text"}
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              disabled={!output}
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
                  Copy
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="html"
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="html"
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
      />
    </ToolWorkspace>
  );
}
