"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import * as yaml from "js-yaml";
import {
  Boxes,
  Network,
  HardDrive,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Terminal,
  RotateCcw,
  Layers,
  Container,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SAMPLE_COMPOSE = `version: '3.8'

services:
  web:
    image: node:20-alpine
    container_name: toolmate-web
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/main
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
    networks:
      - frontend-network
      - backend-network

  api-gateway:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - web
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - frontend-network

  db:
    image: postgres:16-alpine
    container_name: postgres-primary
    restart: always
    environment:
      - POSTGRES_DB=main
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - backend-network

  cache:
    image: redis:7-alpine
    container_name: redis-cache
    restart: always
    volumes:
      - redisdata:/data
    networks:
      - backend-network

volumes:
  pgdata:
  redisdata:

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
`;

const PRESETS = [
  {
    name: "Web + Postgres + Redis + Nginx",
    yaml: SAMPLE_COMPOSE,
  },
  {
    name: "Microservices Stack",
    yaml: `version: '3.8'
services:
  frontend:
    image: my-app/frontend:v1.4
    ports:
      - "8080:80"
    depends_on:
      - auth-service
      - billing-service
    networks:
      - public-net

  auth-service:
    image: my-app/auth:v2.1
    environment:
      - JWT_SECRET=super_secret
    depends_on:
      - auth-db
    networks:
      - public-net
      - internal-net

  billing-service:
    image: my-app/billing:v1.0
    depends_on:
      - rabbitmq
    networks:
      - internal-net

  auth-db:
    image: postgres:15
    volumes:
      - auth_data:/var/lib/postgresql/data
    networks:
      - internal-net

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
      - internal-net

volumes:
  auth_data:

networks:
  public-net:
  internal-net:`,
  },
];

type ParsedService = {
  name: string;
  image?: string;
  containerName?: string;
  ports: string[];
  volumes: string[];
  environmentCount: number;
  dependsOn: string[];
  networks: string[];
  restart?: string;
};

type AuditWarning = {
  service: string;
  type: "warning" | "danger" | "info";
  message: string;
};

export function DockerComposeVisualizerTool({ tool }: { tool: ToolDef }) {
  const [yamlInput, setYamlInput] = useState(SAMPLE_COMPOSE);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");

  // Parse YAML into structured topology
  const parsedData = useMemo(() => {
    try {
      const doc = yaml.load(yamlInput) as any;
      if (!doc || typeof doc !== "object") {
        return { error: "Invalid YAML format", services: [], networks: [], volumes: [] };
      }

      const servicesObj = doc.services || {};
      const networksObj = doc.networks || {};
      const volumesObj = doc.volumes || {};

      const serviceList: ParsedService[] = Object.entries(servicesObj).map(
        ([name, def]: [string, any]) => {
          let ports: string[] = [];
          if (Array.isArray(def?.ports)) {
            ports = def.ports.map((p: any) => String(p));
          }

          let volumes: string[] = [];
          if (Array.isArray(def?.volumes)) {
            volumes = def.volumes.map((v: any) => (typeof v === "string" ? v : v?.source || "volume"));
          }

          let envCount = 0;
          if (Array.isArray(def?.environment)) {
            envCount = def.environment.length;
          } else if (def?.environment && typeof def.environment === "object") {
            envCount = Object.keys(def.environment).length;
          }

          let dependsOn: string[] = [];
          if (Array.isArray(def?.depends_on)) {
            dependsOn = def.depends_on;
          } else if (def?.depends_on && typeof def.depends_on === "object") {
            dependsOn = Object.keys(def.depends_on);
          }

          let networks: string[] = [];
          if (Array.isArray(def?.networks)) {
            networks = def.networks;
          } else if (def?.networks && typeof def.networks === "object") {
            networks = Object.keys(def.networks);
          }

          return {
            name,
            image: def?.image || "Custom Build",
            containerName: def?.container_name,
            ports,
            volumes,
            environmentCount: envCount,
            dependsOn,
            networks,
            restart: def?.restart,
          };
        }
      );

      const networkNames = Object.keys(networksObj);
      const volumeNames = Object.keys(volumesObj);

      return {
        error: null,
        services: serviceList,
        networks: networkNames,
        volumes: volumeNames,
      };
    } catch (err: any) {
      return {
        error: err?.message || "YAML Parse Error",
        services: [],
        networks: [],
        volumes: [],
      };
    }
  }, [yamlInput]);

  // Security & Best Practice Linter
  const auditWarnings = useMemo<AuditWarning[]>(() => {
    const list: AuditWarning[] = [];

    parsedData.services.forEach((s) => {
      // 1. Tag unpinned
      if (s.image?.endsWith(":latest") || !s.image?.includes(":")) {
        list.push({
          service: s.name,
          type: "warning",
          message: `Uses unpinned image '${s.image}'. Pin explicit version tags for production stability.`,
        });
      }

      // 2. Database exposed directly on host
      const isDb = /postgres|mysql|mariadb|mongo|redis/i.test(s.name) || /postgres|mysql|mongo|redis/i.test(s.image || "");
      if (isDb && s.ports.length > 0) {
        list.push({
          service: s.name,
          type: "danger",
          message: `Database has host ports exposed (${s.ports.join(", ")}). Keep internal to private docker networks to prevent external access.`,
        });
      }

      // 3. No restart policy
      if (!s.restart || s.restart === "no") {
        list.push({
          service: s.name,
          type: "info",
          message: "No restart policy defined (e.g. 'restart: unless-stopped').",
        });
      }
    });

    return list;
  }, [parsedData.services]);

  // Filter services by active network tab
  const filteredServices = useMemo(() => {
    if (selectedNetwork === "all") return parsedData.services;
    return parsedData.services.filter((s) => s.networks.includes(selectedNetwork));
  }, [parsedData.services, selectedNetwork]);

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
            onClick={() => setYamlInput(preset.yaml)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Topology Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Container className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">
              Services
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {parsedData.services.length} containers
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/70 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">
              Networks
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {parsedData.networks.length} isolated
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/70 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">
              Volumes
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {parsedData.volumes.length} persistent
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/70 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">
              Exposed Ports
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {parsedData.services.reduce((acc, s) => acc + s.ports.length, 0)} ports
            </span>
          </div>
        </Card>
      </div>

      {/* Main Split: YAML Input on Left, Interactive Visual Topology on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: YAML Editor (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                docker-compose.yml
              </span>
            </div>
            <CopyButton value={yamlInput} text="Copy YAML" />
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <Textarea
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
              placeholder="Paste docker-compose.yml here..."
              rows={22}
              className="w-full flex-1 resize-y font-mono text-xs leading-relaxed border-border/60 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right: Visual Node Topology (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Network Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedNetwork("all")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                  selectedNetwork === "all"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                All Networks ({parsedData.services.length})
              </button>
              {parsedData.networks.map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setSelectedNetwork(net)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-all font-mono",
                    selectedNetwork === net
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {parsedData.error ? (
            <Card className="p-6 border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs font-mono">
              {parsedData.error}
            </Card>
          ) : (
            /* Service Topology Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredServices.map((service) => (
                <Card
                  key={service.name}
                  className="p-4 bg-card border-border/80 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between space-y-3"
                >
                  {/* Top Bar: Container Name & Image */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-sm text-foreground flex items-center gap-1.5">
                        <Container className="w-4 h-4 text-primary shrink-0" />
                        {service.name}
                      </span>
                      {service.restart ? (
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {service.restart}
                        </Badge>
                      ) : null}
                    </div>

                    <span className="text-xs font-mono text-muted-foreground block mt-1 truncate">
                      {service.image}
                    </span>
                  </div>

                  {/* Ports */}
                  {service.ports.length > 0 ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                        Ports:
                      </span>
                      {service.ports.map((p, i) => (
                        <Badge
                          key={i}
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-mono text-[10px]"
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  {/* Depends On Arrow Indicators */}
                  {service.dependsOn.length > 0 ? (
                    <div className="pt-2 border-t border-border/60 text-[11px] font-mono flex items-center gap-1.5 text-muted-foreground flex-wrap">
                      <span className="text-[10px] uppercase font-semibold">Depends on:</span>
                      {service.dependsOn.map((dep) => (
                        <span
                          key={dep}
                          className="px-1.5 py-0.5 rounded bg-muted text-foreground flex items-center gap-1"
                        >
                          <ArrowRight className="w-2.5 h-2.5 text-primary" />
                          {dep}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Footer: Volumes & Networks count */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-muted-foreground" />
                      {service.volumes.length} mounts
                    </span>
                    <span className="flex items-center gap-1">
                      <Network className="w-3 h-3 text-muted-foreground" />
                      {service.networks.length} nets
                    </span>
                    <span>{service.environmentCount} envs</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Security & Best Practice Advice Box */}
          {auditWarnings.length > 0 ? (
            <Card className="p-4 bg-card/90 border-border/80 shadow-xs space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Best Practice & Security Checks
              </span>

              <div className="space-y-1.5">
                {auditWarnings.map((warn, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-muted/40 border border-border/60 text-xs flex items-start gap-2"
                  >
                    <Badge
                      className={cn(
                        "text-[9px] font-mono shrink-0 uppercase",
                        warn.type === "danger"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      )}
                    >
                      {warn.service}
                    </Badge>
                    <span className="text-muted-foreground flex-1 leading-relaxed">
                      {warn.message}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </ToolWorkspace>
  );
}
