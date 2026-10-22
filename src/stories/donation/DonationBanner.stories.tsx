import type { Meta, StoryObj } from "@storybook/react";
import { DonationBanner } from "@/components/donation/DonationBanner";
import { DONATION_CONFIG } from "@/config/donation";

const meta: Meta<typeof DonationBanner> = {
  title: "Donation/DonationBanner",
  component: DonationBanner,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["card", "minimal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DonationBanner>;

export const CardVariant: Story = {
  render: (args) => {
    const prevR = DONATION_CONFIG.razorpayUrl;
    const prevB = DONATION_CONFIG.buyMeACoffeeUrl;
    const prevEnabled = DONATION_CONFIG.isEnabled;

    DONATION_CONFIG.razorpayUrl = "https://razorpay.me/@toolmate";
    DONATION_CONFIG.buyMeACoffeeUrl = "https://buymeacoffee.com/toolmate";
    DONATION_CONFIG.isEnabled = true;

    const el = <DonationBanner {...args} />;

    DONATION_CONFIG.razorpayUrl = prevR;
    DONATION_CONFIG.buyMeACoffeeUrl = prevB;
    DONATION_CONFIG.isEnabled = prevEnabled;

    return el;
  },
  args: {
    variant: "card",
  },
};

export const MinimalVariant: Story = {
  render: (args) => {
    const prevR = DONATION_CONFIG.razorpayUrl;
    const prevB = DONATION_CONFIG.buyMeACoffeeUrl;
    const prevEnabled = DONATION_CONFIG.isEnabled;

    DONATION_CONFIG.razorpayUrl = "https://razorpay.me/@toolmate";
    DONATION_CONFIG.buyMeACoffeeUrl = "https://buymeacoffee.com/toolmate";
    DONATION_CONFIG.isEnabled = true;

    const el = <DonationBanner {...args} />;

    DONATION_CONFIG.razorpayUrl = prevR;
    DONATION_CONFIG.buyMeACoffeeUrl = prevB;
    DONATION_CONFIG.isEnabled = prevEnabled;

    return el;
  },
  args: {
    variant: "minimal",
  },
};
