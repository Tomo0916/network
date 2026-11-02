/* cast — unicast, broadcast and multicast: who receives the frame */
import { moveDot, nodeSvg, markNode, device } from './kit.js';

const PCS = { 1: [342, 40], 2: [342, 97], 3: [342, 155], 4: [342, 212], 5: [342, 270] };
const SW = [190, 155], SRC = [56, 155], GROUP = ['2', '4'];
const TYPES = {
  unicast: { to: ['3'], mac: '00:1A:2B:00:00:03', say: 'dm.uni' },
  broadcast: { to: ['1', '2', '3', '4', '5'], mac: 'FF:FF:FF:FF:FF:FF', say: 'dm.broad', cls: 'pkt b' },
  multicast: { to: GROUP, mac: '01:00:5E:00:00:01', say: 'dm.multi' }
};

export default {
  id: 'cast',
  mount(el, ctx) {
    let busy = false;
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 400 310" role="img" aria-label="${ctx.T('demo.cast')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite">${ctx.H('dm.castIntro')}</div>
        <div class="demo-ctl">${Object.keys(TYPES).map(k => `<button class="btn btn-ghost btn-sm" data-k="${k}">${ctx.termHTML(k)}</button>`).join('')}</div>
        <div class="tablebox card"><h3>${ctx.H('dm.dmac')}</h3><div class="mono dmac">—</div></div>
      </div></div>`;
    const svg = el.querySelector('svg');
    svg.innerHTML = `<line class="link" x1="${SRC[0]}" y1="${SRC[1]}" x2="${SW[0]}" y2="${SW[1]}"/>`
      + Object.values(PCS).map(([x, y]) => `<line class="link" x1="${SW[0]}" y1="${SW[1]}" x2="${x}" y2="${y}"/>`).join('')
      + device(SW[0], SW[1], 84, 'SWITCH')
      + nodeSvg('S', SRC[0], SRC[1], ctx.T('dm.sender'), '')
      + Object.entries(PCS).map(([k, [x, y]]) => nodeSvg(k, x, y, 'PC ' + k, GROUP.includes(k) ? ctx.T('dm.group') : '', GROUP.includes(k) ? 'grp' : '')).join('');

    async function cast(type) {
      if (busy) return;
      busy = true; el.querySelectorAll('[data-k]').forEach(b => { b.disabled = true; });
      const t = TYPES[type];
      Object.keys(PCS).forEach(k => markNode(svg, k));
      el.querySelector('.dmac').textContent = t.mac;
      el.querySelector('.narr').innerHTML = ctx.H(t.say);
      await moveDot(svg, [SRC, SW], 600, t.cls);
      await Promise.all(t.to.map(k => moveDot(svg, [SW, PCS[k]], 700, t.cls)));
      t.to.forEach(k => markNode(svg, k, 'ok', '✓'));
      busy = false; el.querySelectorAll('[data-k]').forEach(b => { b.disabled = false; });
    }
    el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) cast(b.dataset.k); });
  }
};
