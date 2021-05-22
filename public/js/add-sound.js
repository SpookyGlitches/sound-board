document.getElementById("file").addEventListener("change", validateFile);

function validateFile(event) {
	const extensions = [".mp3", ".ogg", ".wav"];
	let btn = document.getElementById("submit");
	btn.disabled = false;
	if (!hasExtension(extensions, event.target)) {
		event.target.value = null;
		btn.disabled = true;
		alert("Supported files are " + extensions.toString() + ".");
	} else if (true) {
	}
}

function hasExtension(extensions, file) {
	var fileName = file.value;
	return new RegExp(
		"(" + extensions.join("|").replace(/\./g, "\\.") + ")$"
	).test(fileName);
}
