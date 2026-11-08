"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Key,
  Calendar,
  Globe,
  Upload,
  Sparkles,
  FileText,
  Clock,
  Layers,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// --- ASN.1 DER Parser Utilities ---
interface Asn1Node {
  tag: number;
  headerLen: number;
  length: number;
  valueOffset: number;
  data: Uint8Array;
}

function parseDer(data: Uint8Array, offset = 0): { node: Asn1Node; nextOffset: number } | null {
  if (offset >= data.length) return null;
  const tag = data[offset];
  let length = 0;
  let headerLen = 2;

  const firstLenByte = data[offset + 1];
  if (firstLenByte === undefined) return null;

  if (firstLenByte < 0x80) {
    length = firstLenByte;
    headerLen = 2;
  } else {
    const numBytes = firstLenByte & 0x7f;
    headerLen = 2 + numBytes;
    length = 0;
    for (let i = 0; i < numBytes; i++) {
      length = (length << 8) | (data[offset + 2 + i] || 0);
    }
  }

  const valueOffset = offset + headerLen;
  return {
    node: {
      tag,
      headerLen,
      length,
      valueOffset,
      data: data.slice(valueOffset, valueOffset + length),
    },
    nextOffset: valueOffset + length,
  };
}

function parseChildren(data: Uint8Array): Asn1Node[] {
  const children: Asn1Node[] = [];
  let curr = 0;
  while (curr < data.length) {
    const parsed = parseDer(data, curr);
    if (!parsed) break;
    children.push(parsed.node);
    curr = parsed.nextOffset;
  }
  return children;
}

function parseOid(data: Uint8Array): string {
  if (data.length === 0) return "";
  const first = data[0];
  const parts: number[] = [Math.floor(first / 40), first % 40];
  let val = 0;
  for (let i = 1; i < data.length; i++) {
    val = (val << 7) | (data[i] & 0x7f);
    if ((data[i] & 0x80) === 0) {
      parts.push(val);
      val = 0;
    }
  }
  return parts.join(".");
}

const OID_NAMES: Record<string, string> = {
  "2.5.4.3": "CN",
  "2.5.4.6": "C",
  "2.5.4.7": "L",
  "2.5.4.8": "ST",
  "2.5.4.10": "O",
  "2.5.4.11": "OU",
  "1.2.840.113549.1.1.1": "RSA Encryption",
  "1.2.840.113549.1.1.5": "SHA-1 with RSA",
  "1.2.840.113549.1.1.11": "SHA-256 with RSA",
  "1.2.840.113549.1.1.12": "SHA-384 with RSA",
  "1.2.840.113549.1.1.13": "SHA-512 with RSA",
  "1.2.840.10045.2.1": "EC Public Key (ECDSA)",
  "1.2.840.10045.4.3.2": "ECDSA with SHA-256",
  "1.2.840.10045.4.3.3": "ECDSA with SHA-384",
  "2.5.29.17": "Subject Alternative Name (SAN)",
  "2.5.29.19": "Basic Constraints",
  "2.5.29.15": "Key Usage",
};

function parseRdnSequence(data: Uint8Array): Record<string, string> {
  const result: Record<string, string> = {};
  const sets = parseChildren(data);
  for (const set of sets) {
    const seqs = parseChildren(set.data);
    for (const seq of seqs) {
      const parts = parseChildren(seq.data);
      if (parts.length >= 2) {
        const oid = parseOid(parts[0].data);
        const name = OID_NAMES[oid] || oid;
        const textDecoder = new TextDecoder("utf-8");
        const val = textDecoder.decode(parts[1].data);
        result[name] = val;
      }
    }
  }
  return result;
}

function parseTime(data: Uint8Array, tag: number): Date | null {
  const str = new TextDecoder("ascii").decode(data);
  if (tag === 0x17) {
    // UTCTime YYMMDDHHMMSSZ
    const year = parseInt(str.substring(0, 2), 10);
    const fullYear = year < 50 ? 2000 + year : 1900 + year;
    const month = parseInt(str.substring(2, 4), 10) - 1;
    const day = parseInt(str.substring(4, 6), 10);
    const hour = parseInt(str.substring(6, 8), 10);
    const min = parseInt(str.substring(8, 10), 10);
    const sec = parseInt(str.substring(10, 12), 10);
    return new Date(Date.UTC(fullYear, month, day, hour, min, sec));
  } else if (tag === 0x18) {
    // GeneralizedTime YYYYMMDDHHMMSSZ
    const fullYear = parseInt(str.substring(0, 4), 10);
    const month = parseInt(str.substring(4, 6), 10) - 1;
    const day = parseInt(str.substring(6, 8), 10);
    const hour = parseInt(str.substring(8, 10), 10);
    const min = parseInt(str.substring(10, 12), 10);
    const sec = parseInt(str.substring(12, 14), 10);
    return new Date(Date.UTC(fullYear, month, day, hour, min, sec));
  }
  return null;
}

function bytesToHexColon(data: Uint8Array): string {
  return Array.from(data)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(":");
}

interface DecodedCert {
  serialNumber: string;
  signatureAlgorithm: string;
  issuer: Record<string, string>;
  subject: Record<string, string>;
  notBefore: Date | null;
  notAfter: Date | null;
  publicKeyAlgorithm: string;
  publicKeyBitSize?: number;
  sans: string[];
  sha256Fingerprint: string;
  sha1Fingerprint: string;
}

// Preset Certs
const SAMPLE_LETS_ENCRYPT = `-----BEGIN CERTIFICATE-----
MIIFBTCCA+2gAwIBAgISAw/7lI9mQ6yQpQh8qF/L2U3TMA0GCSqGSIb3DQEBCwUA
MDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQwwCgYDVQQD
EwNSMTAwHhcNMjQwMTAxMDAwMDAwWhcNMjQwMzMxMjM1OTU5WjAZMRcwFQYDVQQD
Ew5leGFtcGxlLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALyO
y5B0jP/V18iX3n+5NnNl8g5X5D2z5kF8u2/V5G6v9A8k8G4Q4E5qF4zP9l0w6C2
p2l3q5l9g3u2v1t3h4j8k9m0l1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9a0
b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2
AgMBAAGjggHkMIIB4DAOBgNVHQ8BAf8EBAMCBaAwHQYDVR0lBBYwFAYIKwYBBQUH
AwEGCCsGAQUFBwMCMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFG/wX1h4Q4e9z5F3
v2B8k8G4Q4E5MB8GA1UdIwQYMBaAFNXOxfd968ToDs9sVqA2m5eccm9uMDkGCCsG
AQUFBwEBBC0wKzApBggrBgEFBQcwAYYdaHR0cDovL3IxMC5vLmxlbmNyLm9yZy8w
MAYDVR0RBCkwJ4IOZXhhbXBsZS5jb22CEHd3dy5leGFtcGxlLmNvbYIHbXkuZGV2
MA0GCSqGSIb3DQEBCwUAA4IBAQBx1Y0j/k9m0l1o2p3q4r5s6t7u8v9w0x1y2z3a
4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c
6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e
-----END CERTIFICATE-----`;

export function CertDecoderTool({ tool }: { tool: ToolDef }) {
  const [pemInput, setPemInput] = useState<string>(SAMPLE_LETS_ENCRYPT);
  const [decoded, setDecoded] = useState<DecodedCert | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function decodeCert() {
      setError(null);
      if (!pemInput.trim()) {
        setDecoded(null);
        return;
      }

      try {
        const cleanPem = pemInput
          .replace(/-----BEGIN [A-Z0-9_-]+-----/g, "")
          .replace(/-----END [A-Z0-9_-]+-----/g, "")
          .replace(/\s+/g, "");

        if (!cleanPem) {
          throw new Error("No certificate payload detected. Please paste a valid PEM certificate.");
        }

        const binaryStr = atob(cleanPem);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        // Calculate fingerprints using Web Crypto API
        const sha256Buffer = await crypto.subtle.digest("SHA-256", bytes);
        const sha1Buffer = await crypto.subtle.digest("SHA-1", bytes);
        const sha256Fingerprint = bytesToHexColon(new Uint8Array(sha256Buffer));
        const sha1Fingerprint = bytesToHexColon(new Uint8Array(sha1Buffer));

        // Parse Root Sequence
        const root = parseDer(bytes, 0);
        if (!root || root.node.tag !== 0x30) {
          throw new Error("Malformed certificate: Root ASN.1 tag is not a SEQUENCE.");
        }

        const certParts = parseChildren(root.node.data);
        if (certParts.length < 3) {
          throw new Error("Malformed X.509 certificate: Expecting TBSCertificate, Algorithm, Signature.");
        }

        const tbs = certParts[0];
        const tbsParts = parseChildren(tbs.data);

        let idx = 0;
        // Version (optional [0])
        if (tbsParts[idx] && tbsParts[idx].tag === 0xa0) {
          idx++;
        }

        // Serial Number
        const serialNode = tbsParts[idx++];
        const serialNumber = serialNode ? bytesToHexColon(serialNode.data) : "Unknown";

        // Signature Algorithm inside TBS
        const sigAlgNode = tbsParts[idx++];
        let signatureAlgorithm = "Unknown";
        if (sigAlgNode) {
          const sigParts = parseChildren(sigAlgNode.data);
          if (sigParts.length > 0) {
            const oid = parseOid(sigParts[0].data);
            signatureAlgorithm = OID_NAMES[oid] || oid;
          }
        }

        // Issuer
        const issuerNode = tbsParts[idx++];
        const issuer = issuerNode ? parseRdnSequence(issuerNode.data) : {};

        // Validity
        const validityNode = tbsParts[idx++];
        let notBefore: Date | null = null;
        let notAfter: Date | null = null;
        if (validityNode) {
          const timeParts = parseChildren(validityNode.data);
          if (timeParts.length >= 2) {
            notBefore = parseTime(timeParts[0].data, timeParts[0].tag);
            notAfter = parseTime(timeParts[1].data, timeParts[1].tag);
          }
        }

        // Subject
        const subjectNode = tbsParts[idx++];
        const subject = subjectNode ? parseRdnSequence(subjectNode.data) : {};

        // Subject Public Key Info
        const spkiNode = tbsParts[idx++];
        let publicKeyAlgorithm = "RSA / Unknown";
        let publicKeyBitSize: number | undefined;
        if (spkiNode) {
          const spkiParts = parseChildren(spkiNode.data);
          if (spkiParts.length >= 1) {
            const algParts = parseChildren(spkiParts[0].data);
            if (algParts.length > 0) {
              const oid = parseOid(algParts[0].data);
              publicKeyAlgorithm = OID_NAMES[oid] || oid;
            }
          }
          if (spkiParts.length >= 2) {
            // Bit string contains key
            publicKeyBitSize = (spkiParts[1].data.length - 1) * 8;
          }
        }

        // Extensions (v3 tagged [3])
        const sans: string[] = [];
        for (let i = idx; i < tbsParts.length; i++) {
          if (tbsParts[i].tag === 0xa3) {
            const extSeq = parseChildren(tbsParts[i].data);
            if (extSeq.length > 0) {
              const extensions = parseChildren(extSeq[0].data);
              for (const ext of extensions) {
                const extParts = parseChildren(ext.data);
                if (extParts.length >= 2) {
                  const extOid = parseOid(extParts[0].data);
                  if (extOid === "2.5.29.17") {
                    // SAN extension
                    const octetData = extParts[extParts.length - 1].data;
                    const sanSeq = parseChildren(octetData);
                    if (sanSeq.length > 0) {
                      const names = parseChildren(sanSeq[0].data);
                      for (const name of names) {
                        const str = new TextDecoder("ascii").decode(name.data);
                        if (str) sans.push(str);
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (!isCancelled) {
          setDecoded({
            serialNumber,
            signatureAlgorithm,
            issuer,
            subject,
            notBefore,
            notAfter,
            publicKeyAlgorithm,
            publicKeyBitSize,
            sans,
            sha256Fingerprint,
            sha1Fingerprint,
          });
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Failed to decode certificate.");
          setDecoded(null);
        }
      }
    }

    decodeCert();
    return () => {
      isCancelled = true;
    };
  }, [pemInput]);

  // Expiration Status Check
  const expirationStatus = useMemo(() => {
    if (!decoded || !decoded.notAfter) return null;
    const now = new Date();
    const expiry = decoded.notAfter;
    const diffTime = expiry.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return {
        label: `Expired ${Math.abs(daysLeft)} days ago`,
        color: "text-red-500 bg-red-500/10 border-red-500/30",
        icon: ShieldX,
        days: daysLeft,
      };
    } else if (daysLeft <= 30) {
      return {
        label: `Expiring Soon (${daysLeft} days remaining)`,
        color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
        icon: ShieldAlert,
        days: daysLeft,
      };
    } else {
      return {
        label: `Valid (${daysLeft} days remaining)`,
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
        icon: ShieldCheck,
        days: daysLeft,
      };
    }
  }, [decoded]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setPemInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            X.509 SSL Certificate Inspector
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer h-8">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Certificate</span>
            <input
              type="file"
              accept=".crt,.pem,.cer,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPemInput(SAMPLE_LETS_ENCRYPT)}
            className="text-xs h-8"
          >
            Load Sample
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPemInput("")}
            className="text-xs h-8"
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Input Pane: PEM Textarea (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>PEM Certificate (.pem, .crt)</span>
            </span>
            <span className="text-[11px] text-muted-foreground">In-Browser Privacy</span>
          </div>

          <Textarea
            value={pemInput}
            onChange={(e) => setPemInput(e.target.value)}
            placeholder="Paste -----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
            rows={18}
            className="font-mono text-xs leading-relaxed resize-y bg-background"
          />

          <Card className="p-3 bg-muted/30 border-border text-xs text-muted-foreground flex items-center gap-2">
            <Key className="w-4 h-4 text-primary shrink-0" />
            <span>
              Purely parsed client-side via Web Crypto & ASN.1. No certificate keys or domains are transmitted to any server.
            </span>
          </Card>
        </div>

        {/* Right Output Pane: Decoded Certificate Details (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <Card className="p-4 border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </Card>
          )}

          {decoded && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Expiration Status Header */}
              {expirationStatus && (
                <Card
                  className={cn(
                    "p-4 border flex items-center justify-between flex-wrap gap-3",
                    expirationStatus.color
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <expirationStatus.icon className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">{expirationStatus.label}</div>
                      <div className="text-xs opacity-90 mt-0.5">
                        Expires on:{" "}
                        <strong className="underline">
                          {decoded.notAfter?.toUTCString() || "Unknown"}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {expirationStatus.days > 0
                      ? `${expirationStatus.days} Days Left`
                      : "Expired"}
                  </Badge>
                </Card>
              )}

              {/* Subject & Issuer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Subject */}
                <Card className="p-3.5 border-border bg-card">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span>Issued To (Subject)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                      <span className="text-muted-foreground">Common Name (CN):</span>
                      <span className="font-mono font-semibold text-foreground">
                        {decoded.subject.CN || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                      <span className="text-muted-foreground">Organization (O):</span>
                      <span className="text-foreground">{decoded.subject.O || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-muted-foreground">Country (C):</span>
                      <span className="text-foreground">{decoded.subject.C || "—"}</span>
                    </div>
                  </div>
                </Card>

                {/* Issuer */}
                <Card className="p-3.5 border-border bg-card">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Issued By (CA Authority)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                      <span className="text-muted-foreground">Issuer CN:</span>
                      <span className="font-mono font-semibold text-foreground">
                        {decoded.issuer.CN || "Self-Signed"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                      <span className="text-muted-foreground">Issuer Org:</span>
                      <span className="text-foreground">{decoded.issuer.O || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-muted-foreground">Issuer Country:</span>
                      <span className="text-foreground">{decoded.issuer.C || "—"}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Subject Alternative Names (SANs) */}
              <Card className="p-3.5 border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>Subject Alternative Names (SANs)</span>
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {decoded.sans.length} domains covered
                  </Badge>
                </div>
                {decoded.sans.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {decoded.sans.map((san, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="font-mono text-[11px] bg-muted/40"
                      >
                        {san}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No SANs specified (CN fallback used).
                  </p>
                )}
              </Card>

              {/* Cryptographic Technical Details */}
              <Card className="p-3.5 border-border bg-card">
                <div className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-primary" />
                  <span>Key Specifications & Fingerprints</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-muted/30 p-2 rounded">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">
                        Public Key Algorithm
                      </div>
                      <div className="font-semibold text-foreground mt-0.5">
                        {decoded.publicKeyAlgorithm}
                        {decoded.publicKeyBitSize ? ` (${decoded.publicKeyBitSize} bit)` : ""}
                      </div>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">
                        Signature Algorithm
                      </div>
                      <div className="font-semibold text-foreground mt-0.5 truncate">
                        {decoded.signatureAlgorithm}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-2 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" /> SHA-256 Fingerprint
                      </span>
                      <CopyButton value={decoded.sha256Fingerprint} />
                    </div>
                    <div className="font-mono text-[11px] text-foreground break-all mt-1">
                      {decoded.sha256Fingerprint}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-2 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" /> SHA-1 Fingerprint
                      </span>
                      <CopyButton value={decoded.sha1Fingerprint} />
                    </div>
                    <div className="font-mono text-[11px] text-foreground break-all mt-1">
                      {decoded.sha1Fingerprint}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-2 rounded">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">
                      Serial Number
                    </div>
                    <div className="font-mono text-[11px] text-foreground break-all mt-1">
                      {decoded.serialNumber}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {!decoded && !error && (
            <Card className="p-8 text-center text-muted-foreground text-xs border-dashed">
              Paste or upload an SSL certificate to view decoded attributes.
            </Card>
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}

export default CertDecoderTool;
