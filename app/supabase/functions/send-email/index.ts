// Sends an email directly from the app (Resend by default).
// Input:  { to: string, subject: string, body: string }
// Output: { sent: true } | { error }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("SEND_FROM_EMAIL") ?? "onboarding@resend.dev";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    if (!RESEND_API_KEY) {
      return jsonResponse(
        { error: "RESEND_API_KEY is not configured. Set it as a Supabase Edge Function secret to enable sending email." },
        501,
      );
    }

    const { to, subject, body } = await req.json();
    if (!to || !body) return jsonResponse({ error: "to and body are required" }, 400);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: subject ?? "",
        text: body,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      return jsonResponse({ error: "Email provider error", detail }, 502);
    }

    return jsonResponse({ sent: true });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
