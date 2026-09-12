import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { NormalizedHotmartEvent, PurchaseStatus } from "./conversions.ts";
import { sha256 } from "./security.server.ts";

export type ConversionEventInsert = TablesInsert<"conversion_events">;
export type ConversionEventUpdate = TablesUpdate<"conversion_events">;

export async function insertConversionEvent(
  event: ConversionEventInsert,
): Promise<{
  inserted: boolean;
  existingStatus?: string | null;
}> {
  const { error } = await supabaseAdmin.from("conversion_events").insert(event);

  if (!error) return { inserted: true };
  if (error.code === "23505") {
    const { data, error: readError } = await supabaseAdmin
      .from("conversion_events")
      .select("meta_status")
      .eq("event_id", event.event_id)
      .maybeSingle();
    if (readError) {
      throw new Error(
        `Could not read existing conversion event (${readError.code ?? "unknown"})`,
      );
    }
    return { inserted: false, existingStatus: data?.meta_status ?? null };
  }
  throw new Error(
    `Could not persist conversion event (${error.code ?? "unknown"})`,
  );
}

export async function updateConversionEvent(
  eventId: string,
  update: ConversionEventUpdate,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("conversion_events")
    .update(update)
    .eq("event_id", eventId);

  if (error) {
    throw new Error(
      `Could not update conversion event (${error.code ?? "unknown"})`,
    );
  }
}

export async function claimConversionEvent(eventId: string): Promise<{
  claimed: boolean;
  status: string | null;
}> {
  const { data, error } = await supabaseAdmin.rpc("claim_conversion_event", {
    p_event_id: eventId,
  });

  if (error) {
    throw new Error(
      `Could not claim conversion event (${error.code ?? "unknown"})`,
    );
  }

  const row = data?.[0];
  return {
    claimed: row?.claimed === true,
    status: row?.current_status ?? null,
  };
}

export async function findCheckoutAttribution(externalId: string): Promise<{
  eventSourceUrl?: string;
  referrerUrl?: string;
  fbc?: string;
  fbp?: string;
  fbclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  clientIpAddress?: string;
  userAgent?: string;
} | null> {
  const { data, error } = await supabaseAdmin
    .from("conversion_events")
    .select(
      "event_source_url,referrer_url,fbc,fbp,fbclid,utm_source,utm_medium,utm_campaign,utm_content,utm_term,client_ip_address,user_agent",
    )
    .eq("event_name", "InitiateCheckout")
    .eq("external_id", externalId)
    .order("event_time", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Could not load checkout attribution (${error.code ?? "unknown"})`,
    );
  }

  if (!data) return null;
  return {
    ...(data.event_source_url ? { eventSourceUrl: data.event_source_url } : {}),
    ...(data.referrer_url ? { referrerUrl: data.referrer_url } : {}),
    ...(data.fbc ? { fbc: data.fbc } : {}),
    ...(data.fbp ? { fbp: data.fbp } : {}),
    ...(data.fbclid ? { fbclid: data.fbclid } : {}),
    ...(data.utm_source ? { utmSource: data.utm_source } : {}),
    ...(data.utm_medium ? { utmMedium: data.utm_medium } : {}),
    ...(data.utm_campaign ? { utmCampaign: data.utm_campaign } : {}),
    ...(data.utm_content ? { utmContent: data.utm_content } : {}),
    ...(data.utm_term ? { utmTerm: data.utm_term } : {}),
    ...(data.client_ip_address
      ? { clientIpAddress: data.client_ip_address }
      : {}),
    ...(data.user_agent ? { userAgent: data.user_agent } : {}),
  };
}

export async function upsertPurchase(
  event: NormalizedHotmartEvent,
): Promise<{ status: PurchaseStatus | null; created: boolean }> {
  if (!event.status) return { status: null, created: false };

  const { data: current, error: readError } = await supabaseAdmin
    .from("purchases")
    .select("*")
    .eq("transaction_id", event.transactionId)
    .maybeSingle();

  if (readError) {
    throw new Error(`Could not read purchase (${readError.code ?? "unknown"})`);
  }

  const currentStatus = (current?.status as PurchaseStatus | undefined) ?? null;
  const nextStatus = choosePurchaseStatus(currentStatus, event.status);
  const now = new Date().toISOString();
  const row: TablesInsert<"purchases"> = {
    transaction_id: event.transactionId,
    status: nextStatus ?? "approved",
    approved_at:
      event.approvedAt?.toISOString() ?? current?.approved_at ?? null,
    value: event.value ?? current?.value ?? null,
    currency: event.currency ?? current?.currency ?? null,
    product_id: event.productId ?? current?.product_id ?? null,
    product_name: event.productName ?? current?.product_name ?? null,
    external_id: event.externalId ?? current?.external_id ?? null,
    external_id_hash: event.externalId
      ? await sha256(event.externalId)
      : (current?.external_id_hash ?? null),
    hotmart_event_id: event.hotmartEventId ?? current?.hotmart_event_id ?? null,
    meta_event_id: current?.meta_event_id ?? null,
    meta_events_received: current?.meta_events_received ?? false,
    meta_error: current?.meta_error ?? null,
    last_webhook_at: now,
    updated_at: now,
  };

  if (!current) row.created_at = now;

  const { error: upsertError } = await supabaseAdmin
    .from("purchases")
    .upsert(row, { onConflict: "transaction_id" });

  if (upsertError) {
    throw new Error(
      `Could not persist purchase (${upsertError.code ?? "unknown"})`,
    );
  }

  return { status: nextStatus, created: !current };
}

export async function markPurchaseMetaResult(
  transactionId: string,
  result: { eventId: string; accepted: boolean; error?: string | null },
): Promise<void> {
  const update: TablesUpdate<"purchases"> = {
    meta_event_id: result.eventId,
    meta_events_received: result.accepted,
    meta_error: result.error ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("purchases")
    .update(update)
    .eq("transaction_id", transactionId);

  if (error) {
    throw new Error(
      `Could not update purchase Meta status (${error.code ?? "unknown"})`,
    );
  }
}

function choosePurchaseStatus(
  current: PurchaseStatus | null,
  incoming: PurchaseStatus | null,
): PurchaseStatus | null {
  if (!incoming) return current;
  if (!current) return incoming;
  return purchaseStatusRank(current) >= purchaseStatusRank(incoming)
    ? current
    : incoming;
}

function purchaseStatusRank(status: PurchaseStatus): number {
  switch (status) {
    case "approved":
      return 20;
    case "complete":
      return 30;
    case "canceled":
    case "expired":
    case "refunded":
      return 40;
    case "chargeback":
      return 50;
    default:
      return 0;
  }
}
