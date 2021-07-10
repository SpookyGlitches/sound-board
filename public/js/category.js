let soundButtonsModal = document.getElementsByClassName("sound-button-modal");

for (x = 0; x < soundButtonsModal.length; x++) {
	soundButtonsModal[x].addEventListener("click", changeModalDetails);
}

let deleteForm = document.getElementsByClassName("delete");
for (x = 0; x < deleteForm.length; x++) {
	deleteForm[x].addEventListener("click", confirmDelete);
}

function confirmDelete(event) {
	event.preventDefault();
	if (!confirm("Are you sure you want to delete this?")) {
		return false;
	} else {
		this.submit();
	}
}

function changeModalDetails(event) {
	let label = document.getElementById("sound-label");
	let desc = document.getElementById("sound-description");
	let soundTitle = document.getElementById("sound-title");
	let form = document.getElementById("form");
	let route = `/soundboards/${form.dataset.sboardid}/categories/${form.dataset.catid}/sounds`;
	let modal = new bootstrap.Modal(document.getElementById("soundModal"), {});

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
