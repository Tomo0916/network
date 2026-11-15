/* route — PC A sends to a server in another network: first to the default gateway (R1),
 * R1 looks at its routing table, the packet goes on to R2 and then to the server.
 * TTL goes down by 1 at each router; with TTL = 2 the packet dies at R2 and ICMP reports it. */
import { moveDot, nodeSvg, markNode, device, blink, sleep, autoplay, escAttr } from './kit.js';

const A = [62, 124], SW = [62, 226], P2 = [62, 304], R1 = [210, 120], R2 = [350, 120], SV = [466, 226];
const NETS = [
  { x: 6, y: 66, w: 124, h: 286, label: '192.168.1.0/24' },
  { x: 160, y: 70, w: 240, h: 100, label: '10.0.0.0/30' },
  { x: 408, y: 168, w: 120, h: 112, label: '192.168.2.0/24' }
];

export default {
  id: 'route',
  mount(el, ctx) {
    let busy = false;
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 534 366" role="img" aria-label="${ctx.T('demo.route')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite">${ctx.H('dm.rtIntro')}</div>
        <div class="demo-ctl">
          <button class="btn btn-primary btn-sm" data-k="far">${ctx.H('dm.rtFar')} ▶</button>
          <button class="btn btn-ghost btn-sm" data-k="near">${ctx.H('dm.rtNear')} ▶</button>
          <label class="chk"><input type="checkbox" data-k="ttl2"> <span>${ctx.H('dm.rtTtl2')}</span></label>
          <button class="btn btn-ghost btn-sm" data-k="auto"></button>
        </div>
        <div class="tablebox card rt-box"></div>
      </div></div>`;
    const svg = el.querySelector('svg'), narr = el.querySelector('.narr');
    svg.innerHTML = NETS.map(n => `<rect class="net-zone" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14"/><text class="port net-label" x="${n.x + 8}" y="${n.y + 16}">${n.label}</text>`).join('')
      + `<line class="link" data-link="a" x1="${A[0]}" y1="${A[1]}" x2="${SW[0]}" y2="${SW[1]}"/>
        <line class="link" data-link="p2" x1="${SW[0]}" y1="${SW[1]}" x2="${P2[0]}" y2="${P2[1]}"/>
        <path class="link" data-link="sr1" d="M${SW[0]} ${SW[1]} H${R1[0]} V${R1[1]}" fill="none"/>
        <line class="link" data-link="r1r2" x1="${R1[0]}" y1="${R1[1]}" x2="${R2[0]}" y2="${R2[1]}"/>
        <path class="link" data-link="r2s" d="M${R2[0]} ${R2[1]} V${SV[1]} H${SV[0] - 46}" fill="none"/>`
      + device(R1[0], R1[1], 70, 'R1') + device(R2[0], R2[1], 70, 'R2')
      + `<text class="port" x="${R1[0]}" y="${R1[1] + 40}" text-anchor="middle">.1 / 10.0.0.1</text><text class="port" x="${R2[0]}" y="${R2[1] + 40}" text-anchor="middle">10.0.0.2 / .1</text>`
      + `<g class="dev small"><rect x="${SW[0] - 30}" y="${SW[1] - 16}" width="60" height="32" rx="8"/><text x="${SW[0]}" y="${SW[1] + 5}" text-anchor="middle">SW</text></g>`
      + nodeSvg('a', A[0], A[1], 'PC A', '.10')
      + nodeSvg('p2', P2[0], P2[1], 'PC B', '.30')
      + nodeSvg('s', SV[0], SV[1], 'Server', '.20');
    const light = (ks, on) => ks.forEach(k => { const l = svg.querySelector(`[data-link="${k}"]`); if (l) l.classList.toggle('hot', on); });
    const ROWS = [['192.168.1.0/24', 'dm.rtDirect'], ['192.168.2.0/24', '10.0.0.2'], ['0.0.0.0/0', 'dm.rtInternet']];
    function drawTable(hit) {
      el.querySelector('.rt-box').innerHTML = `<h3>${ctx.H('dm.rtTable')}</h3>
        <table class="mactable"><thead><tr><th>${ctx.H('dm.rtDest')}</th><th>${ctx.H('dm.rtNext')}</th></tr></thead><tbody>
        ${ROWS.map((r, i) => `<tr class="${hit === i ? 'new' : ''}"><td class="mono">${r[0]}</td><td>${r[1].startsWith('dm.') ? ctx.H(r[1]) : `<span class="mono">${r[1]}</span>`}</td></tr>`).join('')}</tbody></table>`;
    }
    const say = (k, v) => { narr.innerHTML = ctx.H(k, v); };
    const btns = on => el.querySelectorAll('[data-k="far"],[data-k="near"],[data-k="ttl2"]').forEach(b => { b.disabled = !on; });
    async function far() {
      if (busy) return; busy = true; btns(false);
      ['a', 'p2', 's'].forEach(k => markNode(svg, k)); drawTable();
      let ttl = el.querySelector('[data-k="ttl2"]').checked ? 2 : 64;
      say('dm.rt1');
      light(['a', 'sr1'], true);
      await moveDot(svg, [A, SW, [R1[0], SW[1]], R1], 1500, 'pkt', 'TTL ' + ttl);
      light(['a', 'sr1'], false);
      ttl--; drawTable(1); say('dm.rt2', { ttl });
      await sleep(2600);
      light(['r1r2'], true);
      await moveDot(svg, [R1, R2], 900, 'pkt', 'TTL ' + ttl);
      light(['r1r2'], false);
      ttl--;
      if (ttl <= 0) {
        say('dm.rtDead');
        markNode(svg, 's', 'idle', '—');
        await sleep(1600);
        light(['r1r2', 'sr1', 'a'], true);
        await moveDot(svg, [R2, R1, [R1[0], SW[1]], SW, A], 1800, 'pkt b', 'ICMP');
        light(['r1r2', 'sr1', 'a'], false);
        markNode(svg, 'a', 'ng', ctx.T('dm.rtIcmp'));
      } else {
        say('dm.rt3', { ttl });
        await sleep(2200);
        light(['r2s'], true);
        await moveDot(svg, [R2, [R2[0], SV[1]], [SV[0] - 46, SV[1]]], 1100, 'pkt', 'TTL ' + ttl);
        light(['r2s'], false);
        markNode(svg, 's', 'ok', '✓ ' + ctx.T('dm.recv'));
        say('dm.rt4');
      }
      drawTable(); busy = false; btns(true);
    }
    async function near() {
      if (busy) return; busy = true; btns(false);
      ['a', 'p2', 's'].forEach(k => markNode(svg, k)); drawTable();
      say('dm.rtSame');
      light(['a', 'p2'], true);
      await moveDot(svg, [A, SW, P2], 1300, 'pkt', 'TTL 64');
      light(['a', 'p2'], false);
      markNode(svg, 'p2', 'ok', '✓ ' + ctx.T('dm.recv'));
      busy = false; btns(true);
    }
    el.addEventListener('click', e => {
      const k = e.target.closest('[data-k]') && e.target.closest('[data-k]').dataset.k;
      if (k === 'far') far();
      if (k === 'near') near();
    });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      const box = el.querySelector('[data-k="ttl2"]');
      for (const step of ['near', 'far', 'ttl']) {
        if (!alive()) return;
        box.checked = step === 'ttl';
        await (step === 'near' ? near() : far());
        await sleep(3000);
      }
      box.checked = false;
    });
    drawTable();
  }
};
