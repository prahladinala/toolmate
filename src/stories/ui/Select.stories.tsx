import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@/components/ui/select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
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
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-xs">
      <Select {...args}>
        <option value="json">JSON Formatter</option>
        <option value="base64">Base64 Encoder</option>
        <option value="uuid">UUID Generator</option>
        <option value="yaml">YAML Validator</option>
      </Select>
    </div>
  ),
  args: {
    size: "md",
    variant: "default",
  },
};

export const Small: Story = {
  render: (args) => (
    <div className="max-w-xs">
      <Select {...args}>
        <option value="2">2 spaces</option>
        <option value="4">4 spaces</option>
        <option value="tab">Tabs</option>
      </Select>
    </div>
  ),
  args: {
    size: "sm",
    variant: "default",
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <div className="max-w-xs">
      <Select {...args}>
        <option value="">Select an option...</option>
        <option value="opt1">Option 1</option>
      </Select>
    </div>
  ),
  args: {
    size: "md",
    variant: "error",
  },
};
