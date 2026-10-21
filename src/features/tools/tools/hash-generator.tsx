"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import CryptoJS from "crypto-js";
import { toast } from "sonner";

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";

export function HashGeneratorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, SAMPLE_TEXT);
  const [algorithm, setAlgorithm] = useState("SHA256");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.value) {
      setOutput("");
      return;
    }
    let hash = "";
    switch (algorithm) {
      case "MD5":
        hash = CryptoJS.MD5(input.value).toString();
        break;
      case "SHA1":
        hash = CryptoJS.SHA1(input.value).toString();
        break;
      case "SHA256":
        hash = CryptoJS.SHA256(input.value).toString();
        break;
      case "SHA512":
        hash = CryptoJS.SHA512(input.value).toString();
        break;
      case "RIPEMD160":
        hash = CryptoJS.RIPEMD160(input.value).toString();
        break;
    }
    setOutput(hash);
  }, [input.value, algorithm]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(`${algorithm} digest copied!`);
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
          {["MD5", "SHA1", "SHA256", "SHA512", "RIPEMD160"].map((algo) => (
            <Button
              key={algo}
              type="button"
              size="sm"
              variant={algorithm === algo ? "primary" : "secondary"}
              onClick={() => setAlgorithm(algo)}
              className="text-xs h-8"
            >
              {algo}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(SAMPLE_TEXT)}
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
            Input Plaintext Message
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              {algorithm} Hash Output
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
                  Copy Hash
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="plaintext"
            minHeight="min-h-[260px] sm:min-h-[380px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="plaintext"
            editable={false}
            minHeight="min-h-[260px] sm:min-h-[380px]"
            options={{ wordWrap: "on" }}
          />
        }
      />
    </ToolWorkspace>
  );
}
