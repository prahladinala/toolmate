import type { Meta, StoryObj } from "@storybook/react";
import { DonationButtons } from "@/components/donation/DonationButtons";
import { DONATION_CONFIG } from "@/config/donation";

const meta: Meta<typeof DonationButtons> = {
  title: "Donation/DonationButtons",
  component: DonationButtons,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DonationButtons>;

export const Default: Story = {
  render: (args) => {
    // Temporarily ensure links exist for Storybook preview
    const prevR = DONATION_CONFIG.razorpayUrl;
    const prevB = DONATION_CONFIG.buyMeACoffeeUrl;
    const prevEnabled = DONATION_CONFIG.isEnabled;

    DONATION_CONFIG.razorpayUrl = "https://razorpay.me/@toolmate";
    DONATION_CONFIG.buyMeACoffeeUrl = "https://buymeacoffee.com/toolmate";
    DONATION_CONFIG.isEnabled = true;

    const el = <DonationButtons {...args} />;

    DONATION_CONFIG.razorpayUrl = prevR;
    DONATION_CONFIG.buyMeACoffeeUrl = prevB;
    DONATION_CONFIG.isEnabled = prevEnabled;

    return el;
  },
  args: {
    size: "md",
  },
};

export const Small: Story = {
  render: (args) => {
    const prevR = DONATION_CONFIG.razorpayUrl;
    const prevB = DONATION_CONFIG.buyMeACoffeeUrl;
    const prevEnabled = DONATION_CONFIG.isEnabled;

    DONATION_CONFIG.razorpayUrl = "https://razorpay.me/@toolmate";
    DONATION_CONFIG.buyMeACoffeeUrl = "https://buymeacoffee.com/toolmate";
    DONATION_CONFIG.isEnabled = true;

    const el = <DonationButtons {...args} />;

    DONATION_CONFIG.razorpayUrl = prevR;
    DONATION_CONFIG.buyMeACoffeeUrl = prevB;
    DONATION_CONFIG.isEnabled = prevEnabled;

    return el;
  },
  args: {
    size: "sm",
  },
};
