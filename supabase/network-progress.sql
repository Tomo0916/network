-- =========================================================
-- network-progress.sql — learning records kept with the class account (added 2026-11)
-- Run once in Supabase (SQL Editor) after network.sql. Safe to run again.
-- A student's progress (known words, review, answer counts, lessons read, quick test results)
-- is saved per class member, so it follows the student to another PC or phone
-- (log in again with the nickname + PIN). The teacher of the class can read it.
-- =========================================================
create table if not exists public.net_progress (
  class_id   uuid not null,
  user_id    uuid not null,
  data       jsonb not null default '{}'::jsonb check (pg_column_size(data) < 262144),
  updated_at timestamptz not null default now(),
  primary key (class_id, user_id),
  -- follows the member when they log in on another device (net_resume_member moves the user id)
  foreign key (class_id, user_id) references public.net_members (class_id, user_id) on delete cascade on update cascade
);
alter table public.net_progress enable row level security;
drop policy if exists net_progress_read on public.net_progress;
create policy net_progress_read on public.net_progress for select
  using (user_id = auth.uid() or public.net_is_teacher_of(class_id));
drop policy if exists net_progress_insert on public.net_progress;
create policy net_progress_insert on public.net_progress for insert
  with check (user_id = auth.uid() and public.net_is_member_of(class_id));
drop policy if exists net_progress_update on public.net_progress;
create policy net_progress_update on public.net_progress for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update on public.net_progress to authenticated;
drop trigger if exists net_progress_touch on public.net_progress;
create trigger net_progress_touch before update on public.net_progress for each row execute function public.net_touch_updated_at();
