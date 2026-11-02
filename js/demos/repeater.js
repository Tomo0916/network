/* repeater — attenuation over a long cable, noise, and a repeater that makes the signal strong again */
import { nodeSvg, markNode, reduce } from './kit.js';

const X0 = 96, X1 = 404, MID = 250, Y = 150, A0 = 46, K = 0.0105;
/** wave points from x=X0 to X1; amplitude falls with distance and comes back at the repeater */
function wave(rep, noise) {
  const pts = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - 0.5; };
  for (let x = X0; x <= X1; x += 2) {
    const d = rep && x >= MID ? x - MID : x - X0;
    const amp = A0 * Math.exp(-K * d);
    const bit = Math.floor((x - X0) / 22) % 3 === 1 ? -1 : 1;           // a simple 1/0 pattern
    const sq = Math.sin((x - X0) / 22 * Math.PI) >= 0 ? 1 : -1;
    const n = noise ? rnd() * (rep && x >= MID ? 10 : 26) : 0;
    pts.push([x, Y - amp * sq * bit * 0.5 - amp * 0.5 * Math.sin((x - X0) / 11) + n]);
  }
  return pts;
}

export default {
  id: 'repeater',
  mount(el, ctx) {
    const st = { rep: false, noise: false, busy: false };
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 460 260" role="img" aria-label="${ctx.T('demo.repeater')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite">${ctx.H('dm.attIntro')}</div>
        <div class="demo-ctl">
          <label class="chk"><input type="checkbox" data-k="rep"> ${ctx.termHTML('repeater')}</label>
          <label class="chk"><input type="checkbox" data-k="noise"> ${ctx.termHTML('noise')}</label>
          <button class="btn btn-primary btn-sm" data-k="send">${ctx.H('dm.send')} ▶</button>
        </div>
      </div></div>`;
    const svg = el.querySelector('svg');
    function draw() {
      svg.innerHTML = `<line class="link" x1="${X0}" y1="${Y}" x2="${X1}" y2="${Y}"/>`
        + (st.rep ? `<g class="dev"><rect x="${MID - 34}" y="${Y + 30}" width="68" height="34" rx="8"/><text x="${MID}" y="${Y + 52}" text-anchor="middle">REP</text></g><line class="link" x1="${MID}" y1="${Y}" x2="${MID}" y2="${Y + 30}"/>` : '')
        + `<text class="port" x="${(X0 + X1) / 2}" y="${Y + 92}" text-anchor="middle">← ${ctx.T('dm.long')} →</text>`
        + `<path class="wave" d=""/>`
        + nodeSvg('a', 50, Y, 'PC A', '') + nodeSvg('b', 408, Y - 70, 'PC B', '');
      svg.insertAdjacentHTML('beforeend', `<line class="link" x1="${X1}" y1="${Y}" x2="408" y2="${Y - 46}"/>`);
    }
    async function send() {
      if (st.busy) return;
      st.busy = true; el.querySelector('[data-k="send"]').disabled = true;
      markNode(svg, 'b');
      const pts = wave(st.rep, st.noise);
      const path = svg.querySelector('.wave');
      const full = 'M' + pts.map(p => p.join(' ')).join('L');
      if (reduce()) path.setAttribute('d', full);
      else {
        const t0 = performance.now(), dur = 1600;
        await new Promise(res => {
          const step = now => {
            const n = Math.max(2, Math.round(Math.min(1, (now - t0) / dur) * pts.length));
            path.setAttribute('d', 'M' + pts.slice(0, n).map(p => p.join(' ')).join('L'));
            if (n < pts.length) requestAnimationFrame(step); else res();
          };
          requestAnimationFrame(step);
        });
      }
      const ok = st.rep;
      markNode(svg, 'b', ok ? 'ok' : 'ng', ok ? '✓ ' + ctx.T('dm.readable') : '× ' + ctx.T('dm.unreadable'));
      el.querySelector('.narr').innerHTML = ctx.H(ok ? 'dm.attRep' : 'dm.attWeak') + (st.noise ? ' ' + ctx.H('dm.attNoise') : '');
      st.busy = false; el.querySelector('[data-k="send"]').disabled = false;
    }
    el.addEventListener('change', e => {
      const k = e.target.dataset.k; if (!k || st.busy) return;
      st[k] = e.target.checked; draw();
      el.querySelector('.narr').innerHTML = ctx.H('dm.attIntro');
    });
    el.addEventListener('click', e => { if (e.target.closest('[data-k="send"]')) send(); });
    draw();
  }
};
