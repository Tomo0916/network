/* cast — unicast, broadcast and multicast: who receives the frame */
import { moveDot, nodeSvg, markNode, device, blink, sleep, autoplay } from './kit.js';

const PCS = { 1: [300, 38], 2: [300, 96], 3: [300, 154], 4: [300, 212], 5: [300, 270] };
const SW = [170, 154], SRC = [54, 154], GROUP = ['2', '4'];
const TYPES = {
  unicast: { to: ['3'], mac: '00:1A:2B:00:00:03', tag: '→3', say: 'dm.uni' },
  broadcast: { to: ['1', '2', '3', '4', '5'], mac: 'FF:FF:FF:FF:FF:FF', tag: 'FF…', say: 'dm.broad', cls: 'pkt b' },
  multicast: { to: GROUP, mac: '01:00:5E:00:00:01', tag: '01:00:5E…', say: 'dm.multi', cls: 'pkt m' }
};

export default {
  id: 'cast',
  mount(el, ctx) {
    let busy = false;
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 460 310" role="img" aria-label="${ctx.T('demo.cast')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite">${ctx.H('dm.castIntro')}</div>
        <div class="demo-ctl cast-btns">${Object.keys(TYPES).map(k => `<button class="btn btn-ghost btn-sm cast-${k}" data-k="${k}">${ctx.termHTML(k)}</button>`).join('')}
          <button class="btn btn-ghost btn-sm" data-k="auto"></button></div>
        <div class="tablebox card"><h3>${ctx.H('dm.dmac')}</h3><div class="mono dmac">—</div><p class="muted small dmac-note"></p></div>
      </div></div>`;
    const svg = el.querySelector('svg');
    svg.innerHTML = `<line class="link" data-link="S" x1="${SRC[0]}" y1="${SRC[1]}" x2="${SW[0]}" y2="${SW[1]}"/>`
      + Object.entries(PCS).map(([k, [x, y]]) => `<line class="link" data-link="${k}" x1="${SW[0]}" y1="${SW[1]}" x2="${x}" y2="${y}"/>`).join('')
      + device(SW[0], SW[1], 92, 'SWITCH', 6)
      + nodeSvg('S', SRC[0], SRC[1], ctx.T('dm.sender'), '')
      + Object.entries(PCS).map(([k, [x, y]]) => nodeSvg(k, x, y, 'PC ' + k, GROUP.includes(k) ? ctx.T('dm.group') : '', GROUP.includes(k) ? 'grp' : '')).join('');
    /* the "receives" mark goes to the right of each PC (the PCs are stacked closely) */
    Object.entries(PCS).forEach(([k, [x, y]]) => { const m = svg.querySelector(`[data-mark="${k}"]`); m.setAttribute('x', x + 54); m.setAttribute('y', y + 5); m.setAttribute('text-anchor', 'start'); });
    const light = (k, on) => { const l = svg.querySelector(`[data-link="${k}"]`); if (l) l.classList.toggle('hot', on); };

    async function cast(type) {
      if (busy) return;
      busy = true; el.querySelectorAll('[data-k]:not([data-k="auto"])').forEach(b => { b.disabled = true; });
      const t = TYPES[type];
      Object.keys(PCS).forEach(k => { markNode(svg, k); light(k, false); });
      el.querySelector('.dmac').textContent = t.mac;
      el.querySelector('.dmac-note').innerHTML = ctx.H('dm.mac.' + type);
      el.querySelector('.narr').innerHTML = ctx.H(t.say);
      svg.classList.toggle('show-grp', type === 'multicast');
      light('S', true);
      await moveDot(svg, [SRC, SW], 700, t.cls, t.tag);
      blink(svg, 1);
      await sleep(250);
      t.to.forEach(k => { light(k, true); blink(svg, +k + 1); });
      await Promise.all(t.to.map(k => moveDot(svg, [SW, PCS[k]], 800, t.cls, t.tag)));
      t.to.forEach(k => markNode(svg, k, 'ok', '✓ ' + ctx.T('dm.recv')));
      Object.keys(PCS).filter(k => !t.to.includes(k)).forEach(k => markNode(svg, k, 'idle', '—'));
      light('S', false);
      busy = false; el.querySelectorAll('[data-k]').forEach(b => { b.disabled = false; });
    }
    el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b && b.dataset.k !== 'auto') cast(b.dataset.k); });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      for (const k of Object.keys(TYPES)) { if (!alive()) return; await cast(k); await sleep(2600); }
    });
  }
};
