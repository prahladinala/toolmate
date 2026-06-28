"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

export function TermsGeneratorTool({ tool }: { tool: ToolDef }) {
  const [company, setCompany] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");

  const generateMarkdown = () => {
    const d = new Date().toLocaleDateString();
    return `# Terms and Conditions for ${company || "[Company Name]"}

**Last updated:** ${d}

Welcome to ${websiteName || "[Website Name]"}!

These terms and conditions outline the rules and regulations for the use of ${company || "[Company Name]"}'s Website, located at ${websiteUrl || "[Website URL]"}.

By accessing this website we assume you accept these terms and conditions. Do not continue to use ${websiteName || "[Website Name]"} if you do not agree to take all of the terms and conditions stated on this page.

## Cookies
We employ the use of cookies. By accessing ${websiteName || "[Website Name]"}, you agreed to use cookies in agreement with the ${company || "[Company Name]"}'s Privacy Policy.

## License
Unless otherwise stated, ${company || "[Company Name]"} and/or its licensors own the intellectual property rights for all material on ${websiteName || "[Website Name]"}. All intellectual property rights are reserved.

You must not:
- Republish material from ${websiteName || "[Website Name]"}
- Sell, rent or sub-license material from ${websiteName || "[Website Name]"}
- Reproduce, duplicate or copy material from ${websiteName || "[Website Name]"}
- Redistribute content from ${websiteName || "[Website Name]"}

## Governing Law
These Terms will be governed by and interpreted in accordance with the laws of the State of ${state || "[State/Country]"}, and you submit to the non-exclusive jurisdiction of the state and federal courts located in ${state || "[State/Country]"} for the resolution of any disputes.

## Contact Us
If you have any questions about these Terms, please contact us at: ${email || "[Email Address]"}
`;
  };

  const output = generateMarkdown();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert("Terms copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Terms & Conditions Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Quickly generate standard boilerplate Terms and Conditions for your website or app.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Company Name</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" placeholder="e.g. Acme Corp" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Website Name</label>
            <input type="text" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" placeholder="e.g. Acme App" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Website URL</label>
            <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" placeholder="e.g. https://acme.com" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Contact Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" placeholder="e.g. legal@acme.com" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">State / Country</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" placeholder="e.g. California" />
          </div>
          
          <Button onClick={copyToClipboard} className="w-full mt-4">Copy Markdown</Button>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div className="p-3 border-b border-[rgb(var(--border))] font-medium text-sm flex justify-between items-center bg-[rgb(var(--card-2))]">
             <span>Generated Output</span>
          </div>
          <div className="flex-1 relative">
             <CodeEditor value={output} language="markdown" options={{ readOnly: true, wordWrap: "on" }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
