import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "accent", "subtle"],
    },
    disabled: {
      control: "boolean",
    },
    indeterminate: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Enable Feature"
      />
    );
  },
};

export const AccentVariant: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Accent Style"
        variant="accent"
      />
    );
  },
};

export const Indeterminate: Story = {
  render: () => (
    <Checkbox
      checked={false}
      onChange={() => {}}
      indeterminate
      label="Partial Selection"
    />
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Checkbox checked onChange={() => {}} size="sm" label="Small" />
      <Checkbox checked onChange={() => {}} size="md" label="Medium" />
      <Checkbox checked onChange={() => {}} size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Checkbox checked onChange={() => {}} disabled label="Disabled" />
  ),
};
