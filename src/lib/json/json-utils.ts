import * as jsonc from "jsonc-parser";

/**
 * Robustly parses a JSON string, with automatic fallback for JSONC (comments and trailing commas)
 * and common relaxed formatting mistakes.
 */
export function parseRobustJSON(input: string): any {
  if (!input || !input.trim()) return null;

  // 1. Standard fast JSON.parse
  try {
    return JSON.parse(input);
  } catch (err: any) {
    // 2. Try jsonc-parser (handles inline/block comments and trailing commas)
    const errors: jsonc.ParseError[] = [];
    const parsed = jsonc.parse(input, errors, { allowTrailingComma: true });
    if (errors.length === 0 && parsed !== undefined) {
      return parsed;
    }

    // 3. Fallback: sanitize trailing commas and single quotes
    try {
      const sanitized = input
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "$1") // strip comments
        .replace(/,\s*([\]}])/g, "$1") // remove trailing commas before } or ]
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // ensure quoted keys
        .replace(/'/g, '"'); // single quotes to double quotes
      return JSON.parse(sanitized);
    } catch {
      // Throw original informative syntax error with exact character position
      throw err;
    }
  }
}

/**
 * Deeply sorts object keys alphabetically
 */
export function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}
