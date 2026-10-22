import type { Meta, StoryObj } from "@storybook/react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Card } from "@/components/ui/card";

const meta: Meta<typeof ToolWorkspace> = {
  title: "Tools/ToolWorkspace",
  component: ToolWorkspace,
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["default", "wide", "compact", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToolWorkspace>;

export const Default: Story = {
  args: {
    maxWidth: "default",
    children: (
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-2">Tool Workspace Container</h3>
        <p className="text-sm text-[rgb(var(--muted))]">
          Standard centered workspace container with responsive padding and max-width.
        </p>
      </Card>
    ),
  },
};

export const Wide: Story = {
  args: {
    maxWidth: "wide",
    children: (
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-2">Wide Workspace Container</h3>
        <p className="text-sm text-[rgb(var(--muted))]">
          Used for split-pane code editors, diff checkers, and visual canvas tools.
        </p>
      </Card>
    ),
  },
};
