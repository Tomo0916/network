-- Quick test: extend the time limit while it runs (2026-11-16).
-- Run once in the Supabase SQL Editor after network.sql. Safe to run again.
-- Adds p_min minutes (1-30) to quick.end. The total limit stays within 120 minutes.
create or replace function public.net_extend_quick(p_class uuid, p_min integer)
  returns public.net_classes
  language plpgsql security definer set search_path = public as
$$
declare c public.net_classes; q jsonb; e timestamptz;
begin
  if not public.net_is_teacher_of(p_class) then raise exception 'not_teacher' using errcode = '42501'; end if;
  select quick into q from public.net_classes where id = p_class for update;
  if q is null or q->>'end' is null then raise exception 'no_quick' using errcode = 'P0002'; end if;
  e := (q->>'end')::timestamptz;
  if e < now() then raise exception 'quick_over' using errcode = 'P0001'; end if;
  e := least(e + make_interval(mins => greatest(1, least(coalesce(p_min, 1), 30))), (q->>'at')::timestamptz + interval '120 minutes');
  update public.net_classes set quick = q || jsonb_build_object('end', e) where id = p_class returning * into c;
  return c;
end
$$;
revoke all on function public.net_extend_quick(uuid, integer) from public, anon;
grant execute on function public.net_extend_quick(uuid, integer) to authenticated;
