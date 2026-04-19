

(() => {
	const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8";
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
				
			.action-btn.cancel {
				color: var(--color-danger) !important;
			}

			.action-btn.cancel:hover {
				background: var(--color-danger) !important;
				color: #fff !important;
			}

			.action-btn.finished {
				color: var(--color-info) !important;
			}

			.action-btn.finished:hover {
				background: var(--color-info) !important;
				color: #fff !important;
			}
		</style>
	`)

	/* CARD GENERATOR */
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
						<div class="meta">${item.location}</div>
						<div class="meta">${item.user.phone}</div>
					</div>
				</div>
			</div>
			<div class="card-actions">
				<button class="action-btn take" onclick="handleTake(${item.id})"><span class="material-symbols-outlined">check</span> ${t('card.take')}</button>
			</div>
		`);
		return el;
	}

	function createGreenCard(item, urls) {
		const el = document.createElement("div");
		el.className = "card green";
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
						<div class="meta">${item.location}</div>
						<div class="meta">${item.user.phone}</div>
					</div>
				</div>
			</div>
			<div class="card-actions">
				<button class="action-btn finished" onclick="handleFinished(${item.id})"><span class="material-symbols-outlined">check</span> ${t('card.finished')}</button>
				<button class="action-btn cancel" onclick="handleCancel(${item.id})"><span class="material-symbols-outlined">close</span> ${t('card.cancel')}</button>
			</div>
		`);
		return el;
	}


	/* INITIALIZE */
	function init() {
		const container = VIEW.querySelector("#relevant-list");
		container.innerHTML = "";
		fetch("http://10.0.5.33:8080/demands/accepted", {
			method: "GET",
			headers: { "Authorization": TOKEN }
		})
		.then(response => response.json())
		.then(data => {
			console.log("Relevant data:", data);
			data.forEach(item => {
				const imagePromises = (item.images || []).map(image =>
					fetch("http://10.0.5.33:8080/images/" + image.filename, {
						headers: { "Authorization": TOKEN }
					})
					.then(r => r.blob())
					.then(blob => URL.createObjectURL(blob))
				);
				Promise.all(imagePromises).then(urls => {
					container.prepend(createGreenCard(item, urls));
				});
			});
		});
		fetch("http://10.0.5.33:8080/demands", {
			method: "GET",
			headers: { "Authorization": TOKEN }
		})
		.then(response => response.json())
		.then(data => {
			console.log("Relevant data:", data);
			data.forEach(item => {
				const imagePromises = (item.images || []).map(image =>
					fetch("http://10.0.5.33:8080/images/" + image.filename, {
						headers: { "Authorization": TOKEN }
					})
					.then(r => r.blob())
					.then(blob => URL.createObjectURL(blob))
				);
				Promise.all(imagePromises).then(urls => {
					container.appendChild(createCard(item, urls));
				});
			});
		});
	}

	VIEW.init = init;
})();
