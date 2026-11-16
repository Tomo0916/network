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
