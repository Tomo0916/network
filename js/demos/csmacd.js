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
    /* the signals grow by r pixels from each PC. crash: the broken part (from the meeting point outwards).
       two = false: only PC1 sends */
    const MEET = MID - T1;
    const spread = (r, crashOn, two = true) => {
      span(s1, T1 - r, T1 + r);
      if (two) span(s2, T2 - r, T2 + r); else span(s2, 0, 0);
      if (crashOn) { const c = r - MEET; span(crash, MID - c, MID + c); } else span(crash, 0, 0);
    };
    const spark = () => `<circle class="burst small" cx="${MID}" cy="${Y}" r="12"/>`;
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
      /* ② both send: each signal spreads along the cable in both directions … */
      if (n === 2) {
        markNode(svg, 'p1', 'busy', ctx.T('dm.sending')); markNode(svg, 'p2', 'busy', ctx.T('dm.sending'));
        if (still) spread(MEET, false, true);
        else await tween(2000, p => spread(p * MEET, false, true), p => p);
        fx.innerHTML = spark();
      }
      /* ③ … they meet in the middle; the broken part spreads back until each PC notices it */
      if (n === 3) {
        markNode(svg, 'p1', 'busy', ctx.T('dm.sending')); markNode(svg, 'p2', 'busy', ctx.T('dm.sending'));
        fx.innerHTML = spark();
        if (still) spread(R - L, true, true);
        else await tween(2200, p => { const r = MEET + p * (R - L - MEET); spread(r, true, true);
          if (r - MEET >= MEET) { markNode(svg, 'p1', 'ng', ctx.T('dm.detect')); markNode(svg, 'p2', 'ng', ctx.T('dm.detect')); } }, p => p);
        svg.classList.add('jam'); fx.innerHTML = burst();
        markNode(svg, 'p1', 'ng', ctx.T('dm.detect')); markNode(svg, 'p2', 'ng', ctx.T('dm.detect'));
      }
      /* ④ both stop and wait a random time: two timers run down */
      if (n === 4) {
        markNode(svg, 'p1', '', ''); markNode(svg, 'p2', '', '');
        const W = [[T1, 2], [T2, 5]];
        fx.innerHTML = W.map(([x, v], i) => `<g class="timer"><rect class="tbar-bg" x="${x - 40}" y="118" width="80" height="10" rx="5"/><rect class="tbar t${i}" x="${x - 40}" y="118" width="${v * 16}" height="10" rx="5"/>
          <text class="wait" x="${x}" y="150" text-anchor="middle">${ctx.T('dm.wait', { n: v })}</text></g>`).join('');
        const bars = [...fx.querySelectorAll('.tbar')], texts = [...fx.querySelectorAll('.wait')];
        const show = t => W.forEach(([x, v], i) => { const left = Math.max(0, v - t); bars[i].setAttribute('width', (left * 16).toFixed(1)); texts[i].textContent = ctx.T('dm.wait', { n: Math.ceil(left) }); texts[i].classList.toggle('zero', left <= 0); });
        if (still) show(0); else await tween(3000, p => show(p * 5), p => p);
      }
      /* ⑤ PC1 (shorter wait) listens, the cable is free, it sends; PC2's wait ends while the cable is busy, so it keeps waiting */
      if (n === 5) {
        if (!still) {
          markNode(svg, 'p1', 'busy', ctx.T('dm.listening')); markNode(svg, 'p2', '', ctx.T('dm.wait', { n: 3 }));
          svg.classList.add('listening'); await sleep(1000); svg.classList.remove('listening');
        }
        markNode(svg, 'p1', 'busy', ctx.T('dm.sending'));
        if (still) spread(R - L, false, false);
        else await tween(2000, p => { spread(p * (R - L), false, false); if (p > .5) markNode(svg, 'p2', 'busy', ctx.T('dm.busyWait')); }, p => p);
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
