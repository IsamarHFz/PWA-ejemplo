// PLANTILLA DE SERVICE WORKER


// 1. Nombre del caché y archivos a cachear
const CACHE_NAME = "mi-pwa-cache-v1";
const BASE_PATH = "/PWA-ejemplo/";
const urlsTocache = [
    `${BASE_PATH}index.html`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`,
];

// 2. INSTALL -> el evento que se ejecuta al instalar el sw
// Se dispara la primera vez que se registra el service worker, se hace un trigger
// self es la instancia que escucha los eventos del navegador
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache.addAll(urlsTocache))
    );
});

// 3. ACTIVATE ->  este evento se ejecuta al activarse y debe limpiar caches viejas 
// Se dispara cuando el service worker se activa (está en ejecución)
self.addEventListener("activate", event => {
    event.waitUntil(
        cahes.keys().then( keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
}
);
// 4. FETCH -> intercepta las peticiones de la PWA 
// Intercepta cada petici+on de cada página de la PWA
// Busca primero en caché 
// Si el recurso no está, va a la red 
// Si falla todo, muestra Offline.html
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(
                () => caches.match.match("offline.html"));
        })
    );
});

// 5. PUSH -> notificaciones en segundo plano (opcional)
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin datos"; // ternario, un if and else
    event.waitUntil(
        self.registration.showNotification("Mi PWA", { body: data })
    ); 
});

// Opcional: 
//     SYNC -> sincronización en segundo plano 
//     Manejo de eventos de APIs  que el navegador soporte

// Investiga sobre las promesas y sobre los eventos waitUntil
// Triggers e investigar los métodos 
