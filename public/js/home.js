fetchSavedBoards();

async function fetchSavedBoards() {
	try {
		const response = await fetch("/savedboards");
		if (!response.ok) {
			throw new Error();
		} else {
			const svboards = await response.json();
			createSvboardLink(svboards);
		}
	} catch (err) {
		console.log(err);
	}
}

function createSvboardLink(svboards) {
	var container = document.getElementById("savedBoardsContainer");
	for (x = 0; x < svboards.length; x++) {
		let div = document.createElement("div");
		div.classList.add("overflow-hidden", "mb-1");

		let a = document.createElement("a");
		a.classList.add("text-decoration-none");

		let h6 = document.createElement("h6");
		h6.innerHTML = svboards[x].name;

		a.appendChild(h6);
		div.appendChild(a);

		container.appendChild(div);
	}

	// <div class='overflow-hidden mb-1'>
	// 	<a href="" class='text-decoration-none'>
	// 		<h6>aaaaaaaaaaaaaaaddddddddddddddddda</h6>
	// 	</a>
	// </div>
}
// var audio = new Audio();
// var button;
// document.querySelectorAll(".sound").forEach((btn) =>
// 	btn.addEventListener("click", (event) => {
// 		audio.src =
// 			"https://www.myinstants.com/media/sounds/miku-miku-uwu.mp3";
// 		button = event.target;
// 	})
// );
// audio.oncanplay = () => {
// 	audio.play();
// };
