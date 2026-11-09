/* csmacd — Carrier Sense, Multiple Access, Collision Detection, step by step.
 * The signal of each PC spreads along the shared cable in both directions; where the two meet they collide. */
import { NS, sleep, tween, nodeSvg, markNode, autoplay } from './kit.js';

const L = 20, R = 380, Y = 206, T1 = 80, T2 = 320, MID = (T1 + T2) / 2;
const STEPS = 6;

export default {
  id: 'csmacd',
  mount(el, ctx) {
    let n = 0, busy = false;
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 400 270" role="img" aria-label="CSMA/CD"></svg></div>
      <div class="demo-side">
        <ol class="steps"></ol>
        <div class="narr" aria-live="polite"></div>
        <div class="demo-ctl">
          <button class="btn btn-ghost btn-sm" data-k="back">← ${ctx.H('btn.prev')}</button>
          <button class="btn btn-primary btn-sm" data-k="fwd">${ctx.H('btn.next')} ▶</button>
          <button class="btn btn-ghost btn-sm" data-k="auto"></button>
          <span class="count"></span>
        </div>
      </div></div>`;
    el.querySelector('.steps').innerHTML = ['fx.listen', 'fx.send', 'fx.detect', 'fx.wait', 'fx.resend'].map((k, i) => `<li data-s="${i + 1}">${ctx.H(k)}</li>`).join('');
    const svg = el.querySelector('svg');
    svg.innerHTML = `<line class="bus" x1="${L}" y1="${Y}" x2="${R}" y2="${Y}"/>
      <rect class="sig s1" x="0" y="${Y - 7}" width="0" height="14" rx="7"/>
      <rect class="sig s2" x="0" y="${Y - 7}" width="0" height="14" rx="7"/>
      <rect class="sig crash" x="0" y="${Y - 9}" width="0" height="18" rx="9"/>
      <line class="link" x1="${T1}" y1="94" x2="${T1}" y2="${Y}"/><line class="link" x1="${T2}" y1="94" x2="${T2}" y2="${Y}"/>
      <text class="port" x="200" y="246" text-anchor="middle">${ctx.T('dm.cable')}</text><g class="fx"></g>`
      + nodeSvg('p1', T1, 70, 'PC1', '') + nodeSvg('p2', T2, 70, 'PC2', '');
    const fx = svg.querySelector('.fx');
    const s1 = svg.querySelector('.s1'), s2 = svg.querySelector('.s2'), crash = svg.querySelector('.crash');
    const span = (rect, a, b) => { a = Math.max(L, a); b = Math.min(R, b); rect.setAttribute('x', a); rect.setAttribute('width', Math.max(0, b - a)); };
    const clear = () => [s1, s2, crash].forEach(r => r.setAttribute('width', 0));
    /* both signals grow by r pixels; the overlap is the collision */
    const spread = (r, both = true) => {
      span(s1, T1 - r, T1 + r);
      if (both) { span(s2, T2 - r, T2 + r); span(crash, T2 - r, T1 + r); } else span(s2, 0, 0);
    };
    const burst = () => `<circle class="burst" cx="${MID}" cy="${Y}" r="24"/><text class="mark ng big" x="${MID}" y="${Y - 34}" text-anchor="middle">${ctx.T('dm.collision')}</text>`;

    async function go(step, still) {
      if (busy) return;
      busy = true; n = step;
      fx.innerHTML = ''; clear(); svg.classList.remove('listening', 'jam');
      markNode(svg, 'p1'); markNode(svg, 'p2');
      el.querySelector('.narr').innerHTML = ctx.H('dm.cs' + n);
      el.querySelector('.count').textContent = `${n + 1} / ${STEPS}`;
      el.querySelectorAll('.steps li').forEach(li => { const s = +li.dataset.s; li.className = s === n ? 'on' : s < n ? 'done' : ''; });
      el.querySelector('[data-k="back"]').disabled = n === 0;
      el.querySelector('[data-k="fwd"]').disabled = n === STEPS - 1;
      if (n === 1) {
        svg.classList.add('listening');
        markNode(svg, 'p1', 'busy', ctx.T('dm.listening')); markNode(svg, 'p2', 'busy', ctx.T('dm.listening'));
        fx.innerHTML = `<text class="mark ok" x="${MID}" y="${Y - 18}" text-anchor="middle">${ctx.T('dm.free')}</text>`;
      }
      if (n === 2) {
        markNode(svg, 'p1', 'busy', ctx.T('dm.sending')); markNode(svg, 'p2', 'busy', ctx.T('dm.sending'));
        if (still) spread(R - L);
        else await tween(2200, p => spread(p * (R - L)), p => p);
      }
      if (n === 3) {
        spread(R - L); svg.classList.add('jam'); fx.innerHTML = burst();
        markNode(svg, 'p1', 'ng', ctx.T('dm.detect')); markNode(svg, 'p2', 'ng', ctx.T('dm.detect'));
      }
      if (n === 4) {
        markNode(svg, 'p1', 'busy', ''); markNode(svg, 'p2', 'busy', '');
        const w = [[T1, 2], [T2, 5]].map(([x, v]) => {
          const t = document.createElementNS(NS, 'text');
          t.setAttribute('class', 'wait'); t.setAttribute('x', x); t.setAttribute('y', 132); t.setAttribute('text-anchor', 'middle');
          t.textContent = ctx.T('dm.wait', { n: v }); fx.appendChild(t); return [t, v];
        });
        if (!still) for (let i = 1; i <= 5; i++) { await sleep(600); w.forEach(([t, v]) => { t.textContent = ctx.T('dm.wait', { n: Math.max(0, v - i) }); if (v - i <= 0) t.classList.add('zero'); }); }
      }
      if (n === 5) {
        markNode(svg, 'p1', 'busy', ctx.T('dm.sending')); markNode(svg, 'p2', '', ctx.T('dm.listening'));
        if (still) spread(R - L, false);
        else await tween(2000, p => spread(p * (R - L), false), p => p);
        markNode(svg, 'p1', 'ok', '✓'); markNode(svg, 'p2', 'ok', '✓ ' + ctx.T('dm.recv'));
      }
      busy = false;
    }
    el.addEventListener('click', e => {
      const k = e.target.closest('[data-k]') && e.target.closest('[data-k]').dataset.k;
      if (k === 'fwd' && n < STEPS - 1) go(n + 1);
      if (k === 'back' && n > 0) go(n - 1, true);
    });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      for (let s = 0; s < STEPS; s++) { if (!alive()) return; await go(s); await sleep(s === 0 ? 1800 : 2600); }
    });
    go(0, true);
  }
};
