/* arp — PC A knows the IP address of C, but not its MAC address.
 * It asks everyone (broadcast), only C answers (unicast), A writes the answer in its ARP table,
 * then sends. The second time, the answer is already in the table. */
import { moveDot, nodeSvg, markNode, device, blink, sleep, autoplay, escAttr } from './kit.js';

const SW = [230, 150];
const PCS = {
  a: { xy: [60, 150], ip: '192.168.1.10', mac: '…:0A' },
  b: { xy: [400, 46], ip: '192.168.1.20', mac: '…:0B' },
  c: { xy: [400, 150], ip: '192.168.1.50', mac: '3c-22-fb-8a-01-0c' },
  d: { xy: [400, 254], ip: '192.168.1.30', mac: '…:0D' }
};
const PORT = { a: 1, b: 2, c: 3, d: 4 };

export default {
  id: 'arp',
  mount(el, ctx) {
    let busy = false, table = [];
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 470 300" role="img" aria-label="${ctx.T('demo.arp')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite">${ctx.H('dm.arpIntro')}</div>
        <div class="demo-ctl">
          <button class="btn btn-primary btn-sm" data-k="send">${ctx.H('dm.arpSendBtn')} ▶</button>
          <button class="btn btn-ghost btn-sm" data-k="clear">${ctx.H('dm.arpClear')}</button>
          <button class="btn btn-ghost btn-sm" data-k="auto"></button>
        </div>
        <div class="tablebox card arp-box"></div>
      </div></div>`;
    const svg = el.querySelector('svg'), narr = el.querySelector('.narr');
    svg.innerHTML = Object.entries(PCS).map(([k, p]) => `<line class="link" data-link="${k}" x1="${SW[0]}" y1="${SW[1]}" x2="${p.xy[0]}" y2="${p.xy[1]}"/>`).join('')
      + device(SW[0], SW[1], 92, 'SWITCH', 4) + `<text class="port net-label" x="8" y="18">192.168.1.0/24</text>`
      + Object.entries(PCS).map(([k, p]) => nodeSvg(k, p.xy[0], p.xy[1], 'PC ' + k.toUpperCase(), '.' + p.ip.split('.')[3], k === 'c' ? 'target' : '')).join('');
    const light = (ks, on) => ks.forEach(k => { const l = svg.querySelector(`[data-link="${k}"]`); if (l) l.classList.toggle('hot', on); });
    function drawTable(fresh) {
      el.querySelector('.arp-box').innerHTML = `<h3>${ctx.H('dm.arpTable')}</h3>
        <table class="mactable"><thead><tr><th>${ctx.termHTML('ipaddress')}</th><th>${ctx.termHTML('mac')}</th><th>${ctx.H('dm.arpType')}</th></tr></thead><tbody>
        ${table.length ? table.map(r => `<tr class="${fresh ? 'new' : ''}"><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${ctx.H('dm.arpDyn')}</td></tr>`).join('')
          : `<tr><td colspan="3" class="muted">${ctx.H('dm.arpEmpty')}</td></tr>`}</tbody></table>
        <p class="muted small mono">C:\\&gt; arp -a 192.168.1.50</p>`;
    }
    const say = (k, v) => { narr.innerHTML = ctx.H(k, v); };
    const btns = on => el.querySelectorAll('[data-k="send"],[data-k="clear"]').forEach(b => { b.disabled = !on; });
    async function run() {
      if (busy) return;
      busy = true; btns(false);
      Object.keys(PCS).forEach(k => markNode(svg, k));
      const known = table.length > 0;
      say('dm.arp1', { ip: PCS.c.ip });
      el.querySelector('.arp-box').classList.add('look');
      await sleep(1800);
      el.querySelector('.arp-box').classList.remove('look');
      if (!known) {
        /* 1. ask everyone */
        say('dm.arp2');
        light(['a'], true);
        await moveDot(svg, [PCS.a.xy, SW], 650, 'pkt b', '.50 ?');
        blink(svg, 1); await sleep(200);
        const others = ['b', 'c', 'd'];
        light(others, true); others.forEach(k => blink(svg, PORT[k]));
        await Promise.all(others.map(k => moveDot(svg, [SW, PCS[k].xy], 750, 'pkt b', '.50 ?')));
        markNode(svg, 'b', 'idle', ctx.T('dm.arpNotMe')); markNode(svg, 'd', 'idle', ctx.T('dm.arpNotMe'));
        markNode(svg, 'c', 'ok', ctx.T('dm.arpMe'));
        light(['a', 'b', 'c', 'd'], false);
        await sleep(1400);
        /* 2. only C answers, to A only */
        say('dm.arp3', { mac: PCS.c.mac });
        light(['c', 'a'], true);
        await moveDot(svg, [PCS.c.xy, SW], 650, 'pkt', 'MAC');
        blink(svg, PORT.c);
        await moveDot(svg, [SW, PCS.a.xy], 650, 'pkt', 'MAC');
        light(['c', 'a'], false);
        /* 3. write it down */
        table = [[PCS.c.ip, PCS.c.mac]]; drawTable(true);
        say('dm.arp4');
        await sleep(2200);
      } else {
        say('dm.arpAgain');
        await sleep(1800);
      }
      /* 4. now the frame can go to C */
      Object.keys(PCS).forEach(k => markNode(svg, k));
      say('dm.arp5');
      light(['a', 'c'], true);
      await moveDot(svg, [PCS.a.xy, SW], 650, 'pkt', '→C');
      blink(svg, PORT.c);
      await moveDot(svg, [SW, PCS.c.xy], 650, 'pkt', '→C');
      markNode(svg, 'c', 'ok', '✓ ' + ctx.T('dm.recv'));
      light(['a', 'c'], false);
      drawTable(false);
      busy = false; btns(true);
    }
    el.addEventListener('click', e => {
      const k = e.target.closest('[data-k]') && e.target.closest('[data-k]').dataset.k;
      if (k === 'send') run();
      if (k === 'clear' && !busy) { table = []; drawTable(); Object.keys(PCS).forEach(x => markNode(svg, x)); say('dm.arpCleared'); }
    });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      table = []; drawTable();
      for (let i = 0; i < 2; i++) { if (!alive()) return; await run(); await sleep(2600); }
    });
    drawTable();
  }
};
