/* =========================================================
 * student.js — the student app (index.html)
 *
 * Routes:  #/            home
 *          #/words        word list          #/cards   flashcards
 *          #/quiz         4-choice quiz      #/sort    sorting game
 *          #/review       today's review     #/demos/<id>  animations
 *          #/class        join a class       #/task    the class assignment   #/quick  the quick test
 *          #/text         the textbook contents (lessons)   #/lesson/<n>  the explanation page of a lesson
 * URL options:  ?lang=vi   ?range=lesson-13   ?present=1   ?class=<class code>
 * Progress is stored by word id, so switching language never touches it.
 * ========================================================= */
import { LANGS, loadLang, detectLang, htmlLang, t, th, esc } from './i18n.js';
import { WORDS, WORD_BY_ID } from './words.js';
import { GROUP_BY_ID, DEMOS, CHAPTERS } from './groups.js';
import { LESSON_PAGES, hasPage, termRefs } from './lessons.js';
import { FIGURES } from './figures.js';
import { RANGES, RANGE_SETS, isRange, wordsIn, groupsIn, makeQuiz, makeSort, poolSize, taskQuiz, taskKey, qidOf } from './quiz.js';
import { FACT_BY_ID } from './facts.js';
import { Store, loadSettings, saveSettings, loadProgress, saveProgress, recordAnswer, dueWords } from './store.js';
import * as BE from './backend.js';
import { I, applySettings, langSelect, langOptions, modal, closeModal, seededRandom, toast } from './ui.js';
import { termHTML, enName, rangeLabel as rangeLabelOf, rangeOptions, speakBtn as speakBtnOf, speak, canSpeak, choiceHTML } from './common.js';

const S = {
  settings: loadSettings(null),
  progress: loadProgress(),
  route: { view: 'home' },
  cards: { i: 0, flipped: false, onlyNew: false },
  quiz: null,
  sort: null,
  query: '',
  /* class: cls = what this browser remembers ({id, code, name, nick}); klass = the class row as last read */
  cls: Store.get('netw.class', null),
  klass: null,
  join: { code: '', resume: false, err: '', busy: false },
  skew: 0          // server clock − this device's clock (ms)
};
S.settings.lang = detectLang(S.settings.lang);
const qs = new URLSearchParams(location.search);
if (qs.get('present') === '1') S.settings.presenter = true;
if (isRange(qs.get('range'))) { S.settings.range = qs.get('range'); saveSettings(S.settings); }
if (!isRange(S.settings.range)) S.settings.range = 'all';
if (qs.get('class')) S.join.code = qs.get('class').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);

const app = document.getElementById('app');
const L = () => S.settings.lang;
const T = (k, v) => t(k, L(), v);
const escVars = v => v && Object.fromEntries(Object.entries(v).map(([a, b]) => [a, esc(b)]));
/** label as HTML (furigana kept, variables escaped) */
const H = (k, v) => th(k, L(), escVars(v));
/** text in the main language + the second language underneath (if chosen) */
function bi(k, v, tag = 'span') {
  const one = lang => th(k, lang, escVars(v));
  const sec = S.settings.second;
  if (!sec || sec === L()) return one(L());
  return `${one(L())}<${tag} class="bi" lang="${htmlLang(sec)}">${one(sec)}</${tag}>`;
}
const save = () => saveProgress(S.progress);

/* ---------- terms ---------- */
const speakBtn = w => speakBtnOf(w, T('btn.listen'));
const groupTag = g => `<span class="gtag" style="--gc:var(--g-${g.id})">${H('g.' + g.id)}</span>`;
const words = () => wordsIn(S.settings.range);

/* ---------- range ---------- */
const rangeLabel = r => rangeLabelOf(r, T);
function rangeSelect() {
  return `<label class="range"><span>${H('range.label')}</span><select data-act="range" aria-label="${esc(T('range.label'))}">
    ${rangeOptions(RANGE_SETS, S.settings.range, r => `${rangeLabel(r)} (${T('range.words', { n: wordsIn(r).length })})`, T)}
  </select></label>`;
}

/* ---------- routing ---------- */
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  if (['words', 'cards', 'quiz', 'sort', 'review', 'class', 'task', 'quick'].includes(h[0])) return { view: h[0] };
  if (h[0] === 'demos') return { view: 'demos', id: DEMOS.includes(h[1]) ? h[1] : DEMOS[0] };
  if (h[0] === 'text') return { view: 'text' };
  if (h[0] === 'lesson' && hasPage(Number(h[1]))) return { view: 'lesson', n: Number(h[1]) };
  return { view: 'home' };
}
window.addEventListener('hashchange', () => {
  S.route = parseRoute();
  clearAuto();
  if (S.route.view === 'review') S.quiz = null;
  render(); window.scrollTo(0, 0);
});

/* ---------- page ---------- */
function render() {
  applySettings(S.settings, htmlLang(L()));
  const v = S.route.view;
  const body = { home: homeHTML, words: wordsHTML, cards: cardsHTML, quiz: quizHTML, review: quizHTML, task: quizHTML, sort: sortHTML, demos: demosHTML, class: classHTML, quick: quickHTML, text: textHTML, lesson: lessonHTML }[v]();
  document.title = (v === 'home' ? '' : (v === 'lesson' ? T('lesson.' + S.route.n) : T(v === 'task' ? 'cls.task' : v === 'class' ? 'cls.title' : v === 'quick' ? 'cls.quick' : 'nav.' + v)) + ' · ') + T('app.name');
  app.innerHTML = headerHTML() + liveBanner() + body + footerHTML();
  if (v === 'demos') mountDemo(S.route.id);
  if (v === 'lesson') document.querySelectorAll('[data-demo]').forEach(el => mountDemoIn(el, el.dataset.demo, JSON.parse(el.dataset.opts || '{}')));
  if (v === 'quiz' || v === 'review' || v === 'task') afterQuizRender();
  if (v === 'quick') afterQuickRender();
  if (v === 'words') { const s = document.getElementById('search'); if (s && S.query) { s.focus(); s.setSelectionRange(S.query.length, S.query.length); } }
}
function headerHTML() {
  const due = dueWords(S.progress).length, v = S.route.view === 'lesson' ? 'text' : S.route.view;
  const a = (r, icon, key, extra = '') => `<a href="#/${r}" class="${v === (r.split('/')[0] || 'home') ? 'on' : ''}" title="${esc(T(key))}">${icon}<span>${H(key)}</span>${extra}</a>`;
  return `<header class="topbar"><div class="topbar-in">
    <a class="brand" href="#/"><span class="brand-mark">${I.net}</span><span class="brand-name">${H('app.name')}</span></a>
    <nav class="topnav">
      ${a('', I.home, 'nav.home')}${a('text', I.book, 'nav.text')}${a('words', I.list, 'nav.words')}${a('cards', I.cards, 'nav.cards')}${a('quiz', I.quiz, 'nav.quiz')}${a('sort', I.sort, 'nav.sort')}
      ${a('review', I.repeat, 'nav.review', due ? `<b class="badge">${due}</b>` : '')}${a('demos/' + DEMOS[0], I.play, 'nav.demos')}
      ${S.cls && S.klass && S.klass.task ? a('task', I.flag, 'cls.task', taskDone() ? '' : '<b class="badge dot"></b>') : ''}
    </nav>
    <div class="topbar-right">
      ${langSelect(L(), T('nav.language'))}
      <button class="icon-btn" data-act="settings" aria-label="${esc(T('set.title'))}" title="${esc(T('set.title'))}">${I.gear}</button>
    </div>
  </div></header>`;
}
function footerHTML() {
  return `<footer class="foot"><span>${H('foot.saved')}</span><span><a href="teacher.html">${H('foot.teacher')}</a> · <a href="https://github.com/Tomo0916/network">GitHub</a></span></footer>`;
}
const pageHead = (key, sub) => `<div class="page-head"><div><h1 class="page-title">${H(key)}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div>${rangeSelect()}</div>`;

/* ---------- home ---------- */
function homeHTML() {
  const ws = words();
  const known = ws.filter(w => S.progress.known[w.id]).length;
  const due = dueWords(S.progress).length;
  let ok = 0, all = 0;
  Object.values(S.progress.stats).forEach(s => { ok += s.ok; all += s.ok + s.ng; });
  const pct = all ? Math.round(ok / all * 100) + '%' : '—';
  const mode = (r, icon, key, sub) => `<a class="card mode" href="#/${r}"><span class="mode-icon">${icon}</span><span><b>${H(key)}</b><span class="muted">${bi(sub)}</span></span>${I.next}</a>`;
  return `<main class="wrap">
    <section class="hero">
      <div class="hero-text">
        <h1>${H('home.title')}</h1>
        <p>${bi('home.sub')}</p>
        <div class="hero-btns">
          <a class="btn btn-light" href="#/cards">${H('home.startCards')} ${I.next}</a>
          <a class="btn btn-glass" href="#/quiz">${I.quiz}${H('home.startQuiz')}</a>
          ${due ? `<a class="btn btn-glass" href="#/review">${I.repeat}${H('home.reviewDue', { n: due })}</a>` : ''}
        </div>
        <div class="hero-deco" aria-hidden="true">FF:FF:FF:FF:FF:FF</div>
      </div>
      <div class="card stats">
        ${rangeSelect()}
        <div class="stat-row">
          <div class="stat"><b>${known}<small> / ${ws.length}</small></b><span>${H('home.known')}</span></div>
          <div class="stat"><b>${due}</b><span>${H('home.toReview')}</span></div>
          <div class="stat"><b>${pct}</b><span>${H('home.accuracy')}</span></div>
        </div>
        <div class="bar"><i style="width:${ws.length ? Math.round(known / ws.length * 100) : 0}%"></i></div>
        <div class="glist">${groupsIn(S.settings.range).map(groupTag).join('')}</div>
      </div>
    </section>
    ${classCardHTML()}
    <h2 class="sec-title">${H('home.modes')}</h2>
    <section class="modes">
      ${mode('words', I.list, 'nav.words', 'mode.words')}
      ${mode('cards', I.cards, 'nav.cards', 'mode.cards')}
      ${mode('quiz', I.quiz, 'nav.quiz', 'mode.quiz')}
      ${mode('sort', I.sort, 'nav.sort', 'mode.sort')}
      ${mode('demos/' + DEMOS[0], I.play, 'nav.demos', 'mode.demos')}
    </section>
    <h2 class="sec-title">${H('home.byGroup')}</h2>
    <section class="card gprog">${groupsIn(S.settings.range).map(g => {
      const gw = ws.filter(w => w.group === g.id), gk = gw.filter(w => S.progress.known[w.id]).length;
      let o = 0, n = 0; gw.forEach(w => { const st = S.progress.stats[w.id]; if (st) { o += st.ok; n += st.ok + st.ng; } });
      return `<div class="gprog-row" style="--gc:var(--g-${g.id})">
        <span class="gtag">${H('g.' + g.id)}</span>
        <div class="bar"><i style="width:${Math.round(gk / gw.length * 100)}%"></i></div>
        <span class="count">${gk}/${gw.length}</span>
        <span class="count">${n ? Math.round(o / n * 100) + '%' : '—'}</span>
        <a class="btn btn-ghost btn-xs" href="?range=g-${g.id}#/quiz">${I.quiz}${H('nav.quiz')}</a>
      </div>`;
    }).join('')}
      <p class="muted small">${H('home.byGroupTip')}</p>
    </section>
  </main>`;
}

/* ---------- class (joined with a class code from the teacher) ----------
 * The class row says what the assignment is ({range, mode, n, seed}) and whether the
 * class is live (the teacher pressed "start"). While live, the assignment opens by itself. */
const now = () => Date.now() + S.skew;
const isLive = () => !!(S.klass && S.klass.live_until && Date.parse(S.klass.live_until) > now());
const curTask = () => (S.cls && S.klass && S.klass.task && isRange(S.klass.task.range) ? S.klass.task : null);
const taskDone = () => { const t = curTask(); return !!(t && Store.get('netw.tasks', {})[taskKey(t)]); };
function forgetClass() {
  S.cls = null; S.klass = null; Store.del('netw.class'); Store.del('netw.taskrun');
  if (stopWatch) { stopWatch(); stopWatch = null; }
}
let stopWatch = null, pulse = null, wasLive = false;
async function refreshClass() {
  if (!S.cls) return;
  try {
    const row = await BE.getClass(S.cls.id);
    if (!row) { forgetClass(); toast(T('cls.removed')); render(); return; }
    const before = JSON.stringify(S.klass);
    S.klass = row;
    if (row.name !== S.cls.name) { S.cls.name = row.name; Store.set('netw.class', S.cls); }
    const live = isLive();
    /* the teacher has just started the class: open the assignment (once) */
    if (live && !wasLive && curTask() && !taskDone() && S.route.view !== 'task') location.hash = '#/task';
    wasLive = live;
    /* a quick test has started: everyone goes to it */
    if (quickOn() && !quickDone(row.quick.id) && S.route.view !== 'quick') { location.hash = '#/quick'; return; }
    if (S.route.view === 'quick') { render(); return; }
    if (JSON.stringify(S.klass) !== before && !(S.route.view === 'task' && S.quiz && S.quiz.task && S.quiz.state === 'q' && S.quiz.task.key === taskKey(curTask()))) render();
    else if (JSON.stringify(S.klass) !== before) { const b = document.getElementById('live-banner'); if (b) b.outerHTML = liveBanner(); }
  } catch (e) { /* offline: try again later */ }
}
async function bootClass() {
  if (!BE.enabled || !S.cls) return;
  BE.serverNow().then(d => { if (d) S.skew = d.getTime() - Date.now(); }).catch(() => {});
  await refreshClass();
  if (!S.cls) return;
  BE.flushAttempts();
  if (stopWatch) stopWatch();
  BE.watchClass(S.cls.id, () => refreshClass()).then(f => { stopWatch = f; }).catch(() => {});
  clearInterval(pulse);
  pulse = setInterval(() => { if (document.visibilityState === 'visible') refreshClass(); }, 30000);
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.cls) { refreshClass(); BE.flushAttempts(); } });
setInterval(() => { if (S.cls && wasLive && !isLive()) { wasLive = false; render(); } }, 15000);   // the live time ran out

function liveBanner() {
  if (quickOn() && !quickDone(S.klass.quick.id) && S.route.view !== 'quick')
    return `<div id="live-banner" class="live-banner"><div class="wrap">${I.flag}<span>${H('cls.quickNow')}</span><a class="btn btn-light btn-sm" href="#/quick">${H('cls.quickGo')}${I.next}</a></div></div>`;
  if (!isLive() || S.route.view === 'task' || !curTask()) return '<div id="live-banner" hidden></div>';
  return `<div id="live-banner" class="live-banner"><div class="wrap">${I.live}<span>${H('cls.liveNow')}</span><a class="btn btn-light btn-sm" href="#/task">${H('cls.backToTask')}${I.next}</a></div></div>`;
}
function taskInfo(t) {
  return H('cls.taskInfo', { range: rangeLabel(t.range), mode: T('quiz.m.' + t.mode), n: t.n });
}
function classCardHTML() {
  if (!BE.enabled) return '';
  if (!S.cls) return `<a class="card cls-card join" href="#/class">${I.users}<span><b>${H('cls.join')}</b><span class="muted">${bi('cls.joinSub')}</span></span>${I.next}</a>`;
  const t = curTask(), done = Store.get('netw.tasks', {})[taskKey(t)];
  const qk = quickOn() && !quickDone(S.klass.quick.id);
  return `<section class="card cls-card">
    ${qk ? `<a class="btn btn-primary quick-go" href="#/quick">${I.flag}${H('cls.quickGo')}</a>` : ''}
    <div class="cls-head">${I.users}<div><b>${esc(S.cls.name)}</b><span class="muted small">${H('cls.you', { nick: S.cls.nick })}</span></div>
      ${isLive() ? `<span class="live-tag">${I.live}${H('cls.live')}</span>` : ''}<a class="linkbtn" href="#/class">${H('cls.details')}</a></div>
    ${t ? `<div class="cls-task"><div><b>${H('cls.task')}</b><span class="muted">${taskInfo(t)}</span></div>
      ${done ? `<span class="tag ok">${I.check}${H('cls.done', { a: done.score, b: done.n })}</span>` : ''}
      <a class="btn ${done ? 'btn-ghost' : 'btn-primary'}" href="#/task">${I.flag}${H(done ? 'cls.taskAgain' : 'cls.taskStart')}</a></div>`
      : `<p class="muted">${H('cls.noTask')}</p>`}
  </section>`;
}
const pinInput = () => `<input name="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" required>`;
function classHTML() {
  if (!BE.enabled) return `<main class="wrap narrow"><section class="card empty"><h1>${H('cls.title')}</h1><p class="muted">${H('cls.off')}</p></section></main>`;
  if (S.cls) {
    const t = curTask();
    return `<main class="wrap narrow"><div class="page-head"><div><h1 class="page-title">${H('cls.title')}</h1></div></div>
      ${classCardHTML()}
      <section class="card panel"><p class="muted small">${bi('cls.recordTip')}</p>
        <div class="row-btns left">${t ? '' : ''}<button class="btn btn-ghost" data-act="leaveClass">${H('cls.leave')}</button></div></section></main>`;
  }
  const J = S.join;
  return `<main class="wrap narrow"><div class="page-head"><div><h1 class="page-title">${H(J.resume ? 'cls.resumeTitle' : 'cls.join')}</h1><p class="muted">${bi(J.resume ? 'cls.resumeSub' : 'cls.joinSub')}</p></div></div>
    <form class="card panel form" id="join-form" autocomplete="off">
      <label class="fld"><span>${H('cls.code')}</span><input name="code" value="${esc(J.code)}" maxlength="8" autocapitalize="characters" class="mono up" required></label>
      <label class="fld"><span>${H('cls.nick')}</span><input name="nick" maxlength="30" value="${esc(J.nick || '')}" required><small class="muted">${H(J.resume ? 'cls.nickSame' : 'cls.nickTip')}</small></label>
      <label class="fld"><span>${H('cls.pin')}</span>${pinInput()}<small class="muted">${H(J.resume ? 'cls.pinSame' : 'cls.pinTip')}</small></label>
      ${J.err ? `<p class="err" role="alert">${J.err}</p>` : ''}
      <div class="row-btns left"><button class="btn btn-primary" type="submit" ${J.busy ? 'disabled' : ''}>${H(J.resume ? 'cls.resumeBtn' : 'cls.joinBtn')}${I.next}</button>
        <button class="linkbtn" type="button" data-act="joinMode">${H(J.resume ? 'cls.toJoin' : 'cls.toResume')}</button></div>
    </form></main>`;
}
function joinError(e) {
  const m = e && e.message;
  if (m === 'pin_wrong') return H('err.pin_wrong', { n: e.left ?? '?' });
  if (m === 'pin_locked') return H('err.pin_locked', { n: e.minutes ?? 10 });
  if (['class_not_found', 'class_closed', 'nickname_taken', 'bad_pin', 'anon_disabled', 'not_found', 'no_pin', 'not_ready'].includes(m)) return H('err.' + m);
  return H('err.net');
}
document.addEventListener('submit', async e => {
  if (e.target.id !== 'join-form') return;
  e.preventDefault();
  const f = new FormData(e.target), J = S.join;
  const code = String(f.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), nick = String(f.get('nick') || '').trim(), pin = String(f.get('pin') || '');
  J.code = code; J.nick = nick;
  if (!/^\d{4}$/.test(pin)) { J.err = H('err.bad_pin'); render(); return; }
  J.busy = true; J.err = ''; render();
  try {
    const row = J.resume ? await BE.resumeMember(code, nick, pin) : await BE.joinClass(code, nick, pin);
    S.cls = { id: row.id, code: row.code, name: row.name, nick };
    Store.set('netw.class', S.cls); Store.del('netw.taskrun');
    J.busy = false; J.code = '';
    if (location.search) history.replaceState(null, '', location.pathname + '#/');
    location.hash = '#/';
    await bootClass();
    toast(T('cls.welcome', { name: row.name }));
    render();
  } catch (err) { J.busy = false; J.err = joinError(err); render(); }
});

/* ---------- quick test: everyone at once, a countdown, a time limit, no hints until the end ---------- */
const quickOn = () => { const q = S.klass && S.klass.quick; return !!(q && q.id && (!q.end || Date.parse(q.end) + 5000 > now())); };
const quickDone = id => !!Store.get('netw.quicks', {})[id];
const mmss = ms => { const t = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
function quickState() {
  const qt = S.qt;
  if (!qt) return 'none';
  if (qt.ans.length >= qt.list.length || quickDone(qt.id)) return 'done';
  const q = S.klass && S.klass.quick;
  if (!q || q.id !== qt.id) return 'done';                       // the teacher ended it
  if (q.end && now() > Date.parse(q.end)) return 'done';            // time is up
  return now() < Date.parse(q.at) ? 'wait' : 'q';
}
function finishQuick() {
  const qt = S.qt;
  if (!qt || quickDone(qt.id)) return;
  const all = Store.get('netw.quicks', {});
  all[qt.id] = { score: qt.ans.filter(a => a.ok).length, n: qt.list.length, at: Date.now() };
  const keys = Object.keys(all); if (keys.length > 40) delete all[keys[0]];
  Store.set('netw.quicks', all); Store.del('netw.qrun');
}
function quickHTML() {
  if (!S.cls) return taskHTMLorStart();
  const q = S.klass && S.klass.quick;
  if (q && quickOn() && (!S.qt || S.qt.id !== q.id)) {
    const run = Store.get('netw.qrun', null);
    S.qt = { id: q.id, list: taskQuiz({ range: q.range, mode: q.mode, n: q.n, seed: q.id }, seededRandom), ans: run && run.id === q.id ? run.ans : [] };
  }
  const st = quickState(), qt = S.qt;
  if (st === 'none') return `<main class="wrap narrow"><section class="card empty"><div class="empty-icon">${I.flag}</div><h1>${H('cls.quick')}</h1><p class="muted">${H('cls.noQuick')}</p><div class="row-btns"><a class="btn btn-ghost" href="#/">${H('nav.home')}</a></div></section></main>`;
  if (st === 'wait') return `<main class="wrap narrow"><section class="card empty quick-wait"><h1>${H('cls.quick')}</h1>
    <p class="muted">${H('cls.taskInfo', { range: rangeLabel(q.range), mode: T('quiz.m.' + q.mode), n: q.n })}${q.end ? ' · ' + H('cls.quickLimit', { t: mmss(Date.parse(q.end) - Date.parse(q.at)) }) : ''}</p>
    <div class="countdown" id="qt-count">${Math.max(0, Math.ceil((Date.parse(q.at) - now()) / 1000))}</div><p>${H('cls.quickSoon')}</p></section></main>`;
  if (st === 'done') {
    finishQuick();
    const score = qt.ans.filter(a => a.ok).length;
    return `<main class="wrap narrow"><section class="card empty"><div class="empty-icon">${I.flag}</div><h1>${H('cls.quickEnd')}</h1>
      <p class="big-score">${score} / ${qt.list.length}</p>
      <ol class="qt-review">${qt.list.map((x, i) => { const a = qt.ans[i], w = WORD_BY_ID[x.id];
        const right = x.type === 'fact' ? choiceHTML(FACT_BY_ID[x.fact].opts[0], T) : termHTML(w);
        return `<li class="${a ? (a.ok ? 'ok' : 'ng') : 'skip'}"><span class="mk">${a ? (a.ok ? '○' : '×') : '–'}</span><div><span class="muted small">${H('quiz.' + x.type)}</span><div>${a && a.ok ? right : th('quiz.answerIs', L(), { t: right })}</div></div></li>`; }).join('')}</ol>
      <div class="row-btns"><a class="btn btn-ghost" href="#/">${H('nav.home')}</a></div></section></main>`;
  }
  const x = qt.list[qt.ans.length], w = WORD_BY_ID[x.id];
  return `<main class="wrap narrow">
    <div class="qhead"><h1 class="page-title">${H('cls.quick')}</h1><div class="qhead-r">${q.end ? `<span class="qt-timer" id="qt-timer">${I.repeat}${mmss(Date.parse(q.end) - now())}</span>` : ''}<span class="count">${qt.ans.length + 1} / ${qt.list.length}</span></div></div>
    <div class="bar"><i style="width:${qt.ans.length / qt.list.length * 100}%"></i></div>
    <p class="prompt">${H('quiz.' + x.type)} ${x.type === 's2t' || x.type === 'fact' ? '' : groupTag(GROUP_BY_ID[w.group])}</p>
    ${qBox(x)}
    <div class="opts">${x.opts.map((v, i) => `<button class="opt" data-act="qtAnswer" data-id="${v}"><span class="k">${i + 1}</span>${qOpt(x, v, false)}</button>`).join('')}</div>
  </main>`;
}
let qtSpoken = null;
function afterQuickRender() {
  const qt = S.qt;
  if (!qt || quickState() !== 'q') return;
  const x = qt.list[qt.ans.length];
  if (x && x.type === 'listen' && qtSpoken !== qt.id + ':' + qt.ans.length) { qtSpoken = qt.id + ':' + qt.ans.length; setTimeout(() => speak(WORD_BY_ID[x.id]), 250); }
}
function qtAnswer(v) {
  const qt = S.qt;
  if (!qt || quickState() !== 'q') return;
  const i = qt.ans.length, x = qt.list[i], ok = v === x.answer;
  qt.ans.push({ v, ok });
  recordAnswer(S.progress, x.id, ok, false); save();
  BE.logAttempt({ class_id: S.cls.id, word: x.id, qid: qidOf(x), kind: 'quick', seed: qt.id, pos: i, choice: String(v).slice(0, 40), ok });
  Store.set('netw.qrun', { id: qt.id, ans: qt.ans });
  render(); window.scrollTo(0, 0);
}
/* the countdown and the time limit tick here */
let lastQS = null;
setInterval(() => {
  if (S.route.view !== 'quick' || !S.qt) return;
  const st = quickState();
  if (st !== lastQS) { lastQS = st; render(); return; }
  const q = S.klass && S.klass.quick;
  const c = document.getElementById('qt-count'); if (c && q) c.textContent = Math.max(0, Math.ceil((Date.parse(q.at) - now()) / 1000));
  const t = document.getElementById('qt-timer'); if (t && q && q.end) t.lastChild.textContent = mmss(Date.parse(q.end) - now());
}, 250);

/* the assignment: the same questions for everyone (seeded), resumed after a reload */
function saveTaskRun() {
  const Q = S.quiz;
  if (!Q || !Q.task) return;
  if (Q.state === 'done') {
    const done = Store.get('netw.tasks', {});
    done[Q.task.key] = { score: Q.score, n: Q.list.length, at: Date.now() };
    Store.set('netw.tasks', done); Store.del('netw.taskrun');
    return;
  }
  Store.set('netw.taskrun', { key: Q.task.key, i: Q.ans ? Q.i + 1 : Q.i, score: Q.score, missed: Q.missed });
}
function taskHTMLorStart() {
  const t = curTask();
  if (!S.cls || !t) {
    return `<main class="wrap narrow"><section class="card empty"><div class="empty-icon">${I.flag}</div><h1>${H('cls.task')}</h1>
      <p class="muted">${H(S.cls ? (S.klass ? 'cls.noTask' : 'cls.loading') : 'cls.joinFirst')}</p><div class="row-btns"><a class="btn btn-ghost" href="#/${S.cls ? '' : 'class'}">${H(S.cls ? 'nav.home' : 'cls.join')}</a></div></section></main>`;
  }
  const key = taskKey(t);
  if (!S.quiz || !S.quiz.task || S.quiz.task.key !== key) {
    const list = taskQuiz(t, seededRandom);
    S.quiz = { task: { key, seed: t.seed }, mode: t.mode, list, i: 0, score: 0, ans: null, missed: [], state: 'q', spoken: -1 };
    const run = Store.get('netw.taskrun', null);
    if (run && run.key === key && run.i > 0) {
      Object.assign(S.quiz, { i: Math.min(run.i, list.length - 1), score: run.score || 0, missed: run.missed || [] });
      if (run.i >= list.length) S.quiz.state = 'done';
    }
    if (!list.length) return `<main class="wrap narrow"><section class="card empty"><h1>${H('cls.task')}</h1><p class="muted">${H('cls.noTask')}</p></section></main>`;
  }
  return '';
}

/* ---------- word list ---------- */
function wordCard(w) {
  return `<article class="card wcard" style="--gc:var(--g-${w.group})">
    <div class="wcard-head"><div class="term-row"><div>${termHTML(w)}${enName(w)}</div>${speakBtn(w)}</div>${S.progress.known[w.id] ? `<span class="tag ok">${I.check}${H('cards.known')}</span>` : ''}</div>
    <p class="desc">${bi(`w.${w.id}.desc`)}</p>
    <p class="tip"><b>${H('words.tip')}</b>${bi(`w.${w.id}.tip`)}</p>
    ${w.demo ? `<a class="linkbtn" href="#/demos/${w.demo}">${I.play} ${H('words.seeDemo')}</a>` : ''}
  </article>`;
}
function matches(w, q) {
  if (!q) return true;
  const hay = [w.term, w.yomi, w.en, T(`w.${w.id}.desc`), T(`w.${w.id}.tip`)].join(' ').toLowerCase();
  return hay.includes(q.toLowerCase());
}
/** the words shown, split into sections in the chosen order: lesson (by chapter) · group · kana */
function wordSections(ws) {
  const order = S.settings.wordOrder || 'lesson';
  if (order === 'kana') {
    const key = w => (w.yomi || w.term).replace(/[（(].*$/, '');
    return [{ title: '', words: [...ws].sort((a, b) => key(a).localeCompare(key(b), 'ja')) }];
  }
  if (order === 'group') return groupsIn(S.settings.range).map(g => ({ g, title: `${H('g.' + g.id)} <span class="layer">${H('layer.' + g.layer)}</span>`, words: ws.filter(w => w.group === g.id) }));
  return CHAPTERS.map(c => ({ ch: c.n, title: `<span class="ch-no">${c.n}</span>${H('ch.' + c.n)}`,
    words: ws.filter(w => w.lesson >= c.from && w.lesson <= c.to).sort((a, b) => a.lesson - b.lesson) }));
}
function wordRow(w, i) {
  const k = !!S.progress.known[w.id];
  return `<tr style="--gc:var(--g-${w.group})">
    <td class="wt-no">${i}</td>
    <td class="wt-term"><div class="term-row">${termHTML(w)}${speakBtn(w)}</div>${enName(w)}</td>
    <td class="wt-desc"><button class="wt-open" data-act="termPop" data-id="${w.id}">${bi(`w.${w.id}.desc`)}</button></td>
    <td class="wt-lsn">${hasPage(w.lesson) ? `<a href="#/lesson/${w.lesson}">${H('range.lesson', { n: w.lesson })}</a>` : `<span>${H('range.lesson', { n: w.lesson })}</span>`}</td>
    <td class="wt-known"><button class="wt-chk ${k ? 'on' : ''}" data-act="toggleKnown" data-id="${w.id}" aria-pressed="${k}" title="${esc(T('cards.known'))}">${I.check}</button></td>
  </tr>`;
}
function wordListHTML() {
  const ws = words().filter(w => matches(w, S.query));
  if (!ws.length) return `<p class="muted empty-line">${H('words.none')}</p>`;
  const secs = wordSections(ws).filter(x => x.words.length);
  if (S.settings.wordView === 'cards') return secs.map(x => `<section class="grp" style="--gc:${x.g ? `var(--g-${x.g.id})` : 'var(--accent)'}">${x.title ? `<h2>${x.title}</h2>` : ''}
      <div class="wgrid">${x.words.map(wordCard).join('')}</div></section>`).join('');
  let n = 0;
  return `<table class="wtable">
    <thead><tr><th class="wt-no">#</th><th>${H('words.colTerm')}</th><th>${H('words.colMeaning')}</th><th class="wt-lsn">${H('words.colLesson')}</th><th class="wt-known">${I.check}</th></tr></thead>
    ${secs.map(x => `<tbody>${x.title ? `<tr class="wt-sec" style="--gc:${x.g ? `var(--g-${x.g.id})` : 'var(--accent)'}"><th colspan="5">${x.title} <span class="muted">(${x.words.length})</span></th></tr>` : ''}
      ${x.words.map(w => wordRow(w, ++n)).join('')}</tbody>`).join('')}
  </table>`;
}
function wordsHTML() {
  const seg = (k, v, key, def) => `<label class="seg-i"><input type="radio" name="${k}" data-wset="${k}" value="${v}" ${(S.settings[k] || def) === v ? 'checked' : ''}><span>${H(key)}</span></label>`;
  return `<main class="wrap">${pageHead('nav.words')}
    <div class="wl-ctl">
      <label class="search">${I.search}<input id="search" type="search" value="${esc(S.query)}" placeholder="${esc(T('words.search'))}" aria-label="${esc(T('words.search'))}"></label>
      <div class="seg small-seg" role="group" aria-label="${esc(T('words.view'))}">${seg('wordView', 'table', 'words.viewTable', 'table')}${seg('wordView', 'cards', 'words.viewCards', 'table')}</div>
      <div class="seg small-seg" role="group" aria-label="${esc(T('words.order'))}">${seg('wordOrder', 'lesson', 'words.byLesson', 'lesson')}${seg('wordOrder', 'group', 'words.byGroup', 'lesson')}${seg('wordOrder', 'kana', 'words.byKana', 'lesson')}</div>
      <button class="btn btn-ghost btn-sm" data-act="printWords">${I.print}${H('words.print')}</button>
    </div>
    <p class="wl-print-head">${H('app.name')} — ${esc(rangeLabel(S.settings.range))}</p>
    <div id="wlist">${wordListHTML()}</div></main>`;
}

/* ---------- flashcards ---------- */
function deck() { return words().filter(w => !S.cards.onlyNew || !S.progress.known[w.id]); }
function cardsHTML() {
  const C = S.cards, d = deck();
  if (C.i >= d.length) C.i = Math.max(0, d.length - 1);
  const filt = `<div class="seg small-seg">
    <label class="seg-i"><input type="radio" name="cfilter" data-act="cfilter" value="all" ${!C.onlyNew ? 'checked' : ''}><span>${H('cards.all')}</span></label>
    <label class="seg-i"><input type="radio" name="cfilter" data-act="cfilter" value="new" ${C.onlyNew ? 'checked' : ''}><span>${H('cards.onlyNew')}</span></label></div>`;
  const ws = words(), nk = ws.filter(w => S.progress.known[w.id]).length;
  if (!d.length) {
    return `<main class="wrap narrow">${pageHead('nav.cards')}<section class="card empty">
      <div class="empty-icon">${I.check}</div><h1>${H('cards.allKnown')}</h1>
      <div class="row-btns">${filt}<button class="btn btn-ghost" data-act="cardsReset">${I.reset}${H('cards.reset')}</button></div></section></main>`;
  }
  const w = d[C.i], k = !!S.progress.known[w.id];
  return `<main class="wrap narrow">${pageHead('nav.cards')}
    <div class="cardstage">
      <div class="cardbar">${filt}<span class="count">${C.i + 1} / ${d.length}</span></div>
      <div class="flip ${C.flipped ? 'is-back' : ''}" id="flip" role="button" tabindex="0" data-act="flip" aria-label="${esc(T('cards.flip'))}" style="--gc:var(--g-${w.group})">
        <div class="inner">
          <div class="face front">${groupTag(GROUP_BY_ID[w.group])}<div class="big-term">${termHTML(w)}</div>${enName(w)}${speakBtn(w)}${k ? `<span class="tag ok">${I.check}${H('cards.known')}</span>` : ''}<span class="hint">${H('cards.flip')}</span></div>
          <div class="face back">${groupTag(GROUP_BY_ID[w.group])}<div class="term-row"><div class="mid-term">${termHTML(w)}</div>${speakBtn(w)}</div><p class="desc">${bi(`w.${w.id}.desc`)}</p><p class="tip"><b>${H('words.tip')}</b>${bi(`w.${w.id}.tip`)}</p></div>
        </div>
      </div>
      <div class="cardbar">
        <button class="btn btn-ghost" data-act="cardPrev" ${C.i === 0 ? 'disabled' : ''}>${I.prev}${H('btn.prev')}</button>
        <button class="btn ${k ? 'btn-ok' : 'btn-ghost'}" data-act="cardKnow" aria-pressed="${k}">${I.check}${H('cards.know')}</button>
        <button class="btn btn-primary" data-act="cardNext" ${C.i >= d.length - 1 ? 'disabled' : ''}>${H('btn.next')}${I.next}</button>
      </div>
      <p class="muted center small">${H('cards.knownCount', { a: nk, b: ws.length })}</p>
    </div></main>`;
}

/* ---------- quiz and review ----------
 * modes: mix · scene · fact · listen (see js/quiz.js). Words the student often gets wrong come first. */
const QUIZ_MODES = [['mix', 'shuffle'], ['scene', 'scene'], ['fact', 'hash'], ['listen', 'sound']];
function wordWeight(id) {
  const st = S.progress.stats[id], r = S.progress.review[id];
  return (r ? 0.5 : 0) + (st && st.ok + st.ng ? st.ng / (st.ok + st.ng) * 0.5 : 0);
}
const quizOpts = () => ({ listen: canSpeak, weight: wordWeight });
function startQuiz(review, mode = 'mix') {
  const ids = review ? dueWords(S.progress) : words().map(w => w.id);
  const n = review ? 10 : Number(S.settings.quizN || 10);
  S.quiz = { review, mode, list: makeQuiz(ids, n, review ? 'mix' : mode, quizOpts()), i: 0, score: 0, ans: null, missed: [], state: 'q' };
  S.quiz.spoken = -1;
}
function quizStartHTML() {
  const ids = words().map(w => w.id);
  const N = Number(S.settings.quizN || 10);
  const card = ([mode, icon]) => {
    const size = poolSize(ids, mode, quizOpts());
    return `<button class="card qmode" data-act="quizStart" data-mode="${mode}" ${size ? '' : 'disabled'}>
      <b>${I[icon]}${H('quiz.m.' + mode)}<span class="qcount">${size}</span></b><span class="muted">${bi('quiz.m.' + mode + 'Sub')}</span></button>`;
  };
  const radio = v => `<label class="seg-i"><input type="radio" name="quizN" data-act="quizN" value="${v}" ${N === v ? 'checked' : ''}><span>${v}</span></label>`;
  return `<main class="wrap narrow">${pageHead('quiz.title')}
    <div class="qcount-row"><span>${H('quiz.count')}</span><div class="seg small-seg">${[10, 20, 40].map(radio).join('')}</div>${autoNextBtn()}</div>
    <div class="qmodes">${QUIZ_MODES.map(card).join('')}</div>
    <p class="muted small">${H('quiz.keys')}</p></main>`;
}
/* auto-next: after an answer the next question comes by itself (longer wait after a wrong answer, to read the explanation) */
const AUTO_MS = { ok: 1800, ng: 5000 };
let autoTimer = null;
const clearAuto = () => { clearTimeout(autoTimer); autoTimer = null; };
function autoNextBtn() {
  const on = !!S.settings.autoNext;
  return `<button class="autonext ${on ? 'on' : ''}" data-act="autoNext" aria-pressed="${on}"><span class="sw" aria-hidden="true"><i></i></span>${H('quiz.autoNext')}</button>`;
}
function scheduleAuto() {
  clearAuto();
  const Q = S.quiz;
  if (!S.settings.autoNext || !Q || Q.state !== 'q' || !Q.ans) return;
  const ms = AUTO_MS[Q.ans === Q.list[Q.i].answer ? 'ok' : 'ng'], i = Q.i;
  const nb = document.getElementById('next-btn');
  if (nb) { nb.style.setProperty('--auto', ms + 'ms'); nb.classList.add('auto-go'); }
  autoTimer = setTimeout(() => {
    autoTimer = null;
    if (S.quiz === Q && Q.i === i && Q.ans && ['quiz', 'review', 'task'].includes(S.route.view)) actions.quizNext();
  }, ms);
}
/* one question: the box above the options, and the text of one option (shown = the answer is known) */
function qBox(q) {
  const w = WORD_BY_ID[q.id];
  return {
    s2t: () => `<div class="qbox scene">${I.scene}<p class="desc">${bi('s.' + q.scene)}</p></div>`,
    fact: () => `<div class="qbox scene">${I.hash}<p class="desc">${bi('f.' + q.fact)}</p></div>`,
    d2t: () => `<div class="qbox"><p class="desc">${bi(`w.${w.id}.desc`)}</p></div>`,
    tip2t: () => `<div class="qbox scene">${I.bulb}<p class="desc">${bi(`w.${w.id}.tip`)}</p></div>`,
    e2t: () => `<div class="qbox center"><div class="big-en" lang="en">${esc(w.en)}</div></div>`,
    listen: () => canSpeak ? `<div class="qbox center"><button class="listen-big" data-act="speak" data-id="${w.id}" aria-label="${esc(T('btn.listen'))}">${I.sound}</button><p class="muted small">${H('quiz.tapListen')}</p></div>`
      : `<div class="qbox center"><div class="big-en alt" lang="en">${esc(w.en)}</div></div>`,   /* a class assignment on a device that cannot speak */
    t2d: () => `<div class="qbox center"><div class="big-term">${termHTML(w)}</div></div>`
  }[q.type]();
}
function qOpt(q, v, shown) {
  const f = q.fact && FACT_BY_ID[q.fact];
  if (q.type === 'fact') return `<span class="fact-opt">${choiceHTML(f.opts[+v], T)}</span>`;
    const o = WORD_BY_ID[v];
    if (q.type === 't2d') return `<span>${bi(`w.${v}.desc`)}</span>`;
    if (q.type === 'listen' && !shown) return `<span>${plainTerm(o)}</span>`;
    if (q.type === 'e2t') return `<span>${termHTML(o)}</span>`;
  return `<span>${termHTML(o)}${enName(o)}</span>`;
}
const plainTerm = w => `<span class="term" lang="ja">${esc(w.term)}</span>`;
function quizHTML() {
  const review = S.route.view === 'review', task = S.route.view === 'task';
  if (task) { const t = taskHTMLorStart(); if (t) return t; }
  else if (S.quiz && S.quiz.task) S.quiz = null;
  if (review && !S.quiz) startQuiz(true);
  const Q = S.quiz;
  if (review && !Q.list.length) {
    const waiting = Object.keys(S.progress.review).length;
    return `<main class="wrap narrow"><section class="card empty">
      <div class="empty-icon">${I.check}</div><h1>${H('review.none')}</h1><p class="muted">${H('review.noneSub')}</p>
      ${waiting ? `<p class="muted">${H('review.waiting', { n: waiting })}</p>` : ''}
      <div class="row-btns"><a class="btn btn-primary" href="#/quiz">${I.quiz}${H('home.startQuiz')}</a><a class="btn btn-ghost" href="#/">${H('nav.home')}</a></div></section></main>`;
  }
  if (!task && (!Q || Q.review !== review || Q.state === 'start')) return quizStartHTML();
  if (Q.state === 'done') {
    const n = Q.list.length, pct = Q.score / n, missed = [...new Set(Q.missed)];
    return `<main class="wrap narrow"><section class="card empty">
      <div class="empty-icon">${pct === 1 ? I.fire : I.check}</div>
      <h1>${H(task ? 'cls.taskFinished' : review ? 'review.finished' : pct === 1 ? 'quiz.perfect' : pct >= .7 ? 'quiz.good' : 'quiz.tryAgain')}</h1>
      <p class="big-score">${Q.score} / ${n}</p>
      ${missed.length ? `<div class="missed"><h2>${H('quiz.missed')}</h2><p class="muted small">${H('quiz.toReview')}</p>
        <ul>${missed.map(id => { const w = WORD_BY_ID[id]; return `<li><div class="term-row">${termHTML(w)}${speakBtn(w)}</div><div>${bi(`w.${id}.desc`)}</div></li>`; }).join('')}</ul></div>` : ''}
      <div class="row-btns">${task ? `<button class="btn btn-primary" data-act="taskRestart">${I.reset}${H('btn.again')}</button><a class="btn btn-ghost" href="#/">${H('nav.home')}</a>`
        : `<button class="btn btn-primary" data-act="quizStart" data-mode="${Q.mode || 'mix'}">${I.reset}${H('btn.again')}</button><button class="btn btn-ghost" data-act="quizMenu">${H('quiz.other')}</button>`}</div></section></main>`;
  }
  const q = Q.list[Q.i], w = WORD_BY_ID[q.id], a = Q.ans, f = q.fact && FACT_BY_ID[q.fact];
  const box = qBox(q), optBody = v => qOpt(q, v, !!a);
  const opt = (v, i) => {
    const cls = a ? (v === q.answer ? 'ok' : v === a ? 'ng' : '') : '';
    return `<button class="opt ${cls}" data-act="answer" data-id="${v}" ${a ? 'disabled' : ''}><span class="k">${i + 1}</span>${optBody(v)}</button>`;
  };
  const ok = a === q.answer;
  const right = q.type === 'fact' ? choiceHTML(f.opts[0], T) : esc(w.term);
  return `<main class="wrap narrow">
    <div class="qhead"><h1 class="page-title">${H(task ? 'cls.task' : review ? 'review.title' : 'quiz.title')}</h1><div class="qhead-r">${autoNextBtn()}<span class="count">${Q.i + 1} / ${Q.list.length}</span></div></div>
    <div class="bar"><i style="width:${(Q.i + (a ? 1 : 0)) / Q.list.length * 100}%"></i></div>
    <p class="prompt">${H('quiz.' + q.type)} ${q.type === 's2t' || q.type === 'fact' ? '' : groupTag(GROUP_BY_ID[w.group])}</p>
    ${box}
    <div class="opts">${q.opts.map(opt).join('')}</div>
    ${a ? `<div class="fb ${ok ? 'ok' : 'ng'}" role="status">
      <p class="verdict">${ok ? I.check + H('quiz.ok') : I.x + H('quiz.ng') + ' ' + th('quiz.answerIs', L(), { t: right })}</p>
      <div class="fb-term">${termHTML(w)}${enName(w)}${speakBtn(w)}</div>
      ${q.type === 't2d' || q.type === 'd2t' && ok ? '' : `<p>${bi(`w.${w.id}.desc`)}</p>`}
      ${q.type === 'tip2t' ? '' : `<p class="tip"><b>${H('words.tip')}</b>${bi(`w.${w.id}.tip`)}</p>`}
      ${w.demo ? `<a class="linkbtn" href="#/demos/${w.demo}">${I.play} ${H('words.seeDemo')}</a>` : ''}
      <button class="btn btn-primary" data-act="quizNext" id="next-btn">${H(Q.i < Q.list.length - 1 ? 'btn.next' : 'btn.results')}${I.next}</button></div>` : ''}
  </main>`;
}
/* a listening question speaks once when it appears */
function afterQuizRender() {
  const Q = S.quiz;
  if (!Q || Q.state !== 'q' || !Q.list.length) return;
  const q = Q.list[Q.i];
  if (q.type === 'listen' && !Q.ans && Q.spoken !== Q.i) { Q.spoken = Q.i; setTimeout(() => speak(WORD_BY_ID[q.id]), 250); }
}
function answer(id) {
  const Q = S.quiz;
  if (!Q || Q.ans) return;
  const q = Q.list[Q.i], ok = id === q.answer;
  Q.ans = id;
  if (ok) Q.score++; else Q.missed.push(q.id);
  recordAnswer(S.progress, q.id, ok, Q.review); save();
  if (S.cls) {
    BE.logAttempt({ class_id: S.cls.id, word: q.id, qid: qidOf(q), kind: Q.task ? 'task' : Q.review ? 'review' : 'quiz', seed: Q.task ? String(Q.task.seed).slice(0, 40) : null, pos: Q.task ? Q.i : null, choice: String(id).slice(0, 40), ok });
    if (Q.task) saveTaskRun();
  }
  render();
  const nb = document.getElementById('next-btn'); if (nb) nb.focus({ preventScroll: true });
  scheduleAuto();
}

/* ---------- sorting game ---------- */
function sortHTML() {
  const R = S.sort, gs = groupsIn(S.settings.range);
  if (!R || R.state === 'start') {
    return `<main class="wrap narrow">${pageHead('sort.title')}<section class="card panel">
      <p>${bi('sort.sub')}</p><div class="glist">${gs.map(groupTag).join('')}</div>
      <div class="row-btns left"><button class="btn btn-primary" data-act="sortStart">${H('btn.start')}${I.next}</button></div></section></main>`;
  }
  if (R.state === 'done') {
    return `<main class="wrap narrow"><section class="card empty"><div class="empty-icon">${I.check}</div>
      <h1>${H(R.score === R.list.length ? 'quiz.perfect' : 'quiz.good')}</h1><p class="big-score">${R.score} / ${R.list.length}</p>
      <div class="row-btns"><button class="btn btn-primary" data-act="sortStart">${I.reset}${H('btn.again')}</button><a class="btn btn-ghost" href="#/">${H('nav.home')}</a></div></section></main>`;
  }
  const w = WORD_BY_ID[R.list[R.i]], a = R.ans;
  return `<main class="wrap narrow">
    <div class="qhead"><h1 class="page-title">${H('sort.title')}</h1><span class="count">${R.i + 1} / ${R.list.length}</span></div>
    <div class="bar"><i style="width:${(R.i + (a ? 1 : 0)) / R.list.length * 100}%"></i></div>
    <p class="prompt">${H('sort.q')}</p>
    <div class="qbox center"><div class="big-term">${termHTML(w)}</div>${enName(w)}</div>
    <div class="gbtns">${gs.map(g => {
      const c = a ? (g.id === w.group ? 'ok' : g.id === a ? 'ng' : '') : '';
      return `<button class="gbtn ${c}" style="--gc:var(--g-${g.id})" data-act="sortAnswer" data-g="${g.id}" ${a ? 'disabled' : ''}>${bi('g.' + g.id)}<small>${H('layer.' + g.layer)}</small></button>`;
    }).join('')}</div>
    ${a ? `<div class="fb ${a === w.group ? 'ok' : 'ng'}" role="status"><p class="verdict">${a === w.group ? I.check + H('quiz.ok') : I.x + H('quiz.ng')} — ${H('g.' + w.group)}</p>
      <p>${bi(`w.${w.id}.desc`)}</p>
      <button class="btn btn-primary" data-act="sortNext" id="next-btn">${H(R.i < R.list.length - 1 ? 'btn.next' : 'btn.results')}${I.next}</button></div>` : ''}
  </main>`;
}

/* ---------- animations ---------- */
function demosHTML() {
  const id = S.route.id;
  return `<main class="wrap"><div class="page-head"><div><h1 class="page-title">${H('demos.title')}</h1><p class="muted">${bi('demos.sub')}</p></div></div>
    <div class="demo-bar"><nav class="demo-tabs">${DEMOS.map(d => `<a href="#/demos/${d}" class="${d === id ? 'on' : ''}">${H('demo.' + d)}</a>`).join('')}</nav>
      <div class="speedbar"><span>${H('dm.speed')}</span><div class="seg small-seg">${['0.5', '1', '2'].map(v => `<label class="seg-i"><input type="radio" name="dspeed" data-act="demoSpeed" value="${v}" ${String(S.settings.demoSpeed || 1) === v ? 'checked' : ''}><span>×${v}</span></label>`).join('')}</div></div></div>
    <div id="demo-root"><div class="loading"><div class="spinner"></div></div></div></main>`;
}
async function mountDemo(id) {
  const el = document.getElementById('demo-root');
  if (el) mountDemoIn(el, id, {}, () => S.route.id === id);
}
/** start animation `id` inside el (also used on the lesson pages) */
async function mountDemoIn(el, id, opts, still = () => true) {
  const [mod, kit] = await Promise.all([import(`./demos/${id}.js`).then(m => m.default), import('./demos/kit.js')]);
  kit.setSpeed(S.settings.demoSpeed || 1);
  if (!el.isConnected || !still()) return;
  mod.mount(el, {
    T, H: (k, v) => bi(k, v),
    term: wid => WORD_BY_ID[wid].term,
    termHTML: wid => termHTML(WORD_BY_ID[wid])
  }, opts);
}

/* ---------- textbook: contents and lesson pages ---------- */
/** [[id:text]] in a lesson text → a button that opens the term */
const linkTerms = html => html.replace(/\[\[([a-z0-9]+):(.*?)\]\]/g, (m, id, txt) => WORD_BY_ID[id]
  ? `<button class="tterm" data-act="termPop" data-id="${id}" style="--gc:var(--g-${WORD_BY_ID[id].group})">${txt}</button>` : txt);
const lessonWords = n => WORDS.filter(w => w.lesson === n);
function textHTML() {
  return `<main class="wrap narrow"><div class="page-head"><div><h1 class="page-title">${H('lsn.title')}</h1><p class="muted">${bi('lsn.sub')}</p></div></div>
    ${CHAPTERS.map(c => `<section class="card toc"><h2 class="toc-ch"><span class="ch-no">${c.n}</span>${H('ch.' + c.n)}</h2><ol class="toc-list">
      ${Array.from({ length: c.to - c.from + 1 }, (_, i) => c.from + i).map(n => {
        const ws = lessonWords(n), page = hasPage(n);
        const inner = `<span class="toc-n">${H('range.lesson', { n })}</span><span class="toc-t">${H('lesson.' + n)}</span>`;
        return `<li class="${page ? 'has-page' : ''}">${page ? `<a href="#/lesson/${n}">${inner}<span class="tag accent">${I.book}${H('lsn.read')}</span></a>` : `<div>${inner}${ws.length ? `<button class="linkbtn" data-act="lessonQuiz" data-n="${n}">${I.quiz}${H('lsn.quizShort', { n: ws.length })}</button>` : ''}</div>`}</li>`;
      }).join('')}</ol></section>`).join('')}
  </main>`;
}
function lessonHTML() {
  const n = S.route.n, blocks = LESSON_PAGES[n], k = key => `ls.${n}.${key}`;
  const ch = CHAPTERS.find(c => n >= c.from && n <= c.to);
  const ws = lessonWords(n);
  const refs = [...new Set(blocks.flatMap(b => ['lead', 'p'].filter(f => b[f]).flatMap(f => termRefs(t(k(b[f]), L())))))].filter(id => WORD_BY_ID[id] && !ws.some(w => w.id === id));
  let fig = 0;
  const body = blocks.map(b => {
    if (b.lead) return `<p class="lsn-lead">${linkTerms(bi(k(b.lead)))}</p>`;
    if (b.h) return `<h2 class="lsn-h">${bi(k(b.h))}</h2>`;
    if (b.p) return `<p class="lsn-p">${linkTerms(bi(k(b.p)))}</p>`;
    if (b.fig) { fig++; return `<figure class="lsn-fig card">${FIGURES[b.fig](T)}<figcaption><b>${H('lsn.fig', { n: fig })}</b> ${bi(k(b.cap))}</figcaption></figure>`; }
    if (b.demo) return `<section class="lsn-demo"><h3 class="lsn-demo-h">${I.play}${H('lsn.try')} — ${H('demo.' + b.demo)}</h3><div data-demo="${b.demo}" data-opts='${esc(JSON.stringify(b.opts || {}))}'><div class="loading"><div class="spinner"></div></div></div></section>`;
    if (b.points) return `<section class="lsn-points"><h2>${I.bulb}${H('lsn.points')}</h2><ol>${Array.from({ length: b.points }, (_, i) => `<li>${linkTerms(bi(k('pt' + (i + 1))))}</li>`).join('')}</ol></section>`;
    return '';
  }).join('');
  const tcard = w => `<button class="lsn-term card" data-act="termPop" data-id="${w.id}" style="--gc:var(--g-${w.group})"><span class="term-row"><span>${termHTML(w)}${enName(w)}</span></span><span class="lsn-term-d">${bi(`w.${w.id}.desc`)}</span></button>`;
  return `<main class="wrap lsn">
    <nav class="crumb"><a href="#/text">${H('lsn.title')}</a> › <span>${H('ch.' + ch.n)}</span></nav>
    <header class="lsn-head"><span class="lsn-no">${H('range.lesson', { n })}</span><h1>${bi('lesson.' + n)}</h1></header>
    <p class="lsn-tip muted">${I.bulb}${H('lsn.tapTip')}</p>
    ${body}
    <section class="lsn-terms"><h2>${H('lsn.terms')}</h2><div class="lsn-tgrid">${ws.map(tcard).join('')}</div>
      ${refs.length ? `<h3>${H('lsn.related')}</h3><div class="lsn-tgrid">${refs.map(id => tcard(WORD_BY_ID[id])).join('')}</div>` : ''}</section>
    <div class="lsn-cta card"><div><b>${H('lsn.quizTitle')}</b><p class="muted">${bi('lsn.quizSub', { n: ws.length })}</p></div>
      <button class="btn btn-primary" data-act="lessonQuiz" data-n="${n}">${I.quiz}${H('lsn.quizGo')}${I.next}</button></div>
    <nav class="lsn-nav"><a class="btn btn-ghost" href="#/text">${I.list}${H('lsn.toc')}</a></nav>
  </main>`;
}
function termPop(id) {
  const w = WORD_BY_ID[id];
  modal(`<div class="modal-head"><h2 class="term-row">${termHTML(w)}${speakBtn(w)}</h2><button class="icon-btn" data-act="closeModal" aria-label="${esc(T('btn.close'))}">${I.x}</button></div>
    <div class="modal-body">${enName(w)} ${groupTag(GROUP_BY_ID[w.group])}
      <p class="desc">${bi(`w.${w.id}.desc`)}</p><p class="tip"><b>${H('words.tip')}</b>${bi(`w.${w.id}.tip`)}</p>
      ${w.lesson && hasPage(w.lesson) && !(S.route.view === 'lesson' && S.route.n === w.lesson) ? `<p><a href="#/lesson/${w.lesson}" data-act="goLesson" data-n="${w.lesson}">${I.book}${H('range.lesson', { n: w.lesson })} ${H('lesson.' + w.lesson)}</a></p>` : ''}
    </div>`);
}

/* =========================================================
 * EVENTS
 * ========================================================= */
const actions = {
  settings() { openSettings(); },
  closeModal,
  speak(el) { speak(WORD_BY_ID[el.dataset.id]); },
  flip() { S.cards.flipped = !S.cards.flipped; const f = document.getElementById('flip'); if (f) f.classList.toggle('is-back', S.cards.flipped); },
  cardPrev() { S.cards.i--; S.cards.flipped = false; render(); },
  cardNext() { S.cards.i++; S.cards.flipped = false; render(); },
  cardKnow() {
    const w = deck()[S.cards.i];
    if (S.progress.known[w.id]) delete S.progress.known[w.id]; else S.progress.known[w.id] = Date.now();
    save(); S.cards.flipped = false; render();
  },
  cardsReset() { words().forEach(w => delete S.progress.known[w.id]); save(); S.cards.i = 0; render(); },
  termPop(el) { termPop(el.dataset.id); },
  toggleKnown(el) { const id = el.dataset.id; if (S.progress.known[id]) delete S.progress.known[id]; else S.progress.known[id] = Date.now(); save(); const on = !!S.progress.known[id]; el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); },
  printWords() { window.print(); },
  goLesson(el) { closeModal(); location.hash = '#/lesson/' + el.dataset.n; },
  lessonQuiz(el) { S.settings.range = 'lesson-' + el.dataset.n; saveSettings(S.settings); S.quiz = null; location.hash = '#/quiz'; },
  quizStart(el) { startQuiz(S.route.view === 'review', el.dataset.mode || 'mix'); render(); },
  quizMenu() { clearAuto(); S.quiz = null; render(); },
  answer(el) { answer(el.dataset.id); },
  qtAnswer(el) { qtAnswer(el.dataset.id); },
  autoNext() { S.settings.autoNext = !S.settings.autoNext; saveSettings(S.settings); render(); scheduleAuto(); },
  quizNext() { clearAuto(); const Q = S.quiz; if (Q.i < Q.list.length - 1) { Q.i++; Q.ans = null; } else Q.state = 'done'; if (Q.task) saveTaskRun(); render(); window.scrollTo(0, 0); },
  taskRestart() { clearAuto(); Store.del('netw.taskrun'); S.quiz = null; render(); window.scrollTo(0, 0); },
  joinMode() { S.join.resume = !S.join.resume; S.join.err = ''; render(); },
  leaveClass() {
    if (!confirm(T('cls.leaveConfirm'))) return;
    const id = S.cls.id;
    BE.leaveClass(id).catch(() => {});
    forgetClass(); render();
  },
  sortStart() { S.sort = { list: makeSort(words().map(w => w.id), 10), i: 0, score: 0, ans: null, state: 'q' }; render(); },
  sortAnswer(el) {
    const R = S.sort; if (R.ans) return;
    const w = R.list[R.i]; R.ans = el.dataset.g;
    const ok = R.ans === WORD_BY_ID[w].group;
    if (ok) R.score++;
    recordAnswer(S.progress, w, ok, false); save(); render();
    const nb = document.getElementById('next-btn'); if (nb) nb.focus({ preventScroll: true });
  },
  sortNext() { const R = S.sort; if (R.i < R.list.length - 1) { R.i++; R.ans = null; } else R.state = 'done'; render(); window.scrollTo(0, 0); },
  resetProgress() {
    if (!confirm(T('prog.confirm'))) return;
    S.progress = { known: {}, review: {}, stats: {} }; save(); closeModal(); render();
  }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
  const fn = actions[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el); }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.matches('[data-act="lang"]')) { setLang(el.value); return; }
  if (el.matches('[data-act="range"]')) {
    S.settings.range = el.value; saveSettings(S.settings);
    S.cards.i = 0; S.quiz = null; S.sort = null;
    if (location.search) history.replaceState(null, '', location.pathname + location.hash);
    render(); return;
  }
  if (el.dataset.wset) { S.settings[el.dataset.wset] = el.value; saveSettings(S.settings); document.getElementById('wlist').innerHTML = wordListHTML(); return; }
  if (el.matches('[data-act="demoSpeed"]')) { S.settings.demoSpeed = Number(el.value); saveSettings(S.settings); import('./demos/kit.js').then(k => k.setSpeed(S.settings.demoSpeed)); return; }
  if (el.matches('[data-act="quizN"]')) { S.settings.quizN = Number(el.value); saveSettings(S.settings); render(); return; }
  if (el.matches('[data-act="cfilter"]')) { S.cards.onlyNew = el.value === 'new'; S.cards.i = 0; S.cards.flipped = false; render(); return; }
  if (el.dataset.setting) {
    const k = el.dataset.setting;
    S.settings[k] = el.type === 'checkbox' ? el.checked : el.value === '' ? null : el.value;
    saveSettings(S.settings);
    if (k === 'second' && S.settings.second) loadLang(S.settings.second).then(() => { render(); openSettings(); });
    else { render(); openSettings(); }
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'search') { S.query = e.target.value; document.getElementById('wlist').innerHTML = wordListHTML(); }
});
document.addEventListener('keydown', e => {
  if (document.getElementById('modal') || e.target.closest('input, select, textarea')) return;
  const v = S.route.view;
  if ((v === 'quiz' || v === 'review' || v === 'task') && S.quiz && S.quiz.state === 'q' && !S.quiz.ans && /^[1-4]$/.test(e.key)) {
    const id = S.quiz.list[S.quiz.i].opts[+e.key - 1]; if (id) answer(id);
  }
  if (v === 'quick' && S.qt && quickState() === 'q' && /^[1-4]$/.test(e.key)) {
    const id = S.qt.list[S.qt.ans.length].opts[+e.key - 1]; if (id) qtAnswer(id);
  }
  if (v === 'cards') {
    if (e.key === 'ArrowRight') { const b = document.querySelector('[data-act="cardNext"]'); if (b && !b.disabled) b.click(); }
    if (e.key === 'ArrowLeft') { const b = document.querySelector('[data-act="cardPrev"]'); if (b && !b.disabled) b.click(); }
    if ((e.key === ' ' || e.key === 'Enter') && e.target.id === 'flip') { e.preventDefault(); actions.flip(); }
  }
});

async function setLang(code) {
  await loadLang(code);
  S.settings.lang = code; saveSettings(S.settings);
  render();
}

/* ---------- settings ---------- */
function openSettings() {
  const s = S.settings;
  const radio = (k, v, label) => `<label class="seg-i"><input type="radio" name="${k}" data-setting="${k}" value="${v}" ${String(s[k]) === v ? 'checked' : ''}><span>${esc(label)}</span></label>`;
  modal(`<div class="modal-head"><h2>${I.gear} ${H('set.title')}</h2><button class="icon-btn" data-act="closeModal" aria-label="${esc(T('btn.close'))}">${I.x}</button></div>
    <div class="modal-body form">
      <label class="fld"><span>${H('nav.language')}</span><select data-act="lang">${langOptions(L())}</select></label>
      <label class="fld"><span>${H('set.second')}</span><select data-setting="second"><option value="">${esc(T('set.secondNone'))}</option>${LANGS.filter(l => l.code !== L()).map(l => `<option value="${l.code}" ${s.second === l.code ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</select><small class="muted">${H('set.secondTip')}</small></label>
      <div class="fld"><span>${H('set.theme')}</span><div class="seg">${radio('theme', 'auto', T('set.themeAuto'))}${radio('theme', 'light', T('set.themeLight'))}${radio('theme', 'dark', T('set.themeDark'))}</div></div>
      <div class="fld"><span>${H('set.size')}</span><div class="seg">${radio('size', 's', 'A')}${radio('size', 'm', 'A+')}${radio('size', 'l', 'A++')}</div></div>
      <label class="chk"><input type="checkbox" data-setting="furi" ${s.furi !== false ? 'checked' : ''}><span>${H('set.furi')}</span></label>
      <label class="chk"><input type="checkbox" data-setting="presenter" ${s.presenter ? 'checked' : ''}><span>${H('pres.on')}<small class="muted"> — ${H('pres.onTip')}</small></span></label>
      <hr><button class="linkbtn danger" data-act="resetProgress">${H('prog.reset')}</button>
    </div>`);
}

/* ---------- start ---------- */
(async function start() {
  S.route = parseRoute();
  await Promise.all([loadLang('en'), loadLang(L()), S.settings.second ? loadLang(S.settings.second) : null]);
  if (S.join.code && !S.cls) { S.route = { view: 'class' }; history.replaceState(null, '', location.pathname + '#/class'); }
  render();
  if (S.cls) bootClass();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
