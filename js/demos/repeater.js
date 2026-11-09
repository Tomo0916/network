/* repeater — a digital signal (bits) gets weaker along the cable (attenuation), noise disturbs it,
 * and a repeater in the middle makes a clean, strong signal again. PC B reads each bit:
 * a bit is read only if the signal is strong enough (outside the dashed lines). */
import { nodeSvg, markNode, tween, sleep, autoplay, escAttr } from './kit.js';

const X0 = 104, X1 = 356, Y = 112, AMP = 40, TH = 0.25;      // TH = the weakest signal PC B can read
const BITS = [1, 0, 1, 1, 0, 0, 1, 0];
const K = Math.log(1 / 0.12) / 200;                           // 200 m of cable → 12 % of the signal is left
const strength = d => Math.exp(-K * d);                       // d = metres since the last (re)generation
function rng(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 - 0.5; }; }

/** level (−1..1) of the signal at position x along a cable of len metres */
function model(len, rep, noise) {
  const n = rng(len + (rep ? 7 : 3)), nb = rng(99);
  const bitW = (X1 - X0) / BITS.length;
  const pts = [];
  for (let x = X0; x <= X1; x += 1.5) {
    const m = (x - X0) / (X1 - X0) * len;
    const d = rep && m >= len / 2 ? m - len / 2 : m;
    const a = strength(d);
    const i = Math.min(BITS.length - 1, Math.floor((x - X0) / bitW));
    /* the edge between two bits gets softer as the signal travels (it is not a perfect square any more) */
    const soft = 2 + 16 * (1 - a), inBit = (x - X0) - i * bitW;
    const prev = i > 0 ? (BITS[i - 1] ? 1 : -1) : (BITS[0] ? 1 : -1), cur = BITS[i] ? 1 : -1;
    const lv = inBit < soft ? prev + (cur - prev) * (inBit / soft) : cur;
    const nz = noise ? n() * (rep && m >= len / 2 ? 0.25 : 0.5) * (0.4 + (1 - a)) : 0;
    pts.push([x, lv * a + nz]);
  }
  /* what PC B reads: the strength at the end, plus a little noise per bit */
  const dEnd = rep ? len / 2 : len, aEnd = strength(dEnd);
  const got = BITS.map(b => {
    const v = (b ? 1 : -1) * aEnd + (noise ? nb() * (rep ? 0.2 : 0.6) : 0);
    return Math.abs(v) < TH ? '?' : (v > 0 ? 1 : 0);
  });
  return { pts, got, aEnd };
}

export default {
  id: 'repeater',
  mount(el, ctx) {
    const st = { len: 200, rep: false, noise: false, busy: false };
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 460 230" role="img" aria-label="${ctx.T('demo.repeater')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite">${ctx.H('dm.attIntro')}</div>
        <div class="seg" role="group">
          <label class="seg-i"><input type="radio" name="rp-len" value="50"><span>${ctx.H('dm.short')}</span></label>
          <label class="seg-i"><input type="radio" name="rp-len" value="200" checked><span>${ctx.H('dm.longLen')}</span></label>
        </div>
        <div class="demo-ctl">
          <label class="chk"><input type="checkbox" data-k="rep"> <span lang="ja">${ctx.termHTML('repeater')}</span></label>
          <label class="chk"><input type="checkbox" data-k="noise"> <span lang="ja">${ctx.termHTML('noise')}</span></label>
        </div>
        <div class="demo-ctl">
          <button class="btn btn-primary btn-sm" data-k="send">${ctx.H('dm.send')} ▶</button>
          <button class="btn btn-ghost btn-sm" data-k="auto"></button>
        </div>
        <div class="tablebox card bits"></div>
      </div></div>`;
    const svg = el.querySelector('svg');
    const thY = TH * AMP;
    function draw() {
      const midX = (X0 + X1) / 2;
      svg.innerHTML = `<rect class="cable" x="${X0}" y="${Y - AMP - 8}" width="${X1 - X0}" height="${2 * AMP + 16}" rx="10"/>
        <line class="th" x1="${X0}" x2="${X1}" y1="${Y - thY}" y2="${Y - thY}"/><line class="th" x1="${X0}" x2="${X1}" y1="${Y + thY}" y2="${Y + thY}"/>
        <text class="th-label" x="${X1 - 4}" y="${Y - thY - 4}" text-anchor="end">${escAttr(ctx.T('dm.threshold'))}</text>
        <line class="zero" x1="${X0}" x2="${X1}" y1="${Y}" y2="${Y}"/>
        <path class="wave" d=""/>
        ${st.rep && st.len > 100 ? `<g class="dev rep"><rect x="${midX - 30}" y="${Y + AMP + 18}" width="60" height="30" rx="8"/><text x="${midX}" y="${Y + AMP + 38}" text-anchor="middle">REP</text></g>
          <line class="rep-line" x1="${midX}" x2="${midX}" y1="${Y - AMP - 8}" y2="${Y + AMP + 18}"/>` : ''}
        <text class="port" x="${(X0 + X1) / 2}" y="${Y + AMP + 70}" text-anchor="middle">← ${escAttr(st.len + ' m')} →</text>`
        + nodeSvg('a', 52, Y, 'PC A', '') + nodeSvg('b', 408, Y, 'PC B', '');
      bitsBox(null);
    }
    function bitsBox(got) {
      el.querySelector('.bits').innerHTML = `<div class="bitrow"><span>${ctx.H('dm.sentBits')}</span><span class="bitcells">${BITS.map(b => `<b>${b}</b>`).join('')}</span></div>
        <div class="bitrow"><span>${ctx.H('dm.gotBits')}</span><span class="bitcells">${(got || BITS.map(() => '·')).map((g, i) => `<b class="${!got ? '' : g === '?' ? 'q' : g === BITS[i] ? 'okb' : 'ngb'}">${g}</b>`).join('')}</span></div>`;
    }
    async function send() {
      if (st.busy) return;
      st.busy = true; el.querySelector('[data-k="send"]').disabled = true;
      markNode(svg, 'b'); bitsBox(null);
      const { pts, got } = model(st.len, st.rep && st.len > 100, st.noise);
      const path = svg.querySelector('.wave');
      const toY = v => (Y - v * AMP).toFixed(1);
      await tween(2000, p => {
        const k = Math.max(2, Math.round(p * pts.length));
        path.setAttribute('d', 'M' + pts.slice(0, k).map(([x, v]) => `${x.toFixed(1)} ${toY(v)}`).join('L'));
      }, p => p);
      await sleep(250);
      bitsBox(got);
      const ok = got.every((g, i) => g === BITS[i]);
      markNode(svg, 'b', ok ? 'ok' : 'ng', ok ? '✓ ' + ctx.T('dm.readable') : '× ' + ctx.T('dm.unreadable'));
      const repOn = st.rep && st.len > 100;
      const msg = st.len <= 100 ? 'dm.attShort' : repOn ? 'dm.attRep' : 'dm.attWeak';
      el.querySelector('.narr').innerHTML = ctx.H(msg) + (st.noise ? ' ' + ctx.H('dm.attNoise') : '') + (repOn ? '<br>' + ctx.H('dm.attRegen') : '');
      st.busy = false; el.querySelector('[data-k="send"]').disabled = false;
    }
    const sync = () => {
      el.querySelector('[name="rp-len"][value="' + st.len + '"]').checked = true;
      el.querySelector('[data-k="rep"]').checked = st.rep; el.querySelector('[data-k="noise"]').checked = st.noise;
      el.querySelector('[data-k="rep"]').disabled = st.len <= 100;
    };
    el.addEventListener('change', e => {
      if (st.busy) return;
      if (e.target.name === 'rp-len') st.len = +e.target.value;
      else if (e.target.dataset.k) st[e.target.dataset.k] = e.target.checked;
      sync(); draw(); el.querySelector('.narr').innerHTML = ctx.H('dm.attIntro');
    });
    el.addEventListener('click', e => { if (e.target.closest('[data-k="send"]')) send(); });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      for (const s of [{ len: 50, rep: false, noise: false }, { len: 200, rep: false, noise: false }, { len: 200, rep: true, noise: false }, { len: 200, rep: false, noise: true }, { len: 200, rep: true, noise: true }]) {
        if (!alive()) return;
        Object.assign(st, s); sync(); draw(); el.querySelector('.narr').innerHTML = ctx.H('dm.attIntro');
        await send(); await sleep(3200);
      }
    });
    sync(); draw();
  }
};
