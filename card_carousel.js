/* Lightbox — single instance injected once */
const _lightbox = document.createElement("div");
_lightbox.id = "img-lightbox";
const _lightboxImg = document.createElement("img");
_lightbox.appendChild(_lightboxImg);
_lightbox.addEventListener("click", () => _lightbox.classList.remove("open"));
document.addEventListener("DOMContentLoaded", () => document.body.appendChild(_lightbox));

function _openLightbox(src) {
	_lightboxImg.src = src;
	_lightbox.classList.add("open");
}

window.buildCarousel = function(urls) {
	const wrap = document.createElement("div");
	wrap.className = "img-carousel";
	if (!urls || urls.length === 0) return null;

	let idx = 0;

	const track = document.createElement("div");
	track.className = "carousel-track";
	urls.forEach(url => {
		const img = document.createElement("img");
		img.className = "main-img";
		img.src = url;
		img.addEventListener("click", () => _openLightbox(url));
		track.appendChild(img);
	});
	wrap.appendChild(track);

	const dotsEl = document.createElement("div");
	dotsEl.className = "carousel-dots";
	const dots = urls.map((_, i) => {
		const d = document.createElement("span");
		d.className = "carousel-dot" + (i === 0 ? " active" : "");
		dotsEl.appendChild(d);
		return d;
	});
	wrap.appendChild(dotsEl);

	if (urls.length === 1) return wrap;

	["prev", "next"].forEach(dir => {
		const btn = document.createElement("button");
		btn.className = "carousel-arrow " + dir;
		btn.innerHTML = dir === "prev" ? "&#8249;" : "&#8250;";
		btn.addEventListener("click", e => {
			e.stopPropagation();
			idx = dir === "prev"
				? (idx - 1 + urls.length) % urls.length
				: (idx + 1) % urls.length;
			track.style.transform = "translateX(-" + (idx * 100) + "%)";
			dots.forEach((d, i) => d.classList.toggle("active", i === idx));
		});
		wrap.appendChild(btn);
	});

	return wrap;
};
