// Reads a contact's free-text notes and returns a short Arabic insight sentence
// characterizing the person (interests, useful connections, best time to reach them, ...).
// Input:  { notes: string }
// Output: { insight: string | null }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-haiku-4-5-20251001";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { notes } = await req.json();
    if (!notes || !String(notes).trim()) {
      return jsonResponse({ insight: null });
    }

    const prompt =
      `Read these free-form notes a PR team member wrote about a contact, and reply with ONE short ` +
      `Arabic sentence (max ~20 words) that characterizes this person: their interests, useful ` +
      `connections, communication preferences, or anything actionable. Plain text only, no JSON, ` +
      `no preamble.\n\nNotes:\n${notes}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      return jsonResponse({ error: "Anthropic API error", detail }, 502);
    }

    const data = await anthropicRes.json();
    const insight = (data.content?.[0]?.text ?? "").trim();
    return jsonResponse({ insight: insight || null });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
