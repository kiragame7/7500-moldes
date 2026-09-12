import assert from "node:assert/strict";
import test from "node:test";
import {
  hotmartAuditEventId,
  normalizeEmail,
  normalizeHotmartEvent,
  normalizePhone,
  parseHotmartWebhook,
  purchaseMetaEventId,
  toDate,
} from "./conversions.ts";
import { buildMetaEventPayload } from "./meta-capi.server.ts";
import { constantTimeEqual } from "./security.server.ts";

const approvedPayload = {
  id: "event-123",
  creation_date: 1_725_000_000_000,
  event: "PURCHASE_APPROVED",
  version: "2.0.0",
  data: {
    product: { id: 123, ucode: "product-ucode", name: "7500 Moldes" },
    buyer: {
      email: "Buyer@Example.com",
      checkout_phone: "99999-8888",
      checkout_phone_code: "31",
    },
    purchase: {
      transaction: "HP123",
      approved_date: 1_725_000_000_000,
      full_price: { value: 9.99, currency_value: "brl" },
      origin: { xcod: "moldes_visitor_123" },
    },
  },
};

test("normaliza uma compra aprovada da Hotmart", () => {
  const normalized = normalizeHotmartEvent(
    parseHotmartWebhook(approvedPayload),
  );

  assert.equal(normalized.transactionId, "HP123");
  assert.equal(normalized.status, "approved");
  assert.equal(normalized.value, 9.99);
  assert.equal(normalized.currency, "BRL");
  assert.equal(normalized.externalId, "moldes_visitor_123");
  assert.equal(normalized.email, "buyer@example.com");
  assert.equal(normalized.phone, "31999998888");
});

test("rejeita compra Hotmart sem transação", () => {
  const invalidPayload = structuredClone(approvedPayload) as {
    data: { purchase: { transaction?: string } };
  };
  delete invalidPayload.data.purchase.transaction;
  assert.throws(() => parseHotmartWebhook(invalidPayload));
});

test("mantém IDs de auditoria e compra determinísticos", () => {
  assert.equal(
    hotmartAuditEventId("PURCHASE_APPROVED", "HP123"),
    "hotmart:PURCHASE_APPROVED:HP123",
  );
  assert.equal(purchaseMetaEventId("HP123"), "purchase:HP123");
  assert.equal(purchaseMetaEventId("HP123"), purchaseMetaEventId("HP123"));
});

test("normaliza identificadores pessoais sem expor os valores", () => {
  assert.equal(normalizeEmail("  Pessoa@EXAMPLE.com "), "pessoa@example.com");
  assert.equal(normalizePhone("(999) 888-777", "11"), "11999888777");
  assert.equal(normalizePhone("5511999888777", "55"), "5511999888777");
});

test("converte timestamps Hotmart em milissegundos ou segundos", () => {
  assert.equal(toDate(1_725_000_000_000)?.getTime(), 1_725_000_000_000);
  assert.equal(toDate(1_725_000_000)?.getTime(), 1_725_000_000_000);
  assert.equal(toDate(0), null);
});

test("constrói o evento Meta com hashes e dados de compra", async () => {
  const payload = await buildMetaEventPayload({
    eventName: "Purchase",
    eventId: "purchase:HP123",
    eventSourceUrl: "https://example.com/",
    externalId: "moldes_visitor_123",
    email: "buyer@example.com",
    phone: "31999998888",
    customData: { value: 9.99, currency: "BRL", order_id: "HP123" },
  });

  const event = payload.data[0];
  assert.ok(event);
  assert.equal(event.event_name, "Purchase");
  assert.equal(event.event_id, "purchase:HP123");
  assert.equal(event.action_source, "website");
  assert.equal(event.custom_data?.["order_id"], "HP123");
  assert.match(
    String((event.user_data["em"] as string[] | undefined)?.[0]),
    /^[a-f0-9]{64}$/,
  );
  assert.match(
    String((event.user_data["ph"] as string[] | undefined)?.[0]),
    /^[a-f0-9]{64}$/,
  );
  assert.match(
    String((event.user_data["external_id"] as string[] | undefined)?.[0]),
    /^[a-f0-9]{64}$/,
  );
});

test("compara tokens sem usar comparação ingênua", () => {
  assert.equal(constantTimeEqual("same-token", "same-token"), true);
  assert.equal(constantTimeEqual("same-token", "different-token"), false);
  assert.equal(constantTimeEqual("same-token", "same-token-extra"), false);
});
