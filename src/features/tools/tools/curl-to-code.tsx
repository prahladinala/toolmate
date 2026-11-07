"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Code2,
  Terminal,
  Sparkles,
  RotateCcw,
  Globe,
  Layers,
  FileJson,
  Check,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type LanguageTarget =
  | "fetch-ts"
  | "fetch-js"
  | "axios"
  | "python-requests"
  | "python-httpx"
  | "go"
  | "rust"
  | "php";

const PRESETS = [
  {
    name: "POST JSON (OpenAI API)",
    curl: `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello ToolMate!"
      }
    ]
  }'`,
  },
  {
    name: "GET with Query & Headers",
    curl: `curl "https://api.github.com/repos/octocat/Hello-World/issues?state=open&sort=created" \\
  -H "Accept: application/vnd.github.v3+json" \\
  -H "User-Agent: ToolMate-Client"`,
  },
  {
    name: "POST Form URL-Encoded",
    curl: `curl -X POST https://oauth2.googleapis.com/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code&client_id=MY_CLIENT_ID&client_secret=MY_SECRET&code=AUTH_CODE"`,
  },
  {
    name: "GraphQL Query",
    curl: `curl -X POST https://api.github.com/graphql \\
  -H "Authorization: Bearer GITHUB_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "query": "query { viewer { login name } }" }'`,
  },
];

type ParsedCurl = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  auth: { user: string; pass: string } | null;
};

// Pure client-side resilient cURL parser
function parseCurl(rawInput: string): ParsedCurl {
  // Normalize line continuations and trim
  const cleanInput = rawInput
    .replace(/\\\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  let url = "https://example.com/api";
  let method = "GET";
  const headers: Record<string, string> = {};
  let body: string | null = null;
  let auth: { user: string; pass: string } | null = null;

  // Tokenize considering single and double quotes
  const tokens: string[] = [];
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanInput)) !== null) {
    if (match[1] !== undefined) {
      tokens.push(match[1]);
    } else if (match[2] !== undefined) {
      tokens.push(match[2]);
    } else {
      tokens.push(match[0]);
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    // Method flag -X or --request
    if (t === "-X" || t === "--request") {
      if (tokens[i + 1]) {
        method = tokens[++i].toUpperCase();
      }
    }
    // Headers flag -H or --header
    else if (t === "-H" || t === "--header") {
      if (tokens[i + 1]) {
        const headerStr = tokens[++i];
        const colonIndex = headerStr.indexOf(":");
        if (colonIndex !== -1) {
          const key = headerStr.slice(0, colonIndex).trim();
          const val = headerStr.slice(colonIndex + 1).trim();
          headers[key] = val;
        }
      }
    }
    // Data/Body flag -d, --data, --data-raw, --data-json
    else if (
      t === "-d" ||
      t === "--data" ||
      t === "--data-raw" ||
      t === "--data-json" ||
      t === "--data-binary"
    ) {
      if (tokens[i + 1]) {
        body = tokens[++i];
        if (method === "GET") method = "POST";
      }
    }
    // Auth -u or --user
    else if (t === "-u" || t === "--user") {
      if (tokens[i + 1]) {
        const authStr = tokens[++i];
        const [user, pass] = authStr.split(":");
        auth = { user: user || "", pass: pass || "" };
      }
    }
    // URL token: check if looks like http/https or starts with a valid domain
    else if (!t.startsWith("-") && t !== "curl") {
      if (t.startsWith("http://") || t.startsWith("https://") || t.includes(".")) {
        url = t;
      }
    }
  }

  return { url, method, headers, body, auth };
}

// Code Generators
function generateCode(parsed: ParsedCurl, target: LanguageTarget): string {
  const { url, method, headers, body, auth } = parsed;

  const effectiveHeaders = { ...headers };
  if (auth) {
    effectiveHeaders["Authorization"] = `Basic ${btoa(`${auth.user}:${auth.pass}`)}`;
  }

  const isJson =
    effectiveHeaders["Content-Type"]?.includes("application/json") ||
    (body && body.trim().startsWith("{") && body.trim().endsWith("}"));

  switch (target) {
    case "fetch-ts":
    case "fetch-js": {
      const headerObj = Object.keys(effectiveHeaders).length
        ? `headers: ${JSON.stringify(effectiveHeaders, null, 4)},\n  `
        : "";

      let bodySnippet = "";
      if (body) {
        if (isJson) {
          try {
            const parsedJson = JSON.parse(body);
            bodySnippet = `body: JSON.stringify(${JSON.stringify(parsedJson, null, 4)}),\n  `;
          } catch {
            bodySnippet = `body: ${JSON.stringify(body)},\n  `;
          }
        } else {
          bodySnippet = `body: ${JSON.stringify(body)},\n  `;
        }
      }

      return `async function executeRequest() {
  const response = await fetch(${JSON.stringify(url)}, {
    method: ${JSON.stringify(method)},
    ${headerObj}${bodySnippet}
  });

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  const data = await response.json();
  console.log(data);
  return data;
}

executeRequest().catch(console.error);`;
    }

    case "axios": {
      const configLines: string[] = [];
      configLines.push(`  method: ${JSON.stringify(method.toLowerCase())}`);
      configLines.push(`  url: ${JSON.stringify(url)}`);

      if (Object.keys(effectiveHeaders).length > 0) {
        configLines.push(`  headers: ${JSON.stringify(effectiveHeaders, null, 4).replace(/\n/g, "\n  ")}`);
      }

      if (body) {
        if (isJson) {
          try {
            configLines.push(`  data: ${JSON.stringify(JSON.parse(body), null, 4).replace(/\n/g, "\n  ")}`);
          } catch {
            configLines.push(`  data: ${JSON.stringify(body)}`);
          }
        } else {
          configLines.push(`  data: ${JSON.stringify(body)}`);
        }
      }

      return `import axios from 'axios';

async function makeRequest() {
  try {
    const response = await axios({
${configLines.join(",\n")}
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error);
  }
}

makeRequest();`;
    }

    case "python-requests": {
      const lines: string[] = ["import requests", ""];
      lines.push(`url = ${JSON.stringify(url)}`);

      if (Object.keys(effectiveHeaders).length > 0) {
        lines.push(`headers = ${JSON.stringify(effectiveHeaders, null, 4)}`);
      } else {
        lines.push("headers = {}");
      }

      let reqCall = `response = requests.${method.toLowerCase()}(url, headers=headers`;

      if (body) {
        if (isJson) {
          try {
            lines.push(`payload = ${JSON.stringify(JSON.parse(body), null, 4)}`);
            reqCall += ", json=payload";
          } catch {
            lines.push(`data = ${JSON.stringify(body)}`);
            reqCall += ", data=data";
          }
        } else {
          lines.push(`data = ${JSON.stringify(body)}`);
          reqCall += ", data=data";
        }
      }

      reqCall += ")";
      lines.push("");
      lines.push(reqCall);
      lines.push("response.raise_for_status()");
      lines.push("print(response.json())");

      return lines.join("\n");
    }

    case "python-httpx": {
      return `import httpx
import asyncio

async def main():
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=${JSON.stringify(method)},
            url=${JSON.stringify(url)},
            headers=${JSON.stringify(effectiveHeaders, null, 12).trim()},
            ${body ? `content=${JSON.stringify(body)}` : ""}
        )
        print(response.status_code)
        print(response.text)

asyncio.run(main())`;
    }

    case "go": {
      return `package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

func main() {
	url := ${JSON.stringify(url)}
	method := ${JSON.stringify(method)}

	${body ? `payload := strings.NewReader(${JSON.stringify(body)})` : "var payload io.Reader = nil"}

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)
	if err != nil {
		fmt.Println(err)
		return
	}

${Object.entries(effectiveHeaders)
  .map(([k, v]) => `\treq.Header.Add(${JSON.stringify(k)}, ${JSON.stringify(v)})`)
  .join("\n")}

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(body))
}`;
    }

    case "rust": {
      return `use reqwest::header::HeaderMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std.error::Error>> {
    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();

${Object.entries(effectiveHeaders)
  .map(
    ([k, v]) =>
      `    headers.insert(${JSON.stringify(k)}, ${JSON.stringify(v)}.parse()?);`
  )
  .join("\n")}

    let response = client
        .${method.toLowerCase()}(${JSON.stringify(url)})
        .headers(headers)
        ${body ? `.body(${JSON.stringify(body)})` : ""}
        .send()
        .await?;

    let text = response.text().await?;
    println!("{:#?}", text);

    Ok(())
}`;
    }

    case "php": {
      return `<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => ${JSON.stringify(url)},
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => ${JSON.stringify(method)},
  ${body ? `CURLOPT_POSTFIELDS => ${JSON.stringify(body)},` : ""}
  CURLOPT_HTTPHEADER => array(
${Object.entries(effectiveHeaders)
  .map(([k, v]) => `    ${JSON.stringify(`${k}: ${v}`)}`)
  .join(",\n")}
  ),
));

$response = curl_exec($curl);
curl_close($curl);
echo $response;`;
    }
  }
}

export function CurlToCodeTool({ tool }: { tool: ToolDef }) {
  const [curlInput, setCurlInput] = useState(PRESETS[0].curl);
  const [targetLang, setTargetLang] = useState<LanguageTarget>("fetch-ts");

  const parsed = useMemo(() => parseCurl(curlInput), [curlInput]);
  const generatedCode = useMemo(
    () => generateCode(parsed, targetLang),
    [parsed, targetLang]
  );

  const getMethodBadgeColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "POST":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "PUT":
      case "PATCH":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Presets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => setCurlInput(preset.curl)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Request Breakdown Status Banner */}
      <Card className="p-3.5 bg-card/80 border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={cn("font-mono text-xs px-2.5 py-0.5", getMethodBadgeColor(parsed.method))}>
            {parsed.method}
          </Badge>
          <div className="flex items-center gap-1.5 font-mono text-xs text-foreground max-w-md truncate">
            <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{parsed.url}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {Object.keys(parsed.headers).length} headers
          </span>
          <span className="flex items-center gap-1">
            <FileJson className="w-3.5 h-3.5" />
            {parsed.body ? `${parsed.body.length} bytes body` : "No body"}
          </span>
        </div>
      </Card>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw cURL Input Pane */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                cURL Command Input
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurlInput("")}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <Textarea
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              placeholder="Paste curl command here: curl -X POST https://api.example.com -H '...' -d '...'"
              rows={16}
              className="w-full flex-1 resize-y font-mono text-xs leading-relaxed border-border/60 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right: Target Code Output Pane */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex flex-wrap items-center justify-between gap-2">
            {/* Target Language Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {(
                [
                  { id: "fetch-ts", label: "Fetch (TS)" },
                  { id: "axios", label: "Axios" },
                  { id: "python-requests", label: "Python (requests)" },
                  { id: "python-httpx", label: "Python (httpx)" },
                  { id: "go", label: "Go" },
                  { id: "rust", label: "Rust" },
                  { id: "php", label: "PHP" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTargetLang(tab.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                    targetLang === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <CopyButton value={generatedCode} />
          </div>

          <div className="p-4 flex-1 overflow-auto bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre">
            {generatedCode}
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
