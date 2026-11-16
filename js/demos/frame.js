/* frame — building an Ethernet frame: data → header (framing) → FCS → preamble → bits onto the cable */
import { tween, sleep, escAttr, autoplay } from './kit.js';

const STEPS = 5;
/* field: [key, width in the drawing, bytes, colour class, what is written inside] */
const FIELDS = [
  ['pre', 84, '8', 'f-pre', '1010…'],
  ['dst', 68, '6', 'f-hd', '…:0C'],
  ['src', 68, '6', 'f-hd', '…:0A'],
  ['type', 50, '2', 'f-hd', '0800'],
  ['data', 106, '46–1500', 'f-data', 'Hello!'],
  ['fcs', 50, '4', 'f-fcs', 'CRC']
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
      svg.innerHTML = `<line class="bus" x1="10" y1="206" x2="450" y2="206"/><text class="port" x="446" y="228" text-anchor="end">${escAttr(ctx.T('dm.cableShort'))} →</text>`
        + (n === STEPS - 1 ? `<path class="feed" d="M${lay[0].x + 10} ${FY + FH + 4}V194"/>` : '') + `<g class="bits-stream"></g>`
        + brace(lay) + `<g class="frame">${lay.map(l => fieldSvg(l, !still && NEW[n].includes(l.f[0]))).join('')}</g>`;
      /* new fields drop in from above */
      if (!still) {
        const fresh = [...svg.querySelectorAll('.field.fresh')];
        await tween(700, p => fresh.forEach(g => { g.style.opacity = p; g.style.translate = `0 ${(-40 * (1 - p)).toFixed(1)}px`; }));
      }
      /* last step: the frame goes onto the cable bit by bit, from the front (preamble) to the back (FCS).
         Each field lights up while it is sent; its bits run along the cable to the right, so the
         preamble's bits are always the furthest ahead. */
      if (n === STEPS - 1 && !still) {
        const bits = svg.querySelector('.bits-stream'), groups = [...svg.querySelectorAll('.field')];
        const DOWN = 196, START = 14, PER = 4, SPEED = 210;   // bits per field drawn, pixels per second of the animation
        const chunks = [];
        lay.forEach((l, fi) => { for (let b = 0; b < PER; b++) chunks.push({ fi, cls: l.f[3], t: (fi * PER + b) / (lay.length * PER) }); });
        bits.innerHTML = chunks.map((c, i) => `<rect class="bitbox ${c.cls}" data-i="${i}" x="${START}" y="${DOWN - 9}" width="14" height="14" rx="3" opacity="0"/>`).join('');
        const rects = [...bits.children], DUR = 6000, EMIT = .6;   // all bits leave during the first 62% of the time
        await tween(DUR, p => {
          const now = p * DUR / 1000;
          chunks.forEach((c, i) => {
            const t0 = c.t * EMIT * DUR / 1000, x = START + (now - t0) * SPEED;
            const r = rects[i];
            if (now < t0) { r.setAttribute('opacity', 0); return; }
            r.setAttribute('x', Math.min(x, 470).toFixed(1));
            r.setAttribute('opacity', x > 440 ? Math.max(0, 1 - (x - 440) / 30).toFixed(2) : 1);
          });
          const cur = Math.min(lay.length - 1, Math.floor(p / EMIT * lay.length));
          groups.forEach((g, gi) => { g.classList.toggle('sending', p < EMIT && gi === cur); g.classList.toggle('sent', gi < cur || p >= EMIT); });
        }, p => p);
        await sleep(300);
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
