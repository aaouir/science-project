// Reads a business-card photo and returns structured contact fields.
// Input:  { imageBase64: string, mediaType: string }  (mediaType e.g. "image/jpeg")
// Output: { name, title, company, email, phone }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { imageBase64, mediaType } = await req.json();
    if (!imageBase64) return jsonResponse({ error: "imageBase64 is required" }, 400);

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType ?? "image/jpeg", data: imageBase64 },
              },
              {
                type: "text",
                text:
                  "This is a photo of a business card. Extract the fields into strict JSON only " +
                  '(no markdown, no commentary): {"name":"","title":"","company":"","email":"","phone":""}. ' +
                  "Keep the original language of each field (Arabic stays Arabic, English stays English). " +
                  'Use "" for any field you cannot read.',
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      return jsonResponse({ error: "Anthropic API error", detail }, 502);
    }

    const data = await anthropicRes.json();
    const text = data.content?.[0]?.text ?? "{}";
    const match = text.match(/\{[\s\S]*\}/);
    const fields = JSON.parse(match ? match[0] : text);

    return jsonResponse({ fields });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
