"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import type { ConfigOption, ConfigPreset, OutputFormat } from "@/components/tools/config-builder/types";

const HTACCESS_OPTIONS: ConfigOption[] = [
  // Redirects & Domains
  {
    id: "forceHttps",
    name: "Force HTTPS (SSL Redirection)",
    key: "RewriteRule ^(.*)$ https://%{HTTP_HOST}...",
    category: "Redirects",
    description: "Automatically redirect all insecure HTTP traffic to encrypted HTTPS.",
    whyItHelps: "Encrypts user passwords, cookies, and sensitive payloads while preventing search engine duplicate content penalties.",
    example: "RewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
    defaultChecked: true,
  },
  {
    id: "forceNonWww",
    name: "Force Non-WWW Canonical Domain",
    key: "RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]",
    category: "Redirects",
    description: "Redirect www.example.com to example.com with a 301 permanent redirect.",
    whyItHelps: "Consolidates SEO backlink authority and prevents cookies from leaking to subdomains.",
    example: "RewriteRule ^(.*)$ https://%1/$1 [R=301,L]",
    defaultChecked: true,
  },
  {
    id: "spaRouting",
    name: "SPA Routing (React / Vite / Vue Fallback)",
    key: "RewriteRule ^ index.html [L]",
    category: "Routing",
    description: "Route all missing files and subpaths back to index.html for client-side routers.",
    whyItHelps: "Prevents 404 errors when users refresh or directly visit virtual routes like /dashboard or /profile.",
    example: "RewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.html [L]",
    defaultChecked: true,
  },

  // Security Hardening
  {
    id: "disableDirectoryBrowsing",
    name: "Disable Directory Browsing",
    key: "Options -Indexes",
    category: "Security",
    description: "Disallow visitors from listing directory contents when index.html is absent.",
    whyItHelps: "Prevents malicious scanners from discovering uploaded documents, backups, or source code.",
    example: "Options -Indexes",
    defaultChecked: true,
  },
  {
    id: "protectDotFiles",
    name: "Protect Hidden & Sensitive Files",
    key: "<FilesMatch '^\\.'> Require all denied",
    category: "Security",
    description: "Block public web access to .env, .git, .htaccess, and system hidden files.",
    whyItHelps: "Stops critical exposure of database credentials, API keys, and repository metadata.",
    example: "<FilesMatch \"^\\.\">\n  Require all denied\n</FilesMatch>",
    defaultChecked: true,
  },
  {
    id: "securityHeaders",
    name: "Modern Security Headers (HSTS, CSP, XFO)",
    key: "Header set X-Frame-Options 'SAMEORIGIN'",
    category: "Security",
    description: "Inject X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and HSTS headers.",
    whyItHelps: "Protects against Clickjacking, MIME-confusion attacks, and cross-site scripting vulnerabilities.",
    example: "Header set X-Frame-Options \"SAMEORIGIN\"\nHeader set X-Content-Type-Options \"nosniff\"",
    defaultChecked: true,
  },
  {
    id: "preventHotlinking",
    name: "Prevent Image Hotlinking",
    key: "RewriteCond %{HTTP_REFERER} !^$",
    category: "Security",
    description: "Block third-party websites from hotlinking your images and stealing your server bandwidth.",
    whyItHelps: "Stops scrapers from consuming your hosting bandwidth limits by displaying your images on their sites.",
    example: "RewriteRule .*\.(jpe?g|gif|bmp|png|webp)$ - [F]",
    defaultChecked: false,
  },

  // Performance & Caching
  {
    id: "gzipCompression",
    name: "Gzip / Deflate Compression",
    key: "mod_deflate: AddOutputFilterByType...",
    category: "Performance",
    description: "Compress HTML, CSS, JavaScript, JSON, and SVG files before sending to visitors.",
    whyItHelps: "Reduces transferred file sizes by 60% to 80%, dramatically speeding up page load speeds.",
    example: "AddOutputFilterByType DEFLATE text/html text/css application/javascript",
    defaultChecked: true,
  },
  {
    id: "browserCaching",
    name: "Browser Caching (Expires Headers)",
    key: "mod_expires: ExpiresDefault 'access plus 1 month'",
    category: "Performance",
    description: "Send far-future cache expiry headers for static images, web fonts, CSS, and JavaScript.",
    whyItHelps: "Returning users experience instant page loads since assets are read directly from local device cache.",
    example: "ExpiresByType image/webp \"access plus 1 year\"",
    defaultChecked: true,
  },
  {
    id: "utf8Encoding",
    name: "Default UTF-8 Charset",
    key: "AddDefaultCharset UTF-8",
    category: "Performance",
    description: "Enforce UTF-8 encoding header on all text responses.",
    whyItHelps: "Eliminates character scrambling and international font display issues.",
    example: "AddDefaultCharset UTF-8",
    defaultChecked: true,
  },

  // Errors & Pages
  {
    id: "customError404",
    name: "Custom 404 Error Page",
    key: "ErrorDocument 404 /404.html",
    category: "Error Pages",
    description: "Point missing page requests to a clean branded 404.html template.",
    whyItHelps: "Provides a professional user experience instead of the default ugly Apache 'Not Found' error screen.",
    example: "ErrorDocument 404 /404.html",
    defaultChecked: true,
  },
];

const PRESETS: ConfigPreset[] = [
  {
    id: "recommended",
    name: "Single Page App (SPA)",
    description: "Ideal for React, Vite, Vue, and Next.js static exports with SPA routing and security",
    optionIds: [
      "forceHttps",
      "forceNonWww",
      "spaRouting",
      "disableDirectoryBrowsing",
      "protectDotFiles",
      "securityHeaders",
      "gzipCompression",
      "browserCaching",
      "utf8Encoding",
      "customError404",
    ],
  },
  {
    id: "strict",
    name: "Maximum Security",
    description: "High-security configuration with hotlinking protection and hardened headers",
    optionIds: [
      "forceHttps",
      "forceNonWww",
      "disableDirectoryBrowsing",
      "protectDotFiles",
      "securityHeaders",
      "preventHotlinking",
      "gzipCompression",
      "browserCaching",
      "utf8Encoding",
      "customError404",
    ],
  },
  {
    id: "minimal",
    name: "Performance & Caching",
    description: "Lightweight rules focusing on Gzip compression and browser caching",
    optionIds: [
      "forceHttps",
      "gzipCompression",
      "browserCaching",
      "utf8Encoding",
      "disableDirectoryBrowsing",
    ],
  },
];

export function HtaccessGeneratorTool({ tool }: { tool: ToolDef }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(PRESETS[0].optionIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFormatId, setActiveFormatId] = useState("htaccess");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    HTACCESS_OPTIONS.forEach((opt) => set.add(opt.category));
    return Array.from(set);
  }, []);

  const filteredOptions = useMemo(() => {
    return HTACCESS_OPTIONS.filter((opt) => {
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
    const sections: string[] = [
      "# =====================================================================",
      "# Apache .htaccess Configuration — Generated with ToolMate",
      "# =====================================================================\n",
    ];

    if (selectedIds.has("utf8Encoding")) {
      sections.push(
        "# ---------------------------------------------------------------------",
        "# Character Encoding",
        "# ---------------------------------------------------------------------",
        "AddDefaultCharset UTF-8\n"
      );
    }

    if (
      selectedIds.has("disableDirectoryBrowsing") ||
      selectedIds.has("protectDotFiles")
    ) {
      sections.push(
        "# ---------------------------------------------------------------------",
        "# Security & File Protection",
        "# ---------------------------------------------------------------------"
      );
      if (selectedIds.has("disableDirectoryBrowsing")) {
        sections.push("Options -Indexes");
      }
      if (selectedIds.has("protectDotFiles")) {
        sections.push(
          "<FilesMatch \"^\\.\">",
          "  <IfModule mod_authz_core.c>",
          "    Require all denied",
          "  </IfModule>",
          "  <IfModule !mod_authz_core.c>",
          "    Order deny,allow",
          "    Deny from all",
          "  </IfModule>",
          "</FilesMatch>"
        );
      }
      sections.push("");
    }

    if (selectedIds.has("securityHeaders")) {
      sections.push(
        "# ---------------------------------------------------------------------",
        "# HTTP Security Headers",
        "# ---------------------------------------------------------------------",
        "<IfModule mod_headers.c>",
        "  Header always set X-Content-Type-Options \"nosniff\"",
        "  Header always set X-Frame-Options \"SAMEORIGIN\"",
        "  Header always set X-XSS-Protection \"1; mode=block\"",
        "  Header always set Referrer-Policy \"strict-origin-when-cross-origin\"",
        "  Header always set Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\"",
        "</IfModule>\n"
      );
    }

    const rewriteRules: string[] = [];
    if (selectedIds.has("forceHttps")) {
      rewriteRules.push(
        "  # Force HTTPS",
        "  RewriteCond %{HTTPS} off",
        "  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]"
      );
    }

    if (selectedIds.has("forceNonWww")) {
      rewriteRules.push(
        "  # Redirect www to non-www",
        "  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]",
        "  RewriteRule ^(.*)$ https://%1/$1 [R=301,L]"
      );
    }

    if (selectedIds.has("preventHotlinking")) {
      rewriteRules.push(
        "  # Prevent image hotlinking",
        "  RewriteCond %{HTTP_REFERER} !^$",
        "  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?%{HTTP_HOST} [NC]",
        "  RewriteRule \\.(jpe?g|gif|bmp|png|webp|svg)$ - [F,NC]"
      );
    }

    if (selectedIds.has("spaRouting")) {
      rewriteRules.push(
        "  # Single Page Application (SPA) Fallback",
        "  RewriteCond %{REQUEST_FILENAME} !-f",
        "  RewriteCond %{REQUEST_FILENAME} !-d",
        "  RewriteRule ^ index.html [L]"
      );
    }

    if (rewriteRules.length > 0) {
      sections.push(
        "# ---------------------------------------------------------------------",
        "# URL Rewrites & Routing Engine",
        "# ---------------------------------------------------------------------",
        "<IfModule mod_rewrite.c>",
        "  RewriteEngine On",
        "  RewriteBase /",
        ...rewriteRules,
        "</IfModule>\n"
      );
    }

    if (selectedIds.has("gzipCompression")) {
      sections.push(
        "# ---------------------------------------------------------------------",
        "# Gzip / Deflate Compression",
        "# ---------------------------------------------------------------------",
        "<IfModule mod_deflate.c>",
        "  AddOutputFilterByType DEFLATE text/plain",
        "  AddOutputFilterByType DEFLATE text/html",
        "  AddOutputFilterByType DEFLATE text/xml",
        "  AddOutputFilterByType DEFLATE text/css",
        "  AddOutputFilterByType DEFLATE text/javascript",
        "  AddOutputFilterByType DEFLATE application/xml",
        "  AddOutputFilterByType DEFLATE application/xhtml+xml",
        "  AddOutputFilterByType DEFLATE application/rss+xml",
        "  AddOutputFilterByType DEFLATE application/javascript",
        "  AddOutputFilterByType DEFLATE application/x-javascript",
        "  AddOutputFilterByType DEFLATE application/json",
        "  AddOutputFilterByType DEFLATE image/svg+xml",
        "</IfModule>\n"
      );
    }

    if (selectedIds.has("browserCaching")) {
      sections.push(
        "# ---------------------------------------------------------------------",
        "# Browser Caching (Expires Headers)",
        "# ---------------------------------------------------------------------",
        "<IfModule mod_expires.c>",
        "  ExpiresActive On",
        "  ExpiresDefault \"access plus 1 month\"",
        "  ExpiresByType text/html \"access plus 0 seconds\"",
        "  ExpiresByType text/css \"access plus 1 year\"",
        "  ExpiresByType text/javascript \"access plus 1 year\"",
        "  ExpiresByType application/javascript \"access plus 1 year\"",
        "  ExpiresByType image/jpeg \"access plus 1 year\"",
        "  ExpiresByType image/png \"access plus 1 year\"",
        "  ExpiresByType image/webp \"access plus 1 year\"",
        "  ExpiresByType image/svg+xml \"access plus 1 year\"",
        "  ExpiresByType font/woff2 \"access plus 1 year\"",
        "</IfModule>\n"
      );
    }

    if (selectedIds.has("customError404")) {
      sections.push(
        "# ---------------------------------------------------------------------",
        "# Custom Error Documents",
        "# ---------------------------------------------------------------------",
        "ErrorDocument 404 /404.html\n"
      );
    }

    const content = sections.join("\n");

    return [
      {
        id: "htaccess",
        label: ".htaccess",
        filename: ".htaccess",
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
              totalCount={HTACCESS_OPTIONS.length}
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
            configTip="Place this .htaccess file in the public document root (e.g. public_html/ or dist/) of your Apache server or cPanel hosting account."
          />
        }
      />
    </ToolWorkspace>
  );
}
