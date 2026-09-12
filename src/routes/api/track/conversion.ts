import { createFileRoute } from "@tanstack/react-router";
import { getRequestIP } from "@tanstack/react-start/server";
import {
  metaEventInputSchema,
  processConversionEvent,
} from "@/lib/conversion-processor.server";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Raw endpoint for conversion events sent via `navigator.sendBeacon` or
 * `fetch(..., { keepalive: true })`.
 *
 * Why this exists: the checkout buttons navigate to Hotmart (`target="_blank"`)
 * immediately on click. A normal `fetch`/TanStack Server Function call started
 * in that same click can be aborted by the browser before it finishes —
 * especially on mobile and inside in-app browsers (Instagram/Facebook), which
 * suspend or kill the originating tab's JS context almost immediately on
 * navigation. `sendBeacon`/`keepalive` requests are explicitly guaranteed by
 * the browser to still be sent even if the page is gone by the time the
 * response comes back, which is exactly what we need here.
 *
 * The client doesn't read the response (that's the point of a beacon), so we
 * just do the work and reply — status/body only matter for our own logs.
 */
export const Route = createFileRoute("/api/track/conversion")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return jsonResponse(
            { success: false, error: "invalid_json" },
            400,
          );
        }

        const parsed = metaEventInputSchema.safeParse(body);
        if (!parsed.success) {
          return jsonResponse(
            { success: false, error: "invalid_payload" },
            400,
          );
        }

        // The IP must come from the request itself, never from the client
        // payload — a browser can't reliably report its own public IP, and
        // this is one of the two parameters (with user agent) Meta calls
        // out as the baseline for good match quality on Conversions API
        // events. `xForwardedFor: true` is safe here because the app runs
        // behind Vercel's proxy, which sets that header itself.
        const clientIpAddress = getRequestIP({ xForwardedFor: true });

        try {
          const result = await processConversionEvent({
            ...parsed.data,
            userData: {
              ...parsed.data.userData,
              ...(clientIpAddress ? { clientIpAddress } : {}),
            },
          });
          return jsonResponse(result, 202);
        } catch (error) {
          console.warn(
            "Failed to process beacon conversion event",
            error instanceof Error ? error.message : String(error),
          );
          return jsonResponse(
            { success: false, error: "processing_failed" },
            500,
          );
        }
      },
    },
  },
});
