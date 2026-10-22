import type { Meta, StoryObj } from "@storybook/react";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Play, RotateCcw } from "lucide-react";

const meta: Meta<typeof ToolToolbar> = {
  title: "Tools/ToolToolbar",
  component: ToolToolbar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToolToolbar>;

export const Default: Story = {
  render: () => (
    <ToolToolbar>
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" className="gap-1.5">
          <Play className="w-3.5 h-3.5" />
          <span>Execute</span>
        </Button>
        <Button variant="secondary" size="sm" className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" size="sm">Ready</Badge>
        <CopyButton value="Sample Output" size="sm" variant="secondary" />
      </div>
    </ToolToolbar>
  ),
};
