"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const NGINX_OPTIONS: ConfigOption[] = [
  // Reverse Proxy & Routing
  {
    id: "reverseProxyNext",
    name: "Reverse Proxy to Node / Next.js",
    key: "proxy_pass http://127.0.0.1:3000",
    category: "Proxy & Routing",
    description: "Forward incoming HTTP requests to a local Node.js or Next.js application server.",
    whyItHelps: "Allows Nginx to handle SSL termination, caching, and rate limiting while Node.js processes dynamic requests.",
    example: "proxy_pass http://127.0.0.1:3000;\nproxy_set_header Host $host;",
    defaultChecked: true,
  },
  {
    id: "webSocketHeaders",
    name: "WebSocket Upgrade Headers",
    key: "proxy_set_header Upgrade $http_upgrade",
    category: "Proxy & Routing",
    description: "Support bidirectional WebSocket connections and HTTP/1.1 connection upgrade.",
    whyItHelps: "Essential for Next.js Fast Refresh (HMR), socket.io, real-time chats, and notifications.",
    example: "proxy_set_header Upgrade $http_upgrade;\nproxy_set_header Connection \"upgrade\";",
    defaultChecked: true,
  },
  {
    id: "spaRouting",
    name: "SPA Fallback (try_files)",
    key: "try_files $uri $uri/ /index.html",
    category: "Proxy & Routing",
    description: "Serve index.html when a requested route doesn't match an actual file on disk.",
    whyItHelps: "Prevents 404 errors for Single Page Apps (React/Vue/Vite) when refreshing virtual browser paths.",
    example: "location / {\n  try_files $uri $uri/ /index.html;\n}",
    defaultChecked: false,
  },

  // SSL & Security
  {
    id: "httpToHttps",
    name: "Redirect HTTP to HTTPS (Port 80 to 443)",
    key: "return 301 https://$server_name$request_uri",
    category: "SSL & Security",
    description: "Automatically redirect all port 80 traffic to secure port 443 with SSL.",
    whyItHelps: "Enforces end-to-end TLS encryption and prevents plaintext credential eavesdropping.",
    example: "server {\n  listen 80;\n  return 301 https://$host$request_uri;\n}",
    defaultChecked: true,
  },
  {
    id: "sslConfig",
    name: "Modern SSL / TLS 1.2 & 1.3 Ciphers",
    key: "ssl_protocols TLSv1.2 TLSv1.3",
    category: "SSL & Security",
    description: "Configure secure, modern TLS protocols and strong cipher suites.",
    whyItHelps: "Protects against BEAST, POODLE, and Heartbleed exploits while scoring an A+ on SSL Labs.",
    example: "ssl_protocols TLSv1.2 TLSv1.3;\nssl_prefer_server_ciphers off;",
    defaultChecked: true,
  },
  {
    id: "securityHeaders",
    name: "Security Headers (HSTS, CSP, XFO)",
    key: "add_header X-Frame-Options 'SAMEORIGIN'",
    category: "SSL & Security",
    description: "Inject X-Content-Type-Options, X-Frame-Options, HSTS, and Referrer-Policy headers.",
    whyItHelps: "Prevents Clickjacking, MIME-sniffing, and cross-site scripting vulnerabilities.",
    example: "add_header X-Frame-Options \"SAMEORIGIN\" always;\nadd_header X-Content-Type-Options \"nosniff\" always;",
    defaultChecked: true,
  },
  {
    id: "blockHiddenFiles",
    name: "Deny Access to Hidden Files",
    key: "location ~ /\\. { deny all; }",
    category: "SSL & Security",
    description: "Block public web requests to files starting with a dot (.env, .git, .htaccess).",
    whyItHelps: "Prevents devastating database credential and environment variable leaks.",
    example: "location ~ /\\. {\n  deny all;\n  access_log off;\n}",
    defaultChecked: true,
  },

  // Performance & Caching
  {
    id: "gzipCompression",
    name: "Gzip Compression",
    key: "gzip on; gzip_types text/plain...",
    category: "Performance",
    description: "Compress text, CSS, JavaScript, and SVG before sending across the network.",
    whyItHelps: "Reduces data transfer by up to 75%, slashing latency and server bandwidth usage.",
    example: "gzip on;\ngzip_types text/plain text/css application/javascript application/json;",
    defaultChecked: true,
  },
  {
    id: "staticAssetCache",
    name: "Static Asset Far-Future Caching",
    key: "expires 1y; add_header Cache-Control 'public, immutable'",
    category: "Performance",
    description: "Cache images, fonts, and hashed JavaScript/CSS files for 1 year.",
    whyItHelps: "Offloads static asset requests entirely to browser and CDN edge caches.",
    example: "location ~* \\.(?:css|js|woff2|png|jpg|webp)$ {\n  expires 1y;\n  add_header Cache-Control \"public, immutable\";\n}",
    defaultChecked: true,
  },
  {
    id: "clientMaxBodySize",
    name: "Increase Upload Limit (50MB)",
    key: "client_max_body_size 50M;",
    category: "Performance",
    description: "Increase allowable HTTP request payload size to 50 Megabytes.",
    whyItHelps: "Prevents the frustrating '413 Request Entity Too Large' error when users upload files or photos.",
    example: "client_max_body_size 50M;",
    defaultChecked: true,
  },
  {
    id: "suppressNoisyLogs",
    name: "Suppress Favicon & Robots 404s",
    key: "location = /favicon.ico { log_not_found off; }",
    category: "Performance",
    description: "Disable error logging for missing favicon.ico and robots.txt.",
    whyItHelps: "Keeps error log files clean and focused on real application crashes rather than browser asset noise.",
    example: "location = /favicon.ico { log_not_found off; access_log off; }",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Next.js / Node.js Reverse Proxy",
    description: "Standard production reverse proxy configuration for Next.js, Node.js, and Docker apps",
    optionIds: [
      "reverseProxyNext",
      "webSocketHeaders",
      "httpToHttps",
      "sslConfig",
      "securityHeaders",
      "blockHiddenFiles",
      "gzipCompression",
      "staticAssetCache",
      "clientMaxBodySize",
      "suppressNoisyLogs",
    ],
  },
  {
    id: "strict",
    name: "SPA Static Server (Vite / React)",
    description: "High-performance configuration for hosting static React/Vue/Vite builds directly on Nginx",
    optionIds: [
      "spaRouting",
      "httpToHttps",
      "sslConfig",
      "securityHeaders",
      "blockHiddenFiles",
      "gzipCompression",
      "staticAssetCache",
      "clientMaxBodySize",
      "suppressNoisyLogs",
    ],
  },
  {
    id: "minimal",
    name: "Basic Reverse Proxy",
    description: "Lightweight reverse proxy without SSL certificates configured",
    optionIds: ["reverseProxyNext", "webSocketHeaders", "gzipCompression", "clientMaxBodySize"],
  },
];

export function NginxConfigGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("nginx");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    NGINX_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return NGINX_OPTIONS.filter((opt) => {
      const matchesSearch =
        searchQuery === "" ||
        opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.key && opt.key.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" || opt.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const toggleOption = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedIds(new Set(preset.optionIds));
    }
  };

  const handleReset = () => {
    setSelectedIds(new Set());
  };

  const activePresetId = useMemo(() => {
    for (const p of PRESETS) {
      if (
        p.optionIds.length === selectedIds.size &&
        p.optionIds.every((id) => selectedIds.has(id))
      ) {
        return p.id;
      }
    }
    return null;
  }, [selectedIds]);

  const formats: OutputFormat[] = useMemo(() => {
    const lines: string[] = [
      "# =====================================================================",
      "# Nginx Server Configuration — Generated with ToolMate",
      "# =====================================================================\n",
    ];

    if (selectedIds.has("httpToHttps")) {
      lines.push(
        "# HTTP to HTTPS Redirection",
        "server {",
        "    listen 80;",
        "    listen [::]:80;",
        "    server_name example.com www.example.com;\n",
        "    # Redirect all HTTP requests to HTTPS",
        "    return 301 https://$host$request_uri;",
        "}\n"
      );
    }

    lines.push(
      "server {",
      selectedIds.has("httpToHttps")
        ? "    listen 443 ssl http2;\n    listen [::]:443 ssl http2;"
        : "    listen 80;\n    listen [::]:80;",
      "    server_name example.com www.example.com;\n"
    );

    if (selectedIds.has("sslConfig") && selectedIds.has("httpToHttps")) {
      lines.push(
        "    # SSL / TLS Certificates",
        "    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;",
        "    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;",
        "    ssl_protocols TLSv1.2 TLSv1.3;",
        "    ssl_prefer_server_ciphers off;",
        "    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;\n"
      );
    }

    if (selectedIds.has("clientMaxBodySize")) {
      lines.push("    # Maximum Request Payload Size", "    client_max_body_size 50M;\n");
    }

    if (selectedIds.has("securityHeaders")) {
      lines.push(
        "    # Security Headers",
        "    add_header X-Frame-Options \"SAMEORIGIN\" always;",
        "    add_header X-Content-Type-Options \"nosniff\" always;",
        "    add_header X-XSS-Protection \"1; mode=block\" always;",
        "    add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;",
        "    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\" always;\n"
      );
    }

    if (selectedIds.has("gzipCompression")) {
      lines.push(
        "    # Gzip Compression",
        "    gzip on;",
        "    gzip_vary on;",
        "    gzip_proxied any;",
        "    gzip_comp_level 6;",
        "    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;\n"
      );
    }

    if (selectedIds.has("suppressNoisyLogs")) {
      lines.push(
        "    # Clean logging for common static files",
        "    location = /favicon.ico {",
        "        log_not_found off;",
        "        access_log off;",
        "    }",
        "    location = /robots.txt {",
        "        log_not_found off;",
        "        access_log off;",
        "    }\n"
      );
    }

    if (selectedIds.has("blockHiddenFiles")) {
      lines.push(
        "    # Deny access to sensitive hidden files (.env, .git)",
        "    location ~ /\\. {",
        "        deny all;",
        "        access_log off;",
        "        log_not_found off;",
        "    }\n"
      );
    }

    if (selectedIds.has("staticAssetCache")) {
      lines.push(
        "    # Static asset caching for Next.js / Vite chunks",
        "    location /_next/static/ {",
        "        alias /var/www/my-app/.next/static/;",
        "        expires 1y;",
        "        access_log off;",
        "        add_header Cache-Control \"public, max-age=31536000, immutable\";",
        "    }",
        "    location ~* \\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff2|woff)$ {",
        "        expires 1y;",
        "        access_log off;",
        "        add_header Cache-Control \"public, max-age=31536000, immutable\";",
        "    }\n"
      );
    }

    if (selectedIds.has("spaRouting")) {
      lines.push(
        "    # Single Page Application (SPA) Fallback",
        "    root /var/www/html/dist;",
        "    index index.html;\n",
        "    location / {",
        "        try_files $uri $uri/ /index.html;",
        "    }"
      );
    } else if (selectedIds.has("reverseProxyNext")) {
      lines.push(
        "    # Reverse Proxy to Node.js / Next.js",
        "    location / {",
        "        proxy_pass http://127.0.0.1:3000;",
        "        proxy_http_version 1.1;",
        "        proxy_set_header Host $host;",
        "        proxy_set_header X-Real-IP $remote_addr;",
        "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;",
        "        proxy_set_header X-Forwarded-Proto $scheme;"
      );

      if (selectedIds.has("webSocketHeaders")) {
        lines.push(
          "        proxy_set_header Upgrade $http_upgrade;",
          "        proxy_set_header Connection \"upgrade\";"
        );
      }

      lines.push("    }");
    }

    lines.push("}\n");

    const content = lines.join("\n");

    return [
      {
        id: "nginx",
        label: "nginx.conf",
        filename: "nginx.conf",
        language: "text",
        content,
      },
      {
        id: "site",
        label: "default.conf",
        filename: "default.conf",
        language: "text",
        content,
      },
    ];
  }, [selectedIds]);

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolSplitPane
        defaultMobileView="input"
        hasOutput={true}
        input={
          <div className="space-y-4">
            <ConfigPresetsBar
              presets={PRESETS}
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onReset={handleReset}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedCount={selectedIds.size}
              totalCount={NGINX_OPTIONS.length}
            />

            {/* Options List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto scrollbar-refined pr-2">
              {filteredOptions.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-[rgb(var(--border))] text-[rgb(var(--muted))] text-xs">
                  No matching options found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <ConfigOptionCard
                    key={opt.id}
                    option={opt}
                    checked={selectedIds.has(opt.id)}
                    onToggle={toggleOption}
                  />
                ))
              )}
            </div>
          </div>
        }
        output={
          <ConfigPreviewPane
            formats={formats}
            activeFormatId={activeFormatId}
            onSelectFormat={setActiveFormatId}
            configTip="Place this configuration inside /etc/nginx/sites-available/ (or /etc/nginx/conf.d/) and test with 'sudo nginx -t' before reloading with 'sudo systemctl reload nginx'."
          />
        }
      />
    </ToolWorkspace>
  );
}
