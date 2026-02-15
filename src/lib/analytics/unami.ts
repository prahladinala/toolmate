declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, any>) => void };
  }
}

export function track(event: string, data?: Record<string, any>) {
  if (typeof window === "undefined") return;
  window.umami?.track?.(event, data);
}
