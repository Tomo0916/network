/* =========================================================
 * quiz.js — ranges and question making (no screen code; tools/check.mjs tests it)
 * ========================================================= */
import { WORDS, WORD_BY_ID } from './words.js';
import { GROUPS, GROUP_BY_ID, LESSONS, LAYERS } from './groups.js';
import { shuffle } from './ui.js';
import { SCENES, SCENE_BY_ID, scenesOf } from './scenes.js';

/* ---------- ranges ----------
 * 'all' · 'L1' · 'L2' · 'lesson-1' · 'g-signal'
 * Teachers can hand out a link with  ?range=lesson-2  */
export const RANGES = ['all', ...LAYERS, ...LESSONS.map(n => `lesson-${n}`), ...GROUPS.map(g => `g-${g.id}`)];
export const isRange = r => RANGES.includes(r);
export function inRange(w, r) {
  if (!r || r === 'all') return true;
  if (LAYERS.includes(r)) return GROUP_BY_ID[w.group].layer === r;
  if (r.startsWith('lesson-')) return w.lesson === Number(r.slice(7));
  if (r.startsWith('g-')) return w.group === r.slice(2);
  return true;
}
export const wordsIn = r => WORDS.filter(w => inRange(w, r));
export const groupsIn = r => GROUPS.filter(g => WORDS.some(w => w.group === g.id && inRange(w, r)));

/* ---------- 4-choice quiz ----------
 * wrong choices: confusable terms first, then the same group, then the same layer, then anything */
export function distractors(w, n = 3, rnd = Math.random) {
  const out = [];
  const add = id => { if (id !== w.id && WORD_BY_ID[id] && !out.includes(id) && out.length < n) out.push(id); };
  shuffle(w.related || [], rnd).forEach(add);
  shuffle(WORDS.filter(x => x.group === w.group), rnd).forEach(x => add(x.id));
  const layer = GROUP_BY_ID[w.group].layer;
  shuffle(WORDS.filter(x => GROUP_BY_ID[x.group].layer === layer), rnd).forEach(x => add(x.id));
  shuffle(WORDS, rnd).forEach(x => add(x.id));
  return out;
}
/** type 'd2t' = read the explanation, choose the term · 't2d' = read the term, choose the explanation */
export function makeQuestion(id, type) {
  return { id, type: type || (Math.random() < 0.5 ? 'd2t' : 't2d'), opts: shuffle([id, ...distractors(WORD_BY_ID[id])]) };
}
/** 's2t' = read a situation, choose the term (wrong choices are set by hand in scenes.js) */
export function sceneQuestion(sceneId, rnd = Math.random) {
  const sc = SCENE_BY_ID[sceneId];
  return { id: sc.word, type: 's2t', scene: sc.id, opts: shuffle([sc.word, ...sc.wrong], rnd) };
}
export const scenesIn = ids => SCENES.filter(s => ids.includes(s.word));
/** mode 'mix': each word gets a situation question half of the time (if it has one) · mode 'scene': situations only */
export function makeQuiz(ids, n = 10, mode = 'mix') {
  if (mode === 'scene') return shuffle(scenesIn(ids)).slice(0, n).map(s => sceneQuestion(s.id));
  return shuffle(ids).slice(0, n).map(id => {
    const sc = scenesOf(id);
    return sc.length && Math.random() < 0.5 ? sceneQuestion(shuffle(sc)[0].id) : makeQuestion(id);
  });
}

/* ---------- paper test (same settings + version → same test) ---------- */
export function makeTest(ids, n, format, rnd) {
  if (format === 'scene') return shuffle(scenesIn(ids), rnd).slice(0, n).map(s => sceneQuestion(s.id, rnd));
  return shuffle(ids, rnd).slice(0, n).map(id => ({ id, opts: format === 'choice' ? shuffle([id, ...distractors(WORD_BY_ID[id], 3, rnd)], rnd) : null }));
}

/* ---------- sorting game ---------- */
export function makeSort(ids, n = 10) { return shuffle(ids).slice(0, n); }
