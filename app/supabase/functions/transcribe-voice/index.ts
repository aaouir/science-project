// Transcribes a recorded voice note to text.
// Claude does not accept audio input, so this calls a dedicated speech-to-text API
// (OpenAI Whisper by default — swap the fetch call below if you prefer another provider).
// Input:  { audioBase64: string, mimeType: string }
// Output: { transcript: string }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    if (!OPENAI_API_KEY) {
      return jsonResponse(
        { error: "OPENAI_API_KEY is not configured. Set it as a Supabase Edge Function secret to enable voice notes." },
        501,
      );
    }

    const { audioBase64, mimeType } = await req.json();
    if (!audioBase64) return jsonResponse({ error: "audioBase64 is required" }, 400);

    const bytes = base64ToUint8Array(audioBase64);
    const ext = (mimeType ?? "audio/m4a").includes("wav") ? "wav" : "m4a";
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: mimeType ?? "audio/m4a" }), `note.${ext}`);
    form.append("model", "whisper-1");

    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: form,
    });

    if (!openaiRes.ok) {
      const detail = await openaiRes.text();
      return jsonResponse({ error: "Speech-to-text API error", detail }, 502);
    }

    const data = await openaiRes.json();
    return jsonResponse({ transcript: data.text ?? "" });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
