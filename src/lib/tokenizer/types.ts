export type Token = {
  index: number;
  id: number;
  text: string;
  bytes: number[];
  hex: string;
  colorIndex: number;
};

export type ModelId =
  | "gpt-4o"
  | "gpt-4"
  | "claude-3-5"
  | "llama-3"
  | "deepseek-v3"
  | "gemini-1-5"
  | "gpt-3";

export type ModelInfo = {
  id: ModelId;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Meta" | "DeepSeek" | "Google";
  badge: string;
  encodingName: string;
  vocabSize: number;
  contextWindow: number;
  costPer1MInput: number;
  costPer1MOutput: number;
  description: string;
  accentColor: string;
};

export type TokenizeResult = {
  tokens: Token[];
  totalTokens: number;
  totalCharacters: number;
  totalWords: number;
  charsPerToken: number;
  estimatedCostInput: number;
  estimatedCostOutput: number;
};

export type ComparisonResult = {
  modelA: ModelInfo;
  modelB: ModelInfo;
  resultA: TokenizeResult;
  resultB: TokenizeResult;
  tokenDifference: number; // resultA.totalTokens - resultB.totalTokens
  percentDifference: number; // ((tokensB - tokensA) / tokensB) * 100
  winnerId: ModelId | "tie";
  costDifferencePer1M: number;
};
