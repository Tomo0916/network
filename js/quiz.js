/* =========================================================
 * quiz.js — ranges and question making (no screen code; tools/check.mjs tests it)
 *
 * A question: { id, type, opts, answer, scene?, fact? }
 *   id      the word the question is about (for review and results)
 *   opts    the choices (word ids, or '0'..'3' for number/order questions)
 *   answer  the right choice
 * Types:
 *   d2t    explanation → term          t2d   term → explanation
 *   e2t    English name → term         tip2t example → term
 *   listen hear the term → term        s2t   situation → term (scenes.js)
 *   fact   number / order question (facts.js)
 * ========================================================= */
import { WORDS, WORD_BY_ID } from './words.js';
import { GROUPS, GROUP_BY_ID, LESSONS, LAYERS } from './groups.js';
import { shuffle } from './ui.js';
import { SCENES, SCENE_BY_ID } from './scenes.js';
import { FACTS, FACT_BY_ID } from './facts.js';

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

/* ---------- wrong choices ----------
 * confusable terms first, then the same group, then the same layer, then anything */
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

/* ---------- one question ---------- */
export const WORD_TYPES = ['d2t', 't2d', 'e2t', 'tip2t', 'listen'];
export function makeQuestion(id, type, rnd = Math.random) {
  type = type || shuffle(['d2t', 't2d'], rnd)[0];
  return { id, type, opts: shuffle([id, ...distractors(WORD_BY_ID[id], 3, rnd)], rnd), answer: id };
}
export function sceneQuestion(sceneId, rnd = Math.random) {
  const sc = SCENE_BY_ID[sceneId];
  return { id: sc.word, type: 's2t', scene: sc.id, opts: shuffle([sc.word, ...sc.wrong], rnd), answer: sc.word };
}
export function factQuestion(factId, rnd = Math.random) {
  const f = FACT_BY_ID[factId];
  return { id: f.word, type: 'fact', fact: f.id, opts: shuffle(['0', '1', '2', '3'], rnd), answer: '0' };
}
export const scenesIn = ids => SCENES.filter(s => ids.includes(s.word));
export const factsIn = ids => FACTS.filter(f => ids.includes(f.word));

/* ---------- a quiz ----------
 * mode 'mix'    every kind of question (situation, number/order, explanation, English, example, listening)
 *      'scene'  situations only        'fact'  numbers and order only        'listen'  listening only
 * opts.listen   false when this device cannot speak (no listening questions then)
 * opts.weight   id → 0..1, words with a higher weight come first (words the student often gets wrong)
 * Each word is asked once before any word is asked a second time, always with a different kind of question. */
export function questionPool(ids, mode = 'mix', opts = {}) {
  const canListen = opts.listen !== false;
  if (mode === 'scene') return scenesIn(ids).map(s => ({ id: s.word, make: () => sceneQuestion(s.id) }));
  if (mode === 'fact') return factsIn(ids).map(f => ({ id: f.word, make: () => factQuestion(f.id) }));
  if (mode === 'listen') return canListen ? ids.map(id => ({ id, make: () => makeQuestion(id, 'listen') })) : [];
  const types = WORD_TYPES.filter(t => t !== 'listen' || canListen);
  return [
    ...ids.flatMap(id => types.map(t => ({ id, make: () => makeQuestion(id, t) }))),
    ...scenesIn(ids).map(s => ({ id: s.word, make: () => sceneQuestion(s.id) })),
    ...factsIn(ids).map(f => ({ id: f.word, make: () => factQuestion(f.id) }))
  ];
}
export function makeQuiz(ids, n = 10, mode = 'mix', opts = {}) {
  const weight = opts.weight || (() => 0);
  const pool = questionPool(ids, mode, opts);
  /* group the pool by word, words with a high weight first */
  const byWord = {};
  shuffle(pool).forEach(p => (byWord[p.id] = byWord[p.id] || []).push(p));
  const order = Object.keys(byWord).map(id => [id, Math.random() - weight(id)]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  const out = [];
  for (let round = 0; out.length < n; round++) {
    let added = false;
    for (const id of order) {
      if (out.length >= n) break;
      const p = byWord[id][round];
      if (p) { out.push(p.make()); added = true; }
    }
    if (!added) break;
  }
  return shuffle(out);
}
export const poolSize = (ids, mode, opts) => questionPool(ids, mode, opts).length;

/* ---------- paper test (same settings + version → same test) ---------- */
export function makeTest(ids, n, format, rnd) {
  if (format === 'scene') return shuffle(scenesIn(ids), rnd).slice(0, n).map(s => sceneQuestion(s.id, rnd));
  if (format === 'fact') return shuffle(factsIn(ids), rnd).slice(0, n).map(f => factQuestion(f.id, rnd));
  return shuffle(ids, rnd).slice(0, n).map(id => ({ id, opts: format === 'choice' ? shuffle([id, ...distractors(WORD_BY_ID[id], 3, rnd)], rnd) : null, answer: id }));
}

/* ---------- sorting game ---------- */
export function makeSort(ids, n = 10) { return shuffle(ids).slice(0, n); }
