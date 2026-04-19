(() => {
	const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8";
	const BASE  = "http://10.0.5.33:8080";
	const VIEW  = document.getElementById("view-relevant");

	VIEW.insertAdjacentHTML("afterbegin", `
		<style scoped>
			.action-btn.cancel {
				color: var(--color-danger) !important;
			}
			.action-btn.cancel:hover {
				background: var(--color-danger) !important;
				color: #fff !important;
			}
			.status-row {
				display: flex;
				align-items: center;
				gap: 6px;
				margin-top: 4px;
				font-size: 12px;
			}
			.status-chip {
				padding: 2px 8px;
				border-radius: 99px;
				font-weight: 600;
				font-size: 11px;
			}
			.status-chip.waiting {
				background: var(--border);
				color: var(--muted);
			}
			.status-chip.inprogress {
				background: var(--accent);
				color: #fff;
			}
			.helper-phone {
				font-size: 13px;
				color: var(--accent);
				font-weight: 600;
				margin-top: 4px;
			}
		</style>
	`);

	function formatDuration(mins) {
		if (mins < 60) return `${mins} min`;
		if (mins < 1440) {
			const h = Math.floor(mins / 60), m = mins % 60;
			return m ? `${h}h ${m}m` : `${h}h`;
		}
		return `${Math.floor(mins / 1440)}d`;
	}

	function rewardLabel(reward) {
		if (reward === 0) return "No reward";
		if (reward === -1) return "Negotiable";
		return `${reward} €`;
	}

	function createCard(item, urls) {
		const el = document.createElement("div");
		el.className = item.inProgress ? "card green" : "card";

		const carousel = buildCarousel(urls);
		if (carousel) el.appendChild(carousel);

		const helperRow = item.inProgress
			? `<div class="helper-phone"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle">call</span> ${item.helperPhone}</div>`
			: "";

		el.insertAdjacentHTML("beforeend", `
			<div class="card-content">
				<div class="card-body">
					<div class="left">
						<div class="title">${item.demand.secondaryCategory.name}</div>
						<div class="desc">${item.demand.description}</div>
						<div class="status-row">
							<span class="status-chip ${item.inProgress ? 'inprogress' : 'waiting'}">${item.inProgress ? 'In progress' : 'Waiting'}</span>
							<span class="meta">${formatDuration(item.statusDurationMinutes)}</span>
						</div>
						${helperRow}
					</div>
					<div class="right">
						<div class="meta">${rewardLabel(item.demand.reward)}</div>
					</div>
				</div>
			</div>
			<div class="card-actions">
				<button class="action-btn cancel"><span class="material-symbols-outlined">close</span> Cancel</button>
			</div>
		`);

		el.querySelector(".action-btn.cancel").onclick = async () => {
			await fetch(`${BASE}/demands/${item.demand.id}/resolve`, {
				method: "PATCH",
				headers: { Authorization: TOKEN }
			});
			el.remove();
		};

		return el;
	}

	async function init() {
		const container = VIEW.querySelector("#relevant-list");
		container.innerHTML = "";

		const items = await fetch(`${BASE}/demands/mine`, {
			headers: { Authorization: TOKEN }
		}).then(r => r.json());

		for (const item of items) {
			const urls = await Promise.all(
				(item.demand.images || []).map(img =>
					fetch(`${BASE}/images/${img.filename}`)
						.then(r => r.blob())
						.then(b => URL.createObjectURL(b))
				)
			);
			container.appendChild(createCard(item, urls));
		}
	}

	VIEW.init = init;
})();
