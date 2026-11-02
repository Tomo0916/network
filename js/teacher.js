/* =========================================================
 * teacher.js — the teacher page (teacher.html). No login needed.
 *
 * Routes:  #/present   show one term at a time on the classroom screen
 *          #/share     a link (and QR code) that opens the student app on a range
 *          #/test      a printable vocabulary test (A4, answers on the last page)
 * ========================================================= */
import { LANGS, loadLang, detectLang, htmlLang, t, th, esc } from './i18n.js';
import { WORD_BY_ID } from './words.js';
import { DEMOS } from './groups.js';
import { RANGES, isRange, wordsIn, makeTest } from './quiz.js';
import { Store, loadSettings, saveSettings } from './store.js';
import { I, applySettings, langSelect, shuffle, seededRandom, toast } from './ui.js';
import { termHTML, enName, rangeLabel as rangeLabelOf, speakBtn as speakBtnOf, speak } from './common.js';

const KEY = 'netw.teacher';
const S = {
  settings: loadSettings(null),
  route: 'present',
  t: Object.assign({ range: 'all', order: 'seq', ask: 'term', page: 'cards', slang: '', count: 10, format: 'write', tlang: 'ja', version: 'A' }, Store.get(KEY, {})),
  present: { i: 0, reveal: false, list: null }
};
S.settings.lang = detectLang(S.settings.lang);
if (!isRange(S.t.range)) S.t.range = 'all';
const app = document.getElementById('app');
const L = () => S.settings.lang;
const T = (k, v) => t(k, L(), v);
const escVars = v => v && Object.fromEntries(Object.entries(v).map(([a, b]) => [a, esc(b)]));
const H = (k, v) => th(k, L(), escVars(v));
function bi(k, v) {
  const sec = S.settings.second;
  const main = th(k, L(), escVars(v));
  return !sec || sec === L() ? main : `${main}<span class="bi" lang="${htmlLang(sec)}">${th(k, sec, escVars(v))}</span>`;
}
const saveT = () => Store.set(KEY, S.t);
const rangeLabel = r => rangeLabelOf(r, T);
const speakBtn = w => speakBtnOf(w, T('btn.listen'));
const langName = c => LANGS.find(l => l.code === c).name;

function rangeSelect(name = 'range') {
  return `<label class="range"><span>${H('range.label')}</span><select data-t="${name}">${RANGES.map(r => `<option value="${r}" ${r === S.t.range ? 'selected' : ''}>${esc(rangeLabel(r))} (${esc(T('range.words', { n: wordsIn(r).length }))})</option>`).join('')}</select></label>`;
}
const field = (label, inner) => `<label class="fld"><span>${label}</span>${inner}</label>`;
const select = (k, opts) => `<select data-t="${k}">${opts.map(([v, label]) => `<option value="${v}" ${String(S.t[k]) === String(v) ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select>`;

/* ---------- page ---------- */
function parseRoute() { const h = location.hash.replace(/^#\/?/, ''); return ['present', 'share', 'test'].includes(h) ? h : 'present'; }
window.addEventListener('hashchange', () => { S.route = parseRoute(); render(); });
function render() {
  applySettings(S.settings, htmlLang(L()));
  document.body.classList.toggle('teacher', true);
  const body = { present: presentHTML, share: shareHTML, test: testHTML }[S.route]();
  document.title = `${T('t.' + S.route)} · ${T('t.title')}`;
  app.innerHTML = headerHTML() + body;
  if (S.route === 'share') drawQR();
}
function headerHTML() {
  const a = (r, icon) => `<a href="#/${r}" class="${S.route === r ? 'on' : ''}" title="${esc(T('t.' + r))}">${icon}<span>${H('t.' + r)}</span></a>`;
  return `<header class="topbar"><div class="topbar-in">
    <a class="brand" href="index.html"><span class="brand-mark">${I.net}</span><span class="brand-name">${H('t.title')}</span></a>
    <nav class="topnav">${a('present', I.screen)}${a('share', I.qr)}${a('test', I.print)}<a href="index.html">${I.prev}<span>${H('t.back')}</span></a></nav>
    <div class="topbar-right">${langSelect(L(), T('nav.language'))}</div>
  </div></header>`;
}

/* ---------- present: one term at a time ---------- */
function presentList() {
  const P = S.present;
  if (!P.list) { const ids = wordsIn(S.t.range).map(w => w.id); P.list = S.t.order === 'rand' ? shuffle(ids) : ids; P.i = 0; P.reveal = false; }
  return P.list;
}
function presentHTML() {
  const list = presentList(), P = S.present;
  const w = WORD_BY_ID[list[P.i]];
  const term = `<div class="p-term">${termHTML(w)}${enName(w)}${speakBtn(w)}</div>`;
  const expl = `<div class="p-desc"><p>${bi(`w.${w.id}.desc`)}</p><p class="tip"><b>${H('words.tip')}</b>${bi(`w.${w.id}.tip`)}</p></div>`;
  const first = S.t.ask === 'term' ? term : expl, second = S.t.ask === 'term' ? expl : term;
  return `<main class="wrap">
    <div class="p-bar card">
      ${rangeSelect()}
      ${field(H('t.order'), select('order', [['seq', T('t.inOrder')], ['rand', T('t.random')]]))}
      ${field(H('t.ask'), select('ask', [['term', T('t.askTerm')], ['desc', T('t.askDesc')]]))}
      <button class="btn btn-ghost btn-sm" data-act="fullscreen">${I.screen}${H('t.fullscreen')}</button>
    </div>
    <section class="p-stage card" style="--gc:var(--g-${w.group})">
      <div class="p-top"><span class="gtag" style="--gc:var(--g-${w.group})">${H('g.' + w.group)}</span><span class="count">${P.i + 1} / ${list.length}</span></div>
      ${first}
      ${P.reveal ? `<div class="p-answer">${second}</div>` : `<div class="p-hidden"><button class="btn btn-primary" data-act="reveal">${I.eye}${H('t.reveal')}</button></div>`}
    </section>
    <div class="p-nav">
      <button class="btn btn-ghost" data-act="pPrev" ${P.i === 0 ? 'disabled' : ''}>${I.prev}${H('btn.prev')}</button>
      ${P.reveal ? `<button class="btn btn-ghost" data-act="reveal">${H('t.hide')}</button>` : ''}
      <button class="btn btn-primary" data-act="pNext" ${P.i >= list.length - 1 ? 'disabled' : ''}>${H('btn.next')}${I.next}</button>
    </div>
    <p class="muted small center">${H('t.keys')}</p>
  </main>`;
}

/* ---------- share: link + QR ---------- */
function studentURL() {
  const u = new URL('index.html', location.href);
  if (S.t.range !== 'all') u.searchParams.set('range', S.t.range);
  if (S.t.slang) u.searchParams.set('lang', S.t.slang);
  u.hash = '#/' + (S.t.page === 'home' ? '' : S.t.page);
  return u.href.replace('/index.html', '/');
}
function shareHTML() {
  const pages = [['home', T('nav.home')], ['words', T('nav.words')], ['cards', T('nav.cards')], ['quiz', T('nav.quiz')], ['sort', T('nav.sort')], ...DEMOS.map(d => ['demos/' + d, T('nav.demos') + ': ' + T('demo.' + d)])];
  const url = studentURL();
  return `<main class="wrap"><h1 class="page-title">${H('t.share')}</h1><p class="muted">${H('t.shareSub')}</p>
    <div class="share">
      <div class="card panel form">
        ${rangeSelect()}
        ${field(H('t.page'), select('page', pages))}
        ${field(H('nav.language'), select('slang', [['', T('t.langAny')], ...LANGS.map(l => [l.code, l.name])]))}
        <div class="url-box mono" id="url">${esc(url)}</div>
        <div class="row-btns left"><button class="btn btn-primary" data-act="copy">${I.link}${H('t.copy')}</button><a class="btn btn-ghost" href="${esc(url)}" target="_blank" rel="noopener">${H('t.open')}${I.next}</a><button class="btn btn-ghost" data-act="bigQR">${I.screen}${H('t.big')}</button></div>
      </div>
      <div class="card qr-card"><div id="qr" class="qr"></div></div>
    </div></main>`;
}
let qrLib = null;
async function drawQR(target = 'qr') {
  if (!qrLib) qrLib = (await import('../vendor/qrcode.js')).default;
  const el = document.getElementById(target); if (!el) return;
  const qr = qrLib(0, 'M'); qr.addData(studentURL()); qr.make();
  el.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
}

/* ---------- paper test ---------- */
const LETTERS = ['A', 'B', 'C', 'D'];
function testHTML() {
  const ws = wordsIn(S.t.range), n = Math.min(Number(S.t.count), ws.length);
  const tl = S.t.tlang;
  const rnd = seededRandom([S.t.range, S.t.format, n, S.t.version].join('|'));
  const qs = makeTest(ws.map(w => w.id), n, S.t.format, rnd);
  const TT = (k, v) => th(k, tl, escVars(v));
  const head = (answers) => `<header class="sheet-head">
      <div><h2>${TT('t.testTitle')}${answers ? ` — ${TT('t.answers')}` : ''}</h2><p>${esc(rangeLabelOf(S.t.range, (k, v) => t(k, tl, v)))} · ${esc(t('t.version', tl))} ${esc(S.t.version)} · ${n}</p></div>
      ${answers ? '' : `<div class="sheet-fields"><span>${TT('t.name')}</span><span>${TT('t.date')}</span><span>${TT('t.score')} &nbsp; / ${n}</span></div>`}
    </header>`;
  const q = (x, i) => {
    const w = WORD_BY_ID[x.id];
    return `<li class="tq"><div class="tq-desc">${th(`w.${w.id}.desc`, tl)}</div>${S.t.format === 'choice'
      ? `<div class="tq-opts">${x.opts.map((id, j) => `<span><b>${LETTERS[j]}</b> ${esc(WORD_BY_ID[id].term)}</span>`).join('')}</div><div class="tq-ans">(&nbsp;&nbsp;&nbsp;&nbsp;)</div>`
      : `<div class="tq-line"></div>`}</li>`;
  };
  const a = (x, i) => { const w = WORD_BY_ID[x.id]; return `<li>${S.t.format === 'choice' ? `<b>${LETTERS[x.opts.indexOf(x.id)]}</b> ` : ''}${termHTML(w)} <span class="muted">${esc(w.en)}</span></li>`; };
  return `<main class="wrap"><h1 class="page-title">${H('t.test')}</h1><p class="muted">${H('t.testSub')}</p>
    <div class="test-layout">
      <div class="card panel form test-panel">
        ${rangeSelect()}
        ${field(H('t.count'), select('count', [5, 10, 15, 20, 30].filter(c => c <= ws.length || c === 5).map(c => [c, String(Math.min(c, ws.length))])))}
        ${field(H('t.format'), select('format', [['write', T('t.fWrite')], ['choice', T('t.fChoice')]]))}
        ${field(H('t.descLang'), select('tlang', LANGS.map(l => [l.code, l.name])))}
        ${field(H('t.version'), select('version', ['A', 'B', 'C', 'D'].map(v => [v, v])))}
        <button class="btn btn-primary" data-act="print">${I.print}${H('t.print')}</button>
      </div>
      <div class="paper" lang="${htmlLang(tl)}">
        <section class="sheet">${head(false)}<p class="tq-inst">${TT(S.t.format === 'choice' ? 't.qChoice' : 't.qWrite')}</p><ol class="tqs">${qs.map(q).join('')}</ol></section>
        <section class="sheet">${head(true)}<ol class="tas">${qs.map(a).join('')}</ol></section>
      </div>
    </div></main>`;
}

/* =========================================================
 * EVENTS
 * ========================================================= */
const actions = {
  speak(el) { speak(WORD_BY_ID[el.dataset.id]); },
  reveal() { S.present.reveal = !S.present.reveal; render(); },
  pPrev() { const P = S.present; if (P.i > 0) { P.i--; P.reveal = false; render(); } },
  pNext() { const P = S.present; if (P.i < P.list.length - 1) { P.i++; P.reveal = false; render(); } },
  fullscreen() { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch (e) { /* not supported */ } },
  copy() {
    const url = studentURL();
    const done = () => toast(T('t.copied'));
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, () => selectURL());
    else selectURL();
  },
  async bigQR() {
    const d = document.createElement('div');
    d.className = 'qr-full'; d.id = 'qrfull';
    d.innerHTML = `<div id="qr-big" class="qr"></div><p class="mono">${esc(studentURL())}</p><button class="btn btn-ghost" data-act="closeQR">${I.x}${H('btn.close')}</button>`;
    document.body.appendChild(d); await drawQR('qr-big');
  },
  closeQR() { const d = document.getElementById('qrfull'); if (d) d.remove(); },
  print() { window.print(); }
};
function selectURL() { const el = document.getElementById('url'); const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'SELECT') return;
  const fn = actions[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el); }
});
document.addEventListener('change', async e => {
  const el = e.target;
  if (el.matches('[data-act="lang"]')) { await loadLang(el.value); S.settings.lang = el.value; saveSettings(S.settings); render(); return; }
  if (el.dataset.t) {
    S.t[el.dataset.t] = el.value; saveT();
    if (['range', 'order'].includes(el.dataset.t)) S.present.list = null;
    if (el.dataset.t === 'tlang') await loadLang(el.value);
    render();
  }
});
document.addEventListener('keydown', e => {
  if (e.target.closest('input, select, textarea')) return;
  if (e.key === 'Escape') actions.closeQR();
  if (S.route !== 'present') return;
  if (e.key === 'ArrowRight') actions.pNext();
  if (e.key === 'ArrowLeft') actions.pPrev();
  if (e.key === ' ') { e.preventDefault(); actions.reveal(); }
});

/* ---------- start ---------- */
(async function start() {
  S.route = parseRoute();
  await Promise.all([loadLang('en'), loadLang(L()), loadLang(S.t.tlang), S.settings.second ? loadLang(S.settings.second) : null]);
  render();
})();
