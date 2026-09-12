import { useEffect } from "react";
import { sendFacebookConversionEvent } from "./facebook.functions";

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
  return `checkout:${normalizedPlan}:${externalId}:${createFallbackId()}`;
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

    try {
      await sendFacebookConversionEvent({
        data: {
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
              typeof navigator !== "undefined"
                ? navigator.userAgent
                : undefined,
          },
          referrerUrl:
            typeof document !== "undefined" && document.referrer
              ? document.referrer
              : undefined,
          customData: enrichedData,
        },
      });
    } catch (error) {
      console.warn(
        "Failed to send conversion event",
        error instanceof Error ? error.message : String(error),
      );
    }
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
