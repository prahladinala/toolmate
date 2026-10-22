import type { Meta, StoryObj } from "@storybook/react";
import { ConfigPresetsBar } from "@/components/tools/config-builder/ConfigPresetsBar";
import { useState } from "react";

const meta: Meta<typeof ConfigPresetsBar> = {
  title: "ConfigBuilder/ConfigPresetsBar",
  component: ConfigPresetsBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfigPresetsBar>;

const samplePresets = [
  {
    id: "recommended",
    name: "Recommended",
    description: "Standard industry configuration",
    optionIds: ["semi", "singleQuote", "trailingComma"],
  },
  {
    id: "strict",
    name: "Strict Enterprise",
    description: "Maximum safety rules",
    optionIds: ["semi", "singleQuote", "trailingComma", "strict"],
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Lightweight defaults",
    optionIds: ["semi"],
  },
];

export const Default: Story = {
  render: () => {
    const [activePreset, setActivePreset] = useState<string | null>("recommended");
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("All");

    return (
      <div className="max-w-2xl">
        <ConfigPresetsBar
          presets={samplePresets}
          activePresetId={activePreset}
          onSelectPreset={setActivePreset}
          onReset={() => setActivePreset(null)}
          searchQuery={search}
          onSearchChange={setSearch}
          categories={["All", "Formatting", "Quotes", "Spacing", "Plugins"]}
          selectedCategory={cat}
          onSelectCategory={setCat}
          selectedCount={8}
          totalCount={15}
        />
      </div>
    );
  },
};
