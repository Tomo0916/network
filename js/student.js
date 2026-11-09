/* =========================================================
 * student.js — the student app (index.html)
 *
 * Routes:  #/            home
 *          #/words        word list          #/cards   flashcards
 *          #/quiz         4-choice quiz      #/sort    sorting game
 *          #/review       today's review     #/demos/<id>  animations
 * URL options:  ?lang=vi   ?range=lesson-2   ?present=1
 * Progress is stored by word id, so switching language never touches it.
 * ========================================================= */
import { LANGS, loadLang, detectLang, htmlLang, t, th, esc } from './i18n.js';
import { WORDS, WORD_BY_ID } from './words.js';
import { GROUP_BY_ID, DEMOS } from './groups.js';
import { RANGES, isRange, wordsIn, groupsIn, makeQuiz, makeSort, poolSize } from './quiz.js';
import { FACT_BY_ID } from './facts.js';
import { loadSettings, saveSettings, loadProgress, saveProgress, recordAnswer, dueWords } from './store.js';
import { I, applySettings, langSelect, langOptions, modal, closeModal } from './ui.js';
import { termHTML, enName, rangeLabel as rangeLabelOf, speakBtn as speakBtnOf, speak, canSpeak, choiceHTML } from './common.js';

const S = {
  settings: loadSettings(null),
  progress: loadProgress(),
  route: { view: 'home' },
  cards: { i: 0, flipped: false, onlyNew: false },
  quiz: null,
  sort: null,
  query: ''
};
S.settings.lang = detectLang(S.settings.lang);
const qs = new URLSearchParams(location.search);
if (qs.get('present') === '1') S.settings.presenter = true;
if (isRange(qs.get('range'))) { S.settings.range = qs.get('range'); saveSettings(S.settings); }
if (!isRange(S.settings.range)) S.settings.range = 'all';

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
  const opt = r => `<option value="${r}" ${r === S.settings.range ? 'selected' : ''}>${esc(rangeLabel(r))} (${esc(T('range.words', { n: wordsIn(r).length }))})</option>`;
  return `<label class="range"><span>${H('range.label')}</span><select data-act="range" aria-label="${esc(T('range.label'))}">
    ${RANGES.map(opt).join('')}
  </select></label>`;
}

/* ---------- routing ---------- */
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  if (['words', 'cards', 'quiz', 'sort', 'review'].includes(h[0])) return { view: h[0] };
  if (h[0] === 'demos') return { view: 'demos', id: DEMOS.includes(h[1]) ? h[1] : DEMOS[0] };
  return { view: 'home' };
}
window.addEventListener('hashchange', () => {
  S.route = parseRoute();
  if (S.route.view === 'review') S.quiz = null;
  render(); window.scrollTo(0, 0);
});

/* ---------- page ---------- */
function render() {
  applySettings(S.settings, htmlLang(L()));
  const v = S.route.view;
  const body = { home: homeHTML, words: wordsHTML, cards: cardsHTML, quiz: quizHTML, review: quizHTML, sort: sortHTML, demos: demosHTML }[v]();
  document.title = (v === 'home' ? '' : T('nav.' + v) + ' · ') + T('app.name');
  app.innerHTML = headerHTML() + body + footerHTML();
  if (v === 'demos') mountDemo(S.route.id);
  if (v === 'quiz' || v === 'review') afterQuizRender();
  if (v === 'words') { const s = document.getElementById('search'); if (s && S.query) { s.focus(); s.setSelectionRange(S.query.length, S.query.length); } }
}
function headerHTML() {
  const due = dueWords(S.progress).length, v = S.route.view;
  const a = (r, icon, key, extra = '') => `<a href="#/${r}" class="${v === (r.split('/')[0] || 'home') ? 'on' : ''}" title="${esc(T(key))}">${icon}<span>${H(key)}</span>${extra}</a>`;
  return `<header class="topbar"><div class="topbar-in">
    <a class="brand" href="#/"><span class="brand-mark">${I.net}</span><span class="brand-name">${H('app.name')}</span></a>
    <nav class="topnav">
      ${a('', I.home, 'nav.home')}${a('words', I.list, 'nav.words')}${a('cards', I.cards, 'nav.cards')}${a('quiz', I.quiz, 'nav.quiz')}${a('sort', I.sort, 'nav.sort')}
      ${a('review', I.repeat, 'nav.review', due ? `<b class="badge">${due}</b>` : '')}${a('demos/' + DEMOS[0], I.play, 'nav.demos')}
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
function wordListHTML() {
  const ws = words().filter(w => matches(w, S.query));
  if (!ws.length) return `<p class="muted empty-line">${H('words.none')}</p>`;
  return groupsIn(S.settings.range).map(g => {
    const list = ws.filter(w => w.group === g.id);
    if (!list.length) return '';
    return `<section class="grp" style="--gc:var(--g-${g.id})"><h2>${H('g.' + g.id)} <span class="layer">${H('layer.' + g.layer)}</span></h2>
      <div class="wgrid">${list.map(wordCard).join('')}</div></section>`;
  }).join('');
}
function wordsHTML() {
  return `<main class="wrap">${pageHead('nav.words')}
    <label class="search">${I.search}<input id="search" type="search" value="${esc(S.query)}" placeholder="${esc(T('words.search'))}" aria-label="${esc(T('words.search'))}"></label>
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
    <div class="qcount-row"><span>${H('quiz.count')}</span><div class="seg small-seg">${[10, 20, 40].map(radio).join('')}</div></div>
    <div class="qmodes">${QUIZ_MODES.map(card).join('')}</div>
    <p class="muted small">${H('quiz.keys')}</p></main>`;
}
const plainTerm = w => `<span class="term" lang="ja">${esc(w.term)}</span>`;
function quizHTML() {
  const review = S.route.view === 'review';
  if (review && !S.quiz) startQuiz(true);
  const Q = S.quiz;
  if (review && !Q.list.length) {
    const waiting = Object.keys(S.progress.review).length;
    return `<main class="wrap narrow"><section class="card empty">
      <div class="empty-icon">${I.check}</div><h1>${H('review.none')}</h1><p class="muted">${H('review.noneSub')}</p>
      ${waiting ? `<p class="muted">${H('review.waiting', { n: waiting })}</p>` : ''}
      <div class="row-btns"><a class="btn btn-primary" href="#/quiz">${I.quiz}${H('home.startQuiz')}</a><a class="btn btn-ghost" href="#/">${H('nav.home')}</a></div></section></main>`;
  }
  if (!Q || Q.review !== review || Q.state === 'start') return quizStartHTML();
  if (Q.state === 'done') {
    const n = Q.list.length, pct = Q.score / n, missed = [...new Set(Q.missed)];
    return `<main class="wrap narrow"><section class="card empty">
      <div class="empty-icon">${pct === 1 ? I.fire : I.check}</div>
      <h1>${H(review ? 'review.finished' : pct === 1 ? 'quiz.perfect' : pct >= .7 ? 'quiz.good' : 'quiz.tryAgain')}</h1>
      <p class="big-score">${Q.score} / ${n}</p>
      ${missed.length ? `<div class="missed"><h2>${H('quiz.missed')}</h2><p class="muted small">${H('quiz.toReview')}</p>
        <ul>${missed.map(id => { const w = WORD_BY_ID[id]; return `<li><div class="term-row">${termHTML(w)}${speakBtn(w)}</div><div>${bi(`w.${id}.desc`)}</div></li>`; }).join('')}</ul></div>` : ''}
      <div class="row-btns"><button class="btn btn-primary" data-act="quizStart" data-mode="${Q.mode || 'mix'}">${I.reset}${H('btn.again')}</button><button class="btn btn-ghost" data-act="quizMenu">${H('quiz.other')}</button></div></section></main>`;
  }
  const q = Q.list[Q.i], w = WORD_BY_ID[q.id], a = Q.ans, f = q.fact && FACT_BY_ID[q.fact];
  const box = {
    s2t: () => `<div class="qbox scene">${I.scene}<p class="desc">${bi('s.' + q.scene)}</p></div>`,
    fact: () => `<div class="qbox scene">${I.hash}<p class="desc">${bi('f.' + q.fact)}</p></div>`,
    d2t: () => `<div class="qbox"><p class="desc">${bi(`w.${w.id}.desc`)}</p></div>`,
    tip2t: () => `<div class="qbox scene">${I.bulb}<p class="desc">${bi(`w.${w.id}.tip`)}</p></div>`,
    e2t: () => `<div class="qbox center"><div class="big-en" lang="en">${esc(w.en)}</div></div>`,
    listen: () => `<div class="qbox center"><button class="listen-big" data-act="speak" data-id="${w.id}" aria-label="${esc(T('btn.listen'))}">${I.sound}</button><p class="muted small">${H('quiz.tapListen')}</p></div>`,
    t2d: () => `<div class="qbox center"><div class="big-term">${termHTML(w)}</div></div>`
  }[q.type]();
  const optBody = v => {
    if (q.type === 'fact') return `<span class="fact-opt">${choiceHTML(f.opts[+v], T)}</span>`;
    const o = WORD_BY_ID[v];
    if (q.type === 't2d') return `<span>${bi(`w.${v}.desc`)}</span>`;
    if (q.type === 'listen' && !a) return `<span>${plainTerm(o)}</span>`;
    if (q.type === 'e2t') return `<span>${termHTML(o)}</span>`;
    return `<span>${termHTML(o)}${enName(o)}</span>`;
  };
  const opt = (v, i) => {
    const cls = a ? (v === q.answer ? 'ok' : v === a ? 'ng' : '') : '';
    return `<button class="opt ${cls}" data-act="answer" data-id="${v}" ${a ? 'disabled' : ''}><span class="k">${i + 1}</span>${optBody(v)}</button>`;
  };
  const ok = a === q.answer;
  const right = q.type === 'fact' ? choiceHTML(f.opts[0], T) : esc(w.term);
  return `<main class="wrap narrow">
    <div class="qhead"><h1 class="page-title">${H(review ? 'review.title' : 'quiz.title')}</h1><span class="count">${Q.i + 1} / ${Q.list.length}</span></div>
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
  render();
  const nb = document.getElementById('next-btn'); if (nb) nb.focus({ preventScroll: true });
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
  const [mod, kit] = await Promise.all([import(`./demos/${id}.js`).then(m => m.default), import('./demos/kit.js')]);
  kit.setSpeed(S.settings.demoSpeed || 1);
  const el = document.getElementById('demo-root');
  if (!el || S.route.id !== id) return;
  mod.mount(el, {
    T, H: (k, v) => bi(k, v),
    term: wid => WORD_BY_ID[wid].term,
    termHTML: wid => termHTML(WORD_BY_ID[wid])
  });
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
  quizStart(el) { startQuiz(S.route.view === 'review', el.dataset.mode || 'mix'); render(); },
  quizMenu() { S.quiz = null; render(); },
  answer(el) { answer(el.dataset.id); },
  quizNext() { const Q = S.quiz; if (Q.i < Q.list.length - 1) { Q.i++; Q.ans = null; } else Q.state = 'done'; render(); window.scrollTo(0, 0); },
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
  if ((v === 'quiz' || v === 'review') && S.quiz && S.quiz.state === 'q' && !S.quiz.ans && /^[1-4]$/.test(e.key)) {
    const id = S.quiz.list[S.quiz.i].opts[+e.key - 1]; if (id) answer(id);
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
  render();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
