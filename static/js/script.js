const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        let id = "modal" + button.id
        const modal = document.getElementById(id)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        let modal = button.closest('.modal')
        closeModal(modal)
    })
})

// close modal with click on overlay
document.addEventListener('click', e => {
    let target = e.target
    if (!target.closest('.modal') && !target.closest('.card')){
        modal = document.getElementsByClassName("modal active")[0];
        closeModal(modal)
    }
});

document.addEventListener('keydown', (e) =>{
    if (e.code == 'Escape') {
        modal = document.getElementsByClassName("modal active")[0];
        closeModal(modal)
    }
})
    
function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
    document.body.classList.add('modal-open') // to prevent body scroll
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
    document.body.classList.remove('modal-open')
}