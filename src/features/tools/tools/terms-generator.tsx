"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

export function TermsGeneratorTool({ tool }: { tool: ToolDef }) {
  const [company, setCompany] = useState("ToolMate Inc.");
  const [websiteName, setWebsiteName] = useState("ToolMate");
  const [websiteUrl, setWebsiteUrl] = useState("https://toolmate.co.in");
  const [email, setEmail] = useState("legal@toolmate.co.in");
  const [jurisdiction, setJurisdiction] = useState("India");
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    const d = new Date().toISOString().split("T")[0];
    return `# Terms of Service for ${company || "[Company Name]"}

**Last updated:** ${d}

Welcome to ${websiteName || "[Website Name]"}!

These terms and conditions outline the rules and regulations for the use of ${company || "[Company Name]"}'s Website and services, located at ${websiteUrl || "[Website URL]"}.

By accessing this website, we assume you accept these terms and conditions. Do not continue to use ${websiteName || "[Website Name]"} if you do not agree to all terms stated on this page.

## Intellectual Property
Unless otherwise stated, ${company || "[Company Name]"} and/or its licensors own the intellectual property rights for all material on ${websiteName || "[Website Name]"}. All intellectual property rights are reserved.

You must not:
- Republish material without explicit written consent
- Sell, rent, or sub-license material from ${websiteName || "[Website Name]"}
- Reproduce, duplicate, or copy proprietary material
- Redistribute content from ${websiteName || "[Website Name]"}

## Disclaimer of Warranties
This service is provided "as is," with all faults, and ${company || "[Company Name]"} expresses no representations or warranties of any kind related to this website or the materials contained herein.

## Limitation of Liability
In no event shall ${company || "[Company Name]"}, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.

## Governing Law & Jurisdiction
These Terms will be governed by and interpreted in accordance with the laws of ${jurisdiction || "[Jurisdiction]"}, and you submit to the non-exclusive jurisdiction of state and federal courts located within for the resolution of any disputes.

## Contact Us
If you have any questions about these Terms of Service, please contact our legal team at: ${email || "[Email Address]"}.
`;
  };

  const output = generateMarkdown();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Terms of service copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TERMS_OF_SERVICE.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded TERMS_OF_SERVICE.md!");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Generate standard Terms of Service agreements customized with your company information and governing jurisdiction
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyToClipboard}
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
                Copy Markdown
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={downloadFile}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export Markdown
          </Button>
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Form Inputs */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Legal Entity / Company Name
            </label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp Inc."
              className="text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Website / App Name
            </label>
            <Input
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              placeholder="e.g. Acme App"
              className="text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Canonical URL
            </label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="text-xs sm:text-sm font-mono h-10 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Governing Jurisdiction (State / Country)
            </label>
            <Input
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="e.g. California, USA or India"
              className="text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Legal Support Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="legal@example.com"
              className="text-xs sm:text-sm font-mono h-10 bg-[rgb(var(--card-2))]"
            />
          </div>
        </div>

        {/* Output Code */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Generated Markdown Document
          </span>
          <CodeEditor
            value={output}
            language="markdown"
            editable={false}
            minHeight="min-h-[350px] sm:min-h-[460px]"
            options={{ wordWrap: "on" }}
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
