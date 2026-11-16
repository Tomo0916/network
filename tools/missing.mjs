#!/usr/bin/env node
/* =========================================================
 * tools/missing.mjs — what still needs translating
 *     node tools/missing.mjs            a summary for every language
 *     node tools/missing.mjs vi > vi.json   the missing texts of one language, with the Japanese and English source
 * Write a new lesson in Japanese first (text/ja/<n>.js, then text/easy and text/en),
 * then run this for each language and translate the listed texts into text/<lang>/<n>.js (or i18n/<lang>.js).
 * ========================================================= */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['ja', 'easy', 'en', 'ne', 'fr', 'my', 'bn', 'si', 'id', 'vi', 'zh'];
async function load(l) {
  const d = { ...(await import(pathToFileURL(path.join(root, 'i18n', l + '.js')).href)).default }, where = {};
  Object.keys(d).forEach(k => { where[k] = `i18n/${l}.js`; });
  const dir = path.join(root, 'text', l);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const part = (await import(pathToFileURL(path.join(dir, f)).href)).default;
    Object.entries(part).forEach(([k, v]) => { d[k] = v; where[k] = `text/${l}/${f}`; });
  }
  return { d, where };
}
const all = {};
for (const l of LANGS) all[l] = await load(l);
const ja = all.ja.d, en = all.en.d;
/* the file a missing key should go to */
const target = (l, k) => k.startsWith('fg.') ? `text/${l}/fig.js` : /^ls\.(\d+)\./.test(k) ? `text/${l}/${k.split('.')[1]}.js` : `i18n/${l}.js`;
const want = process.argv[2];
if (want) {
  const out = {};
  for (const k of Object.keys(ja)) if (!(k in all[want].d)) (out[target(want, k)] = out[target(want, k)] || {})[k] = { ja: ja[k], en: en[k] };
  console.log(JSON.stringify(out, null, 1));
} else {
  for (const l of LANGS) {
    const miss = Object.keys(ja).filter(k => !(k in all[l].d));
    console.log(`${l.padEnd(5)} ${String(miss.length).padStart(4)} missing${miss.length ? '  e.g. ' + miss.slice(0, 3).join(', ') : ''}`);
  }
}
