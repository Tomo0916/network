/* =========================================================
 * lessons.js — the explanation pages ("テキスト"), one per textbook lesson.
 * The texts live in i18n/<lang>.js as  ls.<n>.<key> .
 *
 * A page is a list of blocks, shown from top to bottom:
 *   { lead: 'lead' }                 the opening sentence(s)
 *   { h: 'h1' }                      a heading
 *   { p: 'p1' }                      a paragraph
 *   { fig: 'hubAll', cap: 'cap1' }   a still diagram from js/figures.js, with its caption
 *   { demo: 'hubswitch', opts: {} }  an animation from js/demos/ (opts are passed to it)
 *   { points: 3 }                    "Key points": ls.<n>.pt1 … pt3
 *
 * In a text, [[hub:ハブ]] makes "ハブ" a button that opens the term "hub".
 * After the blocks the page always shows the terms of the lesson and a button to its quiz.
 * ========================================================= */
export const LESSON_PAGES = {
  13: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'hubAll', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'hubColl', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'collDomain', cap: 'cap3' },
    { h: 'h4' }, { p: 'p4' }, { demo: 'hubswitch', opts: { mode: 'hub' } },
    { points: 3 }
  ]
};
export const hasPage = n => !!LESSON_PAGES[n];

/** every i18n key the pages use (for tools/check.mjs) */
export function lessonKeys() {
  const keys = [];
  for (const [n, blocks] of Object.entries(LESSON_PAGES)) for (const b of blocks) {
    for (const f of ['lead', 'h', 'p', 'cap']) if (b[f]) keys.push(`ls.${n}.${b[f]}`);
    if (b.points) for (let i = 1; i <= b.points; i++) keys.push(`ls.${n}.pt${i}`);
  }
  return keys;
}
/** term ids written as [[id:…]] in a text */
export const termRefs = s => [...String(s).matchAll(/\[\[([a-z0-9]+):/g)].map(m => m[1]);
