// Drafts a welcome message for someone just added via an event.
// Input:  { contactName, contactTitle, contactCompany, eventName }
// Output: { email: { ar: {subject, body}, en: {subject, body} }, whatsapp: { ar: body, en: body } }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { contactName, contactTitle, contactCompany, eventName } = await req.json();
    if (!contactName || !eventName) {
      return jsonResponse({ error: "contactName and eventName are required" }, 400);
    }

    const prompt =
      `Write a short, warm professional welcome message to someone just met at an event, ` +
      `from the perspective of the person who met them (a PR/relationship-management team member). ` +
      `Recipient: ${contactName}, ${contactTitle ?? ""} at ${contactCompany ?? ""}. Event: ${eventName}.\n` +
      `Return STRICT JSON only, no markdown, in this exact shape:\n` +
      `{"email":{"ar":{"subject":"","body":""},"en":{"subject":"","body":""}},` +
      `"whatsapp":{"ar":"","en":""}}\n` +
      `Email bodies: 3-4 sentences, professional. WhatsApp: 1-2 sentences, casual, may include an emoji. ` +
      `Arabic must read naturally (not a translation of the English).`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      return jsonResponse({ error: "Anthropic API error", detail }, 502);
    }

    const data = await anthropicRes.json();
    const text = data.content?.[0]?.text ?? "{}";
    const match = text.match(/\{[\s\S]*\}/);
    const draft = JSON.parse(match ? match[0] : text);

    return jsonResponse({ draft });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
