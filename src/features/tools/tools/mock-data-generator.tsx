"use client";
import { Select } from "@/components/ui/select";


import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeEditor } from "@/components/ui/code-editor";
import { Plus, Trash2 } from "lucide-react";
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
    { name: "createdAt", type: "Date" }
  ]);
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"JSON" | "CSV" | "SQL">("JSON");
  const [tableName, setTableName] = useState("users");
  const [output, setOutput] = useState("");

  const generateData = () => {
    faker.seed(Math.random());
    const data = [];

    for (let i = 0; i < count; i++) {
      const row: Record<string, any> = {};
      fields.forEach(f => {
        if (!f.name) return;
        let val: any = "";
        switch (f.type) {
          case "UUID": val = faker.string.uuid(); break;
          case "First Name": val = faker.person.firstName(); break;
          case "Last Name": val = faker.person.lastName(); break;
          case "Full Name": val = faker.person.fullName(); break;
          case "Email": val = faker.internet.email(); break;
          case "Phone": val = faker.phone.number(); break;
          case "Date": val = faker.date.past().toISOString(); break;
          case "Address": val = faker.location.streetAddress(); break;
          case "City": val = faker.location.city(); break;
          case "Country": val = faker.location.country(); break;
          case "Job Title": val = faker.person.jobTitle(); break;
          case "Company": val = faker.company.name(); break;
          case "Word": val = faker.word.sample(); break;
          case "Sentence": val = faker.lorem.sentence(); break;
          case "Paragraph": val = faker.lorem.paragraph(); break;
          case "Avatar": val = faker.image.avatar(); break;
          default: val = "";
        }
        row[f.name] = val;
      });
      data.push(row);
    }

    if (format === "JSON") {
      setOutput(JSON.stringify(data, null, 2));
    } else if (format === "CSV") {
      const headers = fields.map(f => f.name).filter(Boolean);
      const csvRows = [headers.join(",")];
      data.forEach(row => {
        const values = headers.map(h => {
          const v = row[h];
          if (typeof v === "string" && (v.includes(",") || v.includes('"') || v.includes("\n"))) {
            return `"${v.replace(/"/g, '""')}"`;
          }
          return v;
        });
        csvRows.push(values.join(","));
      });
      setOutput(csvRows.join("\n"));
    } else if (format === "SQL") {
      const headers = fields.map(f => f.name).filter(Boolean);
      const sqlRows = data.map(row => {
        const values = headers.map(h => {
          const v = row[h];
          if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`;
          return v;
        });
        return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES (${values.join(", ")});`;
      });
      setOutput(sqlRows.join("\n"));
    }
  };

  useEffect(() => {
    generateData();
  }, [fields, count, format, tableName]);

  return (
    <main className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Schema Editor */}
        <Card className="p-6 space-y-6 shadow-sm border border-[rgba(var(--fg),0.1)] flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="font-semibold text-lg">Schema Definition</h2>
            <Button size="sm" variant="secondary" onClick={() => setFields([...fields, { name: "", type: "Word" }])}>
              <Plus className="w-4 h-4 mr-2" /> Add Field
            </Button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {fields.map((f, i) => (
              <div key={i} className="flex gap-3 items-center group">
                <Input 
                  placeholder="Field Name" 
                  value={f.name} 
                  onChange={e => {
                    const newFields = [...fields];
                    newFields[i].name = e.target.value;
                    setFields(newFields);
                  }}
                  className="font-mono flex-1"
                />
                <Select 
                  value={f.type}
                  onChange={e => {
                    const newFields = [...fields];
                    newFields[i].type = e.target.value;
                    setFields(newFields);
                  }}
                  className="p-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none w-40 flex-shrink-0"
                >
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
                <Button 
                  size="sm" aria-label="Action" 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    const newFields = [...fields];
                    newFields.splice(i, 1);
                    setFields(newFields);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rows to Generate</Label>
                <Input type="number" min="1" max="1000" value={count} onChange={e => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))} />
              </div>
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select 
                  value={format}
                  onChange={e => setFormat(e.target.value as any)}
                  className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none h-10"
                >
                  <option value="JSON">JSON</option>
                  <option value="CSV">CSV</option>
                  <option value="SQL">SQL Insert</option>
                </Select>
              </div>
            </div>
            {format === "SQL" && (
              <div className="space-y-2">
                <Label>SQL Table Name</Label>
                <Input value={tableName} onChange={e => setTableName(e.target.value)} />
              </div>
            )}
            <Button className="w-full" size="lg" onClick={generateData}>Generate Data</Button>
          </div>
        </Card>

        {/* Output */}
        <Card className="p-4 space-y-4 shadow-sm border border-[rgba(var(--fg),0.1)] h-full flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b">
            <h2 className="font-semibold text-lg">Output ({count} records)</h2>
            <Button size="sm" onClick={() => navigator.clipboard.writeText(output)}>Copy</Button>
          </div>
          <CodeEditor 
            value={output} 
            editable={false} 
            language={format === "JSON" ? "json" : format === "SQL" ? "sql" : "text"} 
            className="flex-1 !min-h-[500px]"
          />
        </Card>
      </div>
    </main>
  );
}
