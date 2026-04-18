(() => {
	const VIEW = document.getElementById("view-search");

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
		images: ["https://picsum.photos/400/200", "https://picsum.photos/400/210"],
		user: "https://i.pravatar.cc/40?img=1"
	}, {
		title: "Design Feedback",
		username: "anna_design",
		desc: "Need critique on mobile app.",
		tags: ["design"],
		location: "Prague",
		contact: "anna@mail.com",
		extra: "Freelance",
		images: ["https://picsum.photos/400/201", "https://picsum.photos/400/211", "https://picsum.photos/400/220"],
		user: "https://i.pravatar.cc/40?img=2"
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
		`);
		return el;
	}

	/* SEARCH */
	const searchInput = document.getElementById("searchInput");
	const searchFilters = document.querySelectorAll(".filter");
	let activeTag = null;
	searchFilters.forEach(f => {
		f.onclick = () => {
			searchFilters.forEach(x => x.classList.remove("active"));
			f.classList.add("active");
			activeTag = f.innerText;
			filter();
		};
	});
	searchInput.oninput = filter;

	function filter() {
		const term = searchInput.value.toLowerCase();
		const filtered = data.filter(item => {
			const matchText = item.title.toLowerCase().includes(term);
			const matchTag = !activeTag || item.tags.includes(activeTag);
			return matchText && matchTag;
		});
		const container = VIEW.querySelector("#search-list");
		container.innerHTML = "";
		filtered.forEach(item => container.appendChild(createCard(item)));
	}

	/* INITIALIZE */
	function init() {
		// reset search
		searchFilters.forEach(f => f.classList.remove("active"));
		searchInput.value = "";
		activeTag = null;

		const container = VIEW.querySelector("#search-list");
		container.innerHTML = "";
		data.forEach(item => container.appendChild(createCard(item)));
	}

	VIEW.init = init;
})();
