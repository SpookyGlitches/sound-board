document.getElementById("file").addEventListener("change", validateFile);

function validateFile(event) {
	const extensions = [".mp3", ".ogg", ".wav"];
	let btn = document.getElementById("submit");
	btn.disabled = true;
	if (!hasExtension(extensions, event.target)) {
		event.target.value = null;
		alert("Supported files are " + extensions.toString() + ".");
	} else {
		let file = document.getElementById("file").files[0];
		var reader = new FileReader();
		var audio = document.createElement("audio");
		reader.onload = function (e) {
			audio.src = e.target.result;
			audio.addEventListener(
				"durationchange",
				function () {
					alert(audio.duration);
					if (audio.duration > 30) {
						alert(
							"Only sound clips of <= 30 seconds are allowed."
						);
					} else {
						btn.disabled = false;
					}
				},
				false
			);
			audio.addEventListener("onerror", function () {
				alert(
					"Cannot get duration of this file. Please add a different one."
				);
			});
		};
		reader.readAsDataURL(file);
	}
}

function hasExtension(extensions, file) {
	var fileName = file.value;
	return new RegExp(
		"(" + extensions.join("|").replace(/\./g, "\\.") + ")$"
	).test(fileName);
}
