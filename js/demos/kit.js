/* =========================================================
 * demos/kit.js — small drawing helpers shared by the animations
 * Each animation file exports { id, mount(el, ctx) }.
 *   ctx.T(key, vars)  plain text (for SVG labels)
 *   ctx.H(key, vars)  HTML with furigana (+ second language if chosen)
 * ========================================================= */
export const NS = 'http://www.w3.org/2000/svg';
export const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const sleep = ms => new Promise(r => setTimeout(r, reduce() ? 0 : ms));
export const escAttr = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** move a dot (a frame) along a path of points */
export function moveDot(svg, pts, ms, cls = 'pkt') {
  return new Promise(res => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', 9); c.setAttribute('class', cls); svg.appendChild(c);
    const seg = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
    const dur = reduce() ? 60 : ms, t0 = performance.now();
    const step = now => {
      let p = Math.min(1, (now - t0) / dur) * tot, i = 0;
      while (i < seg.length - 1 && p > seg[i]) { p -= seg[i]; i++; }
      const f = seg[i] ? Math.min(1, p / seg[i]) : 1;
      c.setAttribute('cx', pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f);
      c.setAttribute('cy', pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f);
      if (now - t0 < dur) requestAnimationFrame(step); else { c.remove(); res(); }
    };
    requestAnimationFrame(step);
  });
}

/** a PC box with a name, an optional small line and a status line under it */
export function nodeSvg(id, x, y, label, sub, extra = '') {
  return `<g class="node ${extra}" data-node="${id}"><rect x="${x - 44}" y="${y - 24}" width="88" height="48" rx="8"/>`
    + `<text x="${x}" y="${sub ? y - 3 : y + 5}" text-anchor="middle">${escAttr(label)}</text>`
    + (sub ? `<text class="sub" x="${x}" y="${y + 14}" text-anchor="middle">${escAttr(sub)}</text>` : '')
    + `<text class="mark" data-mark="${id}" x="${x}" y="${y + 42}" text-anchor="middle"></text></g>`;
}
export function markNode(svg, id, state, txt) {
  const n = svg.querySelector(`[data-node="${id}"]`), m = svg.querySelector(`[data-mark="${id}"]`);
  if (!n) return;
  n.classList.remove('ok', 'ng');
  if (state) n.classList.add(state);
  m.setAttribute('class', 'mark ' + (state || ''));
  m.textContent = txt || '';
}
export function device(x, y, w, label) {
  return `<g class="dev"><rect x="${x - w / 2}" y="${y - 23}" width="${w}" height="46" rx="8"/><text x="${x}" y="${y + 5}" text-anchor="middle">${escAttr(label)}</text></g>`;
}
