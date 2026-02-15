import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@/components/ui/card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outline", "ghost"],
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    hover: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <h3 className="text-lg font-semibold">Default Card</h3>
      <p className="mt-2 text-sm opacity-70">
        This is a standard card container.
      </p>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated">
      <h3 className="text-lg font-semibold">Elevated Card</h3>
      <p className="mt-2 text-sm opacity-70">Stronger shadow for hierarchy.</p>
    </Card>
  ),
};

export const Outline: Story = {
  render: () => (
    <Card variant="outline">
      <h3 className="text-lg font-semibold">Outline Card</h3>
      <p className="mt-2 text-sm opacity-70">
        Border only, transparent background.
      </p>
    </Card>
  ),
};

export const HoverInteractive: Story = {
  render: () => (
    <Card hover>
      <h3 className="text-lg font-semibold">Hover Card</h3>
      <p className="mt-2 text-sm opacity-70">Lifts slightly on hover.</p>
    </Card>
  ),
};

export const PaddingVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Card padding="sm">Small Padding</Card>
      <Card padding="md">Medium Padding</Card>
      <Card padding="lg">Large Padding</Card>
    </div>
  ),
};
