import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Email Address",
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="email-input">Your Email</Label>
      <Input id="email-input" placeholder="developer@example.com" />
    </div>
  ),
};
