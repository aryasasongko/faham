/* Self-destructing service worker.

   /faham/app/ used to be a working copy of Faham, so browsers that opened it
   have a service worker registered at that scope. Simply deleting the folder
   would leave that worker alive: online it would serve a 404, offline it would
   keep serving a stale ghost of the app forever.

   This worker replaces it. It takes over immediately, deletes every cache it
   can see, unregisters itself, and reloads any open tab — which then lands on
   the tombstone page and is redirected to the real app.

   Safe to delete from the repository once you are confident nobody is still
   holding the old registration. A year is generous. */

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) {
        clients.forEach(function (c) { c.navigate(c.url); });
      })
  );
});

/* Never answer from cache again — always go to the network. */
self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request));
});
