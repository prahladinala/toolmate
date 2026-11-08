"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Compass,
  Sparkles,
  Layers,
  Code2,
  Sliders,
  TrendingUp,
  RotateCcw,
  Database,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Mathematical calculations
function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
}

function magnitude(a: number[]): number {
  return Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
}

function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - (b[i] || 0), 2), 0)
  );
}

function manhattanDistance(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + Math.abs(val - (b[i] || 0)), 0);
}

const PRESETS = [
  {
    name: "Synonym Paraphrase (High Sim)",
    desc: "The cat sat on the mat vs A feline rested on the rug",
    vecA: [0.72, 0.65, 0.18, 0.05, 0.88, -0.12, 0.44, 0.31],
    vecB: [0.69, 0.61, 0.22, 0.08, 0.84, -0.09, 0.41, 0.35],
    textA: "The cat sat comfortably on the soft floor mat.",
    textB: "A small feline rested calmly upon the living room rug.",
  },
  {
    name: "Related Domain (Medium Sim)",
    desc: "Machine Learning models vs Cloud GPU infrastructure",
    vecA: [0.85, 0.42, -0.31, 0.67, 0.12, 0.55, -0.44, 0.23],
    vecB: [0.41, 0.15, -0.11, 0.78, 0.35, 0.62, -0.21, 0.68],
    textA: "Training deep neural network transformers on large datasets.",
    textB: "Provisioning high-memory Nvidia H100 GPU clusters in Kubernetes.",
  },
  {
    name: "Orthogonal / Unrelated (Low Sim)",
    desc: "Database SQL indexing vs Recipe for chocolate chip cookies",
    vecA: [0.92, -0.74, 0.41, 0.12, -0.65, 0.88, 0.05, -0.33],
    vecB: [-0.15, 0.88, -0.62, 0.74, 0.55, -0.12, 0.81, 0.44],
    textA: "Optimizing B-Tree composite indices for PostgreSQL range queries.",
    textB: "Whisk unsalted butter with brown sugar and vanilla extract until fluffy.",
  },
];

export function VectorVisualizerTool({ tool }: { tool: ToolDef }) {
  // Mode: 2D interactive plane vs High-D vector list
  const [mode, setMode] = useState<"2d" | "high-d">("2d");

  // 2D Coordinates
  const [vec2DA, setVec2DA] = useState<{ x: number; y: number }>({ x: 4, y: 3 });
  const [vec2DB, setVec2DB] = useState<{ x: number; y: number }>({ x: 2, y: 5 });

  // High-D Arrays
  const [highDInputA, setHighDInputA] = useState(
    JSON.stringify(PRESETS[0].vecA)
  );
  const [highDInputB, setHighDInputB] = useState(
    JSON.stringify(PRESETS[0].vecB)
  );
  const [queryCodeFormat, setQueryCodeFormat] = useState<"pgvector" | "pinecone">("pgvector");

  // Computed 2D metrics
  const metrics2D = useMemo(() => {
    const arrA = [vec2DA.x, vec2DA.y];
    const arrB = [vec2DB.x, vec2DB.y];
    const cosSim = cosineSimilarity(arrA, arrB);
    const cosDist = 1 - cosSim;
    const dot = dotProduct(arrA, arrB);
    const euclid = euclideanDistance(arrA, arrB);
    const manhattan = manhattanDistance(arrA, arrB);
    const magA = magnitude(arrA);
    const magB = magnitude(arrB);

    // Angle in degrees
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosSim)));
    const angleDeg = (angleRad * 180) / Math.PI;

    return {
      cosSim: Math.round(cosSim * 10000) / 10000,
      cosDist: Math.round(cosDist * 10000) / 10000,
      dot: Math.round(dot * 100) / 100,
      euclid: Math.round(euclid * 100) / 100,
      manhattan: Math.round(manhattan * 100) / 100,
      magA: Math.round(magA * 100) / 100,
      magB: Math.round(magB * 100) / 100,
      angleDeg: Math.round(angleDeg * 10) / 10,
    };
  }, [vec2DA, vec2DB]);

  // Computed High-D metrics
  const metricsHighD = useMemo(() => {
    try {
      const arrA = JSON.parse(highDInputA);
      const arrB = JSON.parse(highDInputB);

      if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
        return { error: "Both inputs must be JSON arrays of numbers." };
      }
      if (arrA.length !== arrB.length) {
        return {
          error: `Dimension mismatch: Vector A has ${arrA.length} dims, but Vector B has ${arrB.length} dims.`,
        };
      }

      const cosSim = cosineSimilarity(arrA, arrB);
      const cosDist = 1 - cosSim;
      const dot = dotProduct(arrA, arrB);
      const euclid = euclideanDistance(arrA, arrB);
      const manhattan = manhattanDistance(arrA, arrB);

      return {
        error: null,
        dimensions: arrA.length,
        cosSim: Math.round(cosSim * 10000) / 10000,
        cosDist: Math.round(cosDist * 10000) / 10000,
        dot: Math.round(dot * 1000) / 1000,
        euclid: Math.round(euclid * 1000) / 1000,
        manhattan: Math.round(manhattan * 1000) / 1000,
      };
    } catch {
      return { error: "Invalid JSON format in vector input." };
    }
  }, [highDInputA, highDInputB]);

  // DB Query Generator
  const dbQuery = useMemo(() => {
    if (queryCodeFormat === "pgvector") {
      return `-- PostgreSQL with pgvector (Cosine Distance <-> operator)
SELECT id, content, 1 - (embedding <=> '${highDInputA}') AS cosine_similarity
FROM documents
WHERE embedding <=> '${highDInputA}' < 0.35
ORDER BY embedding <=> '${highDInputA}' ASC
LIMIT 5;`;
    }

    return `// Pinecone Node.js SDK
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone();
const index = pc.index('document-embeddings');

const queryResponse = await index.query({
  vector: ${highDInputA},
  topK: 5,
  includeMetadata: true,
});

console.log(queryResponse.matches);`;
  }, [queryCodeFormat, highDInputA]);

  // 2D Plane Coordinate Translation
  const planeSize = 340;
  const maxCoord = 6;
  const toSvgX = (x: number) => planeSize / 2 + (x / maxCoord) * (planeSize / 2 - 20);
  const toSvgY = (y: number) => planeSize / 2 - (y / maxCoord) * (planeSize / 2 - 20);

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Top Header Controls: Mode Selector & Presets */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex items-center gap-1.5 bg-muted/60 p-0.5 rounded-lg border border-border">
          <Button
            type="button"
            variant={mode === "2d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("2d")}
            className="h-8 px-3 text-xs font-semibold"
          >
            <Compass className="w-3.5 h-3.5 mr-1 text-primary" />
            2D Interactive Plane
          </Button>
          <Button
            type="button"
            variant={mode === "high-d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("high-d")}
            className="h-8 px-3 text-xs font-semibold"
          >
            <Layers className="w-3.5 h-3.5 mr-1 text-indigo-500" />
            N-Dimensional Embeddings
          </Button>
        </div>

        {mode === "high-d" ? (
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setHighDInputA(JSON.stringify(p.vecA));
                  setHighDInputB(JSON.stringify(p.vecB));
                }}
                className="text-xs px-2.5 py-1 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
              >
                {p.name.split(" ")[0]}
              </button>
            ))}
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setVec2DA({ x: 4, y: 3 });
              setVec2DB({ x: 2, y: 5 });
            }}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Coordinates
          </Button>
        )}
      </div>

      {/* Main Metric KPI Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Cosine Similarity */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cosine Similarity
            </span>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
              cos(θ)
            </Badge>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
            {mode === "2d" ? metrics2D.cosSim : metricsHighD.cosSim ?? "--"}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block font-mono">
            {mode === "2d"
              ? `Angle θ: ${metrics2D.angleDeg}°`
              : `${metricsHighD.dimensions || 0} Dimensions`}
          </span>
        </Card>

        {/* Cosine Distance */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cosine Distance
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">1 - cos(θ)</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
            {mode === "2d" ? metrics2D.cosDist : metricsHighD.cosDist ?? "--"}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Used in Vector DBs
          </span>
        </Card>

        {/* Euclidean Distance (L2) */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Euclidean (L2)
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">||A - B||</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
            {mode === "2d" ? metrics2D.euclid : metricsHighD.euclid ?? "--"}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Straight-line distance
          </span>
        </Card>

        {/* Dot Product */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dot Product
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">A · B</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
            {mode === "2d" ? metrics2D.dot : metricsHighD.dot ?? "--"}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Magnitude weighted
          </span>
        </Card>
      </div>

      {/* Main Workspace based on Mode */}
      {mode === "2d" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 2D Interactive Coordinate Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" /> Vector Coordinate Sliders
              </span>

              {/* Vector A Controls */}
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Vector A
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    ({vec2DA.x}, {vec2DA.y}) | Mag: {metrics2D.magA}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">X: {vec2DA.x}</label>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={vec2DA.x}
                      onChange={(e) => setVec2DA({ ...vec2DA, x: Number(e.target.value) })}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Y: {vec2DA.y}</label>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={vec2DA.y}
                      onChange={(e) => setVec2DA({ ...vec2DA, y: Number(e.target.value) })}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vector B Controls */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vector B
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    ({vec2DB.x}, {vec2DB.y}) | Mag: {metrics2D.magB}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">X: {vec2DB.x}</label>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={vec2DB.x}
                      onChange={(e) => setVec2DB({ ...vec2DB, x: Number(e.target.value) })}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Y: {vec2DB.y}</label>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={vec2DB.y}
                      onChange={(e) => setVec2DB({ ...vec2DB, y: Number(e.target.value) })}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: SVG 2D Coordinate Plane Visualization (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl border border-border/80 bg-card shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Cartesian Coordinate Plane (Origin at 0,0)
            </span>

            <svg
              width={planeSize}
              height={planeSize}
              className="bg-muted/20 rounded-xl border border-border shadow-inner"
            >
              {/* Grid Lines */}
              {[-4, -2, 2, 4].map((val) => (
                <g key={val}>
                  <line
                    x1={toSvgX(val)}
                    y1={10}
                    x2={toSvgX(val)}
                    y2={planeSize - 10}
                    stroke="currentColor"
                    className="text-border/40"
                    strokeDasharray="2,2"
                  />
                  <line
                    x1={10}
                    y1={toSvgY(val)}
                    x2={planeSize - 10}
                    y2={toSvgY(val)}
                    stroke="currentColor"
                    className="text-border/40"
                    strokeDasharray="2,2"
                  />
                </g>
              ))}

              {/* Main Axes */}
              <line
                x1={10}
                y1={planeSize / 2}
                x2={planeSize - 10}
                y2={planeSize / 2}
                stroke="currentColor"
                className="text-border"
                strokeWidth={1.5}
              />
              <line
                x1={planeSize / 2}
                y1={10}
                x2={planeSize / 2}
                y2={planeSize - 10}
                stroke="currentColor"
                className="text-border"
                strokeWidth={1.5}
              />

              {/* Vector A Line (Indigo) */}
              <line
                x1={toSvgX(0)}
                y1={toSvgY(0)}
                x2={toSvgX(vec2DA.x)}
                y2={toSvgY(vec2DA.y)}
                stroke="#6366f1"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle
                cx={toSvgX(vec2DA.x)}
                cy={toSvgY(vec2DA.y)}
                r={6}
                fill="#6366f1"
                className="cursor-pointer"
              />

              {/* Vector B Line (Emerald) */}
              <line
                x1={toSvgX(0)}
                y1={toSvgY(0)}
                x2={toSvgX(vec2DB.x)}
                y2={toSvgY(vec2DB.y)}
                stroke="#10b981"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle
                cx={toSvgX(vec2DB.x)}
                cy={toSvgY(vec2DB.y)}
                r={6}
                fill="#10b981"
                className="cursor-pointer"
              />

              {/* Distance Line between endpoints (dashed) */}
              <line
                x1={toSvgX(vec2DA.x)}
                y1={toSvgY(vec2DA.y)}
                x2={toSvgX(vec2DB.x)}
                y2={toSvgY(vec2DB.y)}
                stroke="currentColor"
                className="text-muted-foreground/60"
                strokeWidth={1.5}
                strokeDasharray="4,4"
              />
            </svg>

            <div className="flex items-center gap-6 mt-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Vector A ({vec2DA.x}, {vec2DA.y})
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vector B ({vec2DB.x}, {vec2DB.y})
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* High-D Embedding Comparison Mode */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vector A Input */}
            <div className="flex flex-col rounded-2xl border border-indigo-500/30 bg-card overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-indigo-500/5 border-b border-indigo-500/20 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Vector A (Embedding Array)
                </span>
                <CopyButton value={highDInputA} />
              </div>
              <div className="p-3">
                <Textarea
                  value={highDInputA}
                  onChange={(e) => setHighDInputA(e.target.value)}
                  placeholder="Paste JSON array: [0.12, 0.45, -0.67, ...]"
                  rows={4}
                  className="font-mono text-xs resize-y"
                />
              </div>
            </div>

            {/* Vector B Input */}
            <div className="flex flex-col rounded-2xl border border-emerald-500/30 bg-card overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-emerald-500/5 border-b border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Vector B (Embedding Array)
                </span>
                <CopyButton value={highDInputB} />
              </div>
              <div className="p-3">
                <Textarea
                  value={highDInputB}
                  onChange={(e) => setHighDInputB(e.target.value)}
                  placeholder="Paste JSON array: [0.11, 0.43, -0.62, ...]"
                  rows={4}
                  className="font-mono text-xs resize-y"
                />
              </div>
            </div>
          </div>

          {metricsHighD.error ? (
            <Card className="p-4 border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs font-mono">
              {metricsHighD.error}
            </Card>
          ) : null}

          {/* Database Query Snippet Generator */}
          <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
                <Button
                  type="button"
                  variant={queryCodeFormat === "pgvector" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setQueryCodeFormat("pgvector")}
                  className="h-7 px-2.5 text-xs"
                >
                  PostgreSQL (pgvector)
                </Button>
                <Button
                  type="button"
                  variant={queryCodeFormat === "pinecone" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setQueryCodeFormat("pinecone")}
                  className="h-7 px-2.5 text-xs"
                >
                  Pinecone SDK
                </Button>
              </div>

              <CopyButton value={dbQuery} text="Copy Query" />
            </div>

            <div className="p-4 bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre overflow-x-auto">
              {dbQuery}
            </div>
          </Card>
        </div>
      )}
    </ToolWorkspace>
  );
}
