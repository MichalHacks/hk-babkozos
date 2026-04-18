(() => {
	const VIEW = document.getElementById("view-blazena");

	/* ===== DISPLAY MANUAL FUNCTION ===== */
	function displayManual() {
		const CONTAINER = VIEW.querySelector("#tab-container");
		CONTAINER.innerHTML = "";

		/* ===== HIERARCHICAL DATA TREE ===== */
		const tree = {
			root: {
				title: "Start",
				items: {
					garden: {
						label: "Záhrada",
						icon: "🪏",
						items: {
							hedge: { label: "Strihanie živého plota", icon: "✂️" },
							water: { label: "Polievanie", icon: "💧" },
							clean: { label: "Čistenie záhrady", icon: "🧹" }
						}
					},
					shopping: {
						label: "Nákupy",
						icon: "🛒",
						items: {
							food: { label: "Potraviny", icon: "🥦" },
							home: { label: "Domáce potreby", icon: "🧴" }
						}
					},
					moving: {
						label: "Prenášanie",
						icon: "📦",
						items: {
							boxes: { label: "Krabice", icon: "📦" },
							furniture: { label: "Nábytok", icon: "🪑" }
						}
					}
				}
			}
		};

		let path = ["root"];

		/* GRID and TABS logic */
		const tabs = document.createElement("div");
		tabs.classList.add("blazena-tabs");
		CONTAINER.appendChild(tabs);

		const grid = document.createElement("div");
		grid.classList.add("blazena-grid");
		CONTAINER.appendChild(grid);

		function getNode(pathArr) {
			return pathArr.reduce((acc, key) => acc.items?.[key] || acc, tree.root);
		}

		function addItem(item, click) {
			const el = document.createElement("div");
			el.className = "blazena-item";

			el.innerHTML = `
				<span class="big">${item.icon || "📁"}</span>
				<span>${item.label}</span>
			`;

			el.onclick = click;

			grid.appendChild(el);
			return el;
		}

		function render() {
			const node = getNode(path);

			/* Clear grid */
			grid.innerHTML = "";

			/* Render grid items */
			Object.entries(node.items || {}).forEach(([key, item]) => {
				addItem(item, () => {
					if (item.items) {
						path.push(key);
						render();
					}
				});
			});

			/* Render "Back" button */
			if (path.length > 1) {
				addItem({ icon: "⬅", label: "Back" }, () => { path.pop(); render() });
			}

			/* Clear tabs */
			tabs.innerHTML = "";

			/* Render tabs (breadcrumb-style) */
			path.forEach((p, i) => {
				const btn = document.createElement("div");
				btn.className = "blazena-tab";
				btn.textContent = p;

				btn.onclick = () => {
					path = path.slice(0, i + 1);
					render();
				};

				tabs.appendChild(btn);

				if (i < path.length - 1)
					tabs.insertAdjacentHTML("beforeend", `<span class="material-symbols-outlined">chevron_right</span>`);
			});
		}

		/* Initialize the manual */
		render();
	}

	function displayAutoManualSelect() {
		const CONTAINER = VIEW.querySelector("#tab-container");
		
		CONTAINER.innerHTML = `
			<div class="blazena-mode" id="blazena-mode">
				<div class="blazena-mode-grid">
					<div class="blazena-mode-item" data-mode="manual">
						<span class="big">✍️</span>
						<span class="label">Manual</span>
					</div>

					<div class="blazena-mode-item" data-mode="auto">
						<span class="big">⚡</span>
						<span class="label">Automatic</span>
					</div>
				</div>
			</div>
		`;

		CONTAINER.querySelectorAll(".blazena-mode-item").forEach(x => {
			if (x.dataset.mode == "manual")
				x.onclick = displayManual;
			if (x.dataset.mode == "auto")
				x.onclick = () => alert("Not implemented");
		})
	}

	VIEW.init = () => displayAutoManualSelect();
})();