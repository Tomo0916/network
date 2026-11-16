/* =========================================================
 * figures.js — still diagrams for the lesson pages (js/lessons.js).
 * Each figure is a function (T) => SVG markup; T(key) gives plain text in the reader's language.
 * They reuse the look of the animations (js/demos/kit.js), so a figure and its animation match.
 * ========================================================= */
import { nodeSvg, device, escAttr } from './demos/kit.js';

/* a line with an arrow head (class "flow" = the signal) */
const arrowDefs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="ah"/></marker></defs>`;
const flow = (a, b, cls = '') => `<line class="flow ${cls}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" marker-end="url(#ah)"/>`;
/* a point on the way from a to b (f = 0..1) */
const along = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
/* PC box with a status line under it ('ok' / 'ng' / '') */
const pc = (id, p, sub, state, mark) => nodeSvg(id, p[0], p[1], 'PC ' + id, sub, state).replace('></text></g>', `>${escAttr(mark || '')}</text></g>`).replace('class="mark"', `class="mark ${state || ''}"`);
const tag = (x, y, txt, cls = '') => `<text class="ftag ${cls}" x="${x}" y="${y}" text-anchor="middle">${escAttr(txt)}</text>`;

/* four PCs around a box in the middle */
const P4 = { A: [80, 58], B: [360, 58], C: [360, 232], D: [80, 232] };
const MID = [220, 145];
const links = () => Object.values(P4).map(p => `<line class="link" x1="${MID[0]}" y1="${MID[1]}" x2="${p[0]}" y2="${p[1]}"/>`).join('');

export const FIGURES = {
  /* a hub copies the signal from A to every other port */
  hubAll(T) {
    const out = ['B', 'C', 'D'];
    return `<svg viewBox="0 0 440 290" role="img" aria-label="${escAttr(T('fg.hubAllAlt'))}">${arrowDefs}
      ${links()}
      ${flow(along(P4.A, MID, .42), along(P4.A, MID, .75), 'hot')}
      ${out.map(k => flow(along(MID, P4[k], .32), along(MID, P4[k], .62), 'hot')).join('')}
      ${device(MID[0], MID[1], 110, 'HUB', 4)}
      ${pc('A', P4.A, '', 'busy', T('fg.send'))}
      ${pc('B', P4.B, '', 'ng', '× ' + T('fg.drop'))}
      ${pc('C', P4.C, T('fg.dest'), 'ok', '✓ ' + T('fg.recv'))}
      ${pc('D', P4.D, '', 'ng', '× ' + T('fg.drop'))}
      ${tag(MID[0], 40, T('fg.allPorts'), 'accent')}
    </svg>`;
  },
  /* A and C send at the same moment: the signals meet in the hub and break */
  hubColl(T) {
    const burst = [...Array(10)].map((_, i) => { const a = i * Math.PI / 5, r = i % 2 ? 17 : 34; return `${(MID[0] + r * Math.cos(a)).toFixed(1)},${(MID[1] - 2 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    return `<svg viewBox="0 0 440 290" role="img" aria-label="${escAttr(T('fg.hubCollAlt'))}">${arrowDefs}
      ${links()}
      ${flow(along(P4.A, MID, .42), along(P4.A, MID, .72), 'hot')}
      ${flow(along(P4.C, MID, .42), along(P4.C, MID, .72), 'hot')}
      ${flow(along(MID, P4.B, .34), along(MID, P4.B, .62), 'bad')}
      ${flow(along(MID, P4.D, .34), along(MID, P4.D, .62), 'bad')}
      ${device(MID[0], MID[1], 110, 'HUB', 4)}
      <polygon class="fburst" points="${burst}"/>
      ${tag(MID[0], MID[1] + 3, T('fg.coll'), 'burst-t')}
      ${pc('A', P4.A, '', 'busy', T('fg.send'))}
      ${pc('C', P4.C, '', 'busy', T('fg.send'))}
      ${pc('B', P4.B, '', 'ng', '× ' + T('fg.broken'))}
      ${pc('D', P4.D, '', 'ng', '× ' + T('fg.broken'))}
    </svg>`;
  },
  /* collision domains: one for the whole hub, one per port for a switch (shown as two panels) */
  collDomain(T) {
    const panel = (mode) => {
      const isHub = mode === 'hub';
      let zones;
      if (isHub) zones = `<rect class="cdom" x="18" y="16" width="404" height="262" rx="22"/>`;
      else zones = Object.values(P4).map(p => {
        const e = along(MID, p, .42), cx = (p[0] + e[0]) / 2, cy = (p[1] + e[1]) / 2;
        const len = Math.hypot(p[0] - e[0], p[1] - e[1]) + 96, ang = Math.atan2(p[1] - e[1], p[0] - e[0]) * 180 / Math.PI;
        return `<rect class="cdom" x="${(cx - len / 2).toFixed(1)}" y="${cy - 40}" width="${len.toFixed(1)}" height="80" rx="38" transform="rotate(${ang.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
      }).join('');
      return `<figure class="fig-panel"><svg viewBox="0 0 440 300" role="img" aria-label="${escAttr(T(isHub ? 'fg.cdHubAlt' : 'fg.cdSwAlt'))}">
        ${zones}${links()}
        ${device(MID[0], MID[1], 120, isHub ? 'HUB' : 'SWITCH', 4)}
        ${Object.keys(P4).map(k => pc(k, P4[k], '', '', '')).join('')}
      </svg><figcaption><b>${escAttr(isHub ? 'HUB' : 'SWITCH')}</b> · ${escAttr(T('fg.cdCount', { n: isHub ? 1 : 4 }))}</figcaption></figure>`;
    };
    return `<div class="fig-pair">${panel('hub')}${panel('switch')}</div>`;
  }
};
