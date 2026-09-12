import { useEffect } from "react";

const CONVERSION_ENDPOINT = "/api/track/conversion";

/**
 * Sends the conversion event in a way that survives the page navigating away
 * right after the click (checkout buttons open Hotmart via target="_blank").
 *
 * `navigator.sendBeacon` is the browser-native tool for exactly this: it's
 * guaranteed to still deliver the request even if the page is unloaded a
 * moment later. Where it's unavailable, we fall back to
 * `fetch(..., { keepalive: true })`, which offers the same guarantee (for
 * payloads under ~64KB, which conversion events always are).
 *
 * This replaced a plain `await sendFacebookConversionEvent(...)` call, which
 * was a normal (non-keepalive) fetch under the hood — mobile browsers and
 * in-app browsers (Instagram/Facebook) were killing that request before it
 * completed, so InitiateCheckout never reached the Conversions API on mobile
 * even though it worked fine on desktop.
 */
function sendConversionBeacon(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const queued = navigator.sendBeacon(CONVERSION_ENDPOINT, blob);
      if (queued) return;
    }
  } catch {
    // fall through to fetch keepalive below
  }

  if (typeof fetch === "function") {
    fetch(CONVERSION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch((error) => {
      console.warn(
        "Failed to send conversion event",
        error instanceof Error ? error.message : String(error),
      );
    });
  }
}

const EXTERNAL_ID_KEY = "moldes_external_id";
const ATTRIBUTION_KEY = "moldes_attribution_v1";
const SENT_EVENTS_KEY = "moldes_sent_events_v1";
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

type Attribution = {
  externalId: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  capturedAt: string;
};

export function getOrCreateExternalId(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const existing = window.localStorage.getItem(EXTERNAL_ID_KEY)?.trim();
    if (existing) return existing;

    const uuid =
      typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : createFallbackId();
    const externalId = `moldes_${uuid}`;
    window.localStorage.setItem(EXTERNAL_ID_KEY, externalId);
    return externalId;
  } catch {
    return undefined;
  }
}

export function captureAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;

  const externalId = getOrCreateExternalId();
  if (!externalId) return undefined;

  const current = readStoredAttribution();
  const params = new URLSearchParams(window.location.search);
  const next: Attribution = {
    externalId,
    ...(current ?? {}),
    capturedAt: current?.capturedAt ?? new Date().toISOString(),
  };

  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key)?.trim();
    if (value && !nextValueExists(next, key)) {
      assignAttributionValue(next, key, value);
    }
  }

  const cookieFbc = getCookie("_fbc");
  const cookieFbp = getCookie("_fbp");
  if (cookieFbc) next.fbc = cookieFbc;
  if (cookieFbp) next.fbp = cookieFbp;

  if (next.fbclid && !next.fbc) {
    next.fbc = `fb.1.${Date.now()}.${next.fbclid}`;
  }

  try {
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  } catch {
    // Tracking must never break the offer page.
  }

  return next;
}

export function getAttribution(): Attribution | undefined {
  return captureAttribution() ?? readStoredAttribution();
}

export function withHotmartAttribution(url: string): string {
  if (typeof window === "undefined") return url;
  const externalId = getOrCreateExternalId();
  if (!externalId) return url;

  try {
    const checkoutUrl = new URL(url);
    checkoutUrl.searchParams.set("xcod", externalId);
    return checkoutUrl.toString();
  } catch {
    return url;
  }
}

export function getCheckoutEventId(plan: string): string {
  const externalId = getOrCreateExternalId() ?? createFallbackId();
  const normalizedPlan = plan
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `checkout:${normalizedPlan}:${externalId}`;
}

export function getViewContentEventId(section: string): string {
  const externalId = getOrCreateExternalId() ?? createFallbackId();
  const normalizedSection = section
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const sessionKey = `moldes_view_session_${normalizedSection}`;
  if (typeof window !== "undefined") {
    try {
      const existing = window.sessionStorage.getItem(sessionKey);
      if (existing) return `viewcontent:${normalizedSection}:${externalId}:${existing}`;
      const token = createFallbackId();
      window.sessionStorage.setItem(sessionKey, token);
      return `viewcontent:${normalizedSection}:${externalId}:${token}`;
    } catch {
      // Tracking must never break the offer page.
    }
  }
  return `viewcontent:${normalizedSection}:${externalId}:${createFallbackId()}`;
}

/**
 * Opens a checkout link a beat after firing tracking, instead of letting the
 * <a target="_blank"> navigate immediately.
 *
 * On desktop, target="_blank" opens a genuinely new tab, so the current page
 * never unloads and window.fbq(...)'s underlying network request has all
 * the time it needs. On many mobile browsers — and especially in-app
 * browsers (Instagram/Facebook ad webviews) — a target="_blank" click
 * instead replaces the current page right away. That unloads the document
 * almost immediately, which can abort fbq's outgoing request before it's
 * actually sent. The server-side beacon call survives this fine (that's
 * exactly what sendBeacon/keepalive fetch are for, see
 * sendConversionBeacon above), but the client-side Pixel call is a plain,
 * cancellable request — which is why only the browser-side event was going
 * missing on mobile while the server event kept working.
 *
 * A short delay before navigating gives the browser time to flush the pixel
 * request first, on every platform.
 */
/**
 * Navigates to the checkout URL a beat after firing tracking, instead of
 * doing it immediately inside the click handler.
 *
 * IMPORTANT: this must use `window.location`, not `window.open`. Opening a
 * new tab/window is only allowed by the browser when it happens
 * synchronously, as a direct result of the click — once it's deferred into
 * a setTimeout callback like this, Safari on iOS (and often Chrome on
 * Android) silently blocks it as a popup, with no error and no visible
 * feedback, which breaks checkout entirely. Assigning `location.href` is a
 * normal navigation of the current tab, not a new window, so it is never
 * subject to that restriction regardless of the delay.
 *
 * This does mean checkout now replaces the current tab instead of opening a
 * new one (on every platform, not just mobile) — a deliberate trade-off:
 * reliable navigation matters far more here than keeping the offer page
 * open in a background tab.
 */
export function openCheckoutLink(url: string, delayMs = 500): void {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    window.location.href = url;
  }, delayMs);
}

export function getPageViewEventId(): string {
  const externalId = getOrCreateExternalId() ?? createFallbackId();
  const sessionKey = "moldes_pageview_session";
  if (typeof window !== "undefined") {
    try {
      const existing = window.sessionStorage.getItem(sessionKey);
      if (existing) return `pageview:${externalId}:${existing}`;
      const token = createFallbackId();
      window.sessionStorage.setItem(sessionKey, token);
      return `pageview:${externalId}:${token}`;
    } catch {
      // Tracking must never break the offer page.
    }
  }
  return `pageview:${externalId}:${createFallbackId()}`;
}

export const useFacebookConversions = () => {
  useEffect(() => {
    captureAttribution();
  }, []);

  const trackEvent = async (
    eventName: string,
    customData: Record<string, unknown> = {},
    eventId?: string,
  ) => {
    const attribution = getAttribution();
    const resolvedEventId =
      eventId ?? `${eventName.toLowerCase()}:${createFallbackId()}`;
    if (wasEventSentInSession(resolvedEventId)) return;
    rememberEventInSession(resolvedEventId);
    const enrichedData = {
      ...customData,
      ...(attribution?.externalId
        ? { external_id: attribution.externalId }
        : {}),
      ...(attribution?.fbclid ? { fbclid: attribution.fbclid } : {}),
      ...(attribution?.fbc ? { fbc: attribution.fbc } : {}),
      ...(attribution?.fbp ? { fbp: attribution.fbp } : {}),
      ...(attribution?.utmSource ? { utm_source: attribution.utmSource } : {}),
      ...(attribution?.utmMedium ? { utm_medium: attribution.utmMedium } : {}),
      ...(attribution?.utmCampaign
        ? { utm_campaign: attribution.utmCampaign }
        : {}),
      ...(attribution?.utmContent
        ? { utm_content: attribution.utmContent }
        : {}),
      ...(attribution?.utmTerm ? { utm_term: attribution.utmTerm } : {}),
    };

    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", eventName, enrichedData, {
        eventID: resolvedEventId,
      });
    }

    sendConversionBeacon({
      eventName,
      eventSourceUrl:
        typeof window !== "undefined"
          ? window.location.href
          : "https://moldes7500-jpvetvra.manus.space/",
      eventId: resolvedEventId,
      userData: {
        ...(attribution?.externalId
          ? { externalId: attribution.externalId }
          : {}),
        ...(attribution?.fbc ? { fbc: attribution.fbc } : {}),
        ...(attribution?.fbp ? { fbp: attribution.fbp } : {}),
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
      referrerUrl:
        typeof document !== "undefined" && document.referrer
          ? document.referrer
          : undefined,
      customData: enrichedData,
    });
  };

  return { trackEvent };
};

function wasEventSentInSession(eventId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.sessionStorage.getItem(SENT_EVENTS_KEY);
    if (!raw) return false;
    const events = JSON.parse(raw) as Record<string, number>;
    const timestamp = events[eventId];
    return typeof timestamp === "number" && Date.now() - timestamp < 30 * 60 * 1000;
  } catch {
    return false;
  }
}

function rememberEventInSession(eventId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(SENT_EVENTS_KEY);
    const events = (raw ? JSON.parse(raw) : {}) as Record<string, number>;
    const cutoff = Date.now() - 30 * 60 * 1000;
    for (const [key, timestamp] of Object.entries(events)) {
      if (typeof timestamp !== "number" || timestamp < cutoff) delete events[key];
    }
    events[eventId] = Date.now();
    window.sessionStorage.setItem(SENT_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // Tracking must never break the offer page.
  }
}

function readStoredAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    if (typeof parsed.externalId !== "string") return undefined;
    return parsed as Attribution;
  } catch {
    return undefined;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));
  if (!cookie) return undefined;
  try {
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return undefined;
  }
}

function nextValueExists(
  attribution: Attribution,
  key: (typeof ATTRIBUTION_KEYS)[number],
): boolean {
  const value =
    key === "fbclid"
      ? attribution.fbclid
      : attribution[camelCase(key) as keyof Attribution];
  return typeof value === "string" && value.length > 0;
}

function assignAttributionValue(
  attribution: Attribution,
  key: (typeof ATTRIBUTION_KEYS)[number],
  value: string,
): void {
  if (key === "fbclid") {
    attribution.fbclid = value;
    return;
  }
  const property = camelCase(key) as keyof Attribution;
  attribution[property] = value;
}

function camelCase(value: string): string {
  return value.replace(/_([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function createFallbackId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
