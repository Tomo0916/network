/* =========================================================
 * groups.js — layers, groups, chapters and lessons.
 * The chapters and lessons follow the class textbook (5 chapters, 44 lessons).
 * Names are translated in i18n/<lang>.js:  layer.<id>  g.<id>  ch.<n>  lesson.<n>
 * ========================================================= */
export const LAYERS = ['base', 'L1', 'L2', 'L3', 'L4', 'L57'];

/* order = order on screen. color = CSS variable --g-<id> in css/app.css */
export const GROUPS = [
  { id: 'basics', layer: 'base' },
  { id: 'model', layer: 'base' },
  { id: 'l1', layer: 'L1' },
  { id: 'signal', layer: 'L1' },
  { id: 'devices', layer: 'L1' },
  { id: 'l2', layer: 'L2' },
  { id: 'addressing', layer: 'L2' },
  { id: 'mac', layer: 'L2' },
  { id: 'duplex', layer: 'L2' },
  { id: 'l3', layer: 'L3' },
  { id: 'subnet', layer: 'L3' },
  { id: 'l3help', layer: 'L3' },
  { id: 'routing', layer: 'L3' },
  { id: 'rtproto', layer: 'L3' },
  { id: 'icmpg', layer: 'L3' },
  { id: 'nat', layer: 'L3' },
  { id: 'l4', layer: 'L4' },
  { id: 'port', layer: 'L4' },
  { id: 'upper', layer: 'L57' }
];
export const GROUP_BY_ID = Object.fromEntries(GROUPS.map(g => [g.id, g]));

/* chapters of the textbook and the lessons in each (lesson numbers are the textbook's) */
export const CHAPTERS = [
  { n: 1, from: 1, to: 10 },
  { n: 2, from: 11, to: 18 },
  { n: 3, from: 19, to: 27 },
  { n: 4, from: 28, to: 35 },
  { n: 5, from: 36, to: 44 }
];
export const LESSONS = Array.from({ length: 44 }, (_, i) => i + 1);
export const chapterOf = lesson => (CHAPTERS.find(c => lesson >= c.from && lesson <= c.to) || {}).n;

/* animations (js/demos/<id>.js) */
export const DEMOS = ['repeater', 'hubswitch', 'cast', 'frame', 'csmacd', 'subnet', 'arp', 'route'];
