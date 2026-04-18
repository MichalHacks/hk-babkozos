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
	}];

	function createCard(item) {
		const el = document.createElement("div");
		el.className = "card";
		el.innerHTML = `
			<img class="main-img" src="${item.img}">
			<div class="card-content">
				<div class="user-row">
					<img class="avatar" src="${item.user}">
					<div class="username">${item.username}</div>
				</div>

				<div class="card-body">
					<div class="left">
						<div class="title">${item.title}</div>
						<div class="desc">${item.desc}</div>
						<div class="tags">
							${item.tags.map(t => `<div class="tag">${t}</div>`).join("")}
						</div>
					</div>

					<div class="right">
						<div class="meta">${item.location}</div>
						<div class="meta">${item.contact}</div>
						<div class="meta">${item.extra}</div>
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
		data.forEach(item => container.appendChild(createCard(item)));
	}

	VIEW.init = init;
})();