document.getElementById("file").addEventListener("change", validateFile);

function validateFile(event) {
	const extensions = [".mp3", ".ogg"];
	if (!hasExtension(extensions, event.target)) {
		alert("Supported files are " + extensions.toString() + ".");
		event.target.value = null;
		return;
	}
}

function hasExtension(extensions, file) {
	var fileName = file.value;
	return new RegExp(
		"(" + extensions.join("|").replace(/\./g, "\\.") + ")$"
	).test(fileName);
}
