/* =========================================================
 * backend.js — the class features (Supabase), shared with SQL Practice
 * Same Supabase project and the same teacher accounts as SQL Practice,
 * but the classes live in their own tables (net_classes, net_members,
 * net_attempts: supabase/network.sql). SQL Practice is never touched.
 * If config.js is empty, everything else still works in this browser.
 * ========================================================= */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';
import { Store } from './store.js';

export const enabled = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
let clientPromise = null;
export function client() {
  if (!enabled) return Promise.reject(new Error('backend_disabled'));
  if (!clientPromise) {
    clientPromise = import('../vendor/supabase.js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'netw.auth' } }));
  }
  return clientPromise;
}
function check({ data, error }) { if (error) { const e = new Error(error.message || 'error'); e.code = error.code; e.details = error; throw e; } return data; }
/** the database has not got the network tables yet (supabase/network.sql not run) */
export const notReady = e => !!e && (e.code === 'PGRST202' || e.code === 'PGRST205' || e.code === '42P01' || /could not find|schema cache|does not exist/i.test(e.message || ''));
const KNOWN = ['class_not_found', 'class_closed', 'nickname_taken', 'bad_pin', 'not_member', 'not_teacher'];
const known = e => { if (notReady(e)) { e.message = 'not_ready'; return e; } const k = KNOWN.find(x => (e.message || '').includes(x)); if (k) e.message = k; return e; };

/* ---------- students ---------- */
async function ensureSession(sb) {
  const { data } = await sb.auth.getSession();
  if (data.session) return data.session;
  return check(await sb.auth.signInAnonymously()).session;
}
async function session(sb) { try { return await ensureSession(sb); } catch (e) { const err = new Error('anon_disabled'); err.cause = e; throw err; } }
/** join with a nickname and a 4-digit number → class row */
export async function joinClass(code, nickname, pin) {
  const sb = await client(); await session(sb);
  try { return check(await sb.rpc('net_join_class', { p_code: code, p_nickname: nickname, p_pin: pin })); } catch (e) { throw known(e); }
}
/** go on as a student who joined on another device → class row; errors pin_wrong (e.left), pin_locked (e.minutes), not_found, no_pin, class_not_found */
export async function resumeMember(code, nickname, pin) {
  const sb = await client(); await session(sb);
  let r;
  try { r = check(await sb.rpc('net_resume_member', { p_code: code, p_nickname: nickname, p_pin: pin })); } catch (e) { throw known(e); }
  if (r && r.ok) return r.class;
  const err = new Error((r && r.error) || 'error'); err.left = r && r.left; err.minutes = r && r.minutes; throw err;
}
/** the class row (null when this student is no longer a member) */
export async function getClass(classId) {
  const sb = await client();
  return check(await sb.from('net_classes').select('id, code, name, task, live_until, open, quick').eq('id', classId).maybeSingle());
}
export async function myNickname(classId) {
  const sb = await client();
  const { data } = await sb.auth.getSession();
  if (!data.session) return null;
  const r = check(await sb.from('net_members').select('nickname').eq('class_id', classId).eq('user_id', data.session.user.id).maybeSingle());
  return r ? r.nickname : null;
}
export async function leaveClass(classId) {
  const sb = await client();
  const { data } = await sb.auth.getSession();
  if (data.session) await sb.from('net_members').delete().eq('class_id', classId).eq('user_id', data.session.user.id);
}

/* ---------- learning records, kept with the class account (supabase/network-progress.sql) ---------- */
/** → { data, updated_at } or null */
export async function loadProgress(classId) {
  const sb = await client(); const s = await session(sb);
  const { data, error } = await sb.from('net_progress').select('data, updated_at').eq('class_id', classId).eq('user_id', s.user.id).maybeSingle();
  if (error) throw known(Object.assign(new Error(error.message), { code: error.code }));
  return data;
}
export async function saveProgress(classId, data) {
  const sb = await client(); const s = await session(sb);
  check(await sb.from('net_progress').upsert({ class_id: classId, user_id: s.user.id, data }, { onConflict: 'class_id,user_id' }));
}
/** forget this browser's anonymous account (the class membership stays; log in again with nickname + PIN) */
export async function signOutDevice() {
  try { const sb = await client(); await sb.auth.signOut({ scope: 'local' }); } catch (e) { /* offline */ }
  Store.del('netw.auth');
}

/* answers wait in this browser until they are sent, so nothing is lost when the network drops */
const QKEY = 'netw.queue';
let flushing = false;
export function logAttempt(row) {
  if (!enabled) return;
  const q = Store.get(QKEY, []);
  q.push(row);
  Store.set(QKEY, q.slice(-500));
  flushAttempts();
}
export async function flushAttempts() {
  if (!enabled || flushing) return;
  const q = Store.get(QKEY, []);
  if (!q.length) return;
  flushing = true;
  try {
    const sb = await client();
    await ensureSession(sb);
    const { error } = await sb.from('net_attempts').insert(q);
    if (!error) Store.set(QKEY, Store.get(QKEY, []).slice(q.length));
    else if (/row-level security|violates|check constraint|foreign key/i.test(error.message)) {   // left the class, or a row the database refuses: send one by one, drop the refused
      for (const row of q) { const r = await sb.from('net_attempts').insert(row); if (r.error && !/row-level security|violates|check constraint|foreign key/i.test(r.error.message)) throw r.error; }
      Store.set(QKEY, Store.get(QKEY, []).slice(q.length));
    }
  } catch (e) { /* offline: keep the queue */ }
  finally { flushing = false; }
}
if (typeof window !== 'undefined') window.addEventListener('online', () => flushAttempts());

/** live changes of the class row (assignment, live) for students. Returns an unsubscribe function. */
export async function watchClass(classId, onChange) {
  const sb = await client();
  const ch = sb.channel('netc-' + classId)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'net_classes', filter: `id=eq.${classId}` }, p => onChange(p.new))
    .subscribe();
  const ping = sb.channel('netping-' + classId).on('broadcast', { event: 'changed' }, () => onChange(null)).subscribe();
  return () => { sb.removeChannel(ch); sb.removeChannel(ping); };
}
/** the server's clock (null if unknown) */
export async function serverNow() {
  const sb = await client();
  const { data, error } = await sb.rpc('server_now');
  return error || !data ? null : new Date(data);
}

/* ---------- teachers (the same accounts as SQL Practice) ---------- */
export async function teacherSession() {
  const sb = await client();
  const { data } = await sb.auth.getSession();
  const s = data.session;
  return !s || s.user.is_anonymous ? null : s;
}
export async function signIn(email, password) { const sb = await client(); return check(await sb.auth.signInWithPassword({ email, password })); }
export async function amITeacher() { const sb = await client(); return !!check(await sb.rpc('am_i_teacher')); }
export async function signOut() { const sb = await client(); await sb.auth.signOut(); }
export async function resetPassword(email) { const sb = await client(); return check(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] })); }

export async function myClasses() {
  const sb = await client();
  const s = await teacherSession();
  if (!s) return [];
  try { return check(await sb.from('net_classes').select('*').eq('teacher_id', s.user.id).order('created_at', { ascending: false })); } catch (e) { throw known(e); }
}
export async function createClass(name) { const sb = await client(); try { return check(await sb.rpc('net_create_class', { p_name: name })); } catch (e) { throw known(e); } }
/** tell the students' screens that the class row changed (they read it again) */
export async function pingClass(id) {
  try { const sb = await client(), ch = sb.channel('netping-' + id); await ch.send({ type: 'broadcast', event: 'changed', payload: {} }); sb.removeChannel(ch); } catch (e) { /* the students also look by themselves */ }
}
const pinged = (id, row) => { pingClass(id); return row; };
export async function updateClass(id, patch) { const sb = await client(); return pinged(id, check(await sb.from('net_classes').update(patch).eq('id', id).select().single())); }
export async function startLive(id, min) { const sb = await client(); return pinged(id, check(await sb.rpc('net_start_live', { p_class: id, p_min: min }))); }
export async function stopLive(id) { const sb = await client(); return pinged(id, check(await sb.rpc('net_stop_live', { p_class: id }))); }
export async function startQuick(id, quick, min) { const sb = await client(); return pinged(id, check(await sb.rpc('net_start_quick', { p_class: id, p_quick: quick, p_min: min }))); }
export async function stopQuick(id) { const sb = await client(); return pinged(id, check(await sb.rpc('net_stop_quick', { p_class: id }))); }
export async function deleteClass(id) { const sb = await client(); check(await sb.from('net_classes').delete().eq('id', id)); }
export async function members(classId) { const sb = await client(); return check(await sb.from('net_members').select('user_id, nickname, joined_at').eq('class_id', classId).order('joined_at')); }
export async function removeMember(classId, userId) { const sb = await client(); check(await sb.from('net_members').delete().eq('class_id', classId).eq('user_id', userId)); }
export async function pinStatus(classId) { const sb = await client(); return check(await sb.rpc('net_pin_status', { p_class: classId })); }
export async function teacherSetPin(classId, userId, pin) { const sb = await client(); try { return check(await sb.rpc('net_teacher_set_pin', { p_class: classId, p_user: userId, p_pin: pin })); } catch (e) { throw known(e); } }
/** answers of a class (optionally only one assignment: its seed) */
export async function attempts(classId, seed) {
  const sb = await client();
  const out = [];
  for (let from = 0; ; from += 1000) {
    let q = sb.from('net_attempts').select('*').eq('class_id', classId).order('id').range(from, from + 999);
    if (seed) q = q.eq('seed', seed);
    const rows = check(await q);
    out.push(...rows);
    if (rows.length < 1000) break;
  }
  return out;
}
/** new answers + members joining, for the teacher's live table. Returns an unsubscribe function. */
export async function watchDashboard(classId, onAttempt, onMember, onStatus) {
  const sb = await client();
  const ch = sb.channel('netdash-' + classId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'net_attempts', filter: `class_id=eq.${classId}` }, p => onAttempt(p.new))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'net_members', filter: `class_id=eq.${classId}` }, () => onMember())
    .subscribe(status => { if (onStatus) onStatus(status); });
  return () => sb.removeChannel(ch);
}
