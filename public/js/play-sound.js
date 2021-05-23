var audio = new Audio();
document.querySelectorAll(".sound").forEach((btn) =>
	btn.addEventListener("click", (event) => {
		audio.src = "/static/sounds/" + btn.dataset.src;
	})
);

audio.oncanplay = () => {
	audio.play();
};
