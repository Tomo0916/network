/* frame — building an Ethernet frame: data → header (framing) → FCS → preamble → bits onto the cable */
import { tween, sleep, escAttr, autoplay } from './kit.js';

const STEPS = 5;
/* field: [key, width in the drawing, bytes, colour class, what is written inside] */
const FIELDS = [
  ['pre', 70, '8', 'f-pre', '1010…'],
  ['dst', 68, '6', 'f-hd', '…:0C'],
  ['src', 68, '6', 'f-hd', '…:0A'],
  ['type', 46, '2', 'f-hd', '0800'],
  ['data', 112, '46–1500', 'f-data', 'Hello!'],
  ['fcs', 48, '4', 'f-fcs', 'CRC']
];
const SHOWN = [['data'], ['dst', 'src', 'type', 'data'], ['dst', 'src', 'type', 'data', 'fcs'], FIELDS.map(f => f[0]), FIELDS.map(f => f[0])];
const NEW = [['data'], ['dst', 'src', 'type'], ['fcs'], ['pre'], []];
const FY = 74, FH = 60;

export default {
  id: 'frame',
  mount(el, ctx) {
    let n = 0, busy = false;
    const label = k => k === 'pre' ? ctx.term('preamble') : ctx.T('dm.f' + k[0].toUpperCase() + k.slice(1));
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 460 236" role="img" aria-label="${ctx.T('demo.frame')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite"></div>
        <div class="demo-ctl">
          <button class="btn btn-ghost btn-sm" data-k="back">← ${ctx.H('btn.prev')}</button>
          <button class="btn btn-primary btn-sm" data-k="fwd">${ctx.H('btn.next')} ▶</button>
          <button class="btn btn-ghost btn-sm" data-k="auto"></button>
          <span class="count"></span>
        </div>
        <div class="tablebox card legend"></div>
      </div></div>`;
    const svg = el.querySelector('svg');

    function layout(keys) {
      const fs = FIELDS.filter(f => keys.includes(f[0]));
      const total = fs.reduce((a, f) => a + f[1], 0);
      let x = (460 - total) / 2;
      return fs.map(f => { const r = { f, x }; x += f[1]; return r; });
    }
    function fieldSvg({ f: [k, w, bytes, cls, inside], x }, fresh) {
      return `<g class="field ${cls} ${fresh ? 'fresh' : ''}" data-f="${k}" transform="translate(${x} ${FY})">
        <rect width="${w}" height="${FH}" rx="5"/>
        <text x="${w / 2}" y="20" text-anchor="middle">${escAttr(label(k))}</text>
        <text class="in" x="${w / 2}" y="38" text-anchor="middle">${escAttr(inside)}</text>
        <text class="sub" x="${w / 2}" y="53" text-anchor="middle">${escAttr(ctx.T('dm.bytes', { n: bytes }))}</text></g>`;
    }
    function brace(lay) {
      const hd = lay.filter(l => ['dst', 'src', 'type'].includes(l.f[0]));
      if (!hd.length) return '';
      const a = hd[0].x, b = hd[hd.length - 1].x + hd[hd.length - 1].f[1];
      return `<path class="brace" d="M${a} ${FY - 6}v-8H${b}v8"/><text class="port" x="${(a + b) / 2}" y="${FY - 20}" text-anchor="middle">${escAttr(ctx.T('dm.header'))}</text>`;
    }
    function legend() {
      el.querySelector('.legend').innerHTML = `<h3>${ctx.H('dm.frameSize')}</h3><p class="mono">64–1518 ${escAttr(ctx.T('dm.bytes', { n: '' }).trim())}</p><p class="muted small">${ctx.H('dm.frameSizeNote')}</p>`;
    }
    async function go(step, still) {
      if (busy) return;
      busy = true; n = step;
      el.querySelector('.narr').innerHTML = ctx.H('dm.fr' + n);
      el.querySelector('.count').textContent = `${n + 1} / ${STEPS}`;
      el.querySelector('[data-k="back"]').disabled = n === 0;
      el.querySelector('[data-k="fwd"]').disabled = n === STEPS - 1;
      const lay = layout(SHOWN[n]);
      svg.innerHTML = `<line class="bus" x1="10" y1="206" x2="450" y2="206"/><text class="port" x="446" y="228" text-anchor="end">${escAttr(ctx.T('dm.cableShort'))} →</text><g class="bits-stream"></g>`
        + brace(lay) + `<g class="frame">${lay.map(l => fieldSvg(l, !still && NEW[n].includes(l.f[0]))).join('')}</g>`;
      /* new fields drop in from above */
      if (!still) {
        const fresh = [...svg.querySelectorAll('.field.fresh')];
        await tween(700, p => fresh.forEach(g => { g.style.opacity = p; g.style.translate = `0 ${(-40 * (1 - p)).toFixed(1)}px`; }));
      }
      /* last step: the frame turns into bits on the cable, preamble first */
      if (n === STEPS - 1 && !still) {
        const g = svg.querySelector('.frame'), bits = svg.querySelector('.bits-stream');
        const stream = '10101010 10101011 0000…1100 0000…1010 08 00 …';
        await tween(2600, p => {
          g.style.translate = `${(p * 520).toFixed(1)}px ${(p * 40).toFixed(1)}px`;
          g.style.opacity = 1 - Math.max(0, p - .55) * 2.2;
          const shown = Math.floor(p * stream.length);
          bits.innerHTML = `<text class="bitline" x="${Math.min(440, 20 + p * 600)}" y="196" text-anchor="end">${escAttr(stream.slice(0, shown))}</text>`;
        }, p => p);
        await sleep(400);
        g.style.translate = ''; g.style.opacity = '';
      }
      busy = false;
    }
    el.addEventListener('click', e => {
      const k = e.target.closest('[data-k]') && e.target.closest('[data-k]').dataset.k;
      if (k === 'fwd' && n < STEPS - 1) go(n + 1);
      if (k === 'back' && n > 0) go(n - 1, true);
    });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      for (let s = 0; s < STEPS; s++) { if (!alive()) return; await go(s); await sleep(2400); }
    });
    legend();
    go(0, true);
  }
};
