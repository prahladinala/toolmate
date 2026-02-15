import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
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
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithStartIcon: Story = {
  render: () => (
    <Input placeholder="Search..." startIcon={<Search size={16} />} />
  ),
};

export const ErrorState: Story = {
  args: {
    placeholder: "Invalid input",
    variant: "error",
  },
};

export const SuccessState: Story = {
  args: {
    placeholder: "Valid input",
    variant: "success",
  },
};

export const LoadingState: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    return <Input placeholder="Loading..." loading={loading} />;
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};
