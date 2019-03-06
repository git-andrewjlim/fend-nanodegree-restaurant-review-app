const CACHE_NAME = 'udacity-restaurant-cache-v1';


/* Install Service Worker with cached files*/
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache){
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
                    if (cache !== CACHE_NAME) {
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


/* Send fetch request for files */
/* Code used from: https://developers.google.com/web/fundamentals/primers/service-workers/ */
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          return fetch(event.request).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });