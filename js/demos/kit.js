/* =========================================================
 * demos/kit.js — drawing and timing helpers shared by the animations
 * Each animation file exports { id, mount(el, ctx) }.
 *   ctx.T(key, vars)   plain text (for SVG labels)
 *   ctx.H(key, vars)   HTML with furigana (+ second language if chosen)
 *   ctx.term(id)       the Japanese term of a word
 *   ctx.termHTML(id)   the term with its reading
 * Speed: setSpeed(0.5 | 1 | 2) changes every wait and every movement.
 * ========================================================= */
export const NS = 'http://www.w3.org/2000/svg';
export const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let speed = 1;
export const setSpeed = s => { speed = Number(s) || 1; };
export const dur = ms => reduce() ? 0 : ms / speed;
export const sleep = ms => new Promise(r => setTimeout(r, dur(ms)));
export const escAttr = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** run fn(progress 0..1) for ms milliseconds (eased); resolves at the end */
export function tween(ms, fn, easing = ease) {
  return new Promise(res => {
    const d = dur(ms);
    if (!d) { fn(1); res(); return; }
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / d);
      fn(easing(p));
      if (p < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}

/** a frame (small envelope with a label) moving along a path of points */
export function moveDot(svg, pts, ms, cls = 'pkt', label = '') {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'pkt-g ' + cls);
  g.innerHTML = `<rect class="pkt-body" x="-17" y="-11" width="34" height="22" rx="5"/><path class="pkt-flap" d="M-17 -9 L0 2 L17 -9"/>`
    + (label ? `<text class="pkt-label" y="18" text-anchor="middle">${escAttr(label)}</text>` : '');
  svg.appendChild(g);
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  const at = p => {
    let d = p * tot, i = 0;
    while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
    const f = seg[i] ? Math.min(1, d / seg[i]) : 1;
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
  };
  return tween(ms, p => { const [x, y] = at(p); g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); })
    .then(() => g.remove());
}

/** a PC: a small monitor, its name, an optional second line (MAC address) and a status line under it */
export function nodeSvg(id, x, y, label, sub, extra = '') {
  return `<g class="node ${extra}" data-node="${id}">
    <rect class="node-box" x="${x - 46}" y="${y - 24}" width="92" height="48" rx="9"/>
    <g class="pc-ico" transform="translate(${x - 36} ${y - 11})"><rect width="20" height="14" rx="2"/><path d="M6 18h8M10 14v4"/></g>
    <text x="${x + 9}" y="${sub ? y - 2 : y + 5}" text-anchor="middle">${escAttr(label)}</text>
    ${sub ? `<text class="sub" x="${x + 9}" y="${y + 14}" text-anchor="middle">${escAttr(sub)}</text>` : ''}
    <text class="mark" data-mark="${id}" x="${x}" y="${y + 41}" text-anchor="middle"></text></g>`;
}
export function markNode(svg, id, state, txt) {
  const n = svg.querySelector(`[data-node="${id}"]`), m = svg.querySelector(`[data-mark="${id}"]`);
  if (!n) return;
  n.classList.remove('ok', 'ng', 'busy', 'idle');
  if (state) n.classList.add(state);
  m.setAttribute('class', 'mark ' + (state || ''));
  m.textContent = txt || '';
}
/** a hub / switch / repeater box; ports = number of LEDs drawn along its bottom edge */
export function device(x, y, w, label, ports = 0) {
  const leds = Array.from({ length: ports }, (_, i) => `<circle class="led" data-led="${i + 1}" cx="${x - (ports - 1) * 7 + i * 14}" cy="${y + 15}" r="3.2"/>`).join('');
  return `<g class="dev"><rect x="${x - w / 2}" y="${y - 24}" width="${w}" height="48" rx="9"/>
    <text x="${x}" y="${y + (ports ? 1 : 5)}" text-anchor="middle">${escAttr(label)}</text>${leds}</g>`;
}
/** flash the LED of a port */
export function blink(svg, port) {
  const l = svg.querySelector(`[data-led="${port}"]`);
  if (!l) return;
  l.classList.remove('on'); void l.getBBox(); l.classList.add('on');
  setTimeout(() => l.classList.remove('on'), dur(500) + 60);
}
/** a play-through button helper: runs steps while the element is on the page and not stopped */
export function autoplay(el, btn, ctx, run) {
  let on = false;
  const label = () => { btn.innerHTML = on ? `■ ${ctx.H('dm.stop')}` : `▶▶ ${ctx.H('dm.auto')}`; btn.classList.toggle('btn-primary', !on); };
  label();
  btn.addEventListener('click', async () => {
    if (on) { on = false; label(); return; }
    on = true; label();
    try { await run(() => on && el.isConnected); } finally { on = false; if (el.isConnected) label(); }
  });
}
