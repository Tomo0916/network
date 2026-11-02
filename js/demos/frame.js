/* frame — building an Ethernet frame: data, header (framing), FCS, preamble, then onto the cable */
import { sleep, reduce, escAttr } from './kit.js';

const STEPS = 5;
/* field: [key, width in the drawing, bytes, colour class] */
const FIELDS = [
  ['pre', 74, '8', 'f-pre'],
  ['dst', 72, '6', 'f-hd'],
  ['src', 72, '6', 'f-hd'],
  ['type', 44, '2', 'f-hd'],
  ['data', 120, '46–1500', 'f-data'],
  ['fcs', 50, '4', 'f-fcs']
];
const SHOWN = [['data'], ['dst', 'src', 'type', 'data'], ['dst', 'src', 'type', 'data', 'fcs'], FIELDS.map(f => f[0]), FIELDS.map(f => f[0])];

export default {
  id: 'frame',
  mount(el, ctx) {
    let n = 0, busy = false;
    const label = k => k === 'pre' ? ctx.term('preamble') : ctx.T('dm.f' + k[0].toUpperCase() + k.slice(1));
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 460 230" role="img" aria-label="${ctx.T('demo.frame')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite"></div>
        <div class="demo-ctl">
          <button class="btn btn-ghost btn-sm" data-k="back">← ${ctx.H('btn.prev')}</button>
          <button class="btn btn-primary btn-sm" data-k="fwd">${ctx.H('btn.next')} ▶</button>
          <button class="btn btn-ghost btn-sm" data-k="restart">${ctx.H('dm.restart')}</button>
          <span class="count"></span>
        </div>
      </div></div>`;
    const svg = el.querySelector('svg');

    function frameSvg(keys, dx) {
      const fs = FIELDS.filter(f => keys.includes(f[0]));
      const total = fs.reduce((a, f) => a + f[1], 0);
      let x = (460 - total) / 2 + dx;
      return fs.map(([k, w, bytes, cls]) => {
        const g = `<g class="field ${cls}"><rect x="${x}" y="70" width="${w}" height="56" rx="4"/>
          <text x="${x + w / 2}" y="94" text-anchor="middle">${escAttr(label(k))}</text>
          <text class="sub" x="${x + w / 2}" y="113" text-anchor="middle">${escAttr(k === 'pre' ? '1010…' : ctx.T('dm.bytes', { n: bytes }))}</text></g>`;
        x += w;
        return g;
      }).join('');
    }
    function brace(keys) {
      if (!keys.includes('dst')) return '';
      const fs = FIELDS.filter(f => keys.includes(f[0]));
      const total = fs.reduce((a, f) => a + f[1], 0);
      let x = (460 - total) / 2, start = 0, end = 0;
      fs.forEach(([k, w]) => { if (k === 'dst') start = x; if (k === 'type') end = x + w; x += w; });
      return `<path class="brace" d="M${start} 62v-8H${end}v8"/><text class="port" x="${(start + end) / 2}" y="46" text-anchor="middle">${escAttr(ctx.T('dm.header'))}</text>`;
    }
    async function go(step, still) {
      if (busy) return;
      busy = true; n = step;
      el.querySelector('.narr').innerHTML = ctx.H('dm.fr' + n);
      el.querySelector('.count').textContent = `${n + 1} / ${STEPS}`;
      el.querySelector('[data-k="back"]').disabled = n === 0;
      el.querySelector('[data-k="fwd"]').disabled = n === STEPS - 1;
      const keys = SHOWN[n];
      svg.innerHTML = `<line class="bus" x1="10" y1="196" x2="450" y2="196"/><text class="port" x="440" y="218" text-anchor="end">${escAttr(ctx.T('dm.cableShort'))} →</text>`
        + brace(keys) + `<g class="frame">${frameSvg(keys, 0)}</g>`;
      if (n === STEPS - 1 && !still && !reduce()) {
        const g = svg.querySelector('.frame');
        for (let i = 1; i <= 40; i++) { g.setAttribute('transform', `translate(${i * 14} ${i * 1.2})`); await sleep(30); }
        g.setAttribute('transform', '');
      }
      busy = false;
    }
    el.addEventListener('click', e => {
      const k = e.target.closest('[data-k]') && e.target.closest('[data-k]').dataset.k;
      if (k === 'fwd' && n < STEPS - 1) go(n + 1);
      if (k === 'back' && n > 0) go(n - 1, true);
      if (k === 'restart') go(0, true);
    });
    go(0, true);
  }
};
