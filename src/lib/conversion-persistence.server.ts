import type { NormalizedHotmartEvent, PurchaseStatus } from "./conversions.ts";
import { sha256 } from "./security.server.ts";
import {
  executeSql,
  isDuplicateKeyError,
  queryRows,
  type TidbRow,
} from "./tidb.server.ts";

export type ConversionEventInsert = {
  event_name: string;
  event_id: string;
  source: "browser" | "hotmart" | "meta_capi";
  transaction_id?: string | null;
  external_id?: string | null;
  hotmart_xcod?: string | null;
  event_source_url?: string | null;
  referrer_url?: string | null;
  event_time: string;
  received_at?: string;
  value?: number | null;
  currency?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  fbclid?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  client_ip_address?: string | null;
  user_agent?: string | null;
  provider_status?: string | null;
  provider_response_id?: string | null;
  provider_error?: string | null;
  meta_status?: "pending" | "processing" | "accepted" | "failed" | null;
  request_id?: string | null;
  payload_hash?: string | null;
};

export type ConversionEventUpdate = Partial<
  Pick<
    ConversionEventInsert,
    | "meta_status"
    | "provider_status"
    | "provider_response_id"
    | "provider_error"
  >
>;

type ConversionRow = TidbRow & { meta_status?: string | null };
type PurchaseRow = TidbRow & {
  status?: PurchaseStatus;
  meta_event_id?: string | null;
  meta_events_received?: boolean | number;
  meta_error?: string | null;
  approved_at?: string | null;
  value?: number | string | null;
  currency?: string | null;
  product_id?: string | null;
  product_name?: string | null;
  external_id?: string | null;
  external_id_hash?: string | null;
  hotmart_event_id?: string | null;
};

const EVENT_COLUMNS = [
  "event_name",
  "event_id",
  "source",
  "transaction_id",
  "external_id",
  "hotmart_xcod",
  "event_source_url",
  "referrer_url",
  "event_time",
  "received_at",
  "value",
  "currency",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "fbc",
  "fbp",
  "client_ip_address",
  "user_agent",
  "provider_status",
  "provider_response_id",
  "provider_error",
  "meta_status",
  "request_id",
  "payload_hash",
] as const;

export async function insertConversionEvent(
  event: ConversionEventInsert,
): Promise<{ inserted: boolean; existingStatus?: string | null }> {
  const placeholders = EVENT_COLUMNS.map(() => "?").join(", ");
  const values = EVENT_COLUMNS.map((column) =>
    column === "received_at"
      ? (event.received_at ?? new Date().toISOString())
      : (event[column] ?? null),
  );

  try {
    await executeSql(
      `insert into conversion_events (${EVENT_COLUMNS.join(", ")}) values (${placeholders})`,
      values,
    );
    return { inserted: true };
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw new Error("Could not persist conversion event");
    }

    const rows = await queryRows<ConversionRow>(
      "select meta_status from conversion_events where event_id = ? limit 1",
      [event.event_id],
    );
    return { inserted: false, existingStatus: rows[0]?.meta_status ?? null };
  }
}

export async function updateConversionEvent(
  eventId: string,
  update: ConversionEventUpdate,
): Promise<void> {
  const entries = Object.entries(update).filter(
    ([, value]) => value !== undefined,
  );
  if (entries.length === 0) return;
  const assignments = entries.map(([key]) => `${key} = ?`).join(", ");
  await executeSql(
    `update conversion_events set ${assignments}, updated_at = current_timestamp where event_id = ?`,
    [...entries.map(([, value]) => value ?? null), eventId],
  );
}

export async function claimConversionEvent(eventId: string): Promise<{
  claimed: boolean;
  status: string | null;
}> {
  const result = await executeSql(
    `update conversion_events
     set meta_status = 'processing',
         meta_attempts = meta_attempts + 1,
         meta_last_attempt_at = current_timestamp,
         updated_at = current_timestamp
     where event_id = ?
       and (meta_status is null
         or meta_status = 'pending'
         or meta_status = 'failed'
         or (meta_status = 'processing' and meta_last_attempt_at < current_timestamp - interval 2 minute))`,
    [eventId],
  );
  const rows = await queryRows<ConversionRow>(
    "select meta_status from conversion_events where event_id = ? limit 1",
    [eventId],
  );
  return {
    claimed: result.affectedRows > 0,
    status: rows[0]?.meta_status ?? null,
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
  const rows = await queryRows<
    TidbRow & {
      event_source_url?: string | null;
      referrer_url?: string | null;
      fbc?: string | null;
      fbp?: string | null;
      fbclid?: string | null;
      utm_source?: string | null;
      utm_medium?: string | null;
      utm_campaign?: string | null;
      utm_content?: string | null;
      utm_term?: string | null;
      client_ip_address?: string | null;
      user_agent?: string | null;
    }
  >(
    `select event_source_url, referrer_url, fbc, fbp, fbclid,
            utm_source, utm_medium, utm_campaign, utm_content, utm_term,
            client_ip_address, user_agent
     from conversion_events
     where event_name = 'InitiateCheckout'
       and (external_id = ? or hotmart_xcod = ?)
     order by event_time desc limit 1`,
    [externalId, externalId],
  );
  const data = rows[0];
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

  const rows = await queryRows<PurchaseRow>(
    "select * from purchases where transaction_id = ? limit 1",
    [event.transactionId],
  );
  const current = rows[0];
  const currentStatus = current?.status ?? null;
  const nextStatus = choosePurchaseStatus(currentStatus, event.status);
  const externalId = event.externalId ?? current?.external_id ?? null;
  const values = [
    event.transactionId,
    nextStatus ?? "approved",
    event.approvedAt?.toISOString() ?? current?.approved_at ?? null,
    event.value ?? current?.value ?? null,
    event.currency ?? current?.currency ?? null,
    event.productId ?? current?.product_id ?? null,
    event.productName ?? current?.product_name ?? null,
    externalId,
    event.externalId
      ? await sha256(event.externalId)
      : (current?.external_id_hash ?? null),
    event.hotmartEventId ?? current?.hotmart_event_id ?? null,
    current?.meta_event_id ?? null,
    current?.meta_events_received ?? 0,
    current?.meta_error ?? null,
  ];

  await executeSql(
    `insert into purchases
      (transaction_id, status, approved_at, value, currency, product_id,
       product_name, external_id, external_id_hash, hotmart_event_id,
       meta_event_id, meta_events_received, meta_error)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     on duplicate key update
       status = values(status), approved_at = values(approved_at),
       value = values(value), currency = values(currency),
       product_id = values(product_id), product_name = values(product_name),
       external_id = values(external_id), external_id_hash = values(external_id_hash),
       hotmart_event_id = values(hotmart_event_id),
       meta_event_id = values(meta_event_id),
       meta_events_received = values(meta_events_received),
       meta_error = values(meta_error), last_webhook_at = current_timestamp,
       updated_at = current_timestamp`,
    values,
  );

  return { status: nextStatus, created: !current };
}

export async function markPurchaseMetaResult(
  transactionId: string,
  result: { eventId: string; accepted: boolean; error?: string | null },
): Promise<void> {
  await executeSql(
    `update purchases
     set meta_event_id = ?, meta_events_received = ?, meta_error = ?, updated_at = current_timestamp
     where transaction_id = ?`,
    [
      result.eventId,
      result.accepted ? 1 : 0,
      result.error ?? null,
      transactionId,
    ],
  );
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
