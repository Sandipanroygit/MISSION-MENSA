create table if not exists public.content_collections (
  key text primary key,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.content_collections enable row level security;

drop policy if exists "Public can read content collections" on public.content_collections;
create policy "Public can read content collections"
  on public.content_collections
  for select
  using (true);

drop policy if exists "Public can upsert content collections" on public.content_collections;
create policy "Public can upsert content collections"
  on public.content_collections
  for insert
  with check (key in ('publishedBlogs', 'blogDrafts', 'discussionTopics', 'feedbackEntries', 'voiceEntries', 'trustedDevices', 'meetingMinutesDrafts'));

drop policy if exists "Public can update content collections" on public.content_collections;
create policy "Public can update content collections"
  on public.content_collections
  for update
  using (key in ('publishedBlogs', 'blogDrafts', 'discussionTopics', 'feedbackEntries', 'voiceEntries', 'trustedDevices', 'meetingMinutesDrafts'))
  with check (key in ('publishedBlogs', 'blogDrafts', 'discussionTopics', 'feedbackEntries', 'voiceEntries', 'trustedDevices', 'meetingMinutesDrafts'));
