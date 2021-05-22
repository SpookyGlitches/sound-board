let soundButtonsModal = document.getElementsByClassName("sound-button-modal");

for (x = 0; x < soundButtonsModal.length; x++) {
	soundButtonsModal[x].addEventListener("click", changeModalDetails);
}

function changeModalDetails(event) {
	let submitBtn = document.getElementById("submit");
	let soundTitle = document.getElementById("sound-title");
	let form = document.getElementById("form");
	let labelField = document.getElementById("sound-label");
	let descField = document.getElementById("sound-description");
	var modal = document.getElementById("soundModal");

	submitBtn.disabled = true;
	form.action = `/soundboards/${form.dataset.sboardid}/categories/${form.dataset.catid}/sounds`;
	if (event.target.dataset.action == "add") {
		labelField.value = "";
		descField.value = "";
		form.action += "/create";
		soundTitle.textContent = "Add sound";
	} else {
		labelField.value = event.target.dataset.label;
		descField.value = event.target.dataset.description;
		form.action += `/${event.target.dataset.soundid}/edit`;
		soundTitle.textContent = "Edit sound";
		document.getElementById("file").text = "Change sound";
	}
	bootstrap.Modal.getInstance(modal).show();
	submitBtn.disabled = false;
}
