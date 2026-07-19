// Sends a WhatsApp message directly from the app via Meta's WhatsApp Cloud API.
// Input:  { toPhone: string, message: string }   (toPhone in E.164 format, e.g. +9665...)
// Output: { sent: true } | { error }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN")!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      return jsonResponse(
        {
          error:
            "WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID are not configured. Set up a Meta WhatsApp " +
            "Business Cloud API app and add these as Supabase Edge Function secrets to enable sending.",
        },
        501,
      );
    }

    const { toPhone, message } = await req.json();
    if (!toPhone || !message) return jsonResponse({ error: "toPhone and message are required" }, 400);

    const metaRes = await fetch(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toPhone.replace(/[^0-9+]/g, ""),
          type: "text",
          text: { body: message },
        }),
      },
    );

    if (!metaRes.ok) {
      const detail = await metaRes.text();
      return jsonResponse({ error: "WhatsApp API error", detail }, 502);
    }

    return jsonResponse({ sent: true });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
