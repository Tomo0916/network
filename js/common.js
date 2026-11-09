/* =========================================================
 * common.js — small pieces used by both the student page and the teacher page
 * ========================================================= */
import { esc } from './i18n.js';
import { LAYERS } from './groups.js';
import { I } from './ui.js';

const KANJI = /[一-鿿]/;
/** the Japanese term with furigana (kanji) or a reading line (abbreviations) */
export function termHTML(w, cls = '') {
  const word = KANJI.test(w.term) && w.yomi ? `<ruby>${esc(w.term)}<rt>${esc(w.yomi)}</rt></ruby>` : esc(w.term);
  const yomi = !KANJI.test(w.term) && w.yomi ? `<span class="yomi">${esc(w.yomi)}</span>` : '';
  return `<span class="term ${cls}" lang="ja">${word}</span>${yomi}`;
}
export const enName = w => `<span class="en-name" lang="en">${esc(w.en)}</span>`;

/** range id → its name in the current language */
export function rangeLabel(r, T) {
  if (r === 'all') return T('range.all');
  if (LAYERS.includes(r)) return T('layer.' + r);
  if (r.startsWith('lesson-')) return T('range.lesson', { n: r.slice(7) });
  return T('g.' + r.slice(2));
}

/* listen: the browser reads the Japanese term aloud (no sound file needed) */
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
export const speakBtn = (w, label) => canSpeak ? `<button class="speak" data-act="speak" data-id="${w.id}" aria-label="${esc(label)}" title="${esc(label)}">${I.sound}</button>` : '';
export function speak(w) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w.yomi || w.term);
    u.lang = 'ja-JP'; u.rate = 0.9;
    const v = speechSynthesis.getVoices().find(x => /^ja/i.test(x.lang)); if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) { /* no speech on this device */ }
}

/* a choice of a number/order question (js/facts.js) as HTML; tr(key, vars) gives the text in the wanted language */
import { WORD_BY_ID } from './words.js';
export function choiceHTML(o, tr) {
  if (typeof o === 'string') return `<span class="mono">${esc(o)}</span>`;
  if (o.k) return esc(tr(o.k, o.v));
  return o.seq.map(t => t.startsWith('w:') ? `<span lang="ja">${esc(WORD_BY_ID[t.slice(2)].term)}</span>` : esc(tr(t))).join(' <span class="arrow">→</span> ');
}
