/* hubswitch — a hub sends to every port; a switch learns MAC addresses and floods only when it must */
import { moveDot, sleep, nodeSvg, markNode, device, blink, autoplay } from './kit.js';

const PCS = { A: [74, 58, 1, '…:0A'], B: [326, 58, 2, '…:0B'], C: [326, 236, 3, '…:0C'], D: [74, 236, 4, '…:0D'] };
const CEN = [200, 147];
const KEYS = Object.keys(PCS);
/* the order the switch is shown in "auto": learn A, flood, learn C, then a direct send */
const SCRIPT = [['A', 'C'], ['C', 'A'], ['A', 'C'], ['D', 'B']];

export default {
  id: 'hubswitch',
  mount(el, ctx) {
    const st = { mode: 'switch', table: {}, busy: false };
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 400 300" role="img" aria-label="${ctx.T('demo.hubswitch')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite"></div>
        <div class="seg" role="group">
          <label class="seg-i"><input type="radio" name="hs-mode" value="hub"><span lang="ja">${ctx.term('hub')}</span></label>
          <label class="seg-i"><input type="radio" name="hs-mode" value="switch" checked><span lang="ja">${ctx.term('switch')}</span></label>
        </div>
        <div class="demo-ctl">
          <label>${ctx.H('dm.from')} <select data-k="src">${KEYS.map(k => `<option ${k === 'A' ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
          <label>${ctx.H('dm.to')} <select data-k="dst">${KEYS.map(k => `<option ${k === 'C' ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
          <button class="btn btn-primary btn-sm" data-k="send">${ctx.H('dm.send')} ▶</button>
          <button class="btn btn-ghost btn-sm" data-k="auto"></button>
        </div>
        <div class="tablebox card"></div>
        <div class="tally card"></div>
      </div></div>`;
    const svg = el.querySelector('svg'), narr = el.querySelector('.narr'), box = el.querySelector('.tablebox');
    const say = (k, v) => { narr.innerHTML = ctx.H(k, v); };
    const pos = k => [PCS[k][0], PCS[k][1]];
    const portPos = k => [CEN[0] + (PCS[k][0] - CEN[0]) * .2, CEN[1] + (PCS[k][1] - CEN[1]) * .2];
    let sent = 0, extra = 0;   // frames sent, and frames delivered to PCs that did not need them

    function draw() {
      svg.innerHTML = `<g class="links">${KEYS.map(k => `<line class="link" data-link="${k}" x1="${CEN[0]}" y1="${CEN[1]}" x2="${PCS[k][0]}" y2="${PCS[k][1]}"/>`).join('')}</g>`
        + KEYS.map(k => { const [x, y, p] = PCS[k]; const px = CEN[0] + (x - CEN[0]) * .42, py = CEN[1] + (y - CEN[1]) * .42; return `<text class="port" x="${px + (x < 200 ? -18 : 8)}" y="${py + 4}">p${p}</text>`; }).join('')
        + device(CEN[0], CEN[1], 116, st.mode === 'hub' ? 'HUB' : 'SWITCH', 4)
        + KEYS.map(k => nodeSvg(k, PCS[k][0], PCS[k][1], 'PC ' + k, PCS[k][3])).join('');
      drawTable(); tally();
      say(st.mode === 'hub' ? 'dm.introHub' : 'dm.introSwitch');
    }
    function drawTable(fresh) {
      if (st.mode !== 'switch') { box.hidden = true; return; }
      box.hidden = false;
      const rows = Object.entries(st.table);
      box.innerHTML = `<h3>${ctx.H('dm.table')}</h3><table class="mactable"><thead><tr><th>MAC</th><th>${ctx.H('dm.port')}</th></tr></thead><tbody>${rows.length
        ? rows.map(([k, p]) => `<tr class="${k === fresh ? 'new' : ''}"><td>PC ${k} (${PCS[k][3]})</td><td>p${p}</td></tr>`).join('')
        : `<tr><td colspan="2" class="muted">${ctx.H('dm.empty')}</td></tr>`}</tbody></table>
        <button class="linkbtn" data-k="clear">${ctx.H('dm.clear')}</button>`;
    }
    function tally() {
      el.querySelector('.tally').innerHTML = `<div class="tally-row"><span>${ctx.H('dm.sentCount')}</span><b>${sent}</b></div>
        <div class="tally-row ${extra ? 'bad' : ''}"><span>${ctx.H('dm.wasteCount')}</span><b>${extra}</b></div>`;
    }
    const light = (k, on) => { const l = svg.querySelector(`[data-link="${k}"]`); if (l) l.classList.toggle('hot', on); };
    async function send(src, dst) {
      if (st.busy) return;
      if (src === dst) { say('dm.same'); return; }
      st.busy = true; el.querySelector('[data-k="send"]').disabled = true;
      KEYS.forEach(k => { markNode(svg, k); light(k, false); });
      markNode(svg, src, 'busy');
      say('dm.sends', { a: src, b: dst });
      light(src, true);
      await moveDot(svg, [pos(src), portPos(src), CEN], 800, 'pkt', '→' + dst);
      blink(svg, PCS[src][2]);
      let targets, after;
      if (st.mode === 'hub') { targets = KEYS.filter(k => k !== src); say('dm.hubAll'); after = 'dm.dropHub'; }
      else {
        const isNew = !st.table[src];
        st.table[src] = PCS[src][2];
        drawTable(isNew ? src : null);
        const lead = isNew ? ctx.H('dm.learned', { a: src, p: 'p' + PCS[src][2] }) + ' ' : '';
        if (st.table[dst]) { targets = [dst]; narr.innerHTML = lead + ctx.H('dm.knownDst', { b: dst, p: 'p' + st.table[dst] }); }
        else { targets = KEYS.filter(k => k !== src); narr.innerHTML = lead + ctx.H('dm.unknownDst', { b: dst }); after = 'dm.dropFlood'; }
      }
      await sleep(900);
      targets.forEach(t => { light(t, true); blink(svg, PCS[t][2]); });
      await Promise.all(targets.map(t => moveDot(svg, [CEN, portPos(t), pos(t)], 800, 'pkt', '→' + dst)));
      sent++; extra += targets.filter(t => t !== dst).length; tally();
      targets.forEach(t => t === dst ? markNode(svg, t, 'ok', '✓ ' + ctx.T('dm.recv')) : markNode(svg, t, 'ng', '× ' + ctx.T('dm.drop')));
      markNode(svg, src);
      if (after) { await sleep(700); say(after); }
      await sleep(300);
      KEYS.forEach(k => light(k, false));
      st.busy = false; el.querySelector('[data-k="send"]').disabled = false;
    }
    el.addEventListener('change', e => {
      if (e.target.name === 'hs-mode' && !st.busy) { st.mode = e.target.value; st.table = {}; sent = 0; extra = 0; draw(); }
    });
    el.addEventListener('click', e => {
      const k = e.target.closest('[data-k]') && e.target.closest('[data-k]').dataset.k;
      if (k === 'send') send(el.querySelector('[data-k="src"]').value, el.querySelector('[data-k="dst"]').value);
      if (k === 'clear' && !st.busy) { st.table = {}; drawTable(); say('dm.cleared'); }
    });
    autoplay(el, el.querySelector('[data-k="auto"]'), ctx, async alive => {
      if (st.busy) return;
      st.table = {}; sent = 0; extra = 0; drawTable(); tally();
      for (const [a, b] of SCRIPT) {
        if (!alive()) return;
        el.querySelector('[data-k="src"]').value = a; el.querySelector('[data-k="dst"]').value = b;
        await send(a, b);
        await sleep(1600);
      }
    });
    draw();
  }
};
