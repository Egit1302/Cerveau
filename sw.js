/* Service worker de Cerveau : affiche les notifications et rouvre la bonne note au toucher. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil((async function () {
    var list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if ('focus' in c) {
        try { await c.focus(); } catch (x) {}
        try { if (c.navigate) await c.navigate(url); } catch (x) {}
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(url);
  })());
});

/* Prêt pour de vrais messages push (payload JSON : title, body, url). */
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Cerveau', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', data: { url: d.url || './' }
  }));
});
