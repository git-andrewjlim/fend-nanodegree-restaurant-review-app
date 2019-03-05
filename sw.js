const cacheName = 'udacity-restaurant-cache-v1';


/* Install Service Worker with cached files*/
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cacheName).then(function(cache){
			return cache.addAll([
                './',
                './index.html',
                './restaurant.html',
                './js/main.js',
                './js/dbhelper.js',
                './js/restaurant_info.js',
                './sw.js',
                './css/styles.css',
                './data/restaurants.json',
				'./img/simple-gray-texture.jpg'
			]);
		}).catch(function(err){
            console.log('Service Worker install failure', err);
        })
	);
});


/* Activate Service worker and delete unwanted cache files */
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
		}).catch(function(err){
            console.log('Service Worker error on retreiving keys', err);
        })
	);
});


/* Send fetch request for files - if it finds none (.catch), get from cache */
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            caches.match(event.request)
        })
    );
});