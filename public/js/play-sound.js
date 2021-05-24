var audio = new Audio();

document.querySelectorAll(".sound").forEach((btn) =>
	btn.addEventListener("click", (event) => {
		audio.src = "/static/sounds/" + event.currentTarget.dataset.src;
	})
);

audio.oncanplay = () => {
	audio.play();
};
