"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Plus, Trash2, Copy, Check, Download, RefreshCw } from "lucide-react";
import { faker } from "@faker-js/faker";
import { toast } from "sonner";

const FIELD_TYPES = [
  "UUID", "First Name", "Last Name", "Full Name", "Email",
  "Phone", "Date", "Address", "City", "Country",
  "Job Title", "Company", "Word", "Sentence", "Paragraph", "Avatar"
];

export default function MockDataGenerator() {
  const [fields, setFields] = useState([
    { name: "id", type: "UUID" },
    { name: "name", type: "Full Name" },
    { name: "email", type: "Email" },
    { name: "company", type: "Company" },
    { name: "createdAt", type: "Date" },
  ]);
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"JSON" | "CSV" | "SQL">("JSON");
  const [tableName, setTableName] = useState("users");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generateData = useCallback(() => {
    faker.seed(Math.floor(Math.random() * 100000));
    const data: Record<string, any>[] = [];

    for (let i = 0; i < count; i++) {
      const row: Record<string, any> = {};
      fields.forEach((f) => {
        if (!f.name) return;
        let val: any = "";
        switch (f.type) {
          case "UUID":
            val = faker.string.uuid();
            break;
          case "First Name":
            val = faker.person.firstName();
            break;
          case "Last Name":
            val = faker.person.lastName();
            break;
          case "Full Name":
            val = faker.person.fullName();
            break;
          case "Email":
            val = faker.internet.email();
            break;
          case "Phone":
            val = faker.phone.number();
            break;
          case "Date":
            val = faker.date.past().toISOString();
            break;
          case "Address":
            val = faker.location.streetAddress();
            break;
          case "City":
            val = faker.location.city();
            break;
          case "Country":
            val = faker.location.country();
            break;
          case "Job Title":
            val = faker.person.jobTitle();
            break;
          case "Company":
            val = faker.company.name();
            break;
          case "Word":
            val = faker.word.sample();
            break;
          case "Sentence":
            val = faker.lorem.sentence();
            break;
          case "Paragraph":
            val = faker.lorem.paragraph();
            break;
          case "Avatar":
            val = faker.image.avatar();
            break;
          default:
            val = "";
        }
        row[f.name] = val;
      });
      data.push(row);
    }

    if (format === "JSON") {
      setOutput(JSON.stringify(data, null, 2));
    } else if (format === "CSV") {
      const headers = fields.map((f) => f.name).join(",");
      const rows = data.map((r) =>
        fields
          .map((f) => {
            const val = r[f.name];
            return typeof val === "string" && val.includes(",") ? `"${val}"` : val;
          })
          .join(",")
      );
      setOutput([headers, ...rows].join("\n"));
    } else if (format === "SQL") {
      const colNames = fields.map((f) => f.name).join(", ");
      const queries = data.map((r) => {
        const values = fields.map((f) => `'${String(r[f.name]).replace(/'/g, "''")}'`).join(", ");
        return `INSERT INTO ${tableName} (${colNames}) VALUES (${values});`;
      });
      setOutput(queries.join("\n"));
    }
  }, [fields, count, format, tableName]);

  useEffect(() => {
    generateData();
  }, [generateData]);

  const addField = () => {
    setFields([...fields, { name: `field_${fields.length + 1}`, type: "Word" }]);
  };

  const removeField = (idx: number) => {
    if (fields.length <= 1) return;
    setFields(fields.filter((_, i) => i !== idx));
  };

  const updateField = (idx: number, key: "name" | "type", val: string) => {
    const updated = [...fields];
    updated[idx][key] = val;
    setFields(updated);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Mock dataset copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    if (!output) return;
    const ext = format === "JSON" ? "json" : format === "CSV" ? "csv" : "sql";
    const mime =
      format === "JSON" ? "application/json" : format === "CSV" ? "text/csv" : "text/plain";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock_data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded mock_data.${ext}!`);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["JSON", "CSV", "SQL"] as const).map((fmt) => (
            <Button
              key={fmt}
              type="button"
              size="sm"
              variant={format === fmt ? "primary" : "secondary"}
              onClick={() => setFormat(fmt)}
              className="text-xs h-8"
            >
              {fmt}
            </Button>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
              Rows:
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className="w-16 h-8 text-xs bg-[rgb(var(--card-2))]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={generateData}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Regenerate
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyToClipboard}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={downloadFile}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download
          </Button>
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Schema Configuration */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgb(var(--border))]">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Schema Fields ({fields.length})
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={addField}
              className="text-xs h-7 px-2"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Field
            </Button>
          </div>

          {format === "SQL" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Target Table Name
              </label>
              <Input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="text-xs font-mono h-8 bg-[rgb(var(--card-2))]"
              />
            </div>
          )}

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-refined pr-1">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center gap-2"
              >
                <Input
                  value={field.name}
                  onChange={(e) => updateField(idx, "name", e.target.value)}
                  placeholder="field_name"
                  className="flex-1 h-8 text-xs font-mono bg-[rgb(var(--card))]"
                />
                <Select
                  value={field.type}
                  onChange={(e) => updateField(idx, "type", e.target.value)}
                  className="w-36 h-8 text-xs bg-[rgb(var(--card))]"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
                <button
                  type="button"
                  onClick={() => removeField(idx)}
                  disabled={fields.length <= 1}
                  className="p-1 text-[rgb(var(--muted))] hover:text-red-500 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Output Viewer */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Generated {format} Mock Data
          </span>
          <CodeEditor
            value={output}
            language={format === "JSON" ? "json" : format === "SQL" ? "sql" : "plaintext"}
            editable={false}
            minHeight="min-h-[350px] sm:min-h-[480px]"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
