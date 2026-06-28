"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

export function PrivacyPolicyGeneratorTool({ tool }: { tool: ToolDef }) {
  const [company, setCompany] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");

  const generateMarkdown = () => {
    const d = new Date().toLocaleDateString();
    return `# Privacy Policy for ${company || "[Company Name]"}

**Last updated:** ${d}

At ${websiteName || "[Website Name]"}, accessible from ${websiteUrl || "[Website URL]"}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${websiteName || "[Website Name]"} and how we use it.

## Information We Collect
The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

## How We Use Your Information
We use the information we collect in various ways, including to:
- Provide, operate, and maintain our website
- Improve, personalize, and expand our website
- Understand and analyze how you use our website
- Develop new products, services, features, and functionality
- Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
- Send you emails
- Find and prevent fraud

## Log Files
${websiteName || "[Website Name]"} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.

## Contact Us
If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${email || "[Email Address]"}.
`;
  };

  const output = generateMarkdown();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert("Privacy Policy copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Privacy Policy Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Quickly generate standard boilerplate Privacy Policy for your website or app.
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" placeholder="e.g. privacy@acme.com" />
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
