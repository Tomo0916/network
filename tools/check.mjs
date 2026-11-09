#!/usr/bin/env node
/* =========================================================
 * tools/check.mjs — run before publishing:
 *     node tools/check.mjs
 *  (no npm install needed)
 *  1. words: ids, groups, lessons, confusable terms and animations exist
 *  2. language files: every term has its texts, keys match English,
 *     the same {placeholders}, no Japanese in other languages,
 *     furigana only in easy.js and every kanji in easy.js has furigana
 *  3. every text key the screens use exists in en.js
 *  4. the quiz can always make 4 different choices
 * Errors (✗) must be fixed. Warnings (!) are allowed (e.g. a language not translated yet).
 * ========================================================= */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const imp = p => import(pathToFileURL(path.join(root, p)).href);
const { WORDS } = await imp('js/words.js');
const { GROUPS, LESSONS, DEMOS, LAYERS } = await imp('js/groups.js');
const { makeQuestion, RANGES, wordsIn } = await imp('js/quiz.js');
const { SCENES } = await imp('js/scenes.js');
const { FACTS, factKeys } = await imp('js/facts.js');
const { makeQuiz, poolSize } = await imp('js/quiz.js');

let errors = 0, warnings = 0;
const err = (...a) => { errors++; console.log('  ✗', ...a); };
const warn = (...a) => { warnings++; console.log('  !', ...a); };

/* ---------- 1. words ---------- */
console.log('1. Words');
const ids = new Set(), groupIds = new Set(GROUPS.map(g => g.id));
const KANJI = /[一-鿿]/;
for (const w of WORDS) {
  if (!/^[a-z][a-z0-9]*$/.test(w.id)) err(`id "${w.id}": use lowercase letters and digits only`);
  if (ids.has(w.id)) err(`id "${w.id}" is used twice`);
  ids.add(w.id);
  if (!w.term) err(`${w.id}: term is empty`);
  if (!w.en) err(`${w.id}: en is empty`);
  if (KANJI.test(w.term) && !w.yomi) err(`${w.id}: "${w.term}" has kanji, add yomi`);
  if (!groupIds.has(w.group)) err(`${w.id}: group "${w.group}" is not in groups.js`);
  if (!LESSONS.includes(w.lesson)) err(`${w.id}: lesson ${w.lesson} is not in LESSONS (groups.js)`);
  if (w.demo && !DEMOS.includes(w.demo)) err(`${w.id}: demo "${w.demo}" is not in DEMOS (groups.js)`);
}
for (const w of WORDS) (w.related || []).forEach(r => {
  if (r === w.id) err(`${w.id}: related lists itself`);
  else if (!ids.has(r)) err(`${w.id}: related "${r}" is not a word id`);
});
GROUPS.forEach(g => { if (!WORDS.some(w => w.group === g.id)) warn(`group "${g.id}" has no words`); });
LESSONS.forEach(n => { if (!WORDS.some(w => w.lesson === n)) warn(`lesson ${n} has no words`); });
DEMOS.forEach(d => { if (!fs.existsSync(path.join(root, 'js/demos', d + '.js'))) err(`demo "${d}": js/demos/${d}.js is missing`); });
const sceneIds = new Set();
for (const sc of SCENES) {
  if (!/^[a-z][a-z0-9]*$/.test(sc.id)) err(`scene "${sc.id}": use lowercase letters and digits only`);
  if (sceneIds.has(sc.id)) err(`scene "${sc.id}" is used twice`);
  sceneIds.add(sc.id);
  if (!ids.has(sc.word)) err(`scene ${sc.id}: word "${sc.word}" is not a word id`);
  if (!Array.isArray(sc.wrong) || sc.wrong.length !== 3 || new Set(sc.wrong).size !== 3) err(`scene ${sc.id}: needs 3 different wrong choices`);
  (sc.wrong || []).forEach(x => { if (x === sc.word) err(`scene ${sc.id}: the answer is also a wrong choice`); else if (!ids.has(x)) err(`scene ${sc.id}: wrong choice "${x}" is not a word id`); });
}
WORDS.forEach(w => { if (!SCENES.some(s => s.word === w.id)) warn(`${w.id} has no situation question yet`); });
const factIds = new Set();
for (const f of FACTS) {
  if (!/^[a-z][a-z0-9]*$/.test(f.id)) err(`fact "${f.id}": use lowercase letters and digits only`);
  if (factIds.has(f.id)) err(`fact "${f.id}" is used twice`);
  factIds.add(f.id);
  if (!ids.has(f.word)) err(`fact ${f.id}: word "${f.word}" is not a word id`);
  if (!Array.isArray(f.opts) || f.opts.length !== 4) err(`fact ${f.id}: needs 4 choices`);
  const seen = new Set((f.opts || []).map(o => JSON.stringify(o)));
  if (seen.size !== (f.opts || []).length) err(`fact ${f.id}: two choices are the same`);
  (f.opts || []).forEach(o => { if (o && o.seq) o.seq.forEach(t => { if (t.startsWith('w:') && !ids.has(t.slice(2))) err(`fact ${f.id}: "${t}" is not a word id`); }); });
}
console.log(`   ${WORDS.length} words, ${SCENES.length} situation questions, ${FACTS.length} number/order questions, ${GROUPS.length} groups, ${LESSONS.length} lessons`);

/* ---------- 2. languages ---------- */
console.log('2. Language files');
const LANGS = ['ja', 'easy', 'en', 'ne', 'fr', 'my', 'bn', 'si', 'id', 'vi', 'zh'];
const MUST = ['ja', 'easy', 'en'];       // the teacher writes these three
const dicts = {};
for (const l of LANGS) dicts[l] = (await imp(`i18n/${l}.js`)).default;
const en = dicts.en;
const wordKeys = [...WORDS.flatMap(w => [`w.${w.id}.desc`, `w.${w.id}.tip`]), ...SCENES.map(s => `s.${s.id}`), ...FACTS.map(f => `f.${f.id}`), ...factKeys()];
wordKeys.forEach(k => { if (!(k in en)) err(`en.js is missing "${k}"`); });
const KANA = /[぀-ヿ]/, CJK = /[぀-ヿ一-鿿]/, RUBY = /\{[^{}|]+\|[^{}]+\}/g;
const ph = s => [...new Set([...String(s).matchAll(/\{(\w+)\}/g)].map(m => m[1]))].sort().join();
for (const l of LANGS) {
  const d = dicts[l];
  const missing = Object.keys(en).filter(k => !(k in d));
  if (missing.length) {
    if (MUST.includes(l)) missing.forEach(k => err(`${l}.js is missing "${k}"`));
    else warn(`${l}.js: ${missing.length} of ${Object.keys(en).length} texts not translated yet (shown in English)`);
  }
  Object.keys(d).forEach(k => { if (!(k in en)) warn(`${l}.js has "${k}", which en.js does not have`); });
  for (const [k, v] of Object.entries(d)) {
    if (typeof v !== 'string' || !v.trim()) { err(`${l}.js "${k}" is empty`); continue; }
    if (k in en && ph(v) !== ph(en[k])) err(`${l}.js "${k}": placeholders {${ph(v)}} ≠ English {${ph(en[k])}}`);
    const plain = v.replace(RUBY, '');
    if (l !== 'ja' && l !== 'easy' && (l === 'zh' ? KANA.test(plain) : CJK.test(plain))) err(`${l}.js "${k}" contains Japanese: ${v}`);
    if (l !== 'easy' && RUBY.test(v)) err(`${l}.js "${k}" uses furigana markup (only easy.js may)`);
    RUBY.lastIndex = 0;
    if (l === 'easy') {
      if (KANJI.test(plain)) err(`easy.js "${k}": kanji without furigana: ${plain.match(/[一-鿿]+/g).join(' ')}`);
      if (/\{[^{}]*$|^[^{}]*\}/.test(v.replace(RUBY, '').replace(/\{\w+\}/g, ''))) err(`easy.js "${k}": broken { } markup`);
      for (const m of v.matchAll(/\{([^{}|]+)\|([^{}]+)\}/g)) if (!/^[ぁ-ゖー]+$/.test(m[2])) err(`easy.js "${k}": reading "${m[2]}" should be hiragana`);
    }
  }
}

/* ---------- 3. keys used by the screens ---------- */
console.log('3. Text keys used in the code');
const used = new Set();
for (const f of ['js/student.js', 'js/teacher.js', 'js/common.js', ...DEMOS.map(d => `js/demos/${d}.js`)]) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of src.matchAll(/\b(?:T|H|bi)\(\s*'([a-z]+(?:\.[A-Za-z0-9]+)+)'(?!\s*\+)/g)) used.add(m[1]);
  for (const m of src.matchAll(/'((?:dm|quiz|cards|review|home|words|sort|btn|set|pres|prog|range|demos?|layer|nav|mode|t|foot)\.[A-Za-z0-9]+)'(?!\s*\+)/g)) used.add(m[1]);
}
['home', 'words', 'cards', 'quiz', 'sort', 'review', 'demos'].forEach(v => used.add('nav.' + v));
['present', 'share', 'test'].forEach(v => used.add('t.' + v));
['d2t', 't2d', 's2t', 'e2t', 'tip2t', 'listen', 'fact'].forEach(v => used.add('quiz.' + v));
['mix', 'scene', 'fact', 'listen'].forEach(m => { used.add('quiz.m.' + m); used.add('quiz.m.' + m + 'Sub'); });
['t.qFact', 't.fFact'].forEach(k => used.add(k));
['t.qChoice', 't.qScene', 't.qWrite'].forEach(k => used.add(k));
GROUPS.forEach(g => used.add('g.' + g.id));
LAYERS.forEach(l => used.add('layer.' + l));
DEMOS.forEach(d => used.add('demo.' + d));
for (let i = 0; i < 6; i++) used.add('dm.cs' + i);
for (let i = 0; i < 5; i++) used.add('dm.fr' + i);
['Dst', 'Src', 'Type', 'Data', 'Fcs'].forEach(f => used.add('dm.f' + f));
used.forEach(k => { if (!(k in en)) err(`en.js is missing "${k}" (used by the app)`); });

/* ---------- 4. quiz ---------- */
console.log('4. Quiz');
for (const w of WORDS) for (let i = 0; i < 20; i++) {
  const q = makeQuestion(w.id);
  if (q.opts.length !== Math.min(4, WORDS.length) || new Set(q.opts).size !== q.opts.length || !q.opts.includes(w.id)) { err(`${w.id}: bad choices ${q.opts}`); break; }
}
RANGES.forEach(r => { if (!wordsIn(r).length) warn(`range "${r}" has no words`); });
const all = WORDS.map(w => w.id);
for (const mode of ['mix', 'scene', 'fact', 'listen']) for (let i = 0; i < 10; i++) {
  const qs = makeQuiz(all, 40, mode);
  if (qs.length !== Math.min(40, poolSize(all, mode))) { err(`quiz ${mode}: made ${qs.length} questions`); break; }
  const bad = qs.find(q => q.opts.length !== 4 || new Set(q.opts).size !== 4 || !q.opts.includes(q.answer));
  if (bad) { err(`quiz ${mode}: bad question ${JSON.stringify(bad)}`); break; }
}
console.log(`   questions in all words: mix ${poolSize(all, 'mix')}, situations ${poolSize(all, 'scene')}, numbers/order ${poolSize(all, 'fact')}, listening ${poolSize(all, 'listen')}`);

console.log(errors ? `\n${errors} error(s), ${warnings} warning(s)` : `\nOK (${warnings} warning(s))`);
process.exit(errors ? 1 : 0);
