import type { MetaEventInput } from "./conversions.ts";
import { boundedErrorMessage, envFirst, sha256 } from "./security.server.ts";

export type MetaCapiResult = {
  accepted: boolean;
  httpStatus: number;
  responseId: string | null;
  error: string | null;
  raw: unknown;
};

type MetaUserData = Record<string, unknown>;

type MetaPayload = {
  data: Array<{
    event_name: string;
    event_time: number;
    event_id: string;
    action_source: "website";
    event_source_url: string;
    user_data: MetaUserData;
    custom_data?: Record<string, unknown>;
    referrer_url?: string;
  }>;
};

export async function buildMetaEventPayload(
  input: MetaEventInput,
): Promise<MetaPayload> {
  const userData: MetaUserData = {};
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.replace(/\D/g, "");
  const externalId = input.externalId?.trim();

  if (email) userData["em"] = [await sha256(email)];
  if (phone) userData["ph"] = [await sha256(phone)];
  if (externalId) userData["external_id"] = [await sha256(externalId)];
  if (input.fbc) userData["fbc"] = input.fbc;
  if (input.fbp) userData["fbp"] = input.fbp;
  if (input.clientIpAddress)
    userData["client_ip_address"] = input.clientIpAddress;
  if (input.userAgent) userData["client_user_agent"] = input.userAgent;

  const eventTime = clampEventTime(input.eventTime ?? new Date());
  const event = {
    event_name: input.eventName,
    event_time: eventTime,
    event_id: input.eventId,
    action_source: "website" as const,
    event_source_url: input.eventSourceUrl,
    user_data: userData,
    ...(input.customData ? { custom_data: input.customData } : {}),
    ...(input.referrerUrl ? { referrer_url: input.referrerUrl } : {}),
  };

  return { data: [event] };
}

export async function sendMetaEvent(
  input: MetaEventInput,
): Promise<MetaCapiResult> {
  const accessToken = envFirst(
    "META_CAPI_ACCESS_TOKEN",
    "FACEBOOK_CONVERSIONS_API_TOKEN",
  );
  const pixelId =
    envFirst("META_PIXEL_ID", "VITE_META_PIXEL_ID") ?? "27483742397970318";
  const apiVersion = envFirst("META_GRAPH_API_VERSION") ?? "v26.0";

  if (!accessToken) {
    return {
      accepted: false,
      httpStatus: 503,
      responseId: null,
      error: "Meta Conversions API token is not configured",
      raw: null,
    };
  }

  const payload = await buildMetaEventPayload(input);
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const raw = await readJsonOrText(response);
  const responseId = getResponseId(raw);

  if (!response.ok) {
    return {
      accepted: false,
      httpStatus: response.status,
      responseId,
      error: getMetaError(raw) ?? `Meta CAPI returned HTTP ${response.status}`,
      raw,
    };
  }

  return {
    accepted: true,
    httpStatus: response.status,
    responseId,
    error: null,
    raw,
  };
}

function clampEventTime(eventTime: Date): number {
  const now = Math.floor(Date.now() / 1000);
  const eventSeconds = Math.floor(eventTime.getTime() / 1000);
  const oldestAllowed = now - 7 * 24 * 60 * 60 + 60;
  return Math.max(oldestAllowed, Math.min(eventSeconds, now));
}

async function readJsonOrText(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text.slice(0, 1000);
  }
}

function getResponseId(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const value = (raw as { events_received?: unknown; fbtrace_id?: unknown })
    .fbtrace_id;
  return typeof value === "string" ? value : null;
}

function getMetaError(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const error = (raw as { error?: { message?: unknown; code?: unknown } })
    .error;
  if (!error || typeof error !== "object") return null;
  const message =
    typeof error.message === "string"
      ? error.message
      : "Meta CAPI rejected the event";
  const code = typeof error.code === "number" ? ` (code ${error.code})` : "";
  return boundedErrorMessage(`${message}${code}`);
}
