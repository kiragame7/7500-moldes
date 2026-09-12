import {
  hotmartAuditEventId,
  normalizeHotmartEvent,
  parseHotmartWebhook,
  purchaseMetaEventId,
  type HotmartWebhook,
} from "./conversions.ts";
import {
  claimConversionEvent,
  findCheckoutAttribution,
  insertConversionEvent,
  markPurchaseMetaResult,
  updateConversionEvent,
  upsertPurchase,
} from "./conversion-persistence.server.ts";
import { sendMetaEvent, type MetaCapiResult } from "./meta-capi.server.ts";
import { boundedErrorMessage, sha256 } from "./security.server.ts";
import { constantTimeEqual, envFirst } from "./security.server.ts";

export type HotmartProcessResult = {
  transactionId: string;
  eventName: string;
  purchaseUpdated: boolean;
  meta: MetaCapiResult | null;
  duplicateWebhook: boolean;
};

export async function processHotmartWebhook(
  payload: unknown,
  request: Request,
): Promise<HotmartProcessResult> {
  const webhook = parseHotmartWebhook(payload);
  const normalized = normalizeHotmartEvent(webhook);
  const requestId = crypto.randomUUID();
  const auditEventId = hotmartAuditEventId(
    normalized.eventName,
    normalized.transactionId,
  );
  const payloadHash = await sha256(JSON.stringify(payload));
  const attribution = normalized.externalId
    ? await findCheckoutAttribution(normalized.externalId)
    : null;

  const auditInsert = await insertConversionEvent({
    event_name: normalized.eventName,
    event_id: auditEventId,
    source: "hotmart",
    transaction_id: normalized.transactionId,
    external_id: normalized.externalId,
    event_source_url:
      attribution?.eventSourceUrl ?? new URL(request.url).origin,
    referrer_url: attribution?.referrerUrl ?? null,
    event_time: normalized.eventTime.toISOString(),
    value: normalized.value,
    currency: normalized.currency,
    utm_source: attribution?.utmSource ?? null,
    utm_medium: attribution?.utmMedium ?? null,
    utm_campaign: attribution?.utmCampaign ?? null,
    utm_content: attribution?.utmContent ?? null,
    utm_term: attribution?.utmTerm ?? null,
    fbclid: attribution?.fbclid ?? null,
    fbc: attribution?.fbc ?? null,
    fbp: attribution?.fbp ?? null,
    client_ip_address: attribution?.clientIpAddress ?? null,
    user_agent: attribution?.userAgent ?? null,
    provider_status: normalized.eventName,
    request_id: requestId,
    payload_hash: payloadHash,
    meta_status:
      normalized.status === "approved" || normalized.status === "complete"
        ? "pending"
        : null,
  });

  const purchase = await upsertPurchase(normalized);

  if (
    !purchase.status ||
    (purchase.status !== "approved" && purchase.status !== "complete")
  ) {
    return {
      transactionId: normalized.transactionId,
      eventName: normalized.eventName,
      purchaseUpdated: true,
      meta: null,
      duplicateWebhook: !auditInsert.inserted,
    };
  }

  const metaEventId = purchaseMetaEventId(normalized.transactionId);
  const purchaseEventInsert = await insertConversionEvent({
    event_name: "Purchase",
    event_id: metaEventId,
    source: "meta_capi",
    transaction_id: normalized.transactionId,
    external_id: normalized.externalId,
    event_source_url:
      attribution?.eventSourceUrl ?? new URL(request.url).origin,
    referrer_url: attribution?.referrerUrl ?? null,
    event_time: normalized.eventTime.toISOString(),
    value: normalized.value,
    currency: normalized.currency,
    utm_source: attribution?.utmSource ?? null,
    utm_medium: attribution?.utmMedium ?? null,
    utm_campaign: attribution?.utmCampaign ?? null,
    utm_content: attribution?.utmContent ?? null,
    utm_term: attribution?.utmTerm ?? null,
    fbclid: attribution?.fbclid ?? null,
    fbc: attribution?.fbc ?? null,
    fbp: attribution?.fbp ?? null,
    client_ip_address: attribution?.clientIpAddress ?? null,
    user_agent: attribution?.userAgent ?? null,
    request_id: requestId,
    payload_hash: payloadHash,
    meta_status: "pending",
  });

  const claim = await claimConversionEvent(metaEventId);
  if (!claim.claimed) {
    return {
      transactionId: normalized.transactionId,
      eventName: normalized.eventName,
      purchaseUpdated: true,
      meta: null,
      duplicateWebhook: !auditInsert.inserted || !purchaseEventInsert.inserted,
    };
  }

  const meta = await sendMetaEvent({
    eventName: "Purchase",
    eventId: metaEventId,
    eventSourceUrl: attribution?.eventSourceUrl ?? new URL(request.url).origin,
    eventTime: normalized.eventTime,
    ...(normalized.externalId ? { externalId: normalized.externalId } : {}),
    ...(normalized.email ? { email: normalized.email } : {}),
    ...(normalized.phone ? { phone: normalized.phone } : {}),
    ...(attribution?.fbc ? { fbc: attribution.fbc } : {}),
    ...(attribution?.fbp ? { fbp: attribution.fbp } : {}),
    ...(attribution?.clientIpAddress
      ? { clientIpAddress: attribution.clientIpAddress }
      : {}),
    ...(attribution?.userAgent ? { userAgent: attribution.userAgent } : {}),
    ...(attribution?.referrerUrl
      ? { referrerUrl: attribution.referrerUrl }
      : {}),
    customData: {
      value: normalized.value ?? 0,
      currency: normalized.currency ?? "BRL",
      ...(normalized.productId ? { content_ids: [normalized.productId] } : {}),
      content_type: "product",
      order_id: normalized.transactionId,
    },
  });

  await updateConversionEvent(metaEventId, {
    meta_status: meta.accepted ? "accepted" : "failed",
    provider_status: String(meta.httpStatus),
    provider_response_id: meta.responseId,
    provider_error: meta.error,
  });
  await updateConversionEvent(auditEventId, {
    meta_status: meta.accepted ? "accepted" : "failed",
    provider_status: String(meta.httpStatus),
    provider_response_id: meta.responseId,
    provider_error: meta.error,
  });
  await markPurchaseMetaResult(normalized.transactionId, {
    eventId: metaEventId,
    accepted: meta.accepted,
    error: meta.error,
  });

  return {
    transactionId: normalized.transactionId,
    eventName: normalized.eventName,
    purchaseUpdated: true,
    meta,
    duplicateWebhook: !auditInsert.inserted || !purchaseEventInsert.inserted,
  };
}

export function safeHotmartError(error: unknown): string {
  return boundedErrorMessage(error, 300);
}

export function isZodValidationError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "issues" in error);
}

export function getHotmartToken(headers: Headers): string | null {
  const token = headers.get("X-HOTMART-HOTTOK");
  return token && token.length <= 1000 ? token : null;
}

export async function handleHotmartWebhookRequest(
  request: Request,
): Promise<Response> {
  const expectedToken = envFirst("HOTMART_WEBHOOK_TOKEN");
  const receivedToken = getHotmartToken(request.headers);

  if (
    !expectedToken ||
    !receivedToken ||
    !constantTimeEqual(receivedToken, expectedToken)
  ) {
    return jsonResponse({ success: false, error: "Unauthorized webhook" }, 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "Invalid JSON" }, 400);
  }

  try {
    const result = await processHotmartWebhook(payload, request);

    if (result.meta && !result.meta.accepted) {
      return jsonResponse(
        {
          success: false,
          received: true,
          transaction_id: result.transactionId,
          event: result.eventName,
          meta_accepted: false,
        },
        502,
      );
    }

    return jsonResponse({
      success: true,
      received: true,
      transaction_id: result.transactionId,
      event: result.eventName,
      duplicate: result.duplicateWebhook,
      meta_accepted: result.meta?.accepted ?? null,
    });
  } catch (error) {
    if (isZodValidationError(error)) {
      return jsonResponse(
        { success: false, error: "Invalid Hotmart payload" },
        400,
      );
    }

    console.error("Hotmart webhook processing failed", safeHotmartError(error));
    return jsonResponse(
      { success: false, error: "Webhook processing failed" },
      500,
    );
  }
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
