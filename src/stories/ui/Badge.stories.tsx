import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "accent",
        "success",
        "warning",
        "destructive",
        "outline",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    removable: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Developer",
  },
};

export const Accent: Story = {
  args: {
    children: "Accent",
    variant: "accent",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const Destructive: Story = {
  args: {
    children: "Danger",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Removable: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return <div>Removed</div>;

    return (
      <Badge variant="accent" removable onRemove={() => setVisible(false)}>
        Removable Badge
      </Badge>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  ),
};
