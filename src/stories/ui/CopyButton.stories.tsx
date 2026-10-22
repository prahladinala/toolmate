import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "@/components/ui/copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "UI/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    iconOnly: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: "npm install @toolmate/core",
    text: "Copy",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    value: "const greeting = 'Hello, ToolMate!';",
    text: "Copy Code",
    variant: "secondary",
    size: "sm",
  },
};

export const IconOnly: Story = {
  args: {
    value: "https://toolmate.co.in/tools/json-formatter",
    iconOnly: true,
    variant: "secondary",
    size: "sm",
  },
};
