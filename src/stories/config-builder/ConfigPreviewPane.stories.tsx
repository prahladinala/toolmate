import type { Meta, StoryObj } from "@storybook/react";
import { ConfigPreviewPane } from "@/components/tools/config-builder/ConfigPreviewPane";
import { useState } from "react";
import type { OutputFormat } from "@/components/tools/config-builder/types";

const meta: Meta<typeof ConfigPreviewPane> = {
  title: "ConfigBuilder/ConfigPreviewPane",
  component: ConfigPreviewPane,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfigPreviewPane>;

const sampleFormats: OutputFormat[] = [
  {
    id: "json",
    label: ".prettierrc",
    filename: ".prettierrc",
    language: "json",
    content: "{\n  \"semi\": true,\n  \"singleQuote\": true,\n  \"tabWidth\": 2\n}",
  },
  {
    id: "js",
    label: ".prettierrc.js",
    filename: ".prettierrc.js",
    language: "javascript",
    content: "module.exports = {\n  semi: true,\n  singleQuote: true,\n  tabWidth: 2,\n};\n",
  },
];

export const Default: Story = {
  render: () => {
    const [format, setFormat] = useState("json");

    return (
      <div className="max-w-xl h-[480px]">
        <ConfigPreviewPane
          formats={sampleFormats}
          activeFormatId={format}
          onSelectFormat={setFormat}
          installPackages={["prettier", "prettier-plugin-tailwindcss"]}
          configTip="Place this configuration file in your project root."
        />
      </div>
    );
  },
};
