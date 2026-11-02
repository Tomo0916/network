/* csmacd — Carrier Sense, Multiple Access, Collision Detection, step by step */
import { NS, moveDot, sleep, nodeSvg, markNode } from './kit.js';

const P1 = [70, 70], P2 = [330, 70], B1 = [70, 210], B2 = [330, 210], MID = [200, 210];
const STEPS = 6;

export default {
  id: 'csmacd',
  mount(el, ctx) {
    let n = 0, busy = false;
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 400 270" role="img" aria-label="CSMA/CD"></svg></div>
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
    svg.innerHTML = `<line class="bus" x1="20" y1="210" x2="380" y2="210"/>
      <line class="link" x1="70" y1="94" x2="70" y2="210"/><line class="link" x1="330" y1="94" x2="330" y2="210"/>
      <text class="port" x="200" y="244" text-anchor="middle">${ctx.T('dm.cable')}</text><g class="fx"></g>`
      + nodeSvg('p1', P1[0], P1[1], 'PC1', '') + nodeSvg('p2', P2[0], P2[1], 'PC2', '');
    const fx = svg.querySelector('.fx');
    const burst = () => `<circle class="burst" cx="200" cy="210" r="22"/><text class="mark ng" x="200" y="178" text-anchor="middle">${ctx.T('dm.collision')}</text>`;

    async function go(step, still) {
      if (busy) return;
      busy = true; n = step;
      fx.innerHTML = ''; markNode(svg, 'p1'); markNode(svg, 'p2');
      el.querySelector('.narr').innerHTML = ctx.H('dm.cs' + n);
      el.querySelector('.count').textContent = `${n + 1} / ${STEPS}`;
      el.querySelector('[data-k="back"]').disabled = n === 0;
      el.querySelector('[data-k="fwd"]').disabled = n === STEPS - 1;
      if (n === 1) { fx.innerHTML = '<line class="listen" x1="20" y1="210" x2="380" y2="210"/>'; markNode(svg, 'p1', '', ctx.T('dm.listening')); markNode(svg, 'p2', '', ctx.T('dm.listening')); }
      if (n === 2) {
        markNode(svg, 'p1', '', ctx.T('dm.sending')); markNode(svg, 'p2', '', ctx.T('dm.sending'));
        if (!still) await Promise.all([moveDot(svg, [P1, B1, MID], 900), moveDot(svg, [P2, B2, MID], 900)]);
      }
      if (n === 3) { fx.innerHTML = burst(); markNode(svg, 'p1', 'ng', ctx.T('dm.detect')); markNode(svg, 'p2', 'ng', ctx.T('dm.detect')); }
      if (n === 4) {
        fx.innerHTML = burst();
        const w = [[70, 2], [330, 5]].map(([x, v]) => { const t = document.createElementNS(NS, 'text'); t.setAttribute('class', 'wait'); t.setAttribute('x', x); t.setAttribute('y', 140); t.setAttribute('text-anchor', 'middle'); t.textContent = ctx.T('dm.wait', { n: v }); fx.appendChild(t); return [t, v]; });
        if (!still) for (let i = 1; i <= 5; i++) { await sleep(550); w.forEach(([t, v]) => { t.textContent = ctx.T('dm.wait', { n: Math.max(0, v - i) }); }); }
      }
      if (n === 5) {
        markNode(svg, 'p1', '', ctx.T('dm.sending'));
        if (!still) await moveDot(svg, [P1, B1, B2, P2], 1300);
        markNode(svg, 'p2', 'ok', '✓ ' + ctx.T('dm.recv'));
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
