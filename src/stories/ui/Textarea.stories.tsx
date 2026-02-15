import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "error", "success"],
    },
    autoResize: {
      control: "boolean",
    },
    showCount: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Enter text here...",
  },
};

export const WithCounter: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        showCount
        maxLength={120}
        placeholder="Max 120 characters..."
      />
    );
  },
};

export const AutoResize: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoResize
        placeholder="Auto resizing textarea..."
      />
    );
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    placeholder: "Error state",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Textarea size="sm" placeholder="Small" />
      <Textarea size="md" placeholder="Medium" />
      <Textarea size="lg" placeholder="Large" />
    </div>
  ),
};
