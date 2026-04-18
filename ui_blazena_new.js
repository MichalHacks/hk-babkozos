(() => {
	const VIEW = document.getElementById("view-blazena");

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

	VIEW.init = () => {
		path = ["root"];
		render();
	}

	const grid = VIEW.querySelector("#blazena-grid");
	const tabs = VIEW.querySelector("#blazena-tabs");

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

		/* GRID */
		grid.innerHTML = "";

		Object.entries(node.items || {}).forEach(([key, item]) => {
			addItem(item, () => {
				if (item.items) {
					path.push(key);
					render();
				}
			});
		});

		if (path.length > 1) {
			addItem({ icon: "⬅", label: "Back" }, () => { path.pop(); render() })
		}

		/* TABS (breadcrumb-style) */
		tabs.innerHTML = "";

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
				tabs.insertAdjacentHTML("beforeend", `<span class="material-symbols-outlined">chevron_right</span>`)
		});
	}
})();