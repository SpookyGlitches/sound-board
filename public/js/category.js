let soundButtonsModal = document.getElementsByClassName("sound-button-modal");

for (x = 0; x < soundButtonsModal.length; x++) {
	soundButtonsModal[x].addEventListener("click", changeModalDetails);
}

function changeModalDetails(event) {
	let label = document.getElementById("sound-label");
	let desc = document.getElementById("sound-description");
	let soundTitle = document.getElementById("sound-title");
	let form = document.getElementById("form");
	let route = `/soundboards/${form.dataset.sboardid}/categories/${form.dataset.catid}/sounds`;
	let modal = new bootstrap.Modal(
		document.getElementById("soundModal"),
		{}
	);

	let target = event.currentTarget;

	if (target.dataset.action == "add") {
		desc.value = "";
		label.value = " ";
		form.action = route + "/create";
		soundTitle.textContent = "Add sound";
		modal.show();
		return;
	}
	route += `/${target.dataset.soundid}/edit`;
	soundTitle.textContent = "Edit sound";
	fetch(route)
		.then((response) => {
			if (!response.ok) throw new Error();
			return response.json();
		})
		.then((result) => {
			form.action = route;
			desc.value = result.description;
			label.value = result.label;
			modal.show();
		})
		.catch((err) => {
			alert("Error in retrieving sound");
		});
}
