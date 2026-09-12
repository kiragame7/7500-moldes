import { z } from "zod";

export const HOTMART_EVENTS = [
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "PURCHASE_CANCELED",
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_EXPIRED",
  "PURCHASE_PROTEST",
  "PURCHASE_DELAYED",
  "PURCHASE_BILLET_PRINTED",
] as const;

export const APPROVED_HOTMART_EVENTS = [
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
] as const;

export type HotmartEventName = (typeof HOTMART_EVENTS)[number];
export type PurchaseStatus =
  "approved" | "complete" | "refunded" | "chargeback" | "canceled" | "expired";

const moneySchema = z
  .object({
    value: z.coerce.number().finite().nonnegative(),
    currency_value: z.string().trim().length(3),
  })
  .passthrough();

const purchaseSchema = z
  .object({
    transaction: z.string().trim().min(1).max(255),
    approved_date: z.coerce.number().finite().positive().optional(),
    full_price: moneySchema.optional(),
    price: moneySchema.optional(),
    original_offer_price: moneySchema.optional(),
    origin: z
      .object({
        xcod: z.string().trim().min(1).max(500).optional(),
        src: z.string().trim().max(500).optional(),
        sck: z.string().trim().max(500).optional(),
      })
      .passthrough()
      .optional(),
    status: z.string().trim().max(100).optional(),
  })
  .passthrough();

export const hotmartWebhookSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    creation_date: z.coerce.number().finite().positive().optional(),
    event: z.enum(HOTMART_EVENTS),
    version: z.string().optional(),
    data: z
      .object({
        purchase: purchaseSchema,
        product: z
          .object({
            id: z.union([z.string(), z.number()]).optional(),
            ucode: z.string().trim().max(255).optional(),
            name: z.string().trim().max(500).optional(),
          })
          .passthrough()
          .optional(),
        buyer: z
          .object({
            ucode: z.string().trim().max(255).optional(),
            email: z.string().trim().email().max(320).optional(),
            name: z.string().trim().max(500).optional(),
            checkout_phone: z.string().trim().max(80).optional(),
            checkout_phone_code: z.string().trim().max(20).optional(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough(),
  })
  .passthrough();

export type HotmartWebhook = z.infer<typeof hotmartWebhookSchema>;

export type NormalizedHotmartEvent = {
  eventName: HotmartEventName;
  transactionId: string;
  status: PurchaseStatus | null;
  value: number | null;
  currency: string | null;
  productId: string | null;
  productName: string | null;
  externalId: string | null;
  email: string | null;
  phone: string | null;
  eventTime: Date;
  approvedAt: Date | null;
  hotmartEventId: string | null;
};

export type MetaEventInput = {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  eventTime?: Date;
  externalId?: string;
  email?: string;
  phone?: string;
  fbc?: string;
  fbp?: string;
  clientIpAddress?: string;
  userAgent?: string;
  referrerUrl?: string;
  customData?: Record<string, unknown>;
};

export function parseHotmartWebhook(payload: unknown): HotmartWebhook {
  return hotmartWebhookSchema.parse(payload);
}

export function isApprovedHotmartEvent(eventName: HotmartEventName): boolean {
  return (APPROVED_HOTMART_EVENTS as readonly string[]).includes(eventName);
}

export function statusForHotmartEvent(
  eventName: HotmartEventName,
): PurchaseStatus | null {
  switch (eventName) {
    case "PURCHASE_APPROVED":
      return "approved";
    case "PURCHASE_COMPLETE":
      return "complete";
    case "PURCHASE_REFUNDED":
      return "refunded";
    case "PURCHASE_CHARGEBACK":
    case "PURCHASE_PROTEST":
      return "chargeback";
    case "PURCHASE_CANCELED":
      return "canceled";
    case "PURCHASE_EXPIRED":
      return "expired";
    default:
      return null;
  }
}

export function normalizeEmail(
  value: string | null | undefined,
): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized || undefined;
}

export function normalizePhone(
  value: string | null | undefined,
  areaCode?: string | null,
): string | undefined {
  const phone = value?.replace(/\D/g, "") ?? "";
  const code = areaCode?.replace(/\D/g, "") ?? "";
  const normalized =
    code && !phone.startsWith(code) ? `${code}${phone}` : phone;
  return normalized || undefined;
}

export function normalizeExternalId(
  value: string | null | undefined,
): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

export function normalizeCurrency(
  value: string | null | undefined,
): string | undefined {
  const normalized = value?.trim().toUpperCase();
  return normalized && /^[A-Z]{3}$/.test(normalized) ? normalized : undefined;
}

export function toDate(value: number | null | undefined): Date | null {
  if (!value || !Number.isFinite(value) || value <= 0) return null;
  const milliseconds = value < 10_000_000_000 ? value * 1000 : value;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function normalizeHotmartEvent(
  payload: HotmartWebhook,
): NormalizedHotmartEvent {
  const purchase = payload.data.purchase;
  const product = payload.data.product;
  const buyer = payload.data.buyer;
  const price =
    purchase.full_price ?? purchase.price ?? purchase.original_offer_price;
  const approvedAt = toDate(purchase.approved_date);
  const eventTime = approvedAt ?? toDate(payload.creation_date) ?? new Date();

  return {
    eventName: payload.event,
    transactionId: purchase.transaction,
    status: statusForHotmartEvent(payload.event),
    value: price?.value ?? null,
    currency: normalizeCurrency(price?.currency_value) ?? null,
    productId:
      product?.ucode ?? (product?.id != null ? String(product.id) : null),
    productName: product?.name ?? null,
    externalId: normalizeExternalId(purchase.origin?.xcod) ?? null,
    email: normalizeEmail(buyer?.email) ?? null,
    phone:
      normalizePhone(buyer?.checkout_phone, buyer?.checkout_phone_code) ?? null,
    eventTime,
    approvedAt,
    hotmartEventId: payload.id != null ? String(payload.id) : null,
  };
}

export function purchaseMetaEventId(transactionId: string): string {
  return `purchase:${transactionId}`;
}

export function hotmartAuditEventId(
  eventName: HotmartEventName,
  transactionId: string,
): string {
  return `hotmart:${eventName}:${transactionId}`;
}

export function purchaseStatusRank(status: PurchaseStatus | null): number {
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
