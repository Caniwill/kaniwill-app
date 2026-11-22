// 카니윌 AMS 알림 서비스 워커 (앱이 꺼져 있거나 화면이 잠겨 있어도 알림을 받게 해 줘요)
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: '카니윌 AMS', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '카니윌 AMS', {
    body: d.body || '',
    icon: '/photos/logo-w.png',
    badge: '/photos/logo-w.png',
    tag: d.tag || undefined,
    data: { url: d.url || '/ams.html' }
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/ams.html';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if (cs[i].url.indexOf('/ams.html') > -1 && 'focus' in cs[i]) return cs[i].focus(); }
    return self.clients.openWindow(url);
  }));
});
