function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0].toLowerCase())
    .join('');
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
        .then(async response => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message);
        })
		.then(data => {
			profileData = data;
			console.log("Profile data:", profileData);
			VIEW.insertAdjacentHTML("afterbegin", `
		<div class="profile-container">
			<div class="profile-header">
				<div class="profile-avatar">${getInitials(profileData.name)}</div>
				<h1 class="profile-name">${profileData.name}</h1>
			</div>
			
			<div class="profile-content">
				<div class="profile-field">
					<label class="profile-label">Phone Number</label>
					<p class="profile-value">${profileData.phone}</p>
				</div>
			</div>


			<style scoped>
				
			</style>
		</div>
	`)
		});

	

	
})();