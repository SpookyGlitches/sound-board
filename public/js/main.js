var button
var audio = new Audio()
audio.oncanplay = () => {
    audio.play()
    button.innerHTML += `<div class="spinner-grow spinner-grow-sm text-danger" id='spinner' role="status"></div>`
}
audio.onended = () => {
    document.getElementById("spinner").remove()
}
document.querySelectorAll(".voice-btn").forEach(btn => btn.addEventListener("click", (event) => {
    audio.src = "/static/audios/"+btn.value
    button = btn
}))
document.querySelectorAll(".category").forEach(div => {
    div.addEventListener("mouseleave",toggleTrash)
    div.addEventListener("mouseenter",toggleTrash)
})

function toggleTrash(event){
    var trash = event.target.querySelector(".delete-category")
    if(trash){
        trash.style.visibility = trash.style.visibility == 'visible' ? 'hidden' : 'visible'
    }
}
