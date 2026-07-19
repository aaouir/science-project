// Invites a new PR team member into the caller's org. Admin-only.
// Input:  { email: string, name: string }   (Authorization header must carry the caller's session)
// Output: { invited: true } | { error }
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { email, name } = await req.json();
    if (!email || !name) return jsonResponse({ error: "email and name are required" }, 400);

    const authHeader = req.headers.get("Authorization") ?? "";
    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userRes } = await callerClient.auth.getUser();
    const callerId = userRes.user?.id;
    if (!callerId) return jsonResponse({ error: "Not authenticated" }, 401);

    const { data: callerProfile, error: profileErr } = await callerClient
      .from("profiles")
      .select("role, org_id")
      .eq("id", callerId)
      .single();
    if (profileErr || !callerProfile) return jsonResponse({ error: "Profile not found" }, 403);
    if (callerProfile.role !== "admin") {
      return jsonResponse({ error: "Only an admin can invite team members" }, 403);
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email);
    if (inviteErr || !invited.user) {
      return jsonResponse({ error: inviteErr?.message ?? "Invite failed" }, 502);
    }

    const { error: insertErr } = await admin.from("profiles").insert({
      id: invited.user.id,
      org_id: callerProfile.org_id,
      name,
      email,
      role: "member",
    });
    if (insertErr) return jsonResponse({ error: insertErr.message }, 500);

    return jsonResponse({ invited: true });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
