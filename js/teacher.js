/* =========================================================
 * teacher.js — the teacher page (teacher.html). No login needed.
 *
 * Routes:  #/present   show one term at a time on the classroom screen
 *          #/share     a link (and QR code) that opens the student app on a range
 *          #/test      a printable vocabulary test (A4, answers on the last page)
 *          #/class     classes (login with the same account as SQL Practice):
 *                      #/class/<id>  join QR, assignment, class live, live table, students
 * ========================================================= */
import { LANGS, loadLang, detectLang, htmlLang, t, th, esc } from './i18n.js';
import { WORD_BY_ID } from './words.js';
import { DEMOS } from './groups.js';
import { RANGES, isRange, wordsIn, makeTest, scenesIn, factsIn, taskQuiz, TASK_MODES, TASK_COUNTS, poolSize } from './quiz.js';
import * as BE from './backend.js';
import { FACT_BY_ID } from './facts.js';
import { Store, loadSettings, saveSettings } from './store.js';
import { I, applySettings, langSelect, shuffle, seededRandom, toast } from './ui.js';
import { termHTML, enName, rangeLabel as rangeLabelOf, speakBtn as speakBtnOf, speak, choiceHTML } from './common.js';

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
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  C.id = h[0] === 'class' && h[1] ? h[1] : null;
  return ['present', 'share', 'test', 'class'].includes(h[0]) ? h[0] : 'present';
}
window.addEventListener('hashchange', () => { S.route = parseRoute(); openRoute(); });
function render() {
  applySettings(S.settings, htmlLang(L()));
  document.body.classList.toggle('teacher', true);
  const body = { present: presentHTML, share: shareHTML, test: testHTML, class: classPageHTML }[S.route]();
  document.title = `${T('t.' + S.route)} · ${T('t.title')}`;
  app.innerHTML = headerHTML() + body;
  if (S.route === 'share') drawQR();
  if (S.route === 'class' && C.cur) drawQR('cqr', joinURL(C.cur));
}
function headerHTML() {
  const a = (r, icon) => `<a href="#/${r}" class="${S.route === r ? 'on' : ''}" title="${esc(T('t.' + r))}">${icon}<span>${H('t.' + r)}</span></a>`;
  return `<header class="topbar"><div class="topbar-in">
    <a class="brand" href="index.html"><span class="brand-mark">${I.net}</span><span class="brand-name">${H('t.title')}</span></a>
    <nav class="topnav">${a('present', I.screen)}${a('share', I.qr)}${a('test', I.print)}${BE.enabled ? a('class', I.users) : ''}<a href="index.html">${I.prev}<span>${H('t.back')}</span></a></nav>
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
async function drawQR(target = 'qr', url = studentURL()) {
  if (!qrLib) qrLib = (await import('../vendor/qrcode.js')).default;
  const el = document.getElementById(target); if (!el) return;
  const qr = qrLib(0, 'M'); qr.addData(url); qr.make();
  el.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
}

/* ---------- paper test ---------- */
const LETTERS = ['A', 'B', 'C', 'D'];
function testHTML() {
  const ws = wordsIn(S.t.range);
  const pool = S.t.format === 'scene' ? scenesIn(ws.map(w => w.id)).length : S.t.format === 'fact' ? factsIn(ws.map(w => w.id)).length : ws.length;
  const n = Math.min(Number(S.t.count), pool);
  const tl = S.t.tlang;
  const rnd = seededRandom([S.t.range, S.t.format, n, S.t.version].join('|'));
  const qs = makeTest(ws.map(w => w.id), n, S.t.format, rnd);
  const TT = (k, v) => th(k, tl, escVars(v));
  const head = (answers) => `<header class="sheet-head">
      <div><h2>${TT('t.testTitle')}${answers ? ` — ${TT('t.answers')}` : ''}</h2><p>${esc(rangeLabelOf(S.t.range, (k, v) => t(k, tl, v)))} · ${esc(t('t.version', tl))} ${esc(S.t.version)} · ${n}</p></div>
      ${answers ? '' : `<div class="sheet-fields"><span>${TT('t.name')}</span><span>${TT('t.date')}</span><span>${TT('t.score')} &nbsp; / ${n}</span></div>`}
    </header>`;
  const tr = (k, v) => t(k, tl, v);
  const optText = (x, v) => x.fact ? choiceHTML(FACT_BY_ID[x.fact].opts[+v], tr) : esc(WORD_BY_ID[v].term);
  const q = (x, i) => {
    const w = WORD_BY_ID[x.id];
    const ask = x.fact ? 'f.' + x.fact : x.scene ? 's.' + x.scene : `w.${w.id}.desc`;
    return `<li class="tq"><div class="tq-desc">${th(ask, tl)}</div>${S.t.format !== 'write'
      ? `<div class="tq-opts ${x.fact ? 'long' : ''}">${x.opts.map((v, j) => `<span><b>${LETTERS[j]}</b> ${optText(x, v)}</span>`).join('')}</div><div class="tq-ans">(&nbsp;&nbsp;&nbsp;&nbsp;)</div>`
      : `<div class="tq-line"></div>`}</li>`;
  };
  const a = (x, i) => {
    const w = WORD_BY_ID[x.id];
    if (x.fact) return `<li><b>${LETTERS[x.opts.indexOf(x.answer)]}</b> ${optText(x, x.answer)}</li>`;
    return `<li>${S.t.format !== 'write' ? `<b>${LETTERS[x.opts.indexOf(x.answer)]}</b> ` : ''}${termHTML(w)} <span class="muted">${esc(w.en)}</span></li>`;
  };
  return `<main class="wrap"><h1 class="page-title">${H('t.test')}</h1><p class="muted">${H('t.testSub')}</p>
    <div class="test-layout">
      <div class="card panel form test-panel">
        ${rangeSelect()}
        ${field(H('t.count'), select('count', [5, 10, 15, 20, 30, 40].filter(c => c <= pool || c === 5).map(c => [c, String(Math.min(c, pool))])))}
        ${field(H('t.format'), select('format', [['write', T('t.fWrite')], ['choice', T('t.fChoice')], ['scene', T('t.fScene')], ['fact', T('t.fFact')]]))}
        ${field(H('t.descLang'), select('tlang', LANGS.map(l => [l.code, l.name])))}
        ${field(H('t.version'), select('version', ['A', 'B', 'C', 'D'].map(v => [v, v])))}
        <button class="btn btn-primary" data-act="print">${I.print}${H('t.print')}</button>
      </div>
      <div class="paper" lang="${htmlLang(tl)}">
        <section class="sheet">${head(false)}<p class="tq-inst">${TT({ choice: 't.qChoice', scene: 't.qScene', fact: 't.qFact' }[S.t.format] || 't.qWrite')}</p><ol class="tqs">${qs.map(q).join('')}</ol></section>
        <section class="sheet">${head(true)}<ol class="tas">${qs.map(a).join('')}</ol></section>
      </div>
    </div></main>`;
}

/* =========================================================
 * CLASSES — the same teacher account as SQL Practice (Supabase)
 * C.cur = the open class; C.all = every answer of the class; C.view = what the live table shows:
 *   'task' (the assignment) or a quick test's id. In a table the first answer per question counts.
 * ========================================================= */
const C = { all: [], view: 'task', qdraft: { range: 'all', mode: 'mix', n: 5, min: 5 }, slide: null, id: null, ready: false, session: null, teacher: null, classes: null, cur: null, members: [], pins: {}, att: [], err: '', busy: false, draft: null, hide: false, unwatch: null, status: '' };
const pad = n => String(n).padStart(2, '0');
const hhmm = iso => { const d = new Date(iso); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const newSeed = () => { const d = new Date(); return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 5)}`; };
function joinURL(c) { const u = new URL('index.html', location.href); u.searchParams.set('class', c.code); return u.href.replace('/index.html', '/'); }
const isLiveC = c => !!(c && c.live_until && Date.parse(c.live_until) > Date.now());
const errText = e => H(e && e.message === 'not_ready' ? 'tc.notReady' : e && e.message === 'not_teacher' ? 'tc.notTeacher' : 'tc.error', { msg: (e && e.message) || '' });

async function openRoute() {
  if (C.unwatch && (S.route !== 'class' || !C.id || !C.cur || C.cur.id !== C.id)) { C.unwatch(); C.unwatch = null; }
  if (S.route === 'class' && BE.enabled) {
    if (!C.ready) {
      render();
      try { C.session = await BE.teacherSession(); C.teacher = C.session ? await BE.amITeacher() : null; } catch (e) { C.err = errText(e); }
      C.ready = true;
    }
    if (C.teacher) {
      try {
        if (!C.classes || !C.id) C.classes = await BE.myClasses();
        if (C.id && (!C.cur || C.cur.id !== C.id)) await openClass(C.id);
      } catch (e) { C.err = errText(e); }
    }
  }
  render();
}
async function openClass(id) {
  C.cur = (C.classes || []).find(c => c.id === id) || null;
  if (!C.cur) { C.classes = await BE.myClasses(); C.cur = C.classes.find(c => c.id === id) || null; }
  if (!C.cur) return;
  C.draft = Object.assign({ range: S.t.range, mode: 'mix', n: 10, seed: newSeed() }, C.cur.task || {});
  C.qdraft = Object.assign({}, C.qdraft, { range: (C.cur.task && C.cur.task.range) || S.t.range });
  C.view = C.cur.quick ? C.cur.quick.id : 'task'; C.slide = null;
  await Promise.all([loadMembers(), loadAttempts()]);
  if (C.unwatch) C.unwatch();
  C.unwatch = await BE.watchDashboard(id, row => {
    C.all.push(row); drawTable(); drawWeak(); if (C.slide) drawSlide();
  }, () => loadMembers().then(() => { drawTable(); drawMembers(); }), st => { C.status = st; const b = document.getElementById('rt-status'); if (b) b.outerHTML = rtStatus(); }).catch(() => null);
}
async function loadMembers() {
  C.members = await BE.members(C.cur.id);
  try { C.pins = Object.fromEntries((await BE.pinStatus(C.cur.id)).map(p => [p.user_id, p])); } catch (e) { C.pins = {}; }
}
async function loadAttempts() { C.all = await BE.attempts(C.cur.id); }
/* the questions and the answers of what the live table shows */
function quickById(id) { const c = C.cur; return (c.quick && c.quick.id === id) ? c.quick : (c.quick_log || []).find(q => q.id === id) || null; }
function viewData(view = C.view) {
  const c = C.cur;
  if (view !== 'task') {
    const q = quickById(view);
    if (q) return { kind: 'quick', q, qs: taskQuiz({ range: q.range, mode: q.mode, n: q.n, seed: q.id }, seededRandom), att: C.all.filter(a => a.kind === 'quick' && a.seed === q.id) };
  }
  if (!c.task) return null;
  return { kind: 'task', qs: taskQuiz(c.task, seededRandom), att: C.all.filter(a => a.kind === 'task' && a.seed === c.task.seed) };
}
function firstAnswers(att) {   // user → pos → the first answer
  const first = {};
  for (const a of att) { const u = first[a.user_id] || (first[a.user_id] = {}); if (a.pos != null && !(a.pos in u)) u[a.pos] = a; }
  return first;
}

function classPageHTML() {
  if (!BE.enabled) return `<main class="wrap narrow"><section class="card empty"><h1>${H('tc.title')}</h1><p class="muted">${H('cls.off')}</p></section></main>`;
  if (!C.ready) return `<main class="wrap"><div class="loading"><div class="spinner"></div></div></main>`;
  if (!C.session) return loginHTML();
  const who = `<p class="muted small tc-who">${H('tc.signedIn', { email: C.session.user.email })} · <button class="linkbtn" data-act="tcSignOut">${H('tc.signOut')}</button></p>`;
  if (!C.teacher) return `<main class="wrap narrow"><section class="card empty"><h1>${H('tc.title')}</h1><p>${C.err || H('tc.notTeacher')}</p>${who}</section></main>`;
  if (C.id) return C.cur ? classViewHTML() + `<div class="wrap">${who}</div>` : `<main class="wrap">${C.err ? `<p class="err">${C.err}</p>` : '<div class="loading"><div class="spinner"></div></div>'}</main>`;
  return classListHTML() + `<div class="wrap">${who}</div>`;
}
function loginHTML() {
  return `<main class="wrap narrow"><div class="page-head"><div><h1 class="page-title">${H('tc.title')}</h1><p class="muted">${H('tc.loginSub')}</p></div></div>
    <form class="card panel form" id="tc-login">
      <label class="fld"><span>${H('tc.email')}</span><input name="email" type="email" autocomplete="username" value="${esc(C.email || '')}" required></label>
      <label class="fld"><span>${H('tc.password')}</span><input name="password" type="password" autocomplete="current-password" required></label>
      ${C.err ? `<p class="err" role="alert">${C.err}</p>` : ''}
      <div class="row-btns left"><button class="btn btn-primary" type="submit" ${C.busy ? 'disabled' : ''}>${H('tc.login')}</button><button class="linkbtn" type="button" data-act="tcForgot">${H('tc.forgot')}</button></div>
    </form></main>`;
}
function classListHTML() {
  const list = C.classes || [];
  return `<main class="wrap"><div class="page-head"><div><h1 class="page-title">${H('tc.title')}</h1><p class="muted">${H('tc.listSub')}</p></div></div>
    ${C.err ? `<p class="err">${C.err}</p>` : ''}
    <form class="card panel tc-new" id="tc-new"><label class="fld"><span>${H('tc.newName')}</span><input name="name" maxlength="80" placeholder="${esc(T('tc.newPh'))}" required></label>
      <button class="btn btn-primary" type="submit" ${C.busy ? 'disabled' : ''}>${H('tc.create')}</button></form>
    <div class="tc-list">${list.length ? list.map(c => `<a class="card tc-item" href="#/class/${c.id}">
      <b>${esc(c.name)}</b><span class="mono">${esc(c.code)}</span>${isLiveC(c) ? `<span class="live-tag">${I.live}${H('cls.live')}</span>` : ''}
      <span class="muted small">${c.task ? esc(rangeLabel(c.task.range)) + ' · ' + esc(T('quiz.m.' + c.task.mode)) + ' · ' + c.task.n : esc(T('tc.noTask'))}</span>${I.next}</a>`).join('') : `<p class="muted">${H('tc.none')}</p>`}</div></main>`;
}
function classViewHTML() {
  const c = C.cur, d = C.draft, live = isLiveC(c), url = joinURL(c);
  const ids = wordsIn(d.range).map(w => w.id);
  const saved = c.task && ['range', 'mode', 'n', 'seed'].every(k => String(c.task[k]) === String(d[k]));
  const modeOpts = TASK_MODES.map(m => [m, `${T('quiz.m.' + m)} (${poolSize(ids, m, { listen: m === 'listen' })})`]);
  const dsel = (k, opts) => `<select data-d="${k}">${opts.map(([v, l]) => `<option value="${v}" ${String(d[k]) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  return `<main class="wrap">
    <div class="page-head"><div><a class="linkbtn" href="#/class">${I.prev} ${H('tc.all')}</a><h1 class="page-title">${esc(c.name)}</h1></div>
      <div class="tc-live">${live ? `<span class="live-tag big">${I.live}${H('tc.liveUntil', { t: hhmm(c.live_until) })}</span>
        <button class="btn btn-ghost btn-sm" data-act="tcLive" data-min="${Math.ceil((Date.parse(c.live_until) - Date.now()) / 60000) + 10}">+10${esc(T('tc.min'))}</button>
        <button class="btn btn-danger btn-sm" data-act="tcStop">${H('tc.stop')}</button>`
        : `<span class="muted small">${H('tc.liveStart')}</span>${[45, 50, 90].map(m => `<button class="btn btn-primary btn-sm" data-act="tcLive" data-min="${m}" ${c.task ? '' : 'disabled'}>${I.live}${m}${esc(T('tc.min'))}</button>`).join('')}`}</div></div>
    ${c.task ? '' : `<p class="note">${H('tc.taskFirst')}</p>`}
    <div class="tc-grid">
      <section class="card panel tc-join">
        <h2>${I.qr} ${H('tc.joinTitle')}</h2>
        <div class="tc-join-in"><div id="cqr" class="qr small-qr"></div>
          <div><span class="muted small">${H('cls.code')}</span><div class="code-big mono">${esc(c.code)}</div>
          <div class="url-box mono small" id="url">${esc(url)}</div>
          <div class="row-btns left"><button class="btn btn-ghost btn-sm" data-act="tcCopy">${I.link}${H('t.copy')}</button><button class="btn btn-ghost btn-sm" data-act="bigQR" data-cls="1">${I.screen}${H('t.big')}</button></div>
          <label class="chk"><input type="checkbox" data-act="tcOpen" ${c.open ? 'checked' : ''}><span>${H('tc.open')}</span></label></div></div>
      </section>
      <section class="card panel form tc-task">
        <h2>${I.flag} ${H('cls.task')}</h2>
        <label class="fld"><span>${H('range.label')}</span>${dsel('range', RANGES.map(r => [r, `${rangeLabel(r)} (${T('range.words', { n: wordsIn(r).length })})`]))}</label>
        <div class="tc-row"><label class="fld"><span>${H('tc.mode')}</span>${dsel('mode', modeOpts)}</label>
        <label class="fld"><span>${H('quiz.count')}</span>${dsel('n', TASK_COUNTS.map(n => [n, String(n)]))}</label></div>
        <div class="tc-seed muted small">${H('tc.set')} <span class="mono">${esc(d.seed)}</span> <button class="linkbtn" data-act="tcSeed">${I.shuffle}${H('tc.newSet')}</button></div>
        <div class="row-btns left"><button class="btn btn-primary" data-act="tcSaveTask" ${saved ? 'disabled' : ''}>${H(saved ? 'tc.saved' : 'tc.saveTask')}</button>${c.task && !saved ? `<button class="linkbtn" data-act="tcUndo">${H('tc.undo')}</button>` : ''}</div>
        <p class="muted small">${H('tc.taskTip')}</p>
      </section>
      ${quickCardHTML()}
    </div>
    <section class="card panel tc-table-card">
      <div class="tc-table-head"><h2>${I.eye} ${H('tc.table')}</h2>${rtStatus()}${viewSelect()}
        <button class="btn btn-ghost btn-sm" data-act="tcSlide" data-p="worst" ${viewData() ? '' : 'disabled'}>${I.screen}${H('tc.mistakes')}</button>
        <label class="chk"><input type="checkbox" data-act="tcHide" ${C.hide ? 'checked' : ''}><span>${H('tc.hide')}</span></label></div>
      <div id="live-table">${tableHTML()}</div>
    </section>
    <section class="card panel"><h2>${I.bulb} ${H('tc.weak')}</h2><p class="muted small">${H('tc.weakSub')}</p><div id="weak">${weakHTML()}</div></section>
    <section class="card panel"><h2>${I.users} ${H('tc.students')} <span class="count">${C.members.length}</span></h2><div id="members">${membersHTML()}</div></section>
    <div class="row-btns left"><button class="linkbtn danger" data-act="tcDelete">${I.trash}${H('tc.delete')}</button></div>
  </main>`;
}
function viewSelect() {
  const c = C.cur, opts = [];
  if (c.task) opts.push(['task', T('cls.task')]);
  if (c.quick) opts.push([c.quick.id, T('tc.quickNow')]);
  (c.quick_log || []).forEach(q => opts.push([q.id, T('tc.quickPast', { t: hhmm(q.at) + ' ' + (new Date(q.at).getMonth() + 1) + '/' + new Date(q.at).getDate(), n: q.n })]));
  if (opts.length < 2) return '';
  return `<select class="view-sel" data-act="tcView">${opts.map(([v, l]) => `<option value="${esc(v)}" ${C.view === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
}
const QUICK_COUNTS = [5, 10, 15, 20], QUICK_MIN = [0, 3, 5, 10];
function quickCardHTML() {
  const c = C.cur, q = c.quick, d = C.qdraft;
  const sel = (k, opts) => `<select data-q="${k}">${opts.map(([v, l]) => `<option value="${v}" ${String(d[k]) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  if (q) {
    const wait = Date.parse(q.at) > Date.now(), over = q.end && Date.parse(q.end) < Date.now();
    return `<section class="card panel tc-quick on"><h2>${I.flag} ${H('cls.quick')}</h2>
      <p><b>${esc(rangeLabel(q.range))} · ${esc(T('quiz.m.' + q.mode))} · ${q.n}</b></p>
      <div class="qt-state" id="tc-qstate">${quickStateText(q)}</div>
      <div class="row-btns left"><button class="btn ${over ? 'btn-primary' : 'btn-danger'}" data-act="tcQuickStop">${H(over ? 'tc.quickSave' : 'tc.quickStop')}</button></div>
      <p class="muted small">${H('tc.quickStopTip')}</p></section>`;
  }
  const ids = wordsIn(d.range).map(w => w.id);
  return `<section class="card panel form tc-quick"><h2>${I.flag} ${H('cls.quick')}</h2>
    <label class="fld"><span>${H('range.label')}</span>${sel('range', RANGES.map(r => [r, rangeLabel(r)]))}</label>
    <div class="tc-row three"><label class="fld"><span>${H('tc.mode')}</span>${sel('mode', TASK_MODES.map(m => [m, `${T('quiz.m.' + m)} (${poolSize(ids, m, { listen: m === 'listen' })})`]))}</label>
      <label class="fld"><span>${H('quiz.count')}</span>${sel('n', QUICK_COUNTS.map(n => [n, String(n)]))}</label>
      <label class="fld"><span>${H('tc.limit')}</span>${sel('min', QUICK_MIN.map(m => [m, m ? m + T('tc.min') : T('tc.noLimit')]))}</label></div>
    <div class="row-btns left"><button class="btn btn-primary" data-act="tcQuickStart">${I.play}${H('tc.quickStart')}</button></div>
    <p class="muted small">${H('tc.quickTip')}</p></section>`;
}
function quickStateText(q) {
  const t = Date.now(), at = Date.parse(q.at), end = q.end ? Date.parse(q.end) : null;
  const ms = x => { const v = Math.max(0, Math.ceil(x / 1000)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`; };
  const f1 = firstAnswers(C.all.filter(a => a.kind === 'quick' && a.seed === q.id));
  const done = C.members.filter(m => Object.keys(f1[m.user_id] || {}).length >= q.n).length;
  const head = t < at ? H('tc.quickWait', { s: Math.ceil((at - t) / 1000) }) : end && t > end ? H('tc.quickOver') : end ? H('tc.quickLeft', { t: ms(end - t) }) : H('tc.quickRunning');
  return `<span class="big">${head}</span><span class="muted">${H('tc.quickDone', { a: done, b: C.members.length })}</span>`;
}
/* the weak words of the class: every answer (quiz, review, assignment, quick test) */
function weakHTML() {
  const by = {};
  for (const a of C.all) { const r = by[a.word] || (by[a.word] = { n: 0, ok: 0, who: new Set() }); r.n++; if (a.ok) r.ok++; r.who.add(a.user_id); }
  const rows = Object.entries(by).filter(([id, r]) => WORD_BY_ID[id] && r.n >= 3).map(([id, r]) => ({ id, r, rate: r.ok / r.n })).sort((a, b) => a.rate - b.rate).slice(0, 10);
  if (!rows.length) return `<p class="muted">${H('tc.weakNone')}</p>`;
  return `<ul class="weak-list">${rows.map(({ id, r, rate }) => `<li><span class="w-term" lang="ja">${esc(WORD_BY_ID[id].term)}</span>
    <span class="w-bar"><i style="width:${Math.round(rate * 100)}%" class="${rate < .5 ? 'low' : rate < .8 ? 'mid' : 'high'}"></i></span><b>${Math.round(rate * 100)}%</b><span class="muted small">${H('tc.weakN', { n: r.n, p: r.who.size })}</span></li>`).join('')}</ul>`;
}
const drawWeak = () => { const el = document.getElementById('weak'); if (el) el.innerHTML = weakHTML(); };

/* ---------- the mistakes screen (for the projector): one question, how many chose each option, no names ---------- */
function qPrompt(q) {
  const w = WORD_BY_ID[q.id];
  const body = {
    s2t: () => H('s.' + q.scene), fact: () => H('f.' + q.fact), d2t: () => H(`w.${w.id}.desc`), tip2t: () => H(`w.${w.id}.tip`),
    e2t: () => `<span class="big-en" lang="en">${esc(w.en)}</span>`, listen: () => `${I.sound} <span lang="ja">${esc(w.yomi || w.term)}</span>`,
    t2d: () => `<span class="big-term">${termHTML(w)}</span>`
  }[q.type]();
  return `<p class="muted">${H('quiz.' + q.type)}</p><div class="sl-q">${body}</div>`;
}
const qOptText = (q, v) => q.type === 'fact' ? choiceHTML(FACT_BY_ID[q.fact].opts[+v], (k, x) => T(k, x)) : q.type === 't2d' ? H(`w.${v}.desc`) : termHTML(WORD_BY_ID[v]);
function slideOrder(vd) {
  const f1 = firstAnswers(vd.att);
  const stat = vd.qs.map((q, p) => { const v = Object.values(f1).map(u => u[p]).filter(Boolean); return { p, n: v.length, rate: v.length ? v.filter(a => a.ok).length / v.length : 2 }; });
  return stat.filter(x => x.n).sort((a, b) => a.rate - b.rate || a.p - b.p).map(x => x.p);
}
function slideHTML() {
  const vd = viewData(); if (!vd) return '';
  const p = C.slide.p, q = vd.qs[p], f1 = firstAnswers(vd.att);
  const answers = Object.values(f1).map(u => u[p]).filter(Boolean);
  const count = v => answers.filter(a => a.choice === v).length, max = Math.max(1, ...q.opts.map(count));
  const order = C.slide.order, k = order.indexOf(p);
  return `<div class="sl-in">
    <div class="sl-top"><span class="sl-n">${H('tc.qNo', { n: p + 1 })}</span><span class="muted">${H('tc.answered', { n: answers.length })} · ${answers.length ? Math.round(answers.filter(a => a.ok).length / answers.length * 100) + '%' : '—'}</span>
      <button class="btn btn-ghost btn-sm" data-act="tcSlideReveal">${I.eye}${H(C.slide.show ? 'tc.hideAns' : 'tc.showAns')}</button><button class="btn btn-ghost btn-sm" data-act="tcSlideClose">${I.x}${H('btn.close')}</button></div>
    ${qPrompt(q)}
    <div class="sl-opts">${q.opts.map((v, i) => { const n = count(v), right = v === q.answer;
      return `<div class="sl-opt ${C.slide.show ? (right ? 'ok' : n ? 'ng' : '') : ''}"><span class="k">${i + 1}</span><span class="t">${qOptText(q, v)}</span>
        <span class="sl-bar"><i style="width:${n / max * 100}%"></i></span><b class="sl-c">${n}</b>${C.slide.show && right ? I.check : ''}</div>`; }).join('')}</div>
    <div class="sl-nav"><button class="btn btn-ghost" data-act="tcSlideGo" data-d="-1" ${k <= 0 ? 'disabled' : ''}>${I.prev}${H('btn.prev')}</button>
      <span class="muted small">${H('tc.slideOrder')} ${k + 1} / ${order.length}</span>
      <button class="btn btn-primary" data-act="tcSlideGo" data-d="1" ${k >= order.length - 1 ? 'disabled' : ''}>${H('btn.next')}${I.next}</button></div></div>`;
}
function drawSlide() {
  let el = document.getElementById('slide');
  if (!C.slide) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'slide'; el.className = 'slide-full'; document.body.appendChild(el); }
  el.innerHTML = slideHTML();
}

function rtStatus() {
  const on = C.status === 'SUBSCRIBED';
  return `<span id="rt-status" class="rt ${on ? 'on' : ''}">${on ? H('tc.rtOn') : H('tc.rtOff')}</span>`;
}
function tableHTML() {
  const vd = viewData();
  if (!vd) return `<p class="muted">${H('tc.noTask')}</p>`;
  const qs = vd.qs, f1 = firstAnswers(vd.att), first = {};
  for (const u in f1) { first[u] = {}; for (const p in f1[u]) first[u][p] = f1[u][p].ok; }
  if (!C.members.length) return `<p class="muted">${H('tc.noStudents')}</p>`;
  const rows = C.members.map((m, i) => {
    const u = first[m.user_id] || {};
    const done = Object.keys(u).length, ok = Object.values(u).filter(Boolean).length;
    return `<tr><th class="nm">${C.hide ? '#' + (i + 1) : esc(m.nickname)}</th>${qs.map((q, p) => `<td class="${p in u ? (u[p] ? 'ok' : 'ng') : ''}">${p in u ? (u[p] ? '○' : '×') : ''}</td>`).join('')}<td class="num">${ok}/${done}</td><td class="num">${done === qs.length ? I.check : `${done}/${qs.length}`}</td></tr>`;
  }).join('');
  const rate = qs.map((q, p) => { const v = C.members.map(m => (first[m.user_id] || {})[p]).filter(x => x !== undefined); return v.length ? Math.round(v.filter(Boolean).length / v.length * 100) : null; });
  const head = qs.map((q, p) => { const w = WORD_BY_ID[q.id]; return `<th title="${esc(w.term)} · ${esc(T('quiz.' + q.type))}"><button class="qhead-btn" data-act="tcSlide" data-p="${p}"><span class="qn">${p + 1}</span><span class="qt">${esc(w.term)}</span></button></th>`; }).join('');
  return `<div class="tbl-scroll"><table class="live-tbl"><thead><tr><th></th>${head}<th>${H('tc.right')}</th><th>${H('tc.progress')}</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr><th>${H('tc.rate')}</th>${rate.map(r => `<td class="rate ${r === null ? '' : r < 50 ? 'low' : r < 80 ? 'mid' : 'high'}">${r === null ? '' : r + '%'}</td>`).join('')}<td></td><td></td></tr></tfoot></table></div>`;
}
function membersHTML() {
  if (!C.members.length) return `<p class="muted">${H('tc.noStudents')}</p>`;
  return `<ul class="tc-members">${C.members.map(m => { const p = C.pins[m.user_id];
    return `<li><b>${esc(m.nickname)}</b><span class="muted small">${p ? (p.locked ? H('tc.pinLocked') : p.has_pin ? H('tc.pinSet') : H('tc.pinNone')) : ''}</span>
      <button class="linkbtn" data-act="tcPin" data-u="${m.user_id}">${I.key}${H('tc.newPin')}</button><button class="linkbtn danger" data-act="tcRemove" data-u="${m.user_id}">${H('tc.remove')}</button></li>`; }).join('')}</ul>`;
}
const drawTable = () => { const el = document.getElementById('live-table'); if (el) el.innerHTML = tableHTML(); };
const drawMembers = () => { const el = document.getElementById('members'); if (el) el.innerHTML = membersHTML(); };
async function act(fn) {
  try { await fn(); } catch (e) { toast(stripTags(errText(e))); }
  render();
}
const stripTags = h => h.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');
const keepRow = row => { C.cur = row; const i = (C.classes || []).findIndex(c => c.id === row.id); if (i >= 0) C.classes[i] = row; };
const classActions = {
  tcSignOut() { act(async () => { await BE.signOut(); Object.assign(C, { session: null, teacher: null, classes: null, cur: null }); location.hash = '#/class'; }); },
  tcForgot() {
    const email = (document.querySelector('#tc-login [name="email"]') || {}).value;
    if (!email) { C.err = H('tc.emailFirst'); render(); return; }
    act(async () => { await BE.resetPassword(email); toast(T('tc.mailSent')); });
  },
  tcCopy() { const url = joinURL(C.cur); if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(() => toast(T('t.copied')), selectURL); else selectURL(); },
  tcSeed() { C.draft.seed = newSeed(); render(); },
  tcUndo() { C.draft = Object.assign({}, C.cur.task); render(); },
  tcSaveTask() {
    act(async () => {
      const task = { range: C.draft.range, mode: C.draft.mode, n: Number(C.draft.n), seed: C.draft.seed };
      keepRow(await BE.updateClass(C.cur.id, { task }));
      await loadAttempts(); toast(T('tc.taskSent'));
    });
  },
  tcQuickStart() {
    const d = C.qdraft;
    act(async () => { keepRow(await BE.startQuick(C.cur.id, { range: d.range, mode: d.mode, n: Number(d.n) }, Number(d.min))); C.view = C.cur.quick.id; });
  },
  tcQuickStop() {
    if (C.cur.quick && !(C.cur.quick.end && Date.parse(C.cur.quick.end) < Date.now()) && !confirm(T('tc.quickStopAsk'))) return;
    act(async () => { const id = C.cur.quick && C.cur.quick.id; keepRow(await BE.stopQuick(C.cur.id)); if (id) C.view = id; });
  },
  tcSlide(el) {
    const vd = viewData(); if (!vd) return;
    const order = slideOrder(vd);
    if (!order.length) { toast(T('tc.noAnswers')); return; }
    C.slide = { order, p: el.dataset.p === 'worst' ? order[0] : Number(el.dataset.p), show: false };
    if (!order.includes(C.slide.p)) C.slide.order = [C.slide.p, ...order];
    drawSlide();
  },
  tcSlideGo(el) { const o = C.slide.order, k = o.indexOf(C.slide.p) + Number(el.dataset.d); if (o[k] !== undefined) { C.slide.p = o[k]; C.slide.show = false; drawSlide(); } },
  tcSlideReveal() { C.slide.show = !C.slide.show; drawSlide(); },
  tcSlideClose() { C.slide = null; drawSlide(); },
  tcLive(el) { act(async () => keepRow(await BE.startLive(C.cur.id, Number(el.dataset.min)))); },
  tcStop() { act(async () => keepRow(await BE.stopLive(C.cur.id))); },
  tcPin(el) {
    const m = C.members.find(x => x.user_id === el.dataset.u);
    const pin = prompt(T('tc.pinAsk', { name: m.nickname }));
    if (pin === null) return;
    if (!/^\d{4}$/.test(pin.trim())) { toast(T('err.bad_pin')); return; }
    act(async () => { await BE.teacherSetPin(C.cur.id, m.user_id, pin.trim()); await loadMembers(); toast(T('tc.pinDone', { name: m.nickname })); });
  },
  tcRemove(el) {
    const m = C.members.find(x => x.user_id === el.dataset.u);
    if (!confirm(T('tc.removeAsk', { name: m.nickname }))) return;
    act(async () => { await BE.removeMember(C.cur.id, m.user_id); await loadMembers(); });
  },
  tcDelete() {
    if (!confirm(T('tc.deleteAsk', { name: C.cur.name }))) return;
    act(async () => { await BE.deleteClass(C.cur.id); C.classes = C.classes.filter(c => c.id !== C.cur.id); C.cur = null; location.hash = '#/class'; });
  }
};
document.addEventListener('change', e => {
  const el = e.target;
  if (el.matches('[data-act="tcHide"]')) { C.hide = el.checked; drawTable(); }
  if (el.matches('[data-act="tcView"]')) { C.view = el.value; drawTable(); }
  if (el.dataset.q) { C.qdraft[el.dataset.q] = el.dataset.q === 'range' || el.dataset.q === 'mode' ? el.value : Number(el.value); render(); }
  if (el.matches('[data-act="tcOpen"]')) act(async () => keepRow(await BE.updateClass(C.cur.id, { open: el.checked })));
});
document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id === 'tc-login') {
    e.preventDefault();
    const d = new FormData(f);
    C.email = String(d.get('email')).trim();
    C.busy = true; C.err = ''; render();
    try {
      await BE.signIn(String(d.get('email')).trim(), String(d.get('password')));
      C.session = await BE.teacherSession(); C.teacher = await BE.amITeacher();
      if (C.teacher) C.classes = await BE.myClasses();
    } catch (err) { C.err = /invalid/i.test(err.message) ? H('tc.badLogin') : errText(err); }
    C.busy = false; openRoute();
  }
  if (f.id === 'tc-new') {
    e.preventDefault();
    const name = String(new FormData(f).get('name') || '').trim();
    if (!name) return;
    C.busy = true; render();
    try { const c = await BE.createClass(name); C.classes = [c, ...(C.classes || [])]; C.busy = false; location.hash = '#/class/' + c.id; }
    catch (err) { C.busy = false; C.err = errText(err); render(); }
  }
});
setInterval(() => { if (S.route === 'class' && C.cur && C.cur.live_until && !isLiveC(C.cur)) { C.cur.live_until = null; render(); } }, 20000);
setInterval(() => { const el = document.getElementById('tc-qstate'); if (el && C.cur && C.cur.quick) el.innerHTML = quickStateText(C.cur.quick); }, 1000);
document.addEventListener('keydown', e => {
  if (!C.slide) return;
  if (e.key === 'Escape') classActions.tcSlideClose();
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const b = document.querySelector(`[data-act="tcSlideGo"][data-d="${e.key === 'ArrowRight' ? 1 : -1}"]`); if (b && !b.disabled) b.click(); }
  if (e.key === ' ') { e.preventDefault(); classActions.tcSlideReveal(); }
});

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
  async bigQR(el) {
    const cls = el && el.dataset.cls && C.cur;
    const url = cls ? joinURL(C.cur) : studentURL();
    const d = document.createElement('div');
    d.className = 'qr-full'; d.id = 'qrfull';
    d.innerHTML = `${cls ? `<p class="qr-code-big mono">${esc(C.cur.code)}</p>` : ''}<div id="qr-big" class="qr"></div><p class="mono">${esc(url)}</p><button class="btn btn-ghost" data-act="closeQR">${I.x}${H('btn.close')}</button>`;
    document.body.appendChild(d); await drawQR('qr-big', url);
  },
  ...classActions,
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
  if (el.dataset.d) { C.draft[el.dataset.d] = el.dataset.d === 'n' ? Number(el.value) : el.value; render(); return; }
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
  openRoute();
})();
