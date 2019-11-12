importScripts('/javascript/vendor/workbox/workbox-sw.js');
workbox.setConfig({ modulePathPrefix: '/javascript/vendor/workbox/' });

if (workbox) {
  console.log(workbox)
  // workbox.routing.registerRoute(/\.js$/, new workbox.strategies.NetworkFirst());
  // workbox.routing.registerRoute(/\.css$/, new workbox.strategies.StaleWhileRevalidate({ cacheName: 'css-cache' }));
  // workbox.routing.registerRoute(/\.html$/, new workbox.strategies.NetworkFirst());
}