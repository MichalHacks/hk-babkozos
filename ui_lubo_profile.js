function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0].toLowerCase())
    .join('');
}

function parseCategories(categories) {
	let out = []
	for (const [key, value] of Object.entries(categories)) {
		out.push(`${key}: <i>${value.join(", ")}</i>`);
	}
	return out.join("<br>");
}

const subscribe = () => {
	Notification.requestPermission().then((result) => {
		if (result === 'granted') {
			navigator.serviceWorker
				.register("/service-worker-notification.js");
			navigator.serviceWorker.ready
				.then((registration) => registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: "BF8NK3DJkLEz6XEi5pl9UxPE3y6CpBIDl6NZQTdVKMe0ZAWP23LmWFnGFDoQIcQws-S42sWwMjYbufU_pBgKDKA"
				}))
				.then((subscription) => {
					fetch("https://632a-88-212-1-74.ngrok-free.app/subscribe", {
						method: "POST",
						headers: {
							"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8",
							"Content-Type": "application/json"
						},
						body: JSON.stringify(subscription)
					})
				})
		}
	});
}

(() => {
	const VIEW = document.getElementById("view-profile");

	// Sample profile data
	/*const profileData = {
		name: "John Doe",
		phone: "+1 (555) 123-4567",
		bio: "Passionate developer and designer. Love building cool things with code and creating beautiful user experiences.",
		categories: ["varenie", "kosenie"]
	};*/

	let profileData = {};
	fetch("https://632a-88-212-1-74.ngrok-free.app/users/profile", {
		method: "GET",
		headers: {
			"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8"
		}
	})
		.then(response => response.json())
		.then(data => {
			profileData = data;
			console.log("Profile data:", profileData);
			VIEW.insertAdjacentHTML("afterbegin", `
		<div class="profile-container">
			<div class="profile-header glass">
				<div class="profile-avatar">${getInitials(profileData.name)}</div>
				<h1 class="profile-name">${profileData.name}</h1>
			</div>
			
			<div class="profile-content">
				<div class="profile-field">
					<label class="profile-label">${t('profile.phone')}</label>
					<p class="profile-value">${profileData.phone}</p>
				</div>

				<div class="profile-field">
					<label class="profile-label">${t('profile.categories')}</label>
					<p class="profile-value">${parseCategories(profileData.categories)}</p>
				</div>

				<div class="profile-field">
					<label class="profile-label">${t('profile.bio')}</label>
					<p class="profile-value">${profileData.bio}</p>
				</div>
			</div>
			${Notification.permission === "granted" ? '' : `<button onclick="subscribe()" class="subscribe-btn">${t('profile.subscribe')}</button>`}


			<style scoped>
				
			</style>
		</div>
	`)
		});

	

	
})();