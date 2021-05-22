var audio = new Audio();
var button;
document.querySelectorAll(".sound").forEach((btn) =>
	btn.addEventListener("click", (event) => {
		audio.src = "/static/sounds/" + btn.dataset.src;
		button = btn;
	})
);

audio.oncanplay = () => {
	audio.play();
};
