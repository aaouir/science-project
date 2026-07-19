export type Relation = 'client' | 'partner' | 'friend' | 'media' | 'diplomat' | 'intl_org' | 'vip';

export type Profile = {
  id: string;
  org_id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
};

export type EventRow = {
  id: string;
  org_id: string;
  name: string;
  event_date: string | null;
  place: string | null;
  created_by: string | null;
  created_at: string;
};

export type Contact = {
  id: string;
  org_id: string;
  name: string;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  card_image_url: string | null;
  event_id: string | null;
  relation: Relation;
  tags: string[];
  notes: string;
  added_by: string | null;
  last_contact_at: string | null;
  touchpoint_status: 'ok' | 'overdue';
  created_at: string;
  updated_at: string;
  events?: { name: string } | null;
  addedByProfile?: { name: string } | null;
};

export type JobAlert = {
  id: string;
  org_id: string;
  contact_id: string;
  field: 'title' | 'company';
  old_value: string;
  new_value: string;
  status: 'pending' | 'approved' | 'dismissed';
  detected_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  contacts?: { name: string } | null;
};

export type JobHistoryEntry = {
  id: string;
  contact_id: string;
  description: string;
  changed_at: string;
};

export type NewsBroadcast = {
  id: string;
  org_id: string;
  created_by: string | null;
  title_ar: string | null;
  body_ar: string | null;
  title_en: string | null;
  body_en: string | null;
  channel: 'email' | 'whatsapp';
  lang: 'ar' | 'en';
  sent_at: string;
};
