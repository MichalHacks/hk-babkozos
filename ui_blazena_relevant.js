(() => {
	const VIEW = document.getElementById("view-relevant");

	VIEW.insertAdjacentHTML("afterbegin", `
		<style scoped>
			.action-btn.edit {
				color: var(--color-info) !important;
			}

			.action-btn.delete {
				color: var(--color-danger) !important;
			}

			.action-btn.edit:hover {
				background: var(--color-info) !important;
				color: #fff !important;
			}

			.action-btn.delete:hover {
				background: var(--color-danger) !important;
				color: #fff !important;
			}
		</style>
	`)

	/* CARD GENERATOR */
	const data = [{
		title: "Frontend UI Help",
		username: "john_doe",
		desc: "Looking for help with responsive layout.",
		location: "Košice",
		images: ["https://picsum.photos/400/200", "https://picsum.photos/400/210"],
		user: "https://i.pravatar.cc/40?img=1"
	}, {
		title: "Design Feedback",
		username: "anna_design",
		desc: "Need critique on mobile app.",
		location: "Prague",
		images: ["https://picsum.photos/400/201", "https://picsum.photos/400/211", "https://picsum.photos/400/220"],
		user: "https://i.pravatar.cc/40?img=2"
	}, {
		title: "Garden Help",
		username: "peter_green",
		desc: "Need someone to trim hedges.",
		location: "Bratislava",
		images: ["https://picsum.photos/400/202"],
		user: "https://i.pravatar.cc/40?img=3"
	}, {
		title: "Moving Boxes",
		username: "maria_k",
		desc: "Help needed moving furniture.",
		location: "Vienna",
		images: ["https://picsum.photos/400/203", "https://picsum.photos/400/213"],
		user: "https://i.pravatar.cc/40?img=4"
	}];

	function createCard(item) {
		const el = document.createElement("div");
		el.className = "card";
		el.appendChild(buildCarousel(item.images));
		el.insertAdjacentHTML("beforeend", `
			<div class="card-content">
				<div class="user-row">
					<img class="avatar" src="${item.user}">
					<div class="username">${item.username}</div>
				</div>

				<div class="card-body">
					<div class="left">
						<div class="title">${item.title}</div>
						<div class="desc">${item.desc}</div>
					</div>
				</div>
			</div>
			<div class="card-actions">
				<button class="action-btn edit"><span class="material-symbols-outlined">edit_square</span> ${t('card.edit')}</button>
				<button class="action-btn delete"><span class="material-symbols-outlined">close</span> ${t('card.delete')}</button>
			</div>
		`);
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
