/* =========================================================
 * store.js — everything kept in this browser (nothing is sent anywhere)
 * ========================================================= */
export const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
};
export const KEYS = { settings: 'netw.settings', progress: 'netw.progress' };

const DAY = 86400000;
export const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

/* ---------- settings ---------- */
export function loadSettings(detected) {
  return Object.assign({ lang: detected, second: null, theme: 'auto', size: 'm', presenter: false, furi: true, range: 'all' }, Store.get(KEYS.settings, {}));
}
export function saveSettings(s) { Store.set(KEYS.settings, s); }

/* ---------- progress ----------
 * known:  wordId → time the student marked "I know it" on a flashcard
 * review: wordId → { step, due }  words answered wrong come back after 1, 3, 7 days
 * stats:  wordId → { ok, ng }      answer counts (quiz + sort)
 * All keys are word ids, so switching language never touches progress.
 */
export const REVIEW_DAYS = [0, 1, 3, 7];
export function loadProgress() {
  return Object.assign({ known: {}, review: {}, stats: {} }, Store.get(KEYS.progress, {}));
}
export function saveProgress(p) { Store.set(KEYS.progress, p); }

/** record one answer; a wrong answer puts the word into review (due today) */
export function recordAnswer(p, id, ok, inReview) {
  const s = p.stats[id] || (p.stats[id] = { ok: 0, ng: 0 });
  if (ok) s.ok++; else s.ng++;
  const r = p.review[id];
  if (!ok) { p.review[id] = { step: 0, due: today() }; return; }
  if (r && inReview) {
    r.step++;
    if (r.step >= REVIEW_DAYS.length) delete p.review[id];
    else r.due = today() + REVIEW_DAYS[r.step] * DAY;
  }
}
export function dueWords(p) {
  const t = today();
  return Object.entries(p.review).filter(([, r]) => r.due <= t).map(([id]) => id);
}
