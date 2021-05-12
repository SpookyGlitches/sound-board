var audio = new Audio()
var button

audio.onended = removeSpinner

audio.oncanplay = () => {
    audio.play()
    button.innerHTML += `<div class="spinner-grow spinner-grow-sm text-danger" id='spinner' role="status"></div>`
}
document.querySelectorAll(".voice-btn").forEach(btn => btn.addEventListener("click", (event) => {
    removeSpinner()
    audio.src = "/static/audios/"+btn.value
    button = event.target
}))
document.querySelectorAll(".category").forEach(div => { 
    div.addEventListener("mouseleave",toggleTrash)
    div.addEventListener("mouseenter",toggleTrash)
})

function removeSpinner(){
    var spinner = document.getElementById("spinner")
    if(spinner) spinner.remove()
}

function toggleTrash(event){
    var trash = event.target.querySelector(".delete-category")
    if(trash){
        trash.style.visibility = trash.style.visibility == 'visible' ? 'hidden' : 'visible'
    }
}
