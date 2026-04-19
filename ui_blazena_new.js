let recognition, listening = false, output = '';
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function toggleListening() {
	if (!SR) { alert('Use Chrome'); return; }
	if (!listening) {
		recognition = new SR();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'sk-SK';
		recognition.onresult = function(e) {
			output = '';
			for (let i = 0; i < e.results.length; i++) {
				output += e.results[i][0].transcript;
			}
		};
		recognition.onend = function() { if (listening) recognition.start(); };
		recognition.start();
		listening = true;
		document.getElementById('micToggleText').innerText = 'mic_off';
	} else {
		recognition.stop();
		listening = false;
	}
}

(() => {


	const VIEW = document.getElementById("view-blazena");
	const CONTAINER = VIEW.querySelector("#tab-container");

	/* ===== DISPLAY MANUAL FUNCTION ===== */
	function displayManualCategories() {
		CONTAINER.innerHTML = "<h1>Category select</h1>";

		/* ===== HIERARCHICAL DATA TREE ===== */
		const tree = {
			root: {
				title: "Start",
				items: {
					home: {
						label: "Domácnosť",
						icon: "🪏",
						items: {
							a: { label: "Oprava a Montáž", id: 1, icon: "✂️" },
							b: { label: "Upratovanie", id: 2, icon: "💧" },
							c: { label: "Sťahovanie", id: 3, icon: "🧹" }
						}
					},
					garden: {
						label: "Záhrada",
						icon: "🛒",
						items: {
							d: { label: "Kosenie trávy", id: 4, icon: "🥦" },
							e: { label: "Strihanie", id: 5, icon: "🥦" },
							f: { label: "Rúbanie dreva", id: 6, icon: "🥦" },
							g: { label: "Upratovanie", id: 7, icon: "🥦" }
						}
					},
					technology: {
						label: "Technológie",
						icon: "📦",
						items: {
							h: { label: "TV", id: 8, icon: "📦" },
							i: { label: "Telefón", id: 9, icon: "📦" },
							j: { label: "Počítač", id: 10, icon: "📦" },
							k: { label: "Internet", id: 11, icon: "🪑" }
            }
          },
          errands: {
            label: "Vybavovačky",
            icon: "🛒",
            items: {
              l: { label: "Transport", id: 12, icon: "📦" },
              m: { label: "Nákup", id: 13, icon: "📦" },
              n: { label: "Pošta", id: 14, icon: "📦" },
              o: { label: "Administratíva", id: 15, icon: "📦" }
            }
          },
          others: {
            label: "Iné",
            icon: "🛒",
            items: {
              p: { label: "Venčenie", id: 16, icon: "📦" },
              q: { label: "Rozhovor a Návšteva", id: 17, icon: "📦" },
              r: { label: "Sprevádzanie na prechádzke", id: 18, icon: "📦" }
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
					} else {
						displayManualDescription({ categories: item });
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

	function displayAutomatic() {
		CONTAINER.innerHTML = `
			<div class="blazena-auto">
				<div class="instructions">
				<ul>
					<li>Press the microphone button</li>
					<li>Wait for the beep or light</li>
					<li>Say what you need help with</em></li>
					<li>Press the button again to send</li>
				</ul>
				</div>
				<button class="blazena-auto-btn" onclick="toggleListening()">
					<span class="material-symbols-outlined" id="micToggleText">
					mic
					</span>
				</button>
			</div>
		`;
	}

	function displayAutoManualSelect() {
		CONTAINER.innerHTML = `
			<h1>New demand</h1>
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
				x.onclick = displayManualCategories;
			if (x.dataset.mode == "auto")
				x.onclick = displayAutomatic;
		})
	}

	function displayManualDescription(data) {
		CONTAINER.innerHTML = `
			<h1>Description</h1>
			<div class="form-container">
				<textarea class="form-textarea" id="description" placeholder="Write your description here..."></textarea>
				<button class="form-next-button" id="next-button">
					Next <span class="material-symbols-outlined">chevron_right</span>
				</button>
			</div>
		`;

		CONTAINER.querySelector("#next-button").onclick = () => displayManualPhotos({...data, description: CONTAINER.querySelector("#description").value});
	}

	function displayManualPhotos(data) {
		CHOSEN_PHOTOS = "Chosen photos will appear here..."

		CONTAINER.innerHTML = `
			<h1>Photos</h1>
			<div class="form-container">
				<label for="photo-input" class="form-file-input-container">
					<span class="material-symbols-outlined">camera_alt</span>
					<span>Choose a photo</span>
				</label>
				<input type="file" class="form-file-input" id="photo-input" accept="image/*" multiple />
				<div id="uploaded-photos" class="uploaded-photos-container">${CHOSEN_PHOTOS}</div>
				<button class="form-next-button" id="next-button">
					Next <span class="material-symbols-outlined">chevron_right</span>
				</button>
			</div>
		`;

		const photoInput = CONTAINER.querySelector("#photo-input");
		photoInput.addEventListener('change', handleFileSelect);

		const uploadedPhotos = [];
		const uploadedFiles = []

		// Handle file selection and display photos
		function handleFileSelect(event) {
			const files = event.target.files;

			// Loop through selected files
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();

				reader.onload = function (e) {
					// Add the image to the uploaded photos list
					const photoURL = e.target.result;
					uploadedPhotos.push(photoURL);
					uploadedFiles.push(file);
					displayUploadedPhotos();
				}

				reader.readAsDataURL(file);
			}
		}

		// Display the uploaded photos below the input area
		function displayUploadedPhotos() {
			const photoContainer = document.getElementById("uploaded-photos");
			photoContainer.innerHTML = ''; // Clear existing photos before rendering new ones

			if (!uploadedPhotos.length)
				photoContainer.innerText = CHOSEN_PHOTOS;

			// Render each photo with a remove button
			uploadedPhotos.forEach((photoURL, index) => {
				const photoDiv = document.createElement("div");
				photoDiv.className = "uploaded-photo-item";

				photoDiv.innerHTML = `
					<img src="${photoURL}" alt="Uploaded Photo" class="uploaded-photo">
					<button class="remove-photo-button" data-index="${index}">
						<span class="material-symbols-outlined">close</span>
					</button>
				`;

				const removeBtn = photoDiv.querySelector(".remove-photo-button")
				removeBtn.onclick = () => removePhoto(removeBtn.dataset.index);

				photoContainer.appendChild(photoDiv);
			});
		}

		function removePhoto(index) {
			uploadedPhotos.splice(index, 1);
			uploadedFiles.splice(index, 1);
			displayUploadedPhotos(); // Re-render the uploaded photos
		}

		CONTAINER.querySelector("#next-button").onclick = () => displayManualPrice({ ...data, photos: uploadedPhotos, files: uploadedFiles });
	}

	function displayManualPrice(data) {
		CONTAINER.innerHTML = `
			<h1>Typ odmeny</h1>
			<div class="blazena-grid">
				<div class="blazena-item" data-price="none">
					<span class="big">🚫</span>
					<span>Ziadna odmena</span>
				</div>
				<div class="blazena-item" data-price="agreement">
					<span class="big">📦</span>
					<span>Vymenny obcod (v texte)</span>
				</div>
				<div class="blazena-item" data-price="monetary">
					<span class="big">💰</span>
					<span>Monetary</span>
				</div>
			</div>
		`;

		CONTAINER.querySelectorAll(".blazena-item").forEach(x => {
			if (x.dataset.price == "none" || x.dataset.price == "agreement")
				x.onclick = () => displayManualFinishForm({ ...data, priceType: x.dataset.price, price: 0 });
			if (x.dataset.price == "monetary")
				x.onclick = () => displayManualPriceNumber({ ...data, priceType: x.dataset.price });
		})
	}

	function displayManualPriceNumber(data) {
		CONTAINER.innerHTML = `
			<h1>Price</h1>
			<div class="form-container">
				<input type="number" class="form-price-input" id="price-input" placeholder="Enter price" />
				<span style="color:var(--color-danger)" id="err-msg"></span>
				<button class="form-next-button" id="next-button">
					Next <span class="material-symbols-outlined">chevron_right</span>
				</button>
			</div>
		`;

		const input = CONTAINER.querySelector("#price-input");
		const msg = CONTAINER.querySelector("#err-msg");
		input.oninput= () => {
			if (String(input.value).match(/^\d+$/) === null)
				msg.innerHTML = `<span class="material-symbols-outlined">warning</span> Must be a number.`;
			else
				msg.innerHTML = ``;
		}

		CONTAINER.querySelector("#next-button").onclick = () => {
			if (String(input.value).match(/^\d+$/) !== null)
				displayManualFinishForm({ ...data, price: Number(input.value) })
		};sendData(data)
	}

	

	function displayManualFinishForm(data) {
		CONTAINER.innerHTML = `
			<h1>Summary</h1>
			<div class="form-container">
				<div class="summary-tab">
					<div class="summary-item">
						<strong>Categories:</strong> <span class="summary-value">${data.categories.label}</span>
					</div>
					<div class="summary-item">
						<strong>Description:</strong> <span class="summary-value">${data.description || "No description provided."}</span>
					</div>
					<div class="summary-item">
						<strong>Price:</strong> <span class="summary-value">${data.priceType === "monetary" ? data.price + "€" : 'Non-monetary.'}</span>
					</div>
					<div class="summary-item">
						<strong>Price Type:</strong> <span class="summary-value">${data.priceType.charAt(0).toUpperCase() + data.priceType.slice(1)}</span>
					</div>

					<!-- Photos Section -->
					<div class="summary-photos-section">
						<strong>Uploaded Photos:</strong>
						<div class="summary-photos-grid">
							${data.photos.length ? data.photos.map(photo => `
								<div class="summary-photo-item">
									<img src="${photo}" alt="Uploaded Photo" class="summary-photo-image">
									<button class="remove-photo-button">❌</button>
								</div>
							`).join('') : 'No photos.'}
						</div>
					</div>
				</div>
				<button class="form-next-button" id="next-button">
					<span class="material-symbols-outlined">check</span> Finish
				</button>
			</div>
		`;

		

		

		// Add event listener to remove photos
		CONTAINER.querySelectorAll(".remove-photo-btn").forEach(btn => {
			btn.addEventListener("click", (e) => {
				const photoItem = e.target.closest('.photo-item');
				photoItem.remove();
				// Optionally, you can also remove the photo from `data.photos` if needed
			});
		});

		CONTAINER.querySelector("#next-button").addEventListener("click", () => {
			console.log("Final data to send:", data);
			const form = new FormData();
			data.files.forEach(file => {
				form.append('files', file);
			});
			form.append("description", data.description);
			form.append("secondaryCategoryId", 1);
			form.append("latitude", 48.0);
			form.append("longitude", 17.0);
			form.append("reward", (data.priceType === "monetary" ? data.price : (data.priceType === "agreement" ? -1 : 0)));
			fetch("http://10.0.5.33:8080/demands", {
				method: "POST",
				headers: {
					"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImV4cCI6MTc3OTEyMDAyOX0.CpE7xtFq8Jk0BjztaWdR0earJSKyZSrgEvTt5bWRso8",
				},
				body: form
			})
			.then(() => {})
			.then(() => displayAutoManualSelect())
		});
	}

	VIEW.init = () => displayAutoManualSelect();
})();