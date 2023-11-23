self.addEventListener("install", (ev) => {})


self.addEventListener("fetch", (ev) => {
	ev.respondWith(fetch(ev.request))
})