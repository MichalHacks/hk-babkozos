self.addEventListener('push', (e) => {
    const content = e.data.json().text;
    e.waitUntil(
        self.registration.showNotification("penis penis penis", {
            body: content
        })
    );
})