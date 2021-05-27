document.getElementById("file").addEventListener("change", validateFile);

function validateFile(event) {
	//theres a bug here, hope you can solve it for me!
	const extensions = [".mp3", ".ogg", ".wav"];
	let btn = document.getElementById("submit");
	btn.disabled = true;
	if (!hasExtension(extensions, event.target)) {
		alert(
			"Supported file extensions are " +
				extensions.toString() +
				" ."
		);
	}
	let reader = new FileReader();
	let sound = file.files[0];
	let audio = document.createElement("audio");
	reader.onload = function (e) {
		audio.src = e.target.result;
		audio.addEventListener("durationchange", function () {
			if (audio.duration > 30) {
				alert(
					"Only sound clips of <= 30 seconds are allowed"
				);
			} else {
				btn.disabled = false;
			}
		});
		audio.addEventListener("onerror", function () {
			alert(
				"Cannot get duration of this file. Please add a different file."
			);
			return;
		});
	};
	reader.readAsDataURL(sound);
}

function hasExtension(extensions, file) {
	var fileName = file.value;
	return new RegExp(
		"(" + extensions.join("|").replace(/\./g, "\\.") + ")$"
	).test(fileName);
}
