"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"];

export default function DomainIntelligenceTool() {
  const [domain, setDomain] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [dnsData, setDnsData] = React.useState<any>(null);
  const [ipInfo, setIpInfo] = React.useState<any>(null);
  const [headers, setHeaders] = React.useState<any>(null);
  const [responseTime, setResponseTime] = React.useState<number | null>(null);
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);

  const lookup = async () => {
    if (!domain) return;

    setLoading(true);
    setError(null);
    setDnsData(null);
    setIpInfo(null);
    setHeaders(null);
    setResponseTime(null);
    setRedirectUrl(null);

    try {
      const dnsResults: Record<string, any[]> = {};

      const responses = await Promise.all(
        RECORD_TYPES.map((t) =>
          fetch(`https://dns.google/resolve?name=${domain}&type=${t}`).then(
            (r) => r.json(),
          ),
        ),
      );

      responses.forEach((res, i) => {
        if (Array.isArray(res.Answer)) {
          dnsResults[RECORD_TYPES[i]] = res.Answer;
        }
      });

      if (Object.keys(dnsResults).length === 0) {
        throw new Error("No DNS records found.");
      }

      setDnsData(dnsResults);

      const firstA = dnsResults.A?.[0]?.data;

      if (firstA) {
        const ipRes = await fetch(`https://ipapi.co/${firstA}/json/`);
        let ipJson = null;

        if (ipRes.ok) {
          ipJson = await ipRes.json();
        } else {
          console.warn("IP API rate limited");
        }
        setIpInfo(ipJson);
      }

      try {
        const start = performance.now();
        const res = await fetch(`https://${domain}`);
        const duration = performance.now() - start;

        setResponseTime(Math.round(duration));

        if (res.redirected) {
          setRedirectUrl(res.url);
        }

        const headerObj: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          headerObj[key.toLowerCase()] = value;
        });

        setHeaders(headerObj);
      } catch {
        // Some sites block CORS
      }
    } catch (e: any) {
      let message = "Domain lookup failed.";

      if (e?.message?.includes("Too many")) {
        message =
          "Rate limit reached. Please wait a few seconds and try again.";
      } else if (e?.message?.includes("Failed to fetch")) {
        message = "Network error. Please check your internet connection.";
      } else if (e?.message?.includes("No DNS records")) {
        message = "No DNS records found for this domain.";
      }

      setError(message);
    }

    setLoading(false);
  };

  const hasHTTPS = headers?.["strict-transport-security"];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Card className="mt-6 p-5 flex gap-3">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded border p-2"
        />
        <Button onClick={lookup} loading={loading}>
          Analyze
        </Button>
      </Card>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="mt-6 border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.06)] p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(var(--danger),0.15)] text-[rgb(var(--danger))]">
                !
              </div>

              <div>
                <div className="text-lg font-semibold text-[rgb(var(--danger))]">
                  Lookup Failed
                </div>

                <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                  {error}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {dnsData && (
        <div className="mt-6 space-y-6">
          {/* Overview */}
          <Card className="p-5">
            <div className="font-semibold mb-3">Overview</div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-[rgb(var(--muted))]">Response Time</div>
                <div>{responseTime ? `${responseTime} ms` : "—"}</div>
              </div>

              <div>
                <div className="text-[rgb(var(--muted))]">HTTPS</div>
                <div>
                  {hasHTTPS ? (
                    <Badge variant="accent">Enabled</Badge>
                  ) : (
                    <Badge variant="destructive">Not Detected</Badge>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[rgb(var(--muted))]">Redirect</div>
                <div>{redirectUrl || "No redirect"}</div>
              </div>
            </div>
          </Card>

          {/* DNS Fallback */}
          {dnsData === null && (
            <Card className="p-5">
              <div className="font-semibold mb-3">DNS Records</div>
              <div className="text-sm text-[rgb(var(--muted))]">
                Unable to fetch DNS records data. This may be due to API rate
                limits or network issues.
              </div>
            </Card>
          )}

          {/* DNS */}
          <Card className="p-5">
            <div className="font-semibold mb-3">DNS Records</div>

            {Object.entries(dnsData).map(([type, records]) => (
              <div key={type} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{type}</Badge>
                  <span className="text-xs text-[rgb(var(--muted))]">
                    {(records as any[]).length} records
                  </span>
                </div>

                <div className="space-y-1 text-sm font-mono">
                  {(records as any[]).map((r, i) => (
                    <div key={i} className="break-all border-b pb-1">
                      {r.data}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* IP Intelligence Fallback */}
          {dnsData && !ipInfo && (
            <Card className="p-5">
              <div className="font-semibold mb-3">IP Intelligence</div>
              <div className="text-sm text-[rgb(var(--muted))]">
                Unable to fetch IP intelligence data. This may be due to API
                rate limits or network issues.
              </div>
            </Card>
          )}

          {/* IP Intelligence */}
          {ipInfo && (
            <Card className="p-5">
              <div className="font-semibold mb-3">IP Intelligence</div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>IP: {ipInfo.ip}</div>
                <div>Country: {ipInfo.country_name}</div>
                <div>Region: {ipInfo.region}</div>
                <div>ISP: {ipInfo.org}</div>
                <div>ASN: {ipInfo.asn}</div>
                <div>Timezone: {ipInfo.timezone}</div>
              </div>
            </Card>
          )}

          {/* Security Headers Fallback */}
          {dnsData && headers === null && (
            <Card className="p-5">
              <div className="font-semibold mb-3">Security Headers</div>
              <div className="text-sm text-[rgb(var(--muted))]">
                Unable to fetch security header data. This may be due to CORS
                restrictions or network issues.
              </div>
            </Card>
          )}

          {/* Security Headers */}
          {headers && (
            <Card className="p-5">
              <div className="font-semibold mb-3">Security Headers</div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  HSTS:{" "}
                  {headers["strict-transport-security"] ? (
                    <Badge variant="accent">Yes</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </div>

                <div>
                  CSP:{" "}
                  {headers["content-security-policy"] ? (
                    <Badge variant="accent">Yes</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </div>

                <div>
                  X-Frame-Options:{" "}
                  {headers["x-frame-options"] ? (
                    <Badge variant="accent">Yes</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </div>

                <div>
                  Referrer-Policy:{" "}
                  {headers["referrer-policy"] ? (
                    <Badge variant="accent">Yes</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </main>
  );
}
