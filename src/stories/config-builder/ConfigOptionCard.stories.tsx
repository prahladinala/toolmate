import type { Meta, StoryObj } from "@storybook/react";
import { ConfigOptionCard } from "@/components/tools/config-builder/ConfigOptionCard";
import { useState } from "react";

const meta: Meta<typeof ConfigOptionCard> = {
  title: "ConfigBuilder/ConfigOptionCard",
  component: ConfigOptionCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfigOptionCard>;

const sampleOption = {
  id: "semi",
  name: "Semicolons",
  key: "semi: true",
  category: "Formatting",
  description: "Print semicolons at the ends of statements.",
  whyItHelps: "Prevents subtle Automatic Semicolon Insertion (ASI) runtime bugs when lines begin with parentheses or array brackets.",
  example: "const a = 1;\nconst b = 2;",
  defaultChecked: true,
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div className="max-w-xl">
        <ConfigOptionCard
          option={sampleOption}
          checked={checked}
          onToggle={(_, val) => setChecked(val)}
        />
      </div>
    );
  },
};

export const Unchecked: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="max-w-xl">
        <ConfigOptionCard
          option={{
            ...sampleOption,
            name: "Use Hard Tabs",
            key: "useTabs: true",
            category: "Spacing",
            description: "Indent lines with tabs instead of spaces.",
            whyItHelps: "Allows individual team members to customize their perceived indentation width in their own editor.",
          }}
          checked={checked}
          onToggle={(_, val) => setChecked(val)}
        />
      </div>
    );
  },
};
