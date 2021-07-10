let form = document.getElementById("createSoundBoardForm");
let tagsFld = document.getElementById("tagsField");
let tagsContainer = document.getElementById("tagsContainer");
let tags = [];

populateTags();

function populateTags() {
	let existingTags = document.getElementsByClassName("tag");
	for (let index = 0; index < existingTags.length; index++) {
		const element = existingTags[index];
		element.addEventListener("click", deleteTag);
		tags.push(element.textContent);
	}
}
document.getElementById("deleteSboard").addEventListener("submit", (event) => {
	if (!confirm("Are you sure you want to delete this?")) {
		return false;
	} else {
		event.submit();
	}
});

document.getElementById("addTagButton").addEventListener("click", (event) => {
	let val = tagsFld.value.trim();
	tagsFld.value = "";
	if (val.length == 0 || tags.includes(val)) {
		return;
	}
	if (val.length > 16) {
		alert("Limit tags to 16 characters");
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

document
	.getElementById("createSoundBoardForm")
	.addEventListener("submit", onFormSubmit);

function onFormSubmit() {
	if (tags.length <= 0) {
		alert("Tags must not be empty");
		return false;
	}
	document.getElementById("tags").value = tags.toString();
	return true;
}
