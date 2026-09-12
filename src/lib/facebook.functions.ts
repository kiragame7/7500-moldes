import { createServerFn } from "@tanstack/react-start";
import {
  metaEventInputSchema,
  processConversionEvent,
} from "./conversion-processor.server";

/**
 * Kept for callers that can safely wait for a normal async round-trip
 * (the page is not about to navigate away right after calling this, e.g.
 * ViewContent). For anything fired right before leaving the page (checkout
 * buttons), use `POST /api/track/conversion` via `navigator.sendBeacon` /
 * `fetch(..., { keepalive: true })` instead — see `sendConversionBeacon` in
 * `facebook.hooks.ts`. A normal fetch/server-function call like this one can
 * get aborted mid-flight by the browser when the page unloads, which is what
 * was causing InitiateCheckout to never reach the Conversions API on mobile.
 */
export const sendFacebookConversionEvent = createServerFn({ method: "POST" })
  .inputValidator(metaEventInputSchema)
  .handler(async ({ data }) => processConversionEvent(data));
