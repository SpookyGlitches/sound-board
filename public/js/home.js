let svboards;
fetchSavedBoards();

document.getElementById("search").addEventListener("keyup", (event) => {
	if (event.currentTarget.value.length != 0) {
		let result = svboards.filter((e) => {
			console.log(e);
			return e.board.name
				.toLowerCase()
				.includes(
					event.currentTarget.value.toLowerCase()
				);
		});
		createSvboardLink(result);
	} else {
		createSvboardLink(svboards);
	}
});
async function fetchSavedBoards() {
	try {
		const response = await fetch("/savedboards");
		if (!response.ok) {
			throw new Error();
		} else {
			svboards = await response.json();
			console.log(svboards);
			createSvboardLink(svboards);
		}
	} catch (err) {
		console.log(err);
	}
}

function createSvboardLink(svboards) {
	var container = document.getElementById("savedBoardsContainer");
	container.innerHTML = "";
	for (x = 0; x < svboards.length; x++) {
		let div = document.createElement("div");
		div.classList.add("text-break", "mb-1");

		let a = document.createElement("a");
		a.classList.add("text-decoration-none");
		a.href = "/home?board=" + svboards[x].board_id;

		let h6 = document.createElement("h6");
		h6.innerHTML = svboards[x].board.name;

		a.appendChild(h6);
		div.appendChild(a);

		container.appendChild(div);
	}
}
