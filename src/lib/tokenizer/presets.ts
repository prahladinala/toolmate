export type PromptPreset = {
  id: string;
  title: string;
  description: string;
  category: "Multilingual" | "Code" | "Data" | "System";
  text: string;
};

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: "multilingual",
    title: "Multilingual Compression",
    description: "Compare English, Hindi, Japanese, Spanish, and Chinese to see GPT-4o's 60%+ efficiency boost.",
    category: "Multilingual",
    text: `Hello world! Welcome to ToolMate.
नमस्ते दुनिया! टूलमेट एक शानदार ऑनलाइन डेवलपर टूलकिट है।
こんにちは世界！ ToolMateは開発者向けの無料オンラインツールです。
¡Hola Mundo! ToolMate es una colección de herramientas gratuitas para desarrolladores.
你好世界！ToolMate 是一个快速、私密、运行在浏览器中的开发者工具集。`,
  },
  {
    id: "python-code",
    title: "Python Data Processing",
    description: "Inspect how indentation, decorators, and list comprehensions are broken into tokens.",
    category: "Code",
    text: `def calculate_metrics(data: list[dict], threshold: float = 0.85) -> dict:
    """Filter and calculate conversion metrics."""
    valid_entries = [item for item in data if item.get("confidence", 0) >= threshold]
    total_score = sum(entry["score"] for entry in valid_entries)
    average = total_score / len(valid_entries) if valid_entries else 0.0
    return {"count": len(valid_entries), "average": round(average, 4)}`,
  },
  {
    id: "json-payload",
    title: "JSON API Response",
    description: "Observe how whitespace, colons, quotation marks, and curly braces tokenize.",
    category: "Data",
    text: `{
  "status": "success",
  "data": {
    "userId": "usr_99812",
    "name": "Alex Mercer",
    "roles": ["admin", "developer"],
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }
}`,
  },
  {
    id: "reasoning-prompt",
    title: "LLM System Prompt",
    description: "A standard structured AI system prompt with instructions, constraints, and formatting rules.",
    category: "System",
    text: `You are an expert full-stack software engineer and cloud architect.
Always adhere to these guidelines:
1. Write clean, production-grade, and type-safe TypeScript.
2. Provide concise explanations and avoid redundant pleasantries.
3. Include error handling and performance optimizations.
Respond strictly in valid Markdown.`,
  },
];
