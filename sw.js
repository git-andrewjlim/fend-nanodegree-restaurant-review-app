const cacheName = 'udacity-restaurant-cache-v2';


self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cacheName).then(function(cache){
			return cache.addAll([
                './js/main.js',
                './js/dbhelper.js',
                './js/restaurant_info.js',
                './css/styles.css',
                './data/restaurants.json',
				'./img/simple-gray-texture.jpg'
			]);
		}).catch(function(err){
            console.log('Service Worker install failure', err);
        })
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function(cache) {
                    if (cache !== cacheName) {
                        console.log('clearing unused caches');
                        return caches.delete(cache);
                    }
                })
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
    console.log('Service Worker Fetching');
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    )
});