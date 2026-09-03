import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FACEBOOK_PIXEL_ID = "27483742397970318";

export const sendFacebookConversionEvent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      eventName: z.string(),
      eventSourceUrl: z.string(),
      eventId: z.string(),
      userData: z.object({
        clientIpAddress: z.string().optional(),
        userAgent: z.string().optional(),
        fbc: z.string().optional(),
        fbp: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
      }),
      customData: z.record(z.any()).optional(),
    })
  )
  .handler(async ({ data }) => {
    const ACCESS_TOKEN = process.env["FACEBOOK_CONVERSIONS_API_TOKEN"];

    if (!ACCESS_TOKEN) {
      console.warn("Facebook Conversions API token not set");
      return { success: false, error: "Token not configured" };
    }

    try {
      const payload = {
        data: [
          {
            event_name: data.eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: data.eventSourceUrl,
            event_id: data.eventId,
            user_data: {
              client_ip_address: data.userData.clientIpAddress,
              client_user_agent: data.userData.userAgent,
              fbc: data.userData.fbc,
              fbp: data.userData.fbp,
              em: data.userData.email ? [data.userData.email] : undefined,
              ph: data.userData.phone ? [data.userData.phone] : undefined,
            },
            custom_data: data.customData,
          },
        ],
      };

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      console.error("Error sending Facebook Conversion event:", error);
      return { success: false, error: String(error) };
    }
  });
