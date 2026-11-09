/* Offline support (same rules as SQL Practice next/sw.js).
 * App files: network first, so an update shows at once; icons and fonts: cache first.
 * Bump VERSION when publishing big changes. */
const VERSION = 'netw-5';
const CORE = ['./', 'index.html', 'css/app.css', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png',
  'js/student.js', 'js/scenes.js', 'js/facts.js', 'js/common.js', 'vendor/qrcode.js', 'js/i18n.js', 'js/ui.js', 'js/store.js', 'js/quiz.js', 'js/words.js', 'js/groups.js',
  'js/demos/kit.js', 'js/demos/hubswitch.js', 'js/demos/cast.js', 'js/demos/csmacd.js', 'js/demos/repeater.js', 'js/demos/frame.js', 'js/teacher.js', 'teacher.html',
  'i18n/ja.js', 'i18n/easy.js', 'i18n/en.js'];
// cache: 'reload' so a new version never copies stale files from the browser's HTTP cache
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const put = (req, r) => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); } return r; };
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  if (!sameOrigin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
  if (!sameOrigin || url.pathname.includes('/icons/')) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => put(req, r))));
    return;
  }
  e.respondWith(fetch(req, { cache: 'no-cache' }).then(r => put(req, r))
    .catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
