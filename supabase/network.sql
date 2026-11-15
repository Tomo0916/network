-- =========================================================
-- Network Words — クラス機能（Supabase）
--
-- SQL Practice と同じ Supabase プロジェクトで使います。
-- 先に SQL Practice の supabase/schema.sql が実行済みであること（先生の一覧 teachers、
-- is_teacher()、am_i_teacher()、server_now() をそのまま使います）。
--
-- Supabase の「SQL Editor」にこのファイルを全部貼り付けて「Run」を押してください。
-- 何度実行しても安全です。アプリを更新したときも、もう一度 Run してください。
--
-- SQL Practice のテーブル（classes・members・attempts）には一切さわりません。
-- ネットワーク用語アプリのクラスは net_ で始まる別のテーブルに入ります:
--   net_classes     : クラス（先生が作る。課題 = 範囲・出題モード・問題数・セット番号、授業ライブ）
--   net_members     : 参加した生徒（ニックネームだけ）
--   net_member_pins : 生徒の4桁の番号（暗号化。だれも直接は読めない）
--   net_attempts    : 生徒の解答（用語・問題・選んだ答え・正誤）
-- 先生は SQL Practice と同じアカウントでログインします（teachers の一覧も共通）。
-- =========================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------- tables ----------
create table if not exists public.net_classes (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique check (code ~ '^[A-Z0-9]{4,8}$'),
  name       text not null check (char_length(name) between 1 and 80),
  teacher_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  -- the assignment: {"range": "lesson-1", "mode": "mix", "n": 10, "seed": "20261116"}  (null = none)
  task       jsonb check (task is null or jsonb_typeof(task) = 'object'),
  live_until timestamptz,
  open       boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table if not exists public.net_members (
  class_id  uuid not null references public.net_classes(id) on delete cascade,
  user_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nickname  text not null check (char_length(btrim(nickname)) between 1 and 30),
  joined_at timestamptz not null default now(),
  primary key (class_id, user_id)
);
create table if not exists public.net_attempts (
  id         bigint generated always as identity primary key,
  class_id   uuid not null references public.net_classes(id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  word       text not null check (char_length(word) <= 40),          -- the word the question is about
  qid        text not null check (char_length(qid) <= 80),           -- which question: d2t:hub · s:hub3 · f:macbits …
  kind       text not null check (kind in ('task', 'quiz', 'review', 'quick')),
  seed       text check (char_length(seed) <= 40),                   -- the assignment's set (kind = task)
  pos        smallint check (pos between 0 and 200),                 -- question number in the assignment (kind = task)
  choice     text check (char_length(choice) <= 40),                 -- what the student chose
  ok         boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists net_attempts_class_time on public.net_attempts (class_id, created_at);
create index if not exists net_attempts_user on public.net_attempts (user_id);
create index if not exists net_classes_teacher on public.net_classes (teacher_id);

create table if not exists public.net_member_pins (
  class_id     uuid not null,
  user_id      uuid not null,
  pin_hash     text not null,
  fails        integer not null default 0,
  locked_until timestamptz,
  primary key (class_id, user_id),
  foreign key (class_id, user_id) references public.net_members (class_id, user_id) on delete cascade on update cascade
);
alter table public.net_member_pins enable row level security;   -- no policies: no direct access at all
revoke all on public.net_member_pins from public, anon, authenticated;

-- ---------- helpers ----------
create or replace function public.net_is_teacher_of(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select public.is_teacher() and exists (select 1 from public.net_classes c where c.id = cid and c.teacher_id = auth.uid()) $$;
create or replace function public.net_is_member_of(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.net_members m where m.class_id = cid and m.user_id = auth.uid()) $$;

-- ---------- row level security ----------
alter table public.net_classes  enable row level security;
alter table public.net_members  enable row level security;
alter table public.net_attempts enable row level security;

drop policy if exists net_classes_select on public.net_classes;
drop policy if exists net_classes_insert on public.net_classes;
drop policy if exists net_classes_update on public.net_classes;
drop policy if exists net_classes_delete on public.net_classes;
create policy net_classes_select on public.net_classes for select to authenticated
  using ((teacher_id = auth.uid() and public.is_teacher()) or public.net_is_member_of(id));
create policy net_classes_insert on public.net_classes for insert to authenticated
  with check (teacher_id = auth.uid() and public.is_teacher());
create policy net_classes_update on public.net_classes for update to authenticated
  using (teacher_id = auth.uid() and public.is_teacher()) with check (teacher_id = auth.uid());
create policy net_classes_delete on public.net_classes for delete to authenticated
  using (teacher_id = auth.uid() and public.is_teacher());

drop policy if exists net_members_select on public.net_members;
drop policy if exists net_members_update on public.net_members;
drop policy if exists net_members_delete on public.net_members;
create policy net_members_select on public.net_members for select to authenticated
  using (user_id = auth.uid() or public.net_is_teacher_of(class_id));
create policy net_members_update on public.net_members for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy net_members_delete on public.net_members for delete to authenticated
  using (user_id = auth.uid() or public.net_is_teacher_of(class_id));

drop policy if exists net_attempts_select on public.net_attempts;
drop policy if exists net_attempts_insert on public.net_attempts;
drop policy if exists net_attempts_delete on public.net_attempts;
create policy net_attempts_select on public.net_attempts for select to authenticated
  using (user_id = auth.uid() or public.net_is_teacher_of(class_id));
create policy net_attempts_insert on public.net_attempts for insert to authenticated
  with check (user_id = auth.uid() and public.net_is_member_of(class_id));
create policy net_attempts_delete on public.net_attempts for delete to authenticated
  using (public.net_is_teacher_of(class_id));

revoke all on public.net_classes, public.net_members, public.net_attempts from anon;
grant select, insert, update, delete on public.net_classes to authenticated;
grant select, delete on public.net_members to authenticated;
grant update (nickname) on public.net_members to authenticated;
grant select, insert, delete on public.net_attempts to authenticated;
grant usage on sequence public.net_attempts_id_seq to authenticated;

-- one nickname per class
create or replace function public.net_nickname_free() returns trigger
  language plpgsql security definer set search_path = public as
$$
begin
  if exists (select 1 from public.net_members m where m.class_id = new.class_id and m.user_id <> new.user_id
             and lower(btrim(m.nickname)) = lower(btrim(new.nickname))) then
    raise exception 'nickname_taken' using errcode = 'P0001';
  end if;
  return new;
end
$$;
drop trigger if exists net_members_nickname_free on public.net_members;
create trigger net_members_nickname_free before insert or update of nickname on public.net_members
  for each row execute function public.net_nickname_free();

-- ---------- RPC: the teacher creates a class (a code that neither app uses yet) ----------
create or replace function public.net_create_class(p_name text)
  returns public.net_classes
  language plpgsql security definer set search_path = public as
$$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  new_code text;
  c public.net_classes;
begin
  if not public.is_teacher() then raise exception 'not_teacher' using errcode = '42501'; end if;
  loop
    new_code := '';
    for i in 1..6 loop
      new_code := new_code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.net_classes where code = new_code)
          and not exists (select 1 from public.classes where code = new_code);
  end loop;
  insert into public.net_classes (code, name, teacher_id) values (new_code, left(btrim(p_name), 80), auth.uid())
    returning * into c;
  return c;
end
$$;

-- ---------- students: nickname + 4-digit number ----------
create or replace function public.net_save_pin(p_class uuid, p_user uuid, p_pin text) returns void
  language plpgsql security definer set search_path = public, extensions as
$$
begin
  if coalesce(p_pin, '') !~ '^[0-9]{4}$' then raise exception 'bad_pin' using errcode = '22023'; end if;
  insert into public.net_member_pins (class_id, user_id, pin_hash) values (p_class, p_user, crypt(p_pin, gen_salt('bf')))
    on conflict (class_id, user_id) do update set pin_hash = excluded.pin_hash, fails = 0, locked_until = null;
end
$$;
revoke all on function public.net_save_pin(uuid, uuid, text) from public, anon, authenticated;

create or replace function public.net_join_class(p_code text, p_nickname text, p_pin text)
  returns public.net_classes
  language plpgsql security definer set search_path = public as
$$
declare c public.net_classes;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if coalesce(p_pin, '') !~ '^[0-9]{4}$' then raise exception 'bad_pin' using errcode = '22023'; end if;
  select * into c from public.net_classes where code = upper(btrim(p_code));
  if not found then raise exception 'class_not_found' using errcode = 'P0002'; end if;
  if not c.open and not public.net_is_member_of(c.id) then raise exception 'class_closed' using errcode = 'P0001'; end if;
  insert into public.net_members (class_id, user_id, nickname)
    values (c.id, auth.uid(), left(btrim(p_nickname), 30))
    on conflict (class_id, user_id) do update set nickname = excluded.nickname;
  perform public.net_save_pin(c.id, auth.uid(), p_pin);
  return c;
end
$$;

/* go on from another device: {"ok": true, "class": …} or {"ok": false, "error": …, "left": n, "minutes": n} */
create or replace function public.net_resume_member(p_code text, p_nickname text, p_pin text)
  returns jsonb
  language plpgsql security definer set search_path = public, extensions as
$$
declare c public.net_classes; m record; found_name boolean := false; had_pin boolean := false; left_tries integer := 5;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into c from public.net_classes where code = upper(btrim(p_code));
  if not found then return jsonb_build_object('ok', false, 'error', 'class_not_found'); end if;
  for m in select mb.user_id, mp.pin_hash, mp.fails, mp.locked_until from public.net_members mb
           left join public.net_member_pins mp on mp.class_id = mb.class_id and mp.user_id = mb.user_id
           where mb.class_id = c.id and mb.user_id <> auth.uid() and lower(btrim(mb.nickname)) = lower(btrim(p_nickname)) loop
    found_name := true;
    if m.pin_hash is null then continue; end if;
    had_pin := true;
    if m.locked_until is not null and m.locked_until > now() then
      return jsonb_build_object('ok', false, 'error', 'pin_locked', 'minutes', ceil(extract(epoch from m.locked_until - now()) / 60));
    end if;
    if coalesce(p_pin, '') ~ '^[0-9]{4}$' and crypt(p_pin, m.pin_hash) = m.pin_hash then
      delete from public.net_members where class_id = c.id and user_id = auth.uid();
      update public.net_attempts set user_id = auth.uid() where class_id = c.id and user_id = m.user_id;
      update public.net_members set user_id = auth.uid() where class_id = c.id and user_id = m.user_id;
      update public.net_member_pins set fails = 0, locked_until = null where class_id = c.id and user_id = auth.uid();
      return jsonb_build_object('ok', true, 'class', to_jsonb(c));
    end if;
    update public.net_member_pins set fails = fails + 1, locked_until = case when fails + 1 >= 5 then now() + interval '10 minutes' end
      where class_id = c.id and user_id = m.user_id returning greatest(0, 5 - fails) into left_tries;
    if left_tries = 0 then return jsonb_build_object('ok', false, 'error', 'pin_locked', 'minutes', 10); end if;
    return jsonb_build_object('ok', false, 'error', 'pin_wrong', 'left', left_tries);
  end loop;
  return jsonb_build_object('ok', false, 'error', case when not found_name then 'not_found' when not had_pin then 'no_pin' else 'pin_wrong' end);
end
$$;

create or replace function public.net_pin_status(p_class uuid) returns table (user_id uuid, has_pin boolean, locked boolean)
  language plpgsql stable security definer set search_path = public as
$$
begin
  if not public.net_is_teacher_of(p_class) then raise exception 'not_teacher' using errcode = '42501'; end if;
  return query select mb.user_id, mp.user_id is not null, coalesce(mp.locked_until > now(), false)
    from public.net_members mb left join public.net_member_pins mp on mp.class_id = mb.class_id and mp.user_id = mb.user_id
    where mb.class_id = p_class;
end
$$;
create or replace function public.net_teacher_set_pin(p_class uuid, p_user uuid, p_pin text) returns boolean
  language plpgsql security definer set search_path = public as
$$
begin
  if not public.net_is_teacher_of(p_class) then raise exception 'not_teacher' using errcode = '42501'; end if;
  if not exists (select 1 from public.net_members where class_id = p_class and user_id = p_user) then raise exception 'not_member' using errcode = 'P0002'; end if;
  perform public.net_save_pin(p_class, p_user, p_pin);
  return true;
end
$$;

-- ---------- class live: the students' screens open the assignment until live_until ----------
create or replace function public.net_start_live(p_class uuid, p_min integer)
  returns public.net_classes
  language plpgsql security definer set search_path = public as
$$
declare c public.net_classes;
begin
  if not public.net_is_teacher_of(p_class) then raise exception 'not_teacher' using errcode = '42501'; end if;
  update public.net_classes set live_until = now() + make_interval(mins => greatest(5, least(p_min, 240)))
    where id = p_class returning * into c;
  return c;
end
$$;
create or replace function public.net_stop_live(p_class uuid)
  returns public.net_classes
  language plpgsql security definer set search_path = public as
$$
declare c public.net_classes;
begin
  if not public.net_is_teacher_of(p_class) then raise exception 'not_teacher' using errcode = '42501'; end if;
  update public.net_classes set live_until = null where id = p_class returning * into c;
  return c;
end
$$;

revoke all on function public.net_create_class(text) from public, anon;
revoke all on function public.net_join_class(text, text, text) from public, anon;
revoke all on function public.net_resume_member(text, text, text) from public, anon;
revoke all on function public.net_pin_status(uuid) from public, anon;
revoke all on function public.net_teacher_set_pin(uuid, uuid, text) from public, anon;
revoke all on function public.net_start_live(uuid, integer) from public, anon;
revoke all on function public.net_stop_live(uuid) from public, anon;
grant execute on function public.net_create_class(text) to authenticated;
grant execute on function public.net_join_class(text, text, text) to authenticated;
grant execute on function public.net_resume_member(text, text, text) to authenticated;
grant execute on function public.net_pin_status(uuid) to authenticated;
grant execute on function public.net_teacher_set_pin(uuid, uuid, text) to authenticated;
grant execute on function public.net_start_live(uuid, integer) to authenticated;
grant execute on function public.net_stop_live(uuid) to authenticated;

-- ---------- quick test (2026-11-16) ----------
-- quick = {"id", "range", "mode", "n", "at": start (server time, after a 10-second countdown), "end": time limit or null}
-- quick_log = the quick tests so far, newest first (at most 30). Answers: net_attempts kind 'quick', seed = quick id.
alter table public.net_classes add column if not exists quick jsonb check (quick is null or jsonb_typeof(quick) = 'object');
alter table public.net_classes add column if not exists quick_log jsonb check (quick_log is null or jsonb_typeof(quick_log) = 'array');
create or replace function public.net_start_quick(p_class uuid, p_quick jsonb, p_min integer)
  returns public.net_classes
  language plpgsql security definer set search_path = public as
$$
declare c public.net_classes; t0 timestamptz := now() + interval '10 seconds'; q jsonb;
begin
  if not public.net_is_teacher_of(p_class) then raise exception 'not_teacher' using errcode = '42501'; end if;
  q := jsonb_build_object('id', substr(md5(random()::text || clock_timestamp()::text), 1, 10),
    'range', left(coalesce(p_quick->>'range', 'all'), 30), 'mode', left(coalesce(p_quick->>'mode', 'mix'), 10),
    'n', greatest(1, least(coalesce((p_quick->>'n')::int, 5), 40)),
    'at', t0, 'end', case when coalesce(p_min, 0) > 0 then t0 + make_interval(mins => least(p_min, 60)) end);
  update public.net_classes set quick = q where id = p_class returning * into c;
  return c;
end
$$;
create or replace function public.net_stop_quick(p_class uuid)
  returns public.net_classes
  language plpgsql security definer set search_path = public as
$$
declare c public.net_classes;
begin
  if not public.net_is_teacher_of(p_class) then raise exception 'not_teacher' using errcode = '42501'; end if;
  update public.net_classes
    set quick_log = case when quick is null then quick_log
                         else (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
                                select x from jsonb_array_elements(jsonb_build_array(quick || jsonb_build_object('stopped', now())) || coalesce(quick_log, '[]'::jsonb)) with ordinality as e(x, o)
                                order by o limit 30) s) end,
        quick = null
    where id = p_class returning * into c;
  return c;
end
$$;
revoke all on function public.net_start_quick(uuid, jsonb, integer) from public, anon;
revoke all on function public.net_stop_quick(uuid) from public, anon;
grant execute on function public.net_start_quick(uuid, jsonb, integer) to authenticated;
grant execute on function public.net_stop_quick(uuid) to authenticated;

-- keep updated_at fresh
create or replace function public.net_touch_updated_at() returns trigger language plpgsql as
$$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists net_classes_touch on public.net_classes;
create trigger net_classes_touch before update on public.net_classes for each row execute function public.net_touch_updated_at();

-- ---------- realtime (the teacher's live table + the students' assignment) ----------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin alter publication supabase_realtime add table public.net_attempts; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.net_members;  exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.net_classes;  exception when duplicate_object then null; end;
  end if;
end $$;
