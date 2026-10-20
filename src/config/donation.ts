export const DONATION_CONFIG = {
  razorpayUrl:
    process.env.NEXT_PUBLIC_RAZORPAY_URL?.trim() || "#razorpay-link",
  buyMeACoffeeUrl:
    process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL?.trim() || "#buymeacoffee-link",
  timerSeconds: Number(process.env.NEXT_PUBLIC_ENGAGEMENT_TIMER_SECONDS) || 90,
  sessionStorageKey: "toolmate_feedback_dismissed",
};
