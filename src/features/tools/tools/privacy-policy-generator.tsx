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

export function PrivacyPolicyGeneratorTool({ tool }: { tool: ToolDef }) {
  const [company, setCompany] = useState("ToolMate Inc.");
  const [websiteName, setWebsiteName] = useState("ToolMate");
  const [websiteUrl, setWebsiteUrl] = useState("https://toolmate.co.in");
  const [email, setEmail] = useState("privacy@toolmate.co.in");
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    const d = new Date().toISOString().split("T")[0];
    return `# Privacy Policy for ${company || "[Company Name]"}

**Last updated:** ${d}

At ${websiteName || "[Website Name]"}, accessible from ${websiteUrl || "[Website URL]"}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${websiteName || "[Website Name]"} and how we use it.

## Information We Collect
The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

## How We Use Your Information
We use the information we collect in various ways, including to:
- Provide, operate, and maintain our website and utilities
- Improve, personalize, and expand our services
- Understand and analyze how you use our applications
- Develop new products, services, features, and functionality
- Communicate with you for customer support, notices, and updates
- Prevent fraud and guarantee security

## Log Files & Analytics
${websiteName || "[Website Name]"} follows standard web logging procedures. These logs record visitors when they access websites. All hosting providers do this as part of infrastructure diagnostics. Information collected includes IP addresses, browser types, Internet Service Providers (ISPs), date/time stamps, and referring URLs. None of this data is linked to personally identifiable information.

## Data Retention & Deletion
We only retain personal data for as long as necessary to provide you with your requested services.

## Contact Us
If you have additional questions or require more information about our Privacy Policy, please contact our team at: ${email || "[Email Address]"}.
`;
  };

  const output = generateMarkdown();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Privacy Policy copied!");
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
    a.download = "PRIVACY_POLICY.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded PRIVACY_POLICY.md!");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Generate compliant standard Privacy Policy documentation ready for websites, mobile apps, and SaaS platforms
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
              Contact Privacy Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="privacy@example.com"
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
