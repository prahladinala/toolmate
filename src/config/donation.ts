const rawRazorpay = process.env.NEXT_PUBLIC_RAZORPAY_URL?.trim();
const rawBuyMeACoffee = process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL?.trim();

const isValidUrl = (url?: string) => {
  if (!url) return false;
  const normalized = url.toLowerCase();
  if (
    normalized === "#" ||
    normalized === "#razorpay-link" ||
    normalized === "#buymeacoffee-link" ||
    normalized.startsWith("#") ||
    normalized === "placeholder" ||
    normalized === ""
  ) {
    return false;
  }
  return true;
};

const razorpayUrl = isValidUrl(rawRazorpay) ? rawRazorpay : undefined;
const buyMeACoffeeUrl = isValidUrl(rawBuyMeACoffee) ? rawBuyMeACoffee : undefined;

export const DONATION_CONFIG = {
  razorpayUrl,
  buyMeACoffeeUrl,
  isEnabled: Boolean(razorpayUrl || buyMeACoffeeUrl),
  timerSeconds: Number(process.env.NEXT_PUBLIC_ENGAGEMENT_TIMER_SECONDS) || 90,
  sessionStorageKey: "toolmate_feedback_dismissed",
};
