"use client";

import React, { useState, useMemo } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw, Code2, Sparkles } from "lucide-react";

type Language = "go" | "rust" | "typescript" | "python" | "kotlin" | "java" | "csharp" | "swift";

const SAMPLE_JSON = `{
  "id": "usr_99182",
  "username": "alex_chen",
  "email": "alex.chen@example.com",
  "is_active": true,
  "age": 29,
  "role": "admin",
  "profile": {
    "avatar_url": "https://assets.example.com/avatar.png",
    "bio": "Senior Platform Engineer & Open Source Contributor",
    "followers_count": 1420
  },
  "tags": ["developer", "rust", "kubernetes"],
  "settings": {
    "dark_mode": true,
    "notifications_enabled": false
  }
}`;

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function generateCode(jsonStr: string, lang: Language, rootName: string): string {
  try {
    const data = JSON.parse(jsonStr);
    const rootPascal = toPascalCase(rootName || "Root");

    switch (lang) {
      case "go":
        return generateGo(data, rootPascal);
      case "rust":
        return generateRust(data, rootPascal);
      case "typescript":
        return generateTypeScript(data, rootPascal);
      case "python":
        return generatePython(data, rootPascal);
      case "kotlin":
        return generateKotlin(data, rootPascal);
      case "java":
        return generateJava(data, rootPascal);
      case "csharp":
        return generateCSharp(data, rootPascal);
      case "swift":
        return generateSwift(data, rootPascal);
      default:
        return "";
    }
  } catch (err: any) {
    return `// Invalid JSON: ${err.message}`;
  }
}

function generateGo(obj: any, name: string): string {
  const structs: string[] = [];

  function parse(o: any, structName: string): string {
    if (typeof o !== "object" || o === null) return "any";
    if (Array.isArray(o)) {
      if (o.length === 0) return "[]any";
      const elemType = typeof o[0] === "object" ? parse(o[0], structName + "Item") : getGoPrimitive(o[0]);
      return `[]${elemType}`;
    }

    const lines: string[] = [`type ${structName} struct {`];
    for (const [key, val] of Object.entries(o)) {
      const fieldName = toPascalCase(key);
      let fieldType = "any";
      if (val === null) fieldType = "*any";
      else if (Array.isArray(val)) {
        if (val.length === 0) fieldType = "[]any";
        else if (typeof val[0] === "object") {
          const subName = structName + toPascalCase(key) + "Item";
          fieldType = `[]${parse(val[0], subName)}`;
        } else {
          fieldType = `[]${getGoPrimitive(val[0])}`;
        }
      } else if (typeof val === "object") {
        const subName = structName + toPascalCase(key);
        fieldType = parse(val, subName);
      } else {
        fieldType = getGoPrimitive(val);
      }
      lines.push(`\t${fieldName} ${fieldType} \`json:"${key}"\``);
    }
    lines.push("}");
    structs.push(lines.join("\n"));
    return structName;
  }

  function getGoPrimitive(v: any): string {
    if (typeof v === "string") return "string";
    if (typeof v === "number") return Number.isInteger(v) ? "int64" : "float64";
    if (typeof v === "boolean") return "bool";
    return "any";
  }

  parse(obj, name);
  return `package main\n\n${structs.reverse().join("\n\n")}`;
}

function generateRust(obj: any, name: string): string {
  const structs: string[] = [];

  function parse(o: any, structName: string): string {
    if (typeof o !== "object" || o === null) return "serde_json::Value";
    if (Array.isArray(o)) {
      if (o.length === 0) return "Vec<serde_json::Value>";
      const elem = typeof o[0] === "object" ? parse(o[0], structName + "Item") : getRustPrimitive(o[0]);
      return `Vec<${elem}>`;
    }

    const lines = [
      `#[derive(Debug, Clone, Serialize, Deserialize)]`,
      `pub struct ${structName} {`,
    ];
    for (const [key, val] of Object.entries(o)) {
      const fieldName = toSnakeCase(key);
      let fieldType = "serde_json::Value";
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object") {
          fieldType = `Vec<${parse(val[0], structName + toPascalCase(key) + "Item")}>`;
        } else if (val.length > 0) {
          fieldType = `Vec<${getRustPrimitive(val[0])}>`;
        }
      } else if (typeof val === "object" && val !== null) {
        fieldType = parse(val, structName + toPascalCase(key));
      } else {
        fieldType = getRustPrimitive(val);
      }
      if (fieldName !== key) {
        lines.push(`    #[serde(rename = "${key}")]`);
      }
      lines.push(`    pub ${fieldName}: ${fieldType},`);
    }
    lines.push("}");
    structs.push(lines.join("\n"));
    return structName;
  }

  function getRustPrimitive(v: any): string {
    if (typeof v === "string") return "String";
    if (typeof v === "number") return Number.isInteger(v) ? "i64" : "f64";
    if (typeof v === "boolean") return "bool";
    return "serde_json::Value";
  }

  parse(obj, name);
  return `use serde::{Serialize, Deserialize};\n\n${structs.reverse().join("\n\n")}`;
}

function generateTypeScript(obj: any, name: string): string {
  const interfaces: string[] = [];

  function parse(o: any, structName: string): string {
    if (typeof o !== "object" || o === null) return "unknown";
    if (Array.isArray(o)) {
      if (o.length === 0) return "unknown[]";
      const elem = typeof o[0] === "object" ? parse(o[0], structName + "Item") : typeof o[0];
      return `${elem}[]`;
    }

    const lines = [`export interface ${structName} {`];
    for (const [key, val] of Object.entries(o)) {
      let fieldType = "unknown";
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object") {
          fieldType = `${parse(val[0], structName + toPascalCase(key) + "Item")}[]`;
        } else if (val.length > 0) {
          fieldType = `${typeof val[0]}[]`;
        } else {
          fieldType = "unknown[]";
        }
      } else if (typeof val === "object" && val !== null) {
        fieldType = parse(val, structName + toPascalCase(key));
      } else if (val === null) {
        fieldType = "null";
      } else {
        fieldType = typeof val;
      }
      lines.push(`  ${key}: ${fieldType};`);
    }
    lines.push("}");
    interfaces.push(lines.join("\n"));
    return structName;
  }

  parse(obj, name);
  return interfaces.reverse().join("\n\n");
}

function generatePython(obj: any, name: string): string {
  const models: string[] = [];

  function parse(o: any, modelName: string): string {
    if (typeof o !== "object" || o === null) return "Any";
    const lines = [`class ${modelName}(BaseModel):`];
    for (const [key, val] of Object.entries(o)) {
      let fieldType = "Any";
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object") {
          fieldType = `List[${parse(val[0], modelName + toPascalCase(key) + "Item")}]`;
        } else if (val.length > 0) {
          fieldType = `List[${getPyPrimitive(val[0])}]`;
        } else {
          fieldType = "List[Any]";
        }
      } else if (typeof val === "object" && val !== null) {
        fieldType = parse(val, modelName + toPascalCase(key));
      } else {
        fieldType = getPyPrimitive(val);
      }
      const snake = toSnakeCase(key);
      if (snake !== key) {
        lines.push(`    ${snake}: ${fieldType} = Field(alias="${key}")`);
      } else {
        lines.push(`    ${snake}: ${fieldType}`);
      }
    }
    models.push(lines.join("\n"));
    return modelName;
  }

  function getPyPrimitive(v: any): string {
    if (typeof v === "string") return "str";
    if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";
    if (typeof v === "boolean") return "bool";
    return "Any";
  }

  parse(obj, name);
  return `from pydantic import BaseModel, Field\nfrom typing import List, Optional, Any\n\n${models.reverse().join("\n\n")}`;
}

function generateKotlin(obj: any, name: string): string {
  const classes: string[] = [];

  function parse(o: any, className: string): string {
    const lines = [`@Serializable\ndata class ${className}(`];
    for (const [key, val] of Object.entries(o)) {
      let fieldType = "Any";
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object") {
          fieldType = `List<${parse(val[0], className + toPascalCase(key) + "Item")}>`;
        } else if (val.length > 0) {
          fieldType = `List<${getKotlinPrimitive(val[0])}>`;
        }
      } else if (typeof val === "object" && val !== null) {
        fieldType = parse(val, className + toPascalCase(key));
      } else {
        fieldType = getKotlinPrimitive(val);
      }
      lines.push(`    @SerialName("${key}") val ${toCamelCase(key)}: ${fieldType},`);
    }
    lines.push(")");
    classes.push(lines.join("\n"));
    return className;
  }

  function getKotlinPrimitive(v: any): string {
    if (typeof v === "string") return "String";
    if (typeof v === "number") return Number.isInteger(v) ? "Long" : "Double";
    if (typeof v === "boolean") return "Boolean";
    return "Any";
  }

  parse(obj, name);
  return `import kotlinx.serialization.Serializable\nimport kotlinx.serialization.SerialName\n\n${classes.reverse().join("\n\n")}`;
}

function generateJava(obj: any, name: string): string {
  const classes: string[] = [];

  function parse(o: any, className: string): string {
    const lines = [`public class ${className} {`];
    for (const [key, val] of Object.entries(o)) {
      let fieldType = "Object";
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object") {
          fieldType = `List<${parse(val[0], className + toPascalCase(key) + "Item")}>`;
        } else if (val.length > 0) {
          fieldType = `List<${getJavaPrimitive(val[0])}>`;
        }
      } else if (typeof val === "object" && val !== null) {
        fieldType = parse(val, className + toPascalCase(key));
      } else {
        fieldType = getJavaPrimitive(val);
      }
      lines.push(`    @JsonProperty("${key}")\n    private ${fieldType} ${toCamelCase(key)};\n`);
    }
    lines.push("}");
    classes.push(lines.join("\n"));
    return className;
  }

  function getJavaPrimitive(v: any): string {
    if (typeof v === "string") return "String";
    if (typeof v === "number") return Number.isInteger(v) ? "Long" : "Double";
    if (typeof v === "boolean") return "Boolean";
    return "Object";
  }

  parse(obj, name);
  return `import com.fasterxml.jackson.annotation.JsonProperty;\nimport java.util.List;\n\n${classes.reverse().join("\n\n")}`;
}

function generateCSharp(obj: any, name: string): string {
  const classes: string[] = [];

  function parse(o: any, className: string): string {
    const lines = [`public class ${className}\n{`];
    for (const [key, val] of Object.entries(o)) {
      let fieldType = "object";
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object") {
          fieldType = `List<${parse(val[0], className + toPascalCase(key) + "Item")}>`;
        } else if (val.length > 0) {
          fieldType = `List<${getCSharpPrimitive(val[0])}>`;
        }
      } else if (typeof val === "object" && val !== null) {
        fieldType = parse(val, className + toPascalCase(key));
      } else {
        fieldType = getCSharpPrimitive(val);
      }
      lines.push(`    [JsonPropertyName("${key}")]\n    public ${fieldType} ${toPascalCase(key)} { get; set; }\n`);
    }
    lines.push("}");
    classes.push(lines.join("\n"));
    return className;
  }

  function getCSharpPrimitive(v: any): string {
    if (typeof v === "string") return "string";
    if (typeof v === "number") return Number.isInteger(v) ? "long" : "double";
    if (typeof v === "boolean") return "bool";
    return "object";
  }

  parse(obj, name);
  return `using System.Text.Json.Serialization;\nusing System.Collections.Generic;\n\n${classes.reverse().join("\n\n")}`;
}

function generateSwift(obj: any, name: string): string {
  const structs: string[] = [];

  function parse(o: any, structName: string): string {
    const lines = [`struct ${structName}: Codable {`];
    const codingKeys: string[] = [];

    for (const [key, val] of Object.entries(o)) {
      let fieldType = "Any";
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object") {
          fieldType = `[${parse(val[0], structName + toPascalCase(key) + "Item")}]`;
        } else if (val.length > 0) {
          fieldType = `[${getSwiftPrimitive(val[0])}]`;
        }
      } else if (typeof val === "object" && val !== null) {
        fieldType = parse(val, structName + toPascalCase(key));
      } else {
        fieldType = getSwiftPrimitive(val);
      }
      const prop = toCamelCase(key);
      lines.push(`    let ${prop}: ${fieldType}`);
      if (prop !== key) {
        codingKeys.push(`        case ${prop} = "${key}"`);
      }
    }

    if (codingKeys.length > 0) {
      lines.push(`\n    enum CodingKeys: String, CodingKey {`);
      lines.push(codingKeys.join("\n"));
      lines.push(`    }`);
    }

    lines.push("}");
    structs.push(lines.join("\n"));
    return structName;
  }

  function getSwiftPrimitive(v: any): string {
    if (typeof v === "string") return "String";
    if (typeof v === "number") return Number.isInteger(v) ? "Int" : "Double";
    if (typeof v === "boolean") return "Bool";
    return "String";
  }

  parse(obj, name);
  return structs.reverse().join("\n\n");
}

export function JsonToStructTool() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [language, setLanguage] = useState<Language>("go");
  const [rootName, setRootName] = useState("UserResponse");
  const [copied, setCopied] = useState(false);

  const outputCode = useMemo(() => {
    return generateCode(input, language, rootName);
  }, [input, language, rootName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="h-8 px-2.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value="go">Go Struct</option>
                <option value="rust">Rust (Serde)</option>
                <option value="typescript">TypeScript Interface</option>
                <option value="python">Python (Pydantic v2)</option>
                <option value="kotlin">Kotlin (Kotlinx Serialization)</option>
                <option value="java">Java (Jackson POJO)</option>
                <option value="csharp">C# (.NET Record)</option>
                <option value="swift">Swift (Codable)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Root Name:</span>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold w-36"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setInput(SAMPLE_JSON);
                setRootName("UserResponse");
              }}
              className="h-8 gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Sample
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </Button>
          </div>
        </ToolToolbar>

        <ToolSplitPane
          inputHeader={
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              JSON PAYLOAD
            </span>
          }
          outputHeader={
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              {language.toUpperCase()} CODE
            </span>
          }
          input={
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-2">
              <CodeEditor
                value={input}
                onChange={(v) => setInput(v || "")}
                language="json"
                minHeight="420px"
              />
            </div>
          }
          output={
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-2">
              <CodeEditor
                value={outputCode}
                editable={false}
                language={
                  language === "typescript"
                    ? "typescript"
                    : language === "python"
                    ? "python"
                    : "javascript"
                }
                minHeight="420px"
              />
            </div>
          }
        />
      </div>
    </ToolWorkspace>
  );
}
