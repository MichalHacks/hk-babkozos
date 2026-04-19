self.addEventListener('push', (e) => {
    const content = e.data.json().text;
    e.waitUntil(
        self.registration.showNotification("New request for help", {
            body: content
        })
    );
})