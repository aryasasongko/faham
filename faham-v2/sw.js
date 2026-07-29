/* ============================================================================
   Faham service worker.
   ----------------------------------------------------------------------------
   Strategy, and the reasoning behind each part:

   * NAVIGATION is network-first. Whenever there is signal the newest build is
     served, with the cached copy as the offline fallback. This is what stops a
     service worker from pinning users to an old deploy.

   * THE APP SHELL (styles, modules, data, icons) is precached at install under
     a versioned cache name and served cache-first. Because every module is
     fetched fresh at install time, a version bump replaces the whole set
     atomically — a new index.html can never end up paired with stale modules.

   * AUDIO is never precached. The bundled pronunciation files and the Quran
     recitations are both cached on demand, the first time they are played, in
     a separate runtime cache so the shell version can roll without discarding
     a listener's downloaded audio.

   * FAILURES ARE NOT CACHED. Only a genuinely successful response is stored.
     Cross-origin audio arrives opaque (status 0) and is the single documented
     exception, restricted to requests that are actually for audio.

   BUMP `VERSION` on every deploy that changes any shell file.
   ========================================================================== */

var VERSION = 'v16';
var SHELL_CACHE = 'faham-shell-' + VERSION;
var AUDIO_CACHE = 'faham-audio-v1';

var SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',

  './js/audio.js',
  './js/dates.js',
  './js/dom.js',
  './js/i18n.js',
  './js/icons.js',
  './js/location.js',
  './js/madhhab.js',
  './js/poses.js',
  './js/prayer-times.js',
  './js/qibla.js',
  './js/router.js',
  './js/search.js',
  './js/state.js',
  './js/storage.js',
  './js/tracker.js',
  './js/walkthrough.js',

  './js/views/common.js',
  './js/views/duas.js',
  './js/views/faq.js',
  './js/views/onboarding.js',
  './js/views/prayer.js',
  './js/views/qibla.js',
  './js/views/read.js',
  './js/views/settings.js',
  './js/views/times.js',
  './js/views/today.js',
  './js/views/tracker.js',

  './data/audio-map.js',
  './data/concepts.js',
  './data/cycle.js',
  './data/duas.js',
  './data/faq.js',
  './data/islam.js',
  './data/madhhab-data.js',
  './data/parts.js',
  './data/poses.js',
  './data/prayers.js',
  './data/stories.js',
  './data/surahs.js',
  './data/today.js',
  './data/vocab.js',
  './data/wudhu.js',

  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then(function (cache) {
        /* addAll rejects the whole install if a single asset 404s, which would
           strand the user on the previous worker indefinitely — so each asset
           is added individually and a missing optional file is tolerated. */
        return Promise.all(SHELL.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' }))
            .catch(function () { /* one absent asset must not fail the install */ });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (k) { return k !== SHELL_CACHE && k !== AUDIO_CACHE; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

function isAudioRequest(req) {
  if (req.destination === 'audio') return true;
  return req.url.indexOf('.mp3') > -1;
}

function cacheable(res) {
  if (!res) return false;
  if (res.status === 0 && res.type === 'opaque') return true;   // cross-origin audio
  return res.ok;
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var isPage = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') > -1;

  if (isPage) {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          if (cacheable(res)) {
            var copy = res.clone();
            caches.open(SHELL_CACHE).then(function (c) { c.put('./index.html', copy); });
          }
          return res;
        })
        .catch(function () {
          return caches.match('./index.html').then(function (hit) {
            return hit || caches.match('./');
          });
        })
    );
    return;
  }

  if (isAudioRequest(req)) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (cacheable(res)) {
            var copy = res.clone();
            caches.open(AUDIO_CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        });
      })
    );
    return;
  }

  /* Shell assets: cache first, network as the fallback for anything new. */
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (cacheable(res) && new URL(req.url).origin === self.location.origin) {
          var copy = res.clone();
          caches.open(SHELL_CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
