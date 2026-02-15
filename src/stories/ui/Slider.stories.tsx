import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(50);

    return (
      <Slider
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        showValue
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState(30);

    return (
      <div className="space-y-6">
        <Slider
          size="sm"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <Slider
          size="md"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <Slider
          size="lg"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    );
  },
};
