const url = new URLSearchParams(window.location.search);
const page = url.get("page") || 1;
const element = document.getElementById("li-" + page);
if (element) {
	element.classList.add("active");
}
