import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { MetaEventInput } from "./conversions";

const metaEventInputSchema = z.object({
  eventName: z.string().trim().min(1).max(100),
  eventSourceUrl: z.string().url(),
  eventId: z.string().trim().min(1).max(255),
  eventTime: z.string().datetime().optional(),
  userData: z.object({
    clientIpAddress: z.string().trim().max(100).optional(),
    userAgent: z.string().trim().max(1000).optional(),
    fbc: z.string().trim().max(500).optional(),
    fbp: z.string().trim().max(500).optional(),
    externalId: z.string().trim().max(255).optional(),
    email: z.string().trim().max(320).optional(),
    phone: z.string().trim().max(80).optional(),
  }),
  referrerUrl: z.string().url().optional(),
  customData: z.record(z.unknown()).optional(),
});

export const sendFacebookConversionEvent = createServerFn({ method: "POST" })
  .inputValidator(metaEventInputSchema)
  .handler(async ({ data }) => {
    const event: MetaEventInput = {
      eventName: data.eventName,
      eventSourceUrl: data.eventSourceUrl,
      eventId: data.eventId,
      ...(data.eventTime ? { eventTime: new Date(data.eventTime) } : {}),
      ...(data.userData.clientIpAddress
        ? { clientIpAddress: data.userData.clientIpAddress }
        : {}),
      ...(data.userData.userAgent
        ? { userAgent: data.userData.userAgent }
        : {}),
      ...(data.userData.fbc ? { fbc: data.userData.fbc } : {}),
      ...(data.userData.fbp ? { fbp: data.userData.fbp } : {}),
      ...(data.userData.externalId
        ? { externalId: data.userData.externalId }
        : {}),
      ...(data.userData.email ? { email: data.userData.email } : {}),
      ...(data.userData.phone ? { phone: data.userData.phone } : {}),
      ...(data.referrerUrl ? { referrerUrl: data.referrerUrl } : {}),
      ...(data.customData ? { customData: data.customData } : {}),
    };

    const receivedAt = new Date().toISOString();
    let persisted = false;
    let alreadyAccepted = false;

    try {
      const { insertConversionEvent } =
        await import("./conversion-persistence.server.ts");
      const result = await insertConversionEvent({
        event_name: event.eventName,
        event_id: event.eventId,
        source: "browser",
        external_id: event.externalId ?? null,
        event_source_url: event.eventSourceUrl,
        referrer_url: event.referrerUrl ?? null,
        event_time: (event.eventTime ?? new Date()).toISOString(),
        received_at: receivedAt,
        value: getNumericValue(event.customData?.["value"]),
        currency: getCurrency(event.customData?.["currency"]),
        utm_source: getString(event.customData?.["utm_source"]),
        utm_medium: getString(event.customData?.["utm_medium"]),
        utm_campaign: getString(event.customData?.["utm_campaign"]),
        utm_content: getString(event.customData?.["utm_content"]),
        utm_term: getString(event.customData?.["utm_term"]),
        fbclid: getString(event.customData?.["fbclid"]),
        fbc: event.fbc ?? null,
        fbp: event.fbp ?? null,
        client_ip_address: event.clientIpAddress ?? null,
        user_agent: event.userAgent ?? null,
        meta_status: "pending",
      });
      persisted = true;
      alreadyAccepted =
        !result.inserted && result.existingStatus === "accepted";
    } catch (error) {
      console.warn(
        "Could not persist browser conversion event",
        error instanceof Error ? error.message : String(error),
      );
    }

    if (alreadyAccepted) {
      return {
        success: true,
        status: 200,
        responseId: null,
        error: null,
      };
    }

    const { sendMetaEvent } = await import("./meta-capi.server.ts");
    const result = await sendMetaEvent({
      ...event,
      ...(event.customData
        ? { customData: sanitizeMetaCustomData(event.customData) }
        : {}),
    });

    if (persisted) {
      try {
        const { updateConversionEvent } =
          await import("./conversion-persistence.server.ts");
        await updateConversionEvent(event.eventId, {
          meta_status: result.accepted ? "accepted" : "failed",
          provider_status: String(result.httpStatus),
          provider_response_id: result.responseId,
          provider_error: result.error,
        });
      } catch (error) {
        console.warn(
          "Could not update browser conversion audit",
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    return {
      success: result.accepted,
      status: result.httpStatus,
      responseId: result.responseId,
      error: result.error,
    };
  });

function getNumericValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function getCurrency(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z]{3}$/.test(value)
    ? value.toUpperCase()
    : null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function sanitizeMetaCustomData(
  customData: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(customData).filter(
      ([key]) =>
        ![
          "external_id",
          "fbclid",
          "fbc",
          "fbp",
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
        ].includes(key),
    ),
  );
}
