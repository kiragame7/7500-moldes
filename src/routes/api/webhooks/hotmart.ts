import { createFileRoute } from "@tanstack/react-router";
import { handleHotmartWebhookRequest } from "@/lib/hotmart-webhook.server";

export const Route = createFileRoute("/api/webhooks/hotmart")({
  server: {
    handlers: {
      POST: async ({ request }) => handleHotmartWebhookRequest(request),
    },
  },
});
