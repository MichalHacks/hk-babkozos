(() => {
	const VIEW = document.getElementById("view-relevant");

	VIEW.insertAdjacentHTML("afterbegin", `
		<style scoped>
			.action-btn.take {
				color: var(--color-success) !important;
			}

			.action-btn.take:hover {
				background: var(--color-success) !important;
				color: #fff !important;
			}
		</style>
	`)

	/* CARD GENERATOR */
	const data = [{
			title: "Frontend UI Help",
			username: "john_doe",
			desc: "Looking for help with responsive layout.",
			tags: ["tech", "ui"],
			location: "Košice",
			contact: "john@mail.com",
			extra: "Remote",
			img: "https://picsum.photos/400/200",
			user: "https://i.pravatar.cc/40?img=1"
		}, {
			title: "Design Feedback",
			username: "anna_design",
			desc: "Need critique on mobile app.",
			tags: ["design"],
			location: "Prague",
			contact: "anna@mail.com",
			extra: "Freelance",
			img: "https://picsum.photos/400/201",
			user: "https://i.pravatar.cc/40?img=2"
		}, {
			title: "Design Feedback",
			username: "anna_design",
			desc: "Need critique on mobile app.",
			tags: ["design"],
			location: "Prague",
			contact: "anna@mail.com",
			extra: "Freelance",
			img: "https://picsum.photos/400/202",
			user: "https://i.pravatar.cc/40?img=2"
		}, {
			title: "Design Feedback",
			username: "anna_design",
			desc: "Need critique on mobile app.",
			tags: ["design"],
			location: "Prague",
			contact: "anna@mail.com",
			extra: "Freelance",
			img: "https://picsum.photos/400/203",
			user: "https://i.pravatar.cc/40?img=2"
		}];

	function createCard(item) {
		const el = document.createElement("div");
		el.className = "card";
		el.innerHTML = `
			${item.img ? `<img class="main-img" src="${item.img}">` : ""}
			<div class="card-content">
				<div class="user-row">
					<img class="avatar" src="https://i.pravatar.cc/40?img=2">
					<div class="username">${item.user.name}</div>
				</div>

				<div class="card-body">
					<div class="left">
						<div class="title">${item.secondaryCategory.name}</div>
						<div class="desc">${item.description}</div>
					</div>

					<div class="right">
						<div class="meta">${item.location}</div>
						<div class="meta">${item.user.phone}</div>
					</div>
				</div>
			</div>
			<div class="card-actions">
				<button class="action-btn take"><span class="material-symbols-outlined">check</span> Take</button>
			</div>
		`;
		return el;
	}


	/* INITIALIZE */
	function init() {
		const container = VIEW.querySelector("#relevant-list");
		container.innerHTML = "";
		fetch("http://10.0.5.33:8080/demands", {
			method: "GET",
			headers: {
				"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8"
			}
		}).then(response => response.json())
		  .then(data => {
			console.log("Relevant data:", data);
				data.forEach(item => {
					fetch("http://10.0.5.33:8080/images/"+item.images[0].filename, {
						method: "GET",
						headers: {
							"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8"
						}
					}).then(response => response.blob())
					.then(blob => {
						item.img = URL.createObjectURL(blob);
						container.appendChild(createCard(item));
					})
				});
		})
	}

	VIEW.init = init;
})();