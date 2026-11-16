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
  11: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'l1Stack', cap: 'cap1' }, { fig: 'bitsSignal', cap: 'cap2' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'media3', cap: 'cap3' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'nicPath', cap: 'cap4' },
    { points: 3 }
  ],
  12: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'atten', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'noise', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'collide', cap: 'cap3' },
    { h: 'h4' }, { p: 'p4' }, { fig: 'repeaterFig', cap: 'cap4' }, { demo: 'repeater' },
    { points: 3 }
  ],
  13: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'hubAll', cap: 'cap1' }, { fig: 'hubRepeater', cap: 'cap4' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'hubColl', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'collDomain', cap: 'cap3' },
    { h: 'h4' }, { p: 'p4' }, { demo: 'hubswitch', opts: { mode: 'hub' } },
    { points: 3 }
  ],
  14: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'l2Scope', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'frameParts', cap: 'cap2' }, { fig: 'bitstream', cap: 'cap3' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'syncPreamble', cap: 'cap4' }, { demo: 'frame' },
    { points: 3 }
  ],
  15: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'macStruct', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'cast3', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'nicFilter', cap: 'cap3' }, { demo: 'cast' },
    { points: 3 }
  ],
  16: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'ethFrame', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'fcsCheck', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'csmaFlow', cap: 'cap3' }, { demo: 'csmacd' },
    { points: 3 }
  ],
  17: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'learn', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'filterFlood', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'collDomain', cap: 'cap3' }, { demo: 'hubswitch', opts: { mode: 'switch' } },
    { points: 3 }
  ],
  18: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'duplex2', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'wires', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'bufferQ', cap: 'cap3' },
    { points: 3 }
  ],
  19: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'l3Join', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'l2Scope', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { demo: 'route' },
    { points: 3 }
  ],
  20: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'ipOver', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'ipPacket', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'pktInFrame', cap: 'cap3' },
    { points: 3 }
  ],
  21: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'dotted', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'netHost', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { demo: 'subnet' },
    { points: 3 }
  ],
  22: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'classes', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'specialAddr', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'loopbackFig', cap: 'cap3' },
    { points: 3 }
  ],
  23: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'subnetSplit', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'maskBits', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'andCalc', cap: 'cap3' }, { demo: 'subnet' },
    { points: 3 }
  ],
  24: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'classWaste', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'prefixFig', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'aggregate', cap: 'cap3' },
    { points: 3 }
  ],
  25: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'dhcpItems', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'dhcpFlow', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'lease', cap: 'cap3' },
    { points: 3 }
  ],
  26: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'arpNeed', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'arpFlow', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'arpTableFig', cap: 'cap3' }, { demo: 'arp' },
    { points: 3 }
  ],
  27: [
    { lead: 'lead' },
    { h: 'h1' }, { p: 'p1' }, { fig: 'dnsAsk', cap: 'cap1' },
    { h: 'h2' }, { p: 'p2' }, { fig: 'domainTree', cap: 'cap2' },
    { h: 'h3' }, { p: 'p3' }, { fig: 'dnsResolve', cap: 'cap3' },
    { points: 3 }
  ]
};
export const hasPage = n => !!LESSON_PAGES[n];
/** lessons that have a page, in order, and the one before / after n */
export const PAGE_LIST = Object.keys(LESSON_PAGES).map(Number).sort((a, b) => a - b);
export const prevPage = n => PAGE_LIST.filter(x => x < n).pop();
export const nextPage = n => PAGE_LIST.find(x => x > n);

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
