/* =========================================================
 * figures.js — still diagrams for the lesson pages (js/lessons.js).
 * Each figure is a function (T) => SVG markup; T(key) gives plain text in the reader's language.
 * They reuse the look of the animations (js/demos/kit.js), so a figure and its animation match.
 * ========================================================= */
import { nodeSvg, device, escAttr } from './demos/kit.js';
import { WORD_BY_ID } from './words.js';

/* a line with an arrow head (class "flow" = the signal) */
const arrowDefs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="ah"/></marker></defs>`;
const flow = (a, b, cls = '') => `<line class="flow ${cls}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" marker-end="url(#ah)"/>`;
/* a point on the way from a to b (f = 0..1) */
const along = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
/* PC box with a status line under it ('ok' / 'ng' / '') */
const pc = (id, p, sub, state, mark) => nodeSvg(id, p[0], p[1], 'PC ' + id, sub, state).replace('></text></g>', `>${escAttr(mark || '')}</text></g>`).replace('class="mark"', `class="mark ${state || ''}"`);
const tag = (x, y, txt, cls = '') => `<text class="ftag ${cls}" x="${x}" y="${y}" text-anchor="middle">${escAttr(txt)}</text>`;


/* ---------- small drawing helpers ---------- */
const term = id => WORD_BY_ID[id].term;
const txt = (x, y, s, cls = '', anchor = 'middle') => `<text class="ft ${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${escAttr(s)}</text>`;
const jt = (x, y, s, cls = '', anchor = 'middle') => `<text class="ft ${cls}" lang="ja" x="${x}" y="${y}" text-anchor="${anchor}">${escAttr(s)}</text>`;
/* a labelled box; cls: hl (accent) · ok · ng · dev (dark device) */
const box = (x, y, w, h, label, cls = '', sub = '') => `<g class="fb ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>
  <text x="${x + w / 2}" y="${y + h / 2 + (sub ? -2 : 5)}" text-anchor="middle">${escAttr(label)}</text>${sub ? `<text class="fsub" x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle">${escAttr(sub)}</text>` : ''}</g>`;
const line = (x1, y1, x2, y2, cls = '') => `<line class="fline ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const arrow = (x1, y1, x2, y2, cls = '') => `<line class="flow thin ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#ah)"/>`;
/* a wave from x0 to x1 around y; amp(f) gives the height at 0..1; jit adds noise */
function wave(x0, x1, y, amp, per = 26, cls = '', jit = 0) {
  let d = '';
  for (let x = x0; x <= x1; x += 2) {
    const f = (x - x0) / (x1 - x0), n = jit ? jit * (Math.sin(x * 1.7) * .6 + Math.sin(x * 4.3 + 1) * .4) : 0;
    d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + (y - (typeof amp === 'function' ? amp(f) : amp) * Math.sin((x - x0) / per * 2 * Math.PI) + n).toFixed(1);
  }
  return `<path class="fwave ${cls}" d="${d}"/>`;
}
/* a digital signal for a string of bits: high = 1, low = 0 */
function square(x, y, bits, bw, h, cls = '', jit = 0) {
  let d = '', cx = x;
  [...bits].forEach((b, i) => {
    const yy = b === '1' ? y - h : y;
    if (!jit) d += (i ? 'L' : 'M') + cx + ' ' + yy + 'L' + (cx + bw) + ' ' + yy;
    else for (let k = 0; k <= bw; k += 2) d += ((i || k) ? 'L' : 'M') + (cx + k) + ' ' + (yy + jit * Math.sin((cx + k) * 1.9) * Math.cos((cx + k) * .7)).toFixed(1);
    cx += bw;
  });
  return `<path class="fwave sq ${cls}" d="${d}"/>`;
}
/* a row of cells: segs = [{ w, label, sub, cls, ja }] */
function cells(x, y, h, segs) {
  let cx = x;
  return segs.map(sg => { const out = `<g class="fcell ${sg.cls || ''}"><rect x="${cx}" y="${y}" width="${sg.w}" height="${h}"/>
    <text ${sg.ja ? 'lang="ja"' : ''} x="${cx + sg.w / 2}" y="${y + h / 2 + (sg.sub ? -2 : 5)}" text-anchor="middle">${escAttr(sg.label)}</text>
    ${sg.sub ? `<text class="fsub" x="${cx + sg.w / 2}" y="${y + h / 2 + 14}" text-anchor="middle">${escAttr(sg.sub)}</text>` : ''}</g>`; cx += sg.w; return out; }).join('');
}
/* a bracket under (or over) x0..x1 with a label */
const brace = (x0, x1, y, label, up = false) => { const d = up ? -8 : 8; return `<path class="fbrace" d="M${x0} ${y}v${d}H${x1}v${-d}M${(x0 + x1) / 2} ${y + d}v${d}"/>${txt((x0 + x1) / 2, y + d * 2 + (up ? -4 : 12), label, 'small')}`; };
const svgOpen = (w, h, alt) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${escAttr(alt)}">${arrowDefs}`;
/* small computer icon with a name */
const pcIco = (x, y, label) => `<g class="fpc"><rect x="${x - 16}" y="${y - 13}" width="32" height="22" rx="3"/><path d="M${x - 7} ${y + 15}h14M${x} ${y + 9}v6"/></g>${label ? txt(x, y + 32, label, 'small b') : ''}`;

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

/* =========================================================
 * Chapter 2 figures (lessons 11–18)
 * ========================================================= */
Object.assign(FIGURES, {
  /* L11: the OSI stack, layer 1 turns bits into signals */
  l1Stack(T) {
    const names = [T('fg.osi7'), T('fg.osi6'), T('fg.osi5'), T('fx.osi4'), T('fx.osi3'), T('fx.osi2'), T('fx.osi1')];
    return `${svgOpen(460, 270, T('fg.l1StackAlt'))}
      ${names.map((n, i) => box(30, 12 + i * 34, 210, 30, `L${7 - i}  ${n}`, i === 6 ? 'hl' : 'dim')).join('')}
      ${arrow(250, 233, 300, 233)}
      ${txt(372, 180, T('fg.bitsSignal'), 'b accent')}
      ${[...'01101'].map((b, i) => txt(312 + i * 24, 214, b, 'mono')).join('')}
      ${square(300, 252, '01101', 24, 18)}
    </svg>`;
  },
  /* L11: bits as an electrical signal */
  bitsSignal(T) {
    const bits = '10110010', bw = 46, x = 40;
    return `${svgOpen(460, 190, T('fg.bitsSignalAlt'))}
      ${[...bits].map((b, i) => txt(x + bw * i + bw / 2, 30, b, 'mono big')).join('')}
      ${line(x, 140, x + bw * 8, 140, 'dash')}${line(x, 70, x + bw * 8, 70, 'dash')}
      ${square(x, 140, bits, bw, 70)}
      ${txt(x - 6, 74, T('fg.high'), 'small', 'end')}${txt(x - 6, 144, T('fg.low'), 'small', 'end')}
      ${txt(230, 176, T('fg.oneHigh'), 'small')}
    </svg>`.replace('viewBox="0 0 460 190"', 'viewBox="-60 0 520 190"');
  },
  /* L11: three kinds of transmission media */
  media3(T) {
    const panel = (x, label, art) => `<rect class="fpanel" x="${x}" y="10" width="140" height="130" rx="12"/>${art}${txt(x + 70, 162, label, 'small b')}`;
    const copper = `${wave(30, 150, 62, 10, 30)}${wave(30, 150, 62, -10, 30, 'alt')}${wave(30, 150, 102, 10, 30)}${wave(30, 150, 102, -10, 30, 'alt')}`;
    const fiber = `<rect class="ftube" x="180" y="62" width="120" height="26" rx="13"/>${[0, 1, 2, 3].map(i => `<rect class="flight" x="${190 + i * 28}" y="70" width="14" height="10" rx="5"/>`).join('')}`;
    const radio = `<g class="fpc"><rect x="368" y="88" width="34" height="18" rx="4"/><path d="M376 88v-14"/></g>${[16, 30, 44].map(r => `<path class="fwave" d="M${385 - r * .7} ${74 - r * .7}A${r} ${r} 0 0 1 ${385 + r * .7} ${74 - r * .7}"/>`).join('')}`;
    return `${svgOpen(470, 175, T('fg.media3Alt'))}
      ${panel(15, T('fg.copper'), copper)}${panel(165, T('fg.fiber'), fiber)}${panel(315, T('fg.radio'), radio)}
    </svg>`;
  },
  /* L11: NIC turns bits into signals and back */
  nicPath(T) {
    return `${svgOpen(460, 170, T('fg.nicPathAlt'))}
      ${pcIco(40, 90, 'PC A')}${box(70, 72, 50, 34, 'NIC', 'hl')}
      ${line(120, 89, 340, 89, 'cable')}${wave(135, 325, 89, 12, 24)}
      ${box(340, 72, 50, 34, 'NIC', 'hl')}${pcIco(420, 90, 'PC B')}
      ${txt(95, 40, T('fg.toSignal'), 'small b')}${txt(365, 40, T('fg.toBits'), 'small b')}
      ${txt(95, 58, '0110…', 'mono')}${txt(365, 58, '0110…', 'mono')}
      ${txt(230, 140, term('media'), 'small', 'middle').replace('<text', '<text lang="ja"')}
    </svg>`;
  },
  /* L12: attenuation */
  atten(T) {
    return `${svgOpen(460, 190, T('fg.attenAlt'))}
      ${line(30, 100, 430, 100, 'cable')}
      ${wave(30, 410, 100, f => 42 * (1 - f) + 3, 34)}
      ${[0, 50, 100, 150].map((m, i) => `${line(30 + i * 126, 150, 30 + i * 126, 158)}${txt(30 + i * 126, 174, m + ' m', 'small mono')}`).join('')}
      ${line(30, 150, 408, 150)}
      ${txt(60, 40, T('fg.strongSig'), 'small b', 'start')}${txt(420, 76, T('fg.cantRead'), 'small b bad', 'end')}
    </svg>`;
  },
  /* L12: noise */
  noise(T) {
    const bits = '1011001', bw = 50, x = 60;
    return `${svgOpen(460, 260, T('fg.noiseAlt'))}
      ${txt(x - 8, 60, T('fg.clean'), 'small b', 'end')}${square(x, 80, bits, bw, 46)}
      ${txt(x - 8, 128, '+ ' + term('noise'), 'small b bad', 'end').replace('<text', '<text lang="ja"')}${wave(x, x + bw * 7, 120, 5, 7, 'bad', 2)}
      ${txt(x - 8, 200, T('fg.noisy'), 'small b', 'end')}${square(x, 228, bits, bw, 46, 'bad', 9)}
      <rect class="fq" x="${x + bw * 4 - 4}" y="168" width="${bw + 8}" height="70" rx="8"/>${txt(x + bw * 4.5, 254, '?', 'big bad')}
    </svg>`.replace('viewBox="0 0 460 260"', 'viewBox="-90 0 530 262"');
  },
  /* L12: two signals meet */
  collide(T) {
    return `${svgOpen(460, 220, T('fg.collideAlt'))}
      ${line(20, 70, 440, 70, 'cable')}
      ${wave(40, 150, 70, 22, 22)}${arrow(150, 40, 200, 40)}${txt(40, 34, 'A', 'b', 'start')}
      ${wave(310, 420, 70, 22, 22, 'alt2')}${arrow(310, 40, 260, 40)}${txt(420, 34, 'B', 'b', 'end')}
      ${line(20, 160, 440, 160, 'cable')}
      ${wave(150, 310, 160, 30, 22, 'bad', 14)}
      ${txt(230, 210, T('fg.coll'), 'b bad')}
    </svg>`;
  },
  /* L12: a repeater restores the signal */
  repeaterFig(T) {
    return `${svgOpen(460, 170, T('fg.repeaterAlt'))}
      ${line(20, 85, 440, 85, 'cable')}
      ${wave(20, 165, 85, 7, 24, 'dim')}${box(170, 55, 120, 60, 'REPEATER', 'dev')}${wave(295, 440, 85, 32, 24)}
      ${txt(92, 140, T('fg.weak'), 'small b')}${txt(368, 140, T('fg.strong'), 'small b')}
    </svg>`;
  },
  /* L13: a hub is a repeater with many ports */
  hubRepeater(T) {
    return `${svgOpen(460, 260, T('fg.hubRepAlt'))}
      ${pcIco(50, 60, 'PC')}${line(70, 60, 170, 60)}${box(170, 38, 120, 44, 'REPEATER', 'dev')}${line(290, 60, 390, 60)}${pcIco(410, 60, 'PC')}
      ${txt(230, 100, T('fg.ports', { n: 2 }), 'small b')}
      ${[70, 175, 285, 390].map(x => `${line(x, 200, 230, 170)}${pcIco(x, 214)}`).join('')}${box(170, 146, 120, 44, 'HUB', 'dev')}
      ${txt(300, 173, T('fg.ports', { n: 4 }), 'small b', 'start')}
    </svg>`.replace('viewBox="0 0 460 260"', 'viewBox="0 0 460 236"');
  },
  /* L14: layer 2 delivers to the next device; layer 3 across networks */
  l2Scope(T) {
    return `${svgOpen(470, 220, T('fg.l2ScopeAlt'))}
      <rect class="fzone" x="10" y="62" width="200" height="80" rx="14"/><rect class="fzone" x="260" y="62" width="200" height="80" rx="14"/>
      ${txt(20, 80, 'LAN 1', 'small mono', 'start')}${txt(450, 80, 'LAN 2', 'small mono', 'end')}
      ${pcIco(50, 106, 'A')}${line(70, 104, 115, 104)}${box(115, 88, 54, 32, 'SW', 'dev')}${line(169, 104, 208, 104)}
      ${box(208, 86, 54, 36, 'R', 'dev')}${line(262, 104, 301, 104)}${box(301, 88, 54, 32, 'SW', 'dev')}${line(355, 104, 400, 104)}${pcIco(420, 106, 'B')}
      ${arrow(46, 168, 228, 168)}${arrow(242, 168, 424, 168)}${txt(137, 190, T('fg.l2Hop'), 'small b accent')}${txt(333, 190, T('fg.l2Hop'), 'small b accent')}
      ${arrow(46, 40, 424, 40, 'l3')}${txt(235, 28, T('fg.l3E2E'), 'small b l3t')}
    </svg>`;
  },
  /* L14: the parts of a frame */
  frameParts(T) {
    return `${svgOpen(460, 160, T('fg.framePartsAlt'))}
      ${cells(20, 50, 52, [{ w: 120, label: term('header'), sub: T('fg.hdrSub'), cls: 'c1', ja: 1 }, { w: 200, label: T('fg.data'), cls: 'c2' }, { w: 100, label: T('fg.trailer'), sub: 'FCS', cls: 'c3' }])}
      ${brace(20, 440, 42, term('framing') + ' → ' + T('fg.frame'), true)}
      ${txt(80, 130, T('fg.front'), 'small')}${txt(390, 130, T('fg.back'), 'small')}
    </svg>`;
  },
  /* L14: a stream of bits split into frames */
  bitstream(T) {
    const f1 = '0110100111010010', f2 = '110100111010', cw = 7.2, mono = (x, y, str) => txt(x, y, str, 'mono stream', 'start');
    const w1 = f1.length * cw + 20, w2 = f2.length * cw + 20, x1 = 40, x2 = x1 + w1 + 30;
    return `${svgOpen(460, 170, T('fg.bitstreamAlt'))}
      ${mono(x1 + 10, 40, f1 + '··' + f2 + '··')}${arrow(200, 54, 200, 84)}
      <rect class="fcellbg c1" x="${x1}" y="96" width="${w1}" height="40" rx="6"/><rect class="fcellbg c3" x="${x2}" y="96" width="${w2}" height="40" rx="6"/>
      ${mono(x1 + 10, 121, f1)}${mono(x2 + 10, 121, f2)}
      ${txt(x1 + w1 / 2, 156, T('fg.frameN', { n: 1 }), 'small b')}${txt(x2 + w2 / 2, 156, T('fg.frameN', { n: 2 }), 'small b')}
    </svg>`;
  },
  /* L14: the preamble lets the receiver match the timing */
  syncPreamble(T) {
    const pre = '10101010', dat = '1101', bw = 30, x = 20;
    return `${svgOpen(460, 200, T('fg.syncAlt'))}
      <rect class="fcellbg c2" x="${x}" y="40" width="${bw * 8}" height="86" rx="6"/>
      ${square(x, 110, pre + dat, bw, 54)}
      ${[...Array(12)].map((_, i) => line(x + bw * i + bw / 2, 140, x + bw * i + bw / 2, 150, i < 8 ? '' : 'acc')).join('')}
      ${txt(x + bw * 4, 32, term('preamble') + '  1010…', 'small b').replace('<text', '<text lang="ja"')}${txt(x + bw * 10, 32, T('fg.data'), 'small b')}
      ${brace(x, x + bw * 8, 158, T('fg.sync'))}${txt(x + bw * 10, 176, T('fg.readStart'), 'small b accent')}
    </svg>`;
  },
  /* L15: the parts of a MAC address */
  macStruct(T) {
    const b = ['00', '1A', '2B', '3C', '4D', '5E'];
    return `${svgOpen(460, 170, T('fg.macAlt'))}
      ${txt(230, 26, T('fg.bits48'), 'small b')}
      ${cells(50, 40, 46, b.map((x, i) => ({ w: 60, label: x, cls: i < 3 ? 'c1 mono' : 'c3 mono' })))}
      ${brace(50, 230, 94, T('fg.oui'))}${brace(230, 410, 94, T('fg.serial'))}
    </svg>`;
  },
  /* L15: unicast, broadcast, multicast */
  cast3(T) {
    const panel = (x, id, hit) => {
      const xs = [x + 18, x + 52, x + 86, x + 120];
      return `<rect class="fpanel" x="${x}" y="8" width="138" height="150" rx="12"/>
        ${xs.map((cx, i) => `${line(x + 69, 52, cx, 110, hit.includes(i) ? 'hot' : '')}<circle class="fdot ${hit.includes(i) ? 'on' : ''}" cx="${cx}" cy="118" r="11"/>`).join('')}
        <circle class="fdot src" cx="${x + 69}" cy="42" r="13"/>${txt(x + 69, 47, 'S', 'small b inv')}
        ${jt(x + 69, 180, term(id), 'small b')}`;
    };
    return `${svgOpen(450, 192, T('fg.cast3Alt'))}${panel(4, 'unicast', [2])}${panel(156, 'broadcast', [0, 1, 2, 3])}${panel(308, 'multicast', [1, 3])}</svg>`;
  },
  /* L15: what a NIC does with an arriving frame */
  nicFilter(T) {
    const rows = [[T('fg.mine'), 1], ['FF:FF:FF:FF:FF:FF', 1], [T('fg.myGroup'), 1], [T('fg.other'), 0]];
    return `${svgOpen(460, 230, T('fg.nicFilterAlt'))}
      ${box(10, 90, 110, 46, T('fg.dstMac'), 'hl')}
      ${rows.map(([l, ok], i) => { const y = 14 + i * 54; return `${arrow(120, 113, 160, y + 22)}${box(162, y, 170, 44, l, 'mono-ok')}${arrow(332, y + 22, 352, y + 22)}${txt(356, y + 27, (ok ? '✓ ' : '× ') + T(ok ? 'fg.recv' : 'fg.drop'), 'b ' + (ok ? 'ok' : 'bad'), 'start')}`; }).join('')}
    </svg>`;
  },
  /* L16: the Ethernet frame */
  ethFrame(T) {
    /* drawn with HTML boxes rather than SVG, so the labels wrap and never overlap (and the row wraps on a phone) */
    const B = n => T('dm.bytes', { n });
    const cell = (cls, label, sub, grow, ja, extra = '') => `<div class="hf-cell ${cls}" style="flex-grow:${grow}">${extra}<b ${ja ? 'lang="ja"' : ''}>${escAttr(label)}</b><span>${escAttr(sub)}</span></div>`;
    return `<div class="hframe" role="img" aria-label="${escAttr(T('fg.ethFrameAlt'))}">
      ${cell('c0', term('preamble'), B(8), 8, 1, '<i>1010…</i>')}
      <div class="hf-group" style="flex-grow:15"><div class="hf-row">${cell('c1', T('fg.dstMacS'), B(6), 6)}${cell('c1', T('fg.srcMacS'), B(6), 6)}${cell('c1', T('fg.type'), B(2), 4)}</div>
        <div class="hf-brace" lang="ja">${escAttr(term('header'))}</div></div>
      ${cell('c2', T('fg.data'), B('46–1500'), 12)}
      ${cell('c3', 'FCS', B(4), 4)}
    </div>`;
  },
  /* L16: checking a frame with the FCS */
  fcsCheck(T) {
    const row = (y, broken) => `${cells(10, y, 34, [{ w: 110, label: T('fg.data'), cls: 'c2' + (broken ? ' broken' : '') }, { w: 40, label: '7A', cls: 'c3 mono' }])}
      ${broken ? `<path class="fzap" d="M60 ${y - 6}l-8 18h10l-8 18"/>` : ''}
      ${arrow(166, y + 17, 206, y + 17)}${box(208, y, 70, 34, T('fg.calc'))}${arrow(278, y + 17, 300, y + 17)}
      ${txt(304, y + 23, (broken ? '3C ≠ 7A' : '7A = 7A'), 'mono b ' + (broken ? 'bad' : 'ok'), 'start')}
      ${txt(304, y + 44, broken ? '× ' + T('fg.drop') : '✓ ' + T('fg.recv'), 'small b ' + (broken ? 'bad' : 'ok'), 'start')}`;
    return `${svgOpen(460, 170, T('fg.fcsAlt'))}
      ${txt(85, 18, T('fg.arrived'), 'small b')}${txt(243, 18, T('fg.receiver'), 'small b')}
      ${row(32, false)}${row(106, true)}
    </svg>`;
  },
  /* L16: CSMA/CD as a flow chart */
  csmaFlow(T) {
    const M = 180, L = 6, R = 366, W = 150;
    const b = (x, y, k, cls = '', w = W, h = 34) => box(x, y, w, h, T(k), cls);
    return `${svgOpen(520, 392, T('fg.csmaAlt'))}
      ${b(M, 6, 'fg.cWant')}${arrow(M + 75, 40, M + 75, 58)}
      ${b(M, 60, 'fg.cListen', 'hl')}${arrow(M + 75, 94, M + 75, 112)}
      ${b(M, 114, 'fg.cFree', 'q')}${arrow(M + 75, 148, M + 75, 166)}${txt(M + 82, 162, T('fg.yes'), 'small ok', 'start')}
      ${arrow(M + W, 131, R - 2, 131)}${txt((M + W + R) / 2, 124, T('fg.no'), 'small bad')}${b(R, 114, 'fg.cWait')}
      <path class="fline" d="M${R + 75} 114V77H${M + W + 2}" marker-end="url(#ah)"/>
      ${b(M, 168, 'fg.cSend', 'hl')}${arrow(M + 75, 202, M + 75, 220)}
      ${b(M, 222, 'fg.cColl', 'q')}${arrow(M + 75, 256, M + 75, 274)}${txt(M + 82, 270, T('fg.no'), 'small ok', 'start')}
      ${b(M, 276, 'fg.cDone', 'ok')}
      ${arrow(M, 239, L + W + 2, 239)}${txt((M + L + W) / 2 + 1, 232, T('fg.yes'), 'small bad')}
      ${b(L, 222, 'fg.cJam', 'ng')}${arrow(L + 75, 256, L + 75, 298)}
      ${b(L, 300, 'fg.cRandom', 'ng', W, 40)}
      <path class="fline" d="M${L + 75} 340V368H${L + 2}V77H${M - 2}" marker-end="url(#ah)"/>
    </svg>`;
  },
  /* L17: a switch learns the sender's MAC address */
  learn(T) {
    return `${svgOpen(470, 220, T('fg.learnAlt'))}
      ${pcIco(40, 50, 'PC A')}${line(60, 60, 150, 100)}${txt(150, 70, '→ C', 'small mono')}
      ${box(150, 86, 120, 48, 'SWITCH', 'dev')}${txt(158, 100, 'p1', 'small mono inv', 'start')}
      ${[['PC B', 2, 40, 190], ['PC C', 3, 260, 190]].map(([l, p, x, y]) => `${line(210, 134, x, y - 18)}${pcIco(x, y, l)}`).join('')}
      <g class="ftable"><rect x="300" y="40" width="160" height="${3 * 30 + 6}" rx="8"/>
        ${txt(380, 60, term('mactable'), 'small b').replace('<text', '<text lang="ja"')}
        ${txt(330, 86, 'MAC', 'small b', 'start')}${txt(420, 86, T('dm.port'), 'small b', 'start')}
        <rect class="fnew" x="306" y="94" width="148" height="26" rx="5"/>${txt(330, 112, 'A', 'mono b', 'start')}${txt(420, 112, 'p1', 'mono b', 'start')}</g>
      ${arrow(272, 104, 300, 104)}${txt(380, 158, T('fg.learned'), 'small b accent')}
    </svg>`;
  },
  /* L17: filtering vs flooding */
  filterFlood(T) {
    const panel = (x, id, all, cap) => {
      const C = [x + 110, 100], P = { A: [x + 30, 40], B: [x + 190, 40], C: [x + 190, 170], D: [x + 30, 170] };
      const outs = all ? ['B', 'C', 'D'] : ['C'];
      return `<rect class="fpanel" x="${x}" y="4" width="220" height="230" rx="12"/>
        ${Object.values(P).map(p => line(C[0], C[1], p[0], p[1])).join('')}
        ${arrow(P.A[0] + 12, P.A[1] + 8, C[0] - 30, C[1] - 16)}
        ${outs.map(k => arrow(C[0] + (P[k][0] - C[0]) * .3, C[1] + (P[k][1] - C[1]) * .3, P[k][0] - (P[k][0] - C[0]) * .22, P[k][1] - (P[k][1] - C[1]) * .22)).join('')}
        ${box(C[0] - 44, C[1] - 18, 88, 36, 'SWITCH', 'dev')}
        ${Object.entries(P).map(([k, p]) => `<circle class="fdot ${outs.includes(k) ? 'on' : ''} ${k === 'A' ? 'src' : ''}" cx="${p[0]}" cy="${p[1]}" r="14"/>${txt(p[0], p[1] + 5, k, 'small b' + (k === 'A' ? ' inv' : ''))}`).join('')}
        ${jt(x + 110, 214, term(id), 'b')}${txt(x + 110, 256, cap, 'small')}`;
    };
    return `${svgOpen(460, 266, T('fg.filterFloodAlt'))}${panel(4, 'macfilter', false, T('fg.known'))}${panel(236, 'flooding', true, T('fg.unknown'))}</svg>`;
  },
  /* L18: half and full duplex */
  duplex2(T) {
    const panel = (x, id, full) => `<rect class="fpanel" x="${x}" y="4" width="220" height="170" rx="12"/>
      ${pcIco(x + 34, 70)}${pcIco(x + 186, 70)}
      ${full ? `${line(x + 56, 56, x + 164, 56)}${line(x + 56, 86, x + 164, 86)}${arrow(x + 70, 56, x + 150, 56)}${arrow(x + 150, 86, x + 70, 86)}`
        : `${line(x + 56, 70, x + 164, 70)}${arrow(x + 70, 64, x + 150, 64)}${arrow(x + 150, 78, x + 70, 78, 'dim')}`}
      ${jt(x + 110, 130, term(id), 'b')}${txt(x + 110, 154, T(full ? 'fg.both' : 'fg.takeTurns'), 'small')}`;
    return `${svgOpen(460, 180, T('fg.duplexAlt'))}${panel(4, 'halfduplex', false)}${panel(236, 'fullduplex', true)}</svg>`;
  },
  /* L18: separate wires for sending and receiving */
  wires(T) {
    return `${svgOpen(460, 180, T('fg.wiresAlt'))}
      ${pcIco(40, 90, 'PC')}${box(70, 46, 46, 30, 'TX', 'hl')}${box(70, 104, 46, 30, 'RX')}
      ${box(344, 46, 46, 30, 'RX')}${box(344, 104, 46, 30, 'TX', 'hl')}${box(396, 60, 58, 60, 'SW', 'dev')}
      ${line(116, 61, 344, 61, 'cable')}${line(116, 119, 344, 119, 'cable')}
      ${arrow(150, 61, 310, 61)}${arrow(310, 119, 150, 119)}
      ${txt(230, 46, T('fg.sendLine'), 'small b')}${txt(230, 146, T('fg.recvLine'), 'small b')}
    </svg>`;
  },
  /* L18: buffering in a switch */
  bufferQ(T) {
    const env = (x, y, l, cls = '') => `<g class="fenv ${cls}"><rect x="${x - 15}" y="${y - 10}" width="30" height="20" rx="4"/><path d="M${x - 15} ${y - 8}L${x} ${y + 2}L${x + 15} ${y - 8}"/>${txt(x, y + 26, l, 'small mono')}</g>`;
    return `${svgOpen(470, 200, T('fg.bufferAlt'))}
      ${pcIco(36, 40, 'A')}${pcIco(36, 150, 'B')}${line(56, 44, 150, 90)}${line(56, 150, 150, 110)}
      ${env(96, 52, '→C')}${env(96, 132, '→C')}
      <rect class="fdevbox" x="150" y="40" width="160" height="120" rx="12"/>${txt(230, 62, 'SWITCH', 'small mono inv')}
      <rect class="fbuf" x="172" y="74" width="116" height="70" rx="8"/>${txt(230, 172 + 10, T('fg.buffer'), 'small b')}
      ${env(206, 104, '1', 'q1')}${env(254, 104, '2', 'q2')}
      ${line(310, 100, 400, 100)}${arrow(318, 86, 380, 86)}${pcIco(424, 100, 'C')}
      ${txt(360, 150, T('fg.inOrder'), 'small b accent')}
    </svg>`;
  }
});

/* ---------- chapter 3 (lessons 19–27) ---------- */
const bin8 = n => n.toString(2).padStart(8, '0');
const curve = (d, cls = '') => `<path class="flow thin ${cls}" d="${d}" fill="none" marker-end="url(#ah)"/>`;
Object.assign(FIGURES, {
  /* L19: LANs joined by routers */
  l3Join(T) {
    const zone = (x, w, n) => `<rect class="fzone" x="${x}" y="30" width="${w}" height="132" rx="14"/>${txt(x + w / 2, 22, 'LAN ' + n, 'small mono b')}
      ${box(x + w / 2 - 22, 46, 44, 26, 'SW', 'dev')}${line(x + w / 2 - 10, 72, x + 30, 108)}${line(x + w / 2 + 10, 72, x + w - 30, 108)}${pcIco(x + 30, 120)}${pcIco(x + w - 30, 120)}`;
    return `${svgOpen(480, 210, T('fg.l3JoinAlt'))}
      ${zone(8, 130, 1)}${zone(175, 130, 2)}${zone(342, 130, 3)}
      ${line(95, 59, 220, 59)}${line(262, 59, 386, 59)}
      ${box(138, 44, 37, 30, 'R', 'dev')}${box(305, 44, 37, 30, 'R', 'dev')}
      ${brace(8, 472, 172, term('internetwork')).replace('<text', '<text lang="ja"')}
    </svg>`;
  },
  /* L20: IP works on top of many kinds of layer 2 */
  ipOver(T) {
    return `${svgOpen(460, 180, T('fg.ipOverAlt'))}
      ${txt(30, 42, 'L4', 'small mono b')}${txt(30, 92, 'L3', 'small mono b')}${txt(30, 142, 'L2', 'small mono b')}
      ${box(56, 22, 390, 32, 'TCP / UDP', 'dim')}
      ${box(56, 72, 390, 34, 'IP', 'hl')}
      ${box(56, 124, 124, 34, term('ethernet'), '')}${box(189, 124, 124, 34, T('fg.wifi'), '')}${box(322, 124, 124, 34, T('fg.otherL2'), 'dim')}
    </svg>`;
  },
  /* L20: an IP packet (HTML boxes so the labels wrap) */
  ipPacket(T) {
    const cell = (cls, label, sub, grow) => `<div class="hf-cell ${cls}" style="flex-grow:${grow}"><b>${escAttr(label)}</b><span>${escAttr(sub)}</span></div>`;
    return `<div class="hframe" role="img" aria-label="${escAttr(T('fg.ipPacketAlt'))}">
      <div class="hf-group" style="flex-grow:18"><div class="hf-row">${cell('c1', 'TTL', '64', 3)}${cell('c1', T('fg.proto'), 'TCP', 4)}${cell('c1', T('fg.srcIp'), '192.168.1.10', 6)}${cell('c1', T('fg.dstIp'), '203.0.113.5', 6)}</div>
        <div class="hf-brace">${escAttr(T('fg.ipHeader'))}</div></div>
      ${cell('c2', T('fg.data'), '', 8)}
    </div>`;
  },
  /* L20: the packet stays, the frame is made again after each router */
  pktInFrame(T) {
    const fr = (x, mac) => cells(x, 96, 46, [{ w: 52, label: 'MAC', sub: mac, cls: 'c1' }, { w: 92, label: 'IP', sub: 'A → B', cls: 'c2' }, { w: 40, label: 'FCS', cls: 'c3' }]);
    return `${svgOpen(470, 200, T('fg.pktInFrameAlt'))}
      ${pcIco(36, 40, 'A')}${line(56, 40, 214, 40)}${box(214, 25, 42, 30, 'R', 'dev')}${line(256, 40, 414, 40)}${pcIco(434, 40, 'B')}
      ${fr(28, 'A → R')}${fr(258, 'R → B')}
      ${txt(120, 162, T('fg.frameN', { n: 1 }), 'small b')}${txt(350, 162, T('fg.frameN', { n: 2 }), 'small b')}
      ${arrow(170, 82, 300, 82)}${txt(235, 190, T('fg.samePkt'), 'small b accent')}
    </svg>`;
  },
  /* L21: dotted decimal and the 32 bits */
  dotted(T) {
    const n = [192, 168, 1, 10];
    return `${svgOpen(470, 196, T('fg.dottedAlt'))}
      ${n.map((v, i) => txt(80 + i * 104, 40, String(v), 'big mono')).join('')}${[0, 1, 2].map(i => txt(132 + i * 104, 40, '.', 'big mono')).join('')}
      ${n.map((v, i) => arrow(80 + i * 104, 50, 80 + i * 104, 70)).join('')}
      ${cells(30, 76, 40, n.map((v, i) => ({ w: 100, label: bin8(v), cls: (i % 2 ? 'c3' : 'c1') + ' bin' })))}
      ${brace(30, 130, 122, T('fg.bitsN', { n: 8 }))}${brace(30, 430, 154, T('fg.bits32'))}
    </svg>`;
  },
  /* L21: network part and host part */
  netHost(T) {
    const zone = (x, net) => `<rect class="fzone" x="${x}" y="110" width="200" height="96" rx="14"/>${txt(x + 100, 132, net + 'x', 'small mono b')}
      ${[0, 1, 2].map(i => pcIco(x + 40 + i * 60, 160) + txt(x + 40 + i * 60, 194, '.' + (i + 1), 'small mono')).join('')}`;
    return `${svgOpen(470, 214, T('fg.netHostAlt'))}
      ${cells(95, 14, 40, [{ w: 190, label: '192.168.1', cls: 'c1 mono' }, { w: 90, label: '10', cls: 'c3 mono' }])}
      ${brace(95, 285, 60, term('netpart')).replace('<text', '<text lang="ja"')}${brace(285, 375, 60, term('hostpart')).replace('<text', '<text lang="ja"')}
      ${zone(10, '192.168.1.')}${zone(260, '192.168.2.')}${box(213, 140, 44, 30, 'R', 'dev')}
    </svg>`;
  },
  /* L22: classes A, B, C */
  classes(T) {
    const rows = [['A', 8, '1 – 126'], ['B', 16, '128 – 191'], ['C', 24, '192 – 223']];
    const W = 290, x0 = 74;
    return `${svgOpen(470, 204, T('fg.classesAlt'))}
      ${txt(x0 + W / 2, 18, T('fg.bits32'), 'small')}${txt(420, 18, T('fg.firstNum'), 'small b')}
      ${rows.map(([c, nb, r], i) => { const y = 30 + i * 52, w = W * nb / 32;
        return `${txt(34, y + 24, T('fg.classX', { x: c }), 'b')}${cells(x0, y, 38, [{ w, label: T('fg.bitsN', { n: nb }), cls: 'c1' }, { w: W - w, label: T('fg.bitsN', { n: 32 - nb }), cls: 'c3' }])}${txt(420, y + 24, r, 'mono')}`; }).join('')}
      <rect class="fcellbg c1" x="${x0}" y="186" width="12" height="10"/>${jt(x0 + 18, 195, term('netpart'), 'small', 'start')}
      <rect class="fcellbg c3" x="${x0 + 140}" y="186" width="12" height="10"/>${jt(x0 + 158, 195, term('hostpart'), 'small', 'start')}
    </svg>`;
  },
  /* L22: network address, host addresses, broadcast address */
  specialAddr(T) {
    return `${svgOpen(470, 150, T('fg.specialAddrAlt'))}
      ${txt(235, 22, '192.168.1. ___', 'mono b')}
      ${cells(20, 36, 44, [{ w: 90, label: '.0', sub: '00000000', cls: 'c1 mono' }, { w: 250, label: '.1 … .254', cls: 'c2 mono' }, { w: 90, label: '.255', sub: '11111111', cls: 'c3 mono' }])}
      ${jt(65, 104, term('netaddr'), 'small b')}${txt(195, 104, T('fg.forHosts', { n: 254 }), 'small b accent')}${jt(385, 104, term('bcastaddr'), 'small b')}
      ${txt(65, 124, T('fg.thisNet'), 'small')}${txt(385, 124, T('fg.toAll'), 'small')}
    </svg>`;
  },
  /* L22: loopback */
  loopbackFig(T) {
    return `${svgOpen(470, 200, T('fg.loopbackAlt'))}
      <rect class="fpanel" x="60" y="14" width="230" height="172" rx="14"/>${txt(76, 36, 'PC', 'small mono b', 'start')}
      ${box(110, 44, 130, 34, T('fg.app'), 'hl')}${box(110, 130, 130, 34, 'TCP/IP', '')}
      ${curve('M140 80 C 120 100, 120 110, 140 128')}${curve('M210 128 C 230 110, 230 100, 210 80')}
      ${txt(100, 108, '127.0.0.1', 'small mono b accent', 'end')}
      ${line(290, 147, 400, 147, 'dash')}${txt(345, 140, '×', 'big bad')}${txt(420, 151, 'LAN', 'small mono b')}${txt(345, 176, T('fg.notOut'), 'small')}
    </svg>`;
  },
  /* L23: one big network split into subnets */
  subnetSplit(T) {
    const subs = ['172.16.1.0', '172.16.2.0', '172.16.3.0'];
    return `${svgOpen(470, 200, T('fg.subnetSplitAlt'))}
      <rect class="fzone" x="10" y="40" width="150" height="120" rx="14"/>${txt(85, 92, '172.16.0.0', 'mono b')}${txt(85, 114, T('fg.classX', { x: 'B' }), 'small')}
      ${subs.map((s, i) => { const y = 14 + i * 60; return `${arrow(164, 100, 252, y + 24)}<rect class="fzone" x="256" y="${y}" width="200" height="48" rx="10"/>${txt(356, y + 22, s, 'mono b small')}${txt(356, y + 40, T('fg.subnetN', { n: i + 1 }), 'small')}`; }).join('')}
      ${txt(356, 196, '…', 'b')}
    </svg>`;
  },
  /* L23: address and mask, bit by bit */
  maskBits(T) {
    const ip = [192, 168, 1, 10], mk = [255, 255, 255, 0];
    const row = (y, v) => cells(70, y, 34, v.map((n, i) => ({ w: 96, label: bin8(n), cls: (n === 0 || (v === mk ? false : i === 3) ? 'c3' : 'c1') + ' bin' })));
    return `${svgOpen(470, 176, T('fg.maskBitsAlt'))}
      ${txt(62, 36, 'IP', 'small b', 'end')}${row(14, ip)}
      ${txt(62, 80, T('fg.mask'), 'small b', 'end')}${row(58, mk)}
      ${mk.map((n, i) => txt(118 + i * 96, 110, String(n), 'small mono')).join('')}
      ${brace(70, 358, 120, term('netpart')).replace('<text', '<text lang="ja"')}${brace(358, 454, 120, term('hostpart')).replace('<text', '<text lang="ja"')}
    </svg>`;
  },
  /* L23: AND gives the network address */
  andCalc(T) {
    const rows = [['192.168.1.130', 130, 'IP'], ['255.255.255.192', 192, T('fg.mask')], ['192.168.1.128', 128, T('fg.netAddrS')]];
    const bits = (y, v, res) => cells(250, y, 30, [...bin8(v)].map(b => ({ w: 25, label: b, cls: (b === '1' ? (res ? 'c2' : 'c1') : 'c0') + ' bit' })));
    return `${svgOpen(470, 170, T('fg.andCalcAlt'))}
      ${rows.map(([d, v, l], i) => { const y = 14 + i * 48 + (i === 2 ? 10 : 0); return `${txt(8, y + 20, l, 'small b', 'start')}${txt(236, y + 20, d, 'mono', 'end')}${bits(y, v, i === 2)}`; }).join('')}
      ${line(80, 104, 452, 104)}${txt(235, 116, 'AND', 'small b accent')}
      ${txt(350, 168, T('fg.andRule'), 'small')}
    </svg>`;
  },
  /* L24: classes waste addresses */
  classWaste(T) {
    return `${svgOpen(470, 190, T('fg.classWasteAlt'))}
      ${txt(10, 22, T('fg.need', { n: 500 }), 'b', 'start')}
      ${txt(10, 62, T('fg.classX', { x: 'C' }), 'small b', 'start')}
      <rect class="fcellbg c3" x="90" y="44" width="127" height="28" rx="4"/>${txt(154, 63, '254', 'small mono b')}
      <rect x="90" y="44" width="250" height="28" rx="4" fill="none" class="fq"/>${txt(350, 63, '× ' + T('fg.tooFew'), 'small b bad', 'start')}
      ${txt(10, 122, T('fg.classX', { x: 'B' }), 'small b', 'start')}
      <rect class="fcellbg c3" x="90" y="104" width="10" height="28" rx="2"/><rect x="100" y="104" width="360" height="28" rx="4" class="fq"/>
      ${txt(280, 123, T('fg.wasted', { n: '65,034' }), 'small b bad')}
      ${txt(95, 152, '500', 'small mono b', 'start')}${txt(460, 152, '65,534', 'small mono', 'end')}
    </svg>`;
  },
  /* L24: /26 */
  prefixFig(T) {
    const bw = 12, x0 = 43;
    return `${svgOpen(470, 186, T('fg.prefixAlt'))}
      ${txt(235, 24, '192.168.1.0/26', 'big mono')}
      ${cells(x0, 38, 28, [...Array(32)].map((_, i) => ({ w: bw, label: i < 26 ? '1' : '0', cls: (i < 26 ? 'c1' : 'c3') + ' bit tiny' })))}
      ${brace(x0, x0 + 26 * bw, 72, T('fg.bitsN', { n: 26 }))}${brace(x0 + 26 * bw, x0 + 32 * bw, 72, T('fg.bitsN', { n: 6 }))}
      ${txt(20, 136, T('fg.mask') + '  255.255.255.192', 'mono small b', 'start')}
      ${txt(20, 162, T('fg.hostsN', { n: 62 }) + '   (2⁶ − 2)', 'small b accent', 'start')}
    </svg>`;
  },
  /* L24: four /24 networks as one /22 */
  aggregate(T) {
    return `${svgOpen(470, 200, T('fg.aggregateAlt'))}
      ${[0, 1, 2, 3].map(i => box(10, 14 + i * 42, 170, 32, `192.168.${i}.0/24`, 'mono-ok')).join('')}
      ${[0, 1, 2, 3].map(i => line(180, 30 + i * 42, 220, 30 + i * 42)).join('')}${line(220, 30, 220, 156)}${arrow(220, 93, 270, 93)}
      ${box(274, 74, 186, 40, '192.168.0.0/22', 'hl mono-ok')}
      ${txt(95, 196, T('fg.routesN', { n: 4 }), 'small b')}${txt(367, 140, T('fg.routesN', { n: 1 }), 'small b accent')}
    </svg>`;
  },
  /* L25: what DHCP gives */
  dhcpItems(T) {
    const items = [term('ipaddress'), term('subnetmask'), term('gateway'), T('fg.dnsServer')];
    return `${svgOpen(470, 200, T('fg.dhcpItemsAlt'))}
      ${box(10, 76, 96, 48, 'DHCP', 'dev', '')}${txt(58, 142, T('fg.server'), 'small b')}
      ${items.map((l, i) => box(140, 10 + i * 46, 200, 38, l, 'hl')).join('')}
      ${arrow(106, 100, 136, 100)}${arrow(344, 100, 394, 100)}${pcIco(430, 100, 'PC')}
    </svg>`;
  },
  /* L25: the four messages */
  dhcpFlow(T) {
    const m = [['DISCOVER', 'fg.dhcpD', 1], ['OFFER', 'fg.dhcpO', 0], ['REQUEST', 'fg.dhcpR', 1], ['ACK', 'fg.dhcpA', 0]];
    return `${svgOpen(470, 310, T('fg.dhcpFlowAlt'))}
      ${pcIco(70, 28, '')}${box(358, 12, 84, 32, 'DHCP', 'dev')}
      ${line(70, 46, 70, 300, 'dash')}${line(400, 46, 400, 300, 'dash')}
      ${m.map(([k, l, right], i) => { const y = 92 + i * 62;
        return `${right ? arrow(76, y, 394, y) : arrow(394, y, 76, y)}${txt(235, y - 10, `${'①②③④'[i]} ${k}`, 'small mono b')}${txt(235, y + 20, T(l), 'small')}`; }).join('')}
      ${txt(392, 72, T('fg.bcast'), 'small b accent', 'end')}
    </svg>`;
  },
  /* L25: the lease */
  lease(T) {
    return `${svgOpen(470, 150, T('fg.leaseAlt'))}
      <rect class="fcellbg c2" x="30" y="40" width="300" height="30" rx="6"/>
      <rect class="fq" x="180" y="84" width="270" height="22" rx="6" style="fill-opacity:.2;stroke:var(--accent)"/>
      ${line(30, 30, 30, 80)}${txt(30, 24, T('fg.borrow'), 'small b')}
      ${line(330, 30, 330, 80)}${txt(330, 24, T('fg.expire'), 'small b')}
      ${arrow(180, 74, 180, 92)}${txt(180, 126, T('fg.renew'), 'small b accent')}
      ${txt(180, 61, T('fg.leaseTime'), 'small b')}${txt(315, 100, T('fg.extended'), 'small')}
    </svg>`;
  },
  /* L26: the destination MAC is unknown */
  arpNeed(T) {
    return `${svgOpen(470, 150, T('fg.arpNeedAlt'))}
      ${cells(10, 30, 54, [{ w: 96, label: '?', sub: T('fg.dstMacS'), cls: 'c1 q' }, { w: 96, label: '00:1A:…', sub: T('fg.srcMacS'), cls: 'c1' }, { w: 200, label: 'IP', sub: '→ 192.168.1.20', cls: 'c2' }, { w: 50, label: 'FCS', cls: 'c3' }])}
      ${txt(58, 110, T('fg.unknownMac'), 'small b bad')}${txt(306, 110, T('fg.knownIp'), 'small b ok')}
    </svg>`;
  },
  /* L26: request to everyone, reply from one */
  arpFlow(T) {
    const panel = (x, rep) => { const xs = [x + 30, x + 110, x + 190];
      return `<rect class="fpanel" x="${x}" y="40" width="220" height="164" rx="12"/>
        ${xs.map((cx, i) => (rep ? (i === 1 ? arrow(cx, 140, x + 112, 96, '') : '') : line(x + 110, 84, cx, 136, 'hot')) + `<circle class="fdot ${rep ? (i === 1 ? 'on' : '') : 'on'}" cx="${cx}" cy="150" r="12"/>${txt(cx, 154, i === 1 ? 'B' : i ? 'D' : 'C', 'small b')}`).join('')}
        <circle class="fdot src" cx="${x + 110}" cy="72" r="13"/>${txt(x + 110, 77, 'A', 'small b inv')}
        ${txt(x + 110, 188, T(rep ? 'fg.arpRep' : 'fg.arpReq') + ' · ' + T(rep ? 'fg.ucast' : 'fg.bcast'), 'small b')}`; };
    return `${svgOpen(460, 212, T('fg.arpFlowAlt'))}${panel(4, false)}${panel(236, true)}
      ${txt(114, 24, T('fg.whoHas', { ip: '192.168.1.20' }), 'small b accent')}${txt(346, 24, T('fg.iAm', { mac: '00:1A:2B:3C:4D:5E' }), 'small b ok')}</svg>`;
  },
  /* L26: the ARP table */
  arpTableFig(T) {
    const rows = [['192.168.1.1', '00:11:22:33:44:01'], ['192.168.1.20', '00:1A:2B:3C:4D:5E'], ['192.168.1.31', '00:1A:2B:9F:01:7C']];
    return `${svgOpen(470, 170, T('fg.arpTableAlt'))}
      ${cells(40, 10, 32, [{ w: 160, label: T('fg.ipAddrS'), cls: 'c2' }, { w: 230, label: T('fg.macAddrS'), cls: 'c1' }])}
      ${rows.map(([a, b], i) => `<g class="ftable"><rect x="40" y="${46 + i * 36}" width="390" height="32"/></g>${txt(120, 67 + i * 36, a, 'small mono')}${txt(315, 67 + i * 36, b, 'small mono')}`).join('')}
      ${txt(235, 164, T('fg.forgetLater'), 'small')}
    </svg>`;
  },
  /* L27: ask the DNS server */
  dnsAsk(T) {
    return `${svgOpen(470, 210, T('fg.dnsAskAlt'))}
      ${pcIco(50, 104, 'PC')}${box(340, 20, 120, 40, 'DNS', 'dev')}${box(340, 150, 120, 40, 'Web', 'dev')}
      ${arrow(78, 86, 334, 36)}${arrow(334, 52, 82, 100)}${arrow(78, 118, 334, 168)}
      ${txt(196, 40, '① www.example.com ?', 'small mono b')}${txt(220, 96, '② 203.0.113.10', 'small mono b ok')}${txt(196, 168, '③ ' + T('fg.connect'), 'small b')}
      ${txt(400, 80, T('fg.dnsServer'), 'small')}${txt(400, 206, '203.0.113.10', 'small mono')}
    </svg>`;
  },
  /* L27: the tree of names */
  domainTree(T) {
    const N = { root: [150, 26, '.', 1], jp: [70, 86, 'jp', 1], com: [150, 86, 'com'], org: [230, 86, 'org'], co: [40, 146, 'co', 1], ac: [110, 146, 'ac'], ex: [40, 206, 'example', 1], www: [40, 262, 'www', 1] };
    const E = [['root', 'jp'], ['root', 'com'], ['root', 'org'], ['jp', 'co'], ['jp', 'ac'], ['co', 'ex'], ['ex', 'www']];
    return `${svgOpen(470, 290, T('fg.domainTreeAlt'))}
      ${E.map(([a, b]) => line(N[a][0], N[a][1] + 14, N[b][0], N[b][1] - 14, N[a][3] && N[b][3] ? 'hot' : '')).join('')}
      ${Object.entries(N).map(([k, [x, y, l, on]]) => box(x - (k === 'ex' ? 36 : 26), y - 14, k === 'ex' ? 72 : 52, 28, l, on ? 'hl mono-ok' : 'dim mono-ok')).join('')}
      ${txt(200, 26, T('fg.root'), 'small', 'start')}
      ${txt(370, 150, 'www.example.co.jp', 'mono b')}${arrow(440, 172, 300, 172)}${txt(370, 196, T('fg.upper'), 'small b accent')}
    </svg>`;
  },
  /* L27: the DNS server asks root, jp, example.co.jp */
  dnsResolve(T) {
    const S = [['.', 'fg.toJp'], ['jp', 'fg.toEx'], ['example.co.jp', '203.0.113.10']];
    return `${svgOpen(470, 236, T('fg.dnsResolveAlt'))}
      ${pcIco(34, 118, 'PC')}${arrow(56, 116, 104, 116)}
      ${box(108, 96, 96, 40, 'DNS', 'dev')}${txt(156, 154, T('fg.cacheDns'), 'small')}
      ${S.map(([n, a], i) => { const y = 14 + i * 76;
        return `${arrow(204, 112, 290, y + 18)}${txt([236, 250, 236][i], [62, 106, 172][i], '①②③'[i], 'small b accent')}${box(294, y, 168, 34, n, 'mono-ok hl')}${txt(378, y + 52, a.startsWith('fg.') ? T(a) : a, 'small ' + (i === 2 ? 'mono b ok' : ''))}`; }).join('')}
    </svg>`;
  }
});
