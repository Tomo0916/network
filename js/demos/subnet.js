/* subnet — an IP address and a prefix length: which bits are the network part and which the host part,
 * the subnet mask, the network address, the broadcast address and how many devices fit. */
import { sleep, autoplay, escAttr } from './kit.js';

const IPS = ['192.168.1.10', '10.1.5.20', '172.16.33.7'];
const toBits = ip => ip.split('.').map(n => (+n).toString(2).padStart(8, '0')).join('');
const toIp = bits => [0, 8, 16, 24].map(i => parseInt(bits.slice(i, i + 8), 2)).join('.');

export default {
  id: 'subnet',
  mount(el, ctx) {
    const st = { ip: IPS[0], p: 24 };
    el.innerHTML = `<div class="demo">
      <div class="stage card sn-stage"></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite">${ctx.H('dm.snIntro')}</div>
        <div class="demo-ctl">
          <label>${ctx.termHTML('ipaddress')} <select data-k="ip">${IPS.map(ip => `<option>${ip}</option>`).join('')}</select></label>
        </div>
        <div class="demo-ctl sn-range"><label for="sn-p">${ctx.termHTML('prefix')}</label>
          <input id="sn-p" type="range" min="8" max="30" step="1" value="24" data-k="p"><b class="mono sn-pv">/24</b></div>
        <div class="demo-ctl"><button class="btn btn-ghost btn-sm" data-k="auto"></button></div>
      </div></div>`;
    const stage = el.querySelector('.sn-stage');
    function draw(changed) {
      const bits = toBits(st.ip), p = st.p, h = 32 - p;
      const net = bits.slice(0, p), mask = '1'.repeat(p) + '0'.repeat(h);
      const cell = (b, i) => `<span class="b ${i < p ? 'n' : 'h'}${i % 8 === 7 && i < 31 ? ' dot' : ''}">${b}</span>`;
      const row = (label, s, cls = '') => `<div class="sn-row ${cls}"><div class="sn-l">${label}</div><div class="sn-bits mono">${[...s].map(cell).join('')}</div><div class="sn-dec mono">${toIp(s)}</div></div>`;
      const hosts = Math.max(0, 2 ** h - 2);
      stage.innerHTML = `<div class="sn-legend"><span class="k n"></span>${ctx.termHTML('netpart')} <b class="mono">${p}</b> bit
          <span class="k h"></span>${ctx.termHTML('hostpart')} <b class="mono">${h}</b> bit</div>
        ${row(ctx.termHTML('ipaddress'), bits, 'ip')}
        ${row(ctx.termHTML('subnetmask'), mask, 'mask')}
        <div class="sn-sep"></div>
        ${row(ctx.termHTML('netaddr') + `<small>${ctx.H('dm.snAll0')}</small>`, net + '0'.repeat(h), 'na')}
        ${row(ctx.termHTML('bcastaddr') + `<small>${ctx.H('dm.snAll1')}</small>`, net + '1'.repeat(h), 'ba')}
        <div class="sn-sum"><div><span class="muted small">${ctx.H('dm.snUse')}</span><b class="mono">${toIp(net + '0'.repeat(h - 1) + '1')} – ${toIp(net + '1'.repeat(h - 1) + '0')}</b></div>
          <div><span class="muted small">${ctx.H('dm.snCount')}</span><b class="mono big">${hosts.toLocaleString()}</b><span class="muted small">= 2<sup>${h}</sup> − 2</span></div></div>`;
      el.querySelector('.sn-pv').textContent = '/' + p;
      if (changed) stage.classList.remove('pulse'), void stage.offsetWidth, stage.classList.add('pulse');
    }
    el.addEventListener('input', e => {
      if (e.target.dataset.k === 'p') { st.p = +e.target.value; draw(true); el.querySelector('.narr').innerHTML = ctx.H('dm.snMove', { p: st.p, h: 32 - st.p }); }
      if (e.target.dataset.k === 'ip') { st.ip = e.target.value; draw(true); }
    });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      const steps = [[24, 'dm.snS24'], [16, 'dm.snS16'], [26, 'dm.snS26'], [24, 'dm.snS0']];
      for (const [p, k] of steps) {
        if (!alive()) return;
        st.p = p; el.querySelector('#sn-p').value = p; draw(true);
        el.querySelector('.narr').innerHTML = ctx.H(k);
        await sleep(4200);
      }
    });
    draw();
  }
};
