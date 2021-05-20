let form = document.getElementById("createSoundBoardForm");
let tagsFld = document.getElementById("tagsField");
let tagsContainer = document.getElementById("tagsContainer");
let tags = [];

function populateTags() {
	let existingTags = document.getElementsByClassName("tag");
	existingTags.forEach((element) => {
		element.addEventListener("click", deleteTag);
		tags.push(element.textContent);
	});
}

document.getElementById("addTagButton").addEventListener("click", (event) => {
	let val = tagsFld.value.trim();
	if (val.length == 0 || tags.includes(val)) {
		return;
	}
	tags.push(val);
	createTag(val);
});

function createTag(val) {
	let btn = document.createElement("button");
	btn.setAttribute("type", "button");
	btn.classList.add("btn", "btn-sm", "btn-light", "mb-1", "tag");
	btn.addEventListener("click", deleteTag);
	btn.textContent = val;
	tagsContainer.appendChild(btn);
}

function deleteTag(event) {
	tags = tags.filter((item) => item !== event.target.textContent);
	event.target.remove();
}

function onFormSubmit() {
	document.getElementById("tags").value = tags.toString();
	return true;
}
