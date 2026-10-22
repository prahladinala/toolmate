import type { Meta, StoryObj } from "@storybook/react";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const meta: Meta<typeof ToolSplitPane> = {
  title: "Tools/ToolSplitPane",
  component: ToolSplitPane,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToolSplitPane>;

export const Default: Story = {
  render: () => (
    <ToolSplitPane
      hasOutput={true}
      input={
        <Card className="p-4 space-y-2">
          <div className="font-semibold text-sm">Input Panel</div>
          <Textarea
            placeholder="Paste your code or data here..."
            className="min-h-[200px]"
            defaultValue={'{\n  "message": "Hello ToolMate"\n}'}
          />
        </Card>
      }
      output={
        <Card className="p-4 space-y-2">
          <div className="font-semibold text-sm">Output Panel</div>
          <div className="p-3 bg-[rgb(var(--card-2))] rounded-lg font-mono text-xs min-h-[200px] border border-[rgb(var(--border))]">
            Processed output will appear here...
          </div>
        </Card>
      }
    />
  ),
};
