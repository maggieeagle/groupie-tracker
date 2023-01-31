let timeout = 4000;
let lastActiveTimestamp = 0;
let userIsActive = false;

window.addEventListener('mousemove', active);
window.addEventListener('keypress', active);
window.addEventListener('click', active);

setInterval(checkUserIsActive, 10*15*4000) // time mod 4 = 0 to play gifs smoothly
active();

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

function checkUserIsActive() {
    if (userIsActive && new Date().getTime() - lastActiveTimestamp > timeout){
        changeToInactive();
        userIsActive = false;
    }
}
  
function active() {
    lastActiveTimestamp = new Date().getTime();
    if (!userIsActive) {
        userIsActive = true;
        changeToActive();
    }
}

function changeToInactive() {
    let modal = document.getElementsByClassName("modal active")[0]
    if (modal != null) {
        modal.classList.remove('active')
        document.getElementById("modal0").classList.add('active')
    } else {
        document.getElementById("header-text").innerHTML = "John Travolta"
        openModalButtons.forEach(card => {
            card.getElementsByClassName("card-img-top")[0].classList.add('inactive')
            card.getElementsByClassName("card-img-top-travolta")[0].classList.remove('inactive')
            card.getElementsByClassName("card-text")[0].classList.add('inactive')
            card.getElementsByClassName("card-text-travolta")[0].classList.remove('inactive')
        });
    }
}

function changeToActive() {
    document.getElementById("header-text").innerHTML = "Music Wave archive"
    openModalButtons.forEach(card => {
        card.getElementsByClassName("card-img-top")[0].classList.remove('inactive')
        card.getElementsByClassName("card-img-top-travolta")[0].classList.add('inactive')
        card.getElementsByClassName("card-text")[0].classList.remove('inactive')
        card.getElementsByClassName("card-text-travolta")[0].classList.add('inactive')
    });
    // modal = document.getElementsByClassName("modal active")[0]
    // image = modal.getElementsByClassName("band-image")[0]
    // image.src = "static/images/dance.gif"
}
