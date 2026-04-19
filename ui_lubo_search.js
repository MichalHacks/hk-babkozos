(() => {
	const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8";
	const BASE = "http://10.0.5.33:8080";
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
	`);

	function createCard(item, urls) {
		const el = document.createElement("div");
		el.className = "card";
		const carousel = buildCarousel(urls);
		if (carousel) el.appendChild(carousel);
		el.insertAdjacentHTML("beforeend", `
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
						<div class="meta">${item.user.phone}</div>
					</div>
				</div>
			</div>
			<div class="card-actions">
				<button class="action-btn take"><span class="material-symbols-outlined">check</span> Take</button>
			</div>
		`);
		return el;
	}

	function fetchAndRender(category) {
		const container = VIEW.querySelector("#search-list");
		container.innerHTML = "";
		const url = category
			? `${BASE}/demands/category/${category}`
			: `${BASE}/demands`;
		fetch(url, { headers: { "Authorization": TOKEN } })
			.then(r => r.json())
			.then(data => {
				data.forEach(item => {
					const imagePromises = (item.images || []).map(image =>
						fetch(`${BASE}/images/${image.filename}`, { headers: { "Authorization": TOKEN } })
							.then(r => r.blob())
							.then(blob => URL.createObjectURL(blob))
					);
					Promise.all(imagePromises).then(urls => {
						container.appendChild(createCard(item, urls));
					});
				});
			});
	}

	const searchFilters = VIEW.querySelectorAll(".filter");
	searchFilters.forEach(f => {
		f.onclick = () => {
			searchFilters.forEach(x => x.classList.remove("active"));
			f.classList.add("active");
			fetchAndRender(f.dataset.cat);
		};
	});

	function init() {
		searchFilters.forEach(f => f.classList.remove("active"));
		VIEW.querySelector(".filter[data-cat='']").classList.add("active");
		fetchAndRender(null);
	}

	VIEW.init = init;
})();
