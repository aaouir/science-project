import { supabase, callEdgeFunction } from './supabase';
import type { Contact, EventRow, JobAlert, JobHistoryEntry, Profile, Relation } from './types';

// ---------- profiles / team ----------

export async function fetchMyProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as Profile;
}

export async function fetchTeam(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function inviteTeamMember(email: string, name: string) {
  return callEdgeFunction<{ invited: boolean }>('invite-member', { email, name });
}

// ---------- events ----------

export async function fetchEvents(): Promise<EventRow[]> {
  const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as EventRow[];
}

export async function createEvent(input: { name: string; event_date?: string; place?: string }) {
  const { data: userRes } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('events')
    .insert({ ...input, created_by: userRes.user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as EventRow;
}

// ---------- contacts ----------

const CONTACT_SELECT = '*, events(name), addedByProfile:profiles!contacts_added_by_fkey(name)';

export async function fetchContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select(CONTACT_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Contact[];
}

export async function fetchContactsByEvent(eventId: string | null): Promise<Contact[]> {
  let query = supabase.from('contacts').select(CONTACT_SELECT);
  query = eventId ? query.eq('event_id', eventId) : query.is('event_id', null);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Contact[];
}

export async function fetchContact(id: string): Promise<Contact> {
  const { data, error } = await supabase.from('contacts').select(CONTACT_SELECT).eq('id', id).single();
  if (error) throw error;
  return data as unknown as Contact;
}

export type NewContactInput = {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  event_id?: string | null;
  relation: Relation;
  tags: string[];
  card_image_url?: string | null;
};

export async function createContact(input: NewContactInput): Promise<Contact> {
  const { data: userRes } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('contacts')
    .insert({ ...input, added_by: userRes.user?.id })
    .select(CONTACT_SELECT)
    .single();
  if (error) throw error;
  return data as unknown as Contact;
}

export async function updateContactNotes(id: string, notes: string) {
  const { error } = await supabase.from('contacts').update({ notes }).eq('id', id);
  if (error) throw error;
}

export async function fetchJobHistory(contactId: string): Promise<JobHistoryEntry[]> {
  const { data, error } = await supabase
    .from('job_history')
    .select('*')
    .eq('contact_id', contactId)
    .order('changed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as JobHistoryEntry[];
}

export async function touchContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .update({ last_contact_at: new Date().toISOString(), touchpoint_status: 'ok' })
    .eq('id', id);
  if (error) throw error;
}

// ---------- job alerts ----------

export async function fetchPendingJobAlertsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('job_alerts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');
  if (error) throw error;
  return count ?? 0;
}

export async function fetchJobAlerts(): Promise<JobAlert[]> {
  const { data, error } = await supabase
    .from('job_alerts')
    .select('*, contacts(name)')
    .order('detected_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as JobAlert[];
}

export async function approveJobAlert(alert: JobAlert) {
  const { data: contact, error: fetchErr } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', alert.contact_id)
    .single();
  if (fetchErr) throw fetchErr;

  const fieldLabel = alert.field === 'title' ? 'المسمى الوظيفي' : 'جهة العمل';
  const { error: historyErr } = await supabase.from('job_history').insert({
    contact_id: alert.contact_id,
    description: `تحديث ${fieldLabel}: كان "${alert.old_value}" وأصبح "${alert.new_value}".`,
  });
  if (historyErr) throw historyErr;

  const { error: updateErr } = await supabase
    .from('contacts')
    .update({ [alert.field]: alert.new_value })
    .eq('id', alert.contact_id);
  if (updateErr) throw updateErr;

  const { data: userRes } = await supabase.auth.getUser();
  const { error: resolveErr } = await supabase
    .from('job_alerts')
    .update({ status: 'approved', resolved_at: new Date().toISOString(), resolved_by: userRes.user?.id })
    .eq('id', alert.id);
  if (resolveErr) throw resolveErr;
}

export async function dismissJobAlert(alertId: string) {
  const { data: userRes } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('job_alerts')
    .update({ status: 'dismissed', resolved_at: new Date().toISOString(), resolved_by: userRes.user?.id })
    .eq('id', alertId);
  if (error) throw error;
}

// ---------- news broadcasts ----------

export async function fetchNewsBroadcasts() {
  const { data, error } = await supabase
    .from('news_broadcasts')
    .select('*, news_recipients(count)')
    .order('sent_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function sendNewsBroadcast(input: {
  title_ar: string;
  body_ar: string;
  title_en: string;
  body_en: string;
  channel: 'email' | 'whatsapp';
  lang: 'ar' | 'en';
  recipientIds: string[];
}) {
  const { data: userRes } = await supabase.auth.getUser();
  const { data: broadcast, error } = await supabase
    .from('news_broadcasts')
    .insert({
      title_ar: input.title_ar,
      body_ar: input.body_ar,
      title_en: input.title_en,
      body_en: input.body_en,
      channel: input.channel,
      lang: input.lang,
      created_by: userRes.user?.id,
    })
    .select()
    .single();
  if (error) throw error;

  const { error: recipientsErr } = await supabase
    .from('news_recipients')
    .insert(input.recipientIds.map((contact_id) => ({ broadcast_id: broadcast.id, contact_id })));
  if (recipientsErr) throw recipientsErr;

  return broadcast;
}

// ---------- AI edge functions ----------

export async function extractCardFields(imageBase64: string, mediaType: string) {
  return callEdgeFunction<{ fields: Record<string, string> }>('extract-card', { imageBase64, mediaType });
}

export async function draftWelcomeMessage(input: {
  contactName: string;
  contactTitle?: string;
  contactCompany?: string;
  eventName: string;
}) {
  return callEdgeFunction<{
    draft: {
      email: { ar: { subject: string; body: string }; en: { subject: string; body: string } };
      whatsapp: { ar: string; en: string };
    };
  }>('draft-message', input);
}

export async function fetchAiInsight(notes: string) {
  return callEdgeFunction<{ insight: string | null }>('ai-insight', { notes });
}

export async function askNetwork(question: string) {
  return callEdgeFunction<{ answer: string }>('network-query', { question });
}

export async function transcribeVoiceNote(audioBase64: string, mimeType: string) {
  return callEdgeFunction<{ transcript: string }>('transcribe-voice', { audioBase64, mimeType });
}

export async function sendEmail(to: string, subject: string, body: string) {
  return callEdgeFunction<{ sent: boolean }>('send-email', { to, subject, body });
}

export async function sendWhatsapp(toPhone: string, message: string) {
  return callEdgeFunction<{ sent: boolean }>('send-whatsapp', { toPhone, message });
}
