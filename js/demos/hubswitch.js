/* hubswitch — a hub sends to every port; a switch learns MAC addresses and floods only when it must */
import { moveDot, sleep, nodeSvg, markNode, device } from './kit.js';

const PCS = { A: [70, 60, 1, '…:0A'], B: [330, 60, 2, '…:0B'], C: [330, 230, 3, '…:0C'], D: [70, 230, 4, '…:0D'] };
const CEN = [200, 145];
const KEYS = Object.keys(PCS);

export default {
  id: 'hubswitch',
  mount(el, ctx) {
    const st = { mode: 'switch', table: {}, busy: false };
    el.innerHTML = `<div class="demo">
      <div class="stage card"><svg viewBox="0 0 400 300" role="img" aria-label="${ctx.T('demo.hubswitch')}"></svg></div>
      <div class="demo-side">
        <div class="narr" aria-live="polite"></div>
        <div class="seg" role="group">
          <label class="seg-i"><input type="radio" name="hs-mode" value="hub"><span>${ctx.term('hub')}</span></label>
          <label class="seg-i"><input type="radio" name="hs-mode" value="switch" checked><span>${ctx.term('switch')}</span></label>
        </div>
        <div class="demo-ctl">
          <label>${ctx.H('dm.from')} <select data-k="src">${KEYS.map(k => `<option ${k === 'A' ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
          <label>${ctx.H('dm.to')} <select data-k="dst">${KEYS.map(k => `<option ${k === 'C' ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
          <button class="btn btn-primary btn-sm" data-k="send">${ctx.H('dm.send')} ▶</button>
        </div>
        <div class="tablebox card"></div>
      </div></div>`;
    const svg = el.querySelector('svg'), narr = el.querySelector('.narr'), box = el.querySelector('.tablebox');
    const say = (k, v) => { narr.innerHTML = ctx.H(k, v); };
    const pos = k => [PCS[k][0], PCS[k][1]];

    function draw() {
      svg.innerHTML = KEYS.map(k => `<line class="link" x1="${CEN[0]}" y1="${CEN[1]}" x2="${PCS[k][0]}" y2="${PCS[k][1]}"/>`).join('')
        + KEYS.map(k => { const [x, y, p] = PCS[k]; const px = CEN[0] + (x - CEN[0]) * .34, py = CEN[1] + (y - CEN[1]) * .34; return `<text class="port" x="${px + (x < 200 ? -16 : 8)}" y="${py}">p${p}</text>`; }).join('')
        + device(CEN[0], CEN[1], 104, st.mode === 'hub' ? 'HUB' : 'SWITCH')
        + KEYS.map(k => nodeSvg(k, PCS[k][0], PCS[k][1], 'PC ' + k, PCS[k][3])).join('');
      drawTable();
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
    async function send(src, dst) {
      if (st.busy) return;
      if (src === dst) { say('dm.same'); return; }
      st.busy = true; el.querySelector('[data-k="send"]').disabled = true;
      KEYS.forEach(k => markNode(svg, k));
      say('dm.sends', { a: src, b: dst });
      await moveDot(svg, [pos(src), CEN], 700);
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
      await sleep(600);
      await Promise.all(targets.map(t => moveDot(svg, [CEN, pos(t)], 700)));
      targets.forEach(t => t === dst ? markNode(svg, t, 'ok', '✓ ' + ctx.T('dm.recv')) : markNode(svg, t, 'ng', '× ' + ctx.T('dm.drop')));
      if (after) { await sleep(400); say(after); }
      st.busy = false; el.querySelector('[data-k="send"]').disabled = false;
    }
    el.addEventListener('change', e => {
      if (e.target.name === 'hs-mode' && !st.busy) { st.mode = e.target.value; st.table = {}; draw(); }
    });
    el.addEventListener('click', e => {
      const k = e.target.closest('[data-k]') && e.target.closest('[data-k]').dataset.k;
      if (k === 'send') send(el.querySelector('[data-k="src"]').value, el.querySelector('[data-k="dst"]').value);
      if (k === 'clear' && !st.busy) { st.table = {}; drawTable(); say('dm.cleared'); }
    });
    draw();
  }
};
