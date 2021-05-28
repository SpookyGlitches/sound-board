document.getElementById("file").addEventListener("change", validateFile);

function validateFile(event) {
	//theres probably a bug here
	const extensions = [".mp3", ".ogg", ".wav"];
	let btn = document.getElementById("submit");
	btn.disabled = true;
	if (!hasExtension(extensions, event.target)) {
		alert(
			"Supported file extensions are " +
				extensions.toString() +
				" ."
		);
		return;
	}
	let reader = new FileReader();
	reader.onload = function (e) {
		let audio = document.createElement("audio");
		audio.src = e.currentTarget.result;
		audio.addEventListener("durationchange", function (e) {
			if (audio.duration > 30) {
				alert(
					"Only sound clips of <= 30 seconds are allowed."
				);
				return;
			}
			btn.disabled = false;
			return;
		});

		audio.addEventListener("onerror", function () {
			alert(
				"Cannot get duration of this file. Please add a different file."
			);
			return;
		});
	};
	reader.readAsDataURL(event.currentTarget.files[0]);
}

function hasExtension(extensions, file) {
	var fileName = file.value;
	return new RegExp(
		"(" + extensions.join("|").replace(/\./g, "\\.") + ")$"
	).test(fileName);
}
