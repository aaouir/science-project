// Answers a free-text question about the whole contact network, reasoning across
// everyone together (shared interests, connections, who needs follow-up) instead of
// treating each contact as an isolated record.
// Input:  { question: string }   (Authorization header must carry the caller's session)
// Output: { answer: string }
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { question } = await req.json();
    if (!question) return jsonResponse({ error: "question is required" }, 400);

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    // RLS scopes this to the caller's own org automatically.
    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("name, title, company, relation, tags, notes, touchpoint_status, last_contact_at, events(name)");

    if (error) return jsonResponse({ error: error.message }, 500);

    const roster = (contacts ?? []).map((c: any) => ({
      name: c.name,
      title: c.title,
      company: c.company,
      relation: c.relation,
      tags: c.tags,
      notes: c.notes,
      met_at_event: c.events?.name ?? null,
      touchpoint_status: c.touchpoint_status,
      last_contact_at: c.last_contact_at,
    }));

    const prompt =
      `You are analyzing a PR team's contact network as ONE connected community, not a list of ` +
      `separate names — look for shared interests, overlapping companies/events, and who connects ` +
      `to whom, the way a human relationship manager would. Answer the question below in Arabic, ` +
      `in 2-4 sentences, naming the specific relevant people from the roster and why they're relevant. ` +
      `If nothing in the roster is relevant, say so plainly.\n\n` +
      `Question: ${question}\n\n` +
      `Roster (JSON):\n${JSON.stringify(roster)}`;

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
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      return jsonResponse({ error: "Anthropic API error", detail }, 502);
    }

    const data = await anthropicRes.json();
    const answer = (data.content?.[0]?.text ?? "").trim();
    return jsonResponse({ answer });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
