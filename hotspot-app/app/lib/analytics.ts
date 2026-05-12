type AnalyticsPayload = Record<string, unknown>;

/**
 * Lightweight analytics hook. Extend with gtag / Plausible / Segment when ready.
 * In development, events are logged for verification (menu vs map interactions).
 */
export function trackEvent(event: string, payload?: AnalyticsPayload): void {
  if (typeof window === "undefined") return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", event, payload ?? {});
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload ?? {});
  }
}

export type InteractionSource = "filter_menu" | "hotspot" | "deep_link" | "reset" | "share";
