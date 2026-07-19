-- Relationship management app: multi-tenant schema (one row per company/org)
-- All team members within an org share full read/write visibility over that org's contacts.

create extension if not exists "pgcrypto";

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- One row per authenticated user, linking them to their org.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  event_date text,
  place text,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  title text,
  company text,
  email text,
  phone text,
  card_image_url text,
  event_id uuid references events (id) on delete set null,
  relation text not null default 'client'
    check (relation in ('client', 'partner', 'friend', 'media', 'diplomat', 'intl_org', 'vip')),
  tags text[] not null default '{}',
  notes text not null default '',
  added_by uuid references profiles (id),
  last_contact_at timestamptz,
  touchpoint_status text not null default 'ok' check (touchpoint_status in ('ok', 'overdue')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_org_id_idx on contacts (org_id);
create index contacts_event_id_idx on contacts (event_id);

-- Detected job/title changes from the licensed data provider (e.g. Apollo, People Data Labs).
-- Nothing here is applied to the contact until a team member approves it.
create table job_alerts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  contact_id uuid not null references contacts (id) on delete cascade,
  field text not null check (field in ('title', 'company')),
  old_value text not null,
  new_value text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references profiles (id)
);

-- Approved changes are archived here so the previous title/company is never lost.
create table job_history (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts (id) on delete cascade,
  description text not null,
  changed_at timestamptz not null default now()
);

-- Voice notes: raw audio kept for reference, transcript gets appended into contacts.notes.
create table voice_notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts (id) on delete cascade,
  audio_url text not null,
  transcript text,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- "My News": personal announcements broadcast to a chosen set of contacts.
create table news_broadcasts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  created_by uuid references profiles (id),
  title_ar text,
  body_ar text,
  title_en text,
  body_en text,
  channel text not null check (channel in ('email', 'whatsapp')),
  lang text not null default 'ar' check (lang in ('ar', 'en')),
  sent_at timestamptz not null default now()
);

create table news_recipients (
  id uuid primary key default gen_random_uuid(),
  broadcast_id uuid not null references news_broadcasts (id) on delete cascade,
  contact_id uuid not null references contacts (id) on delete cascade
);

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table events enable row level security;
alter table contacts enable row level security;
alter table job_alerts enable row level security;
alter table job_history enable row level security;
alter table voice_notes enable row level security;
alter table news_broadcasts enable row level security;
alter table news_recipients enable row level security;

-- Helper: current user's org id (avoids repeating the subquery in every policy).
create function auth_org_id() returns uuid
language sql stable security definer as $$
  select org_id from profiles where id = auth.uid()
$$;

create policy "org members read own org" on organizations
  for select using (id = auth_org_id());

create policy "org members read profiles in org" on profiles
  for select using (org_id = auth_org_id());

create policy "org members read events" on events
  for select using (org_id = auth_org_id());
create policy "org members write events" on events
  for insert with check (org_id = auth_org_id());
create policy "org members update events" on events
  for update using (org_id = auth_org_id());

-- Every team member can see and edit every contact in their org (agreed default),
-- but added_by always records who actually created it.
create policy "org members read contacts" on contacts
  for select using (org_id = auth_org_id());
create policy "org members insert contacts" on contacts
  for insert with check (org_id = auth_org_id());
create policy "org members update contacts" on contacts
  for update using (org_id = auth_org_id());

create policy "org members read job_alerts" on job_alerts
  for select using (org_id = auth_org_id());
create policy "org members update job_alerts" on job_alerts
  for update using (org_id = auth_org_id());

create policy "org members read job_history" on job_history
  for select using (contact_id in (select id from contacts where org_id = auth_org_id()));
create policy "org members insert job_history" on job_history
  for insert with check (contact_id in (select id from contacts where org_id = auth_org_id()));

create policy "org members read voice_notes" on voice_notes
  for select using (contact_id in (select id from contacts where org_id = auth_org_id()));
create policy "org members insert voice_notes" on voice_notes
  for insert with check (contact_id in (select id from contacts where org_id = auth_org_id()));

create policy "org members read news" on news_broadcasts
  for select using (org_id = auth_org_id());
create policy "org members insert news" on news_broadcasts
  for insert with check (org_id = auth_org_id());

create policy "org members read news_recipients" on news_recipients
  for select using (broadcast_id in (select id from news_broadcasts where org_id = auth_org_id()));
create policy "org members insert news_recipients" on news_recipients
  for insert with check (broadcast_id in (select id from news_broadcasts where org_id = auth_org_id()));

-- Storage bucket for business-card photos, scoped per org folder.
insert into storage.buckets (id, name, public) values ('card-images', 'card-images', false)
  on conflict (id) do nothing;

create policy "org members read own card images" on storage.objects
  for select using (bucket_id = 'card-images' and (storage.foldername(name))[1] = auth_org_id()::text);
create policy "org members upload own card images" on storage.objects
  for insert with check (bucket_id = 'card-images' and (storage.foldername(name))[1] = auth_org_id()::text);
