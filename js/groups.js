/* =========================================================
 * groups.js — layers, groups and lessons.
 * Names are translated in i18n/<lang>.js:  g.<id>  and  lesson.<n>
 * ========================================================= */
export const LAYERS = ['L1', 'L2'];

/* order = order on screen. color = CSS variable in css/app.css */
export const GROUPS = [
  { id: 'l1', layer: 'L1' },
  { id: 'signal', layer: 'L1' },
  { id: 'devices', layer: 'L1' },
  { id: 'l2', layer: 'L2' },
  { id: 'addressing', layer: 'L2' },
  { id: 'mac', layer: 'L2' }
];
export const GROUP_BY_ID = Object.fromEntries(GROUPS.map(g => [g.id, g]));

/* lessons that exist so far (the number is what the teacher writes on the board) */
export const LESSONS = [1, 2];

/* animations (js/demos/<id>.js) */
export const DEMOS = ['hubswitch', 'cast', 'csmacd'];
