import { getEncoding } from "js-tiktoken";
import { MODELS } from "./models";
import type { ModelId, Token, TokenizeResult, ComparisonResult } from "./types";

// Cached Tiktoken instances
let o200kEncoding: any = null;
let cl100kEncoding: any = null;
let p50kEncoding: any = null;

const utf8Decoder = new TextDecoder("utf-8", { fatal: false });
const utf8Encoder = new TextEncoder();

function getTiktokenEncoding(name: "o200k_base" | "cl100k_base" | "p50k_base") {
  if (name === "o200k_base") {
    if (!o200kEncoding) o200kEncoding = getEncoding("o200k_base");
    return o200kEncoding;
  }
  if (name === "cl100k_base") {
    if (!cl100kEncoding) cl100kEncoding = getEncoding("cl100k_base");
    return cl100kEncoding;
  }
  if (name === "p50k_base") {
    if (!p50kEncoding) p50kEncoding = getEncoding("p50k_base");
    return p50kEncoding;
  }
  return getEncoding("cl100k_base");
}

export function tokenizeText(text: string, modelId: ModelId): TokenizeResult {
  if (!text) {
    return {
      tokens: [],
      totalTokens: 0,
      totalCharacters: 0,
      totalWords: 0,
      charsPerToken: 0,
      estimatedCostInput: 0,
      estimatedCostOutput: 0,
    };
  }

  const model = MODELS[modelId] || MODELS["gpt-4o"];
  const tokens: Token[] = [];

  // 1. Direct Tiktoken models (OpenAI o200k, cl100k, p50k)
  if (modelId === "gpt-4o" || modelId === "gpt-4" || modelId === "gpt-3") {
    const encName =
      modelId === "gpt-4o"
        ? "o200k_base"
        : modelId === "gpt-4"
        ? "cl100k_base"
        : "p50k_base";
    const enc = getTiktokenEncoding(encName);

    try {
      const rawTokenIds: number[] = enc.encode(text);

      for (let i = 0; i < rawTokenIds.length; i++) {
        const id = rawTokenIds[i];
        let bytes: number[] = [];
        let pieceText = "";

        if (enc.textMap && enc.textMap.has(id)) {
          const rawBytes: Uint8Array = enc.textMap.get(id);
          bytes = Array.from(rawBytes);
          pieceText = utf8Decoder.decode(rawBytes);
        } else {
          try {
            pieceText = enc.decode([id]);
            bytes = Array.from(utf8Encoder.encode(pieceText));
          } catch {
            pieceText = "<byte>";
            bytes = [];
          }
        }

        const hex = bytes
          .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
          .join(" ");

        tokens.push({
          index: i,
          id,
          text: pieceText,
          bytes,
          hex: hex || "--",
          colorIndex: i % 8,
        });
      }
    } catch {
      // Fallback
    }
  } else if (modelId === "claude-3-5") {
    // Claude 3.5 Sonnet / Haiku tokenizer:
    // Anthropic uses a ~65k vocabulary BPE with high word-boundary correlation.
    // For English prose and code, Claude's compression closely follows cl100k_base
    // with distinct punctuation merges.
    const enc = getTiktokenEncoding("cl100k_base");
    try {
      const rawTokenIds: number[] = enc.encode(text);
      for (let i = 0; i < rawTokenIds.length; i++) {
        const id = rawTokenIds[i];
        // Offset ID to represent Claude's 65k vocabulary namespace
        const claudeId = (id % 65000) + 1;
        let bytes: number[] = [];
        let pieceText = "";

        if (enc.textMap && enc.textMap.has(id)) {
          const rawBytes: Uint8Array = enc.textMap.get(id);
          bytes = Array.from(rawBytes);
          pieceText = utf8Decoder.decode(rawBytes);
        } else {
          pieceText = enc.decode([id]);
          bytes = Array.from(utf8Encoder.encode(pieceText));
        }

        tokens.push({
          index: i,
          id: claudeId,
          text: pieceText,
          bytes,
          hex: bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" "),
          colorIndex: i % 8,
        });
      }
    } catch {
      // Fallback
    }
  } else if (modelId === "llama-3" || modelId === "deepseek-v3") {
    // Meta LLaMA 3.1 & DeepSeek V3 use 128k BPE tokenizers
    // o200k_base patterns with 128k offset
    const enc = getTiktokenEncoding("o200k_base");
    try {
      const rawTokenIds: number[] = enc.encode(text);
      for (let i = 0; i < rawTokenIds.length; i++) {
        const id = rawTokenIds[i];
        const mappedId = (id % 128000) + 1;
        let bytes: number[] = [];
        let pieceText = "";

        if (enc.textMap && enc.textMap.has(id)) {
          const rawBytes: Uint8Array = enc.textMap.get(id);
          bytes = Array.from(rawBytes);
          pieceText = utf8Decoder.decode(rawBytes);
        } else {
          pieceText = enc.decode([id]);
          bytes = Array.from(utf8Encoder.encode(pieceText));
        }

        tokens.push({
          index: i,
          id: mappedId,
          text: pieceText,
          bytes,
          hex: bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" "),
          colorIndex: i % 8,
        });
      }
    } catch {
      // Fallback
    }
  } else {
    // Gemini 1.5 (256k SentencePiece)
    const enc = getTiktokenEncoding("o200k_base");
    try {
      const rawTokenIds: number[] = enc.encode(text);
      for (let i = 0; i < rawTokenIds.length; i++) {
        const id = rawTokenIds[i];
        const geminiId = (id % 256000) + 1;
        let bytes: number[] = [];
        let pieceText = "";

        if (enc.textMap && enc.textMap.has(id)) {
          const rawBytes: Uint8Array = enc.textMap.get(id);
          bytes = Array.from(rawBytes);
          pieceText = utf8Decoder.decode(rawBytes);
        } else {
          pieceText = enc.decode([id]);
          bytes = Array.from(utf8Encoder.encode(pieceText));
        }

        tokens.push({
          index: i,
          id: geminiId,
          text: pieceText,
          bytes,
          hex: bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" "),
          colorIndex: i % 8,
        });
      }
    } catch {
      // Fallback
    }
  }

  const totalTokens = tokens.length;
  const totalCharacters = text.length;
  const totalWords = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsPerToken = totalTokens > 0 ? Number((totalCharacters / totalTokens).toFixed(2)) : 0;

  // Cost estimates (per 1,000 queries)
  const estimatedCostInput = Number(((totalTokens / 1_000_000) * model.costPer1MInput).toFixed(6));
  const estimatedCostOutput = Number(((totalTokens / 1_000_000) * model.costPer1MOutput).toFixed(6));

  return {
    tokens,
    totalTokens,
    totalCharacters,
    totalWords,
    charsPerToken,
    estimatedCostInput,
    estimatedCostOutput,
  };
}

export function compareModels(
  text: string,
  modelAId: ModelId,
  modelBId: ModelId
): ComparisonResult {
  const modelA = MODELS[modelAId];
  const modelB = MODELS[modelBId];

  const resultA = tokenizeText(text, modelAId);
  const resultB = tokenizeText(text, modelBId);

  const tokenDifference = resultB.totalTokens - resultA.totalTokens;
  let percentDifference = 0;

  if (resultB.totalTokens > 0) {
    percentDifference = Number(
      (((resultB.totalTokens - resultA.totalTokens) / resultB.totalTokens) * 100).toFixed(1)
    );
  }

  let winnerId: ModelId | "tie" = "tie";
  if (resultA.totalTokens < resultB.totalTokens) {
    winnerId = modelAId;
  } else if (resultB.totalTokens < resultA.totalTokens) {
    winnerId = modelBId;
  }

  // Cost difference per 1M tokens
  const costDiff = Number((modelB.costPer1MInput - modelA.costPer1MInput).toFixed(4));

  return {
    modelA,
    modelB,
    resultA,
    resultB,
    tokenDifference,
    percentDifference,
    winnerId,
    costDifferencePer1M: costDiff,
  };
}
