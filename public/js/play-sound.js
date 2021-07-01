var audio = new Audio();

document.querySelectorAll(".sound").forEach((btn) =>
	btn.addEventListener("click", (event) => {
		const dataset = event.currentTarget.dataset;
		audio.src = `/soundboards/${dataset.sboard}/categories/${dataset.category}/sounds/${dataset.sound}/${dataset.src}/play`;
	})
);

audio.oncanplay = () => {
	audio.play();
};

audio.onerror = (error) => {
	console.log(error);
};
