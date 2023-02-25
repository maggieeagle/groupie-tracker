const cardWraps = document.querySelectorAll('.card-wrap')
const buttons = document.querySelectorAll('.option-button')
const searchInput = document.getElementById('search')
const options = document.getElementById('search-options')
const searchOverlay = document.getElementById('search-overlay')
const hints = document.getElementById('hints')

let searchBand = true
let searchMembers = true
let searchConcerts = true
let searchAlbum = true
let searchCreation = true

// let value = ''

// check input added
searchInput.addEventListener('input', (e) => {
    let value = e.target.value
    if (value != '') {
        showOptions()
    } else {
        hideOptions()
    }

    search(value)
})

//listen click on search input
searchInput.addEventListener('click', (e) => {
    if (searchInput.value != '') {
        showOptions()
    }
})

//listen click to close options window
searchOverlay.addEventListener('click', () =>{
    hideOptions()
})

searchInput.addEventListener('keypress', (e) =>{
    if (e.code == 'Enter') {
        let activeHint = hints.getElementsByClassName('active')[0]
        if (activeHint != null) { // to select hint ad put it to search field
            let v = activeHint.getElementsByClassName("hint-value")[0].innerHTML
            searchInput.value = v
            search(searchInput.value)
        }
        hideOptions()
    }
})

searchInput.addEventListener('keydown', (e) =>{
    if (e.code == 'Escape') {
        hideOptions()
    }
})

function hideOptions() {
    options.classList.add('inactive')
    searchOverlay.classList.remove('active')
    activeHint = 0
}

function showOptions() {
    options.classList.remove('inactive')
    searchOverlay.classList.add('active')
}

function search(value) {
    hints.innerHTML = ""
    if (value && value.trim().length > 0){
        value = value.trim().toLowerCase()
        cardWraps.forEach(card => {
            let id = card.getElementsByClassName('card')[0].id
            let modal = document.getElementById('modal' + id)
               if (checkName(card, value) && checkMembers(modal, value) && checkConcerts(modal, value) && checkCreation(modal, value) && checkAlbum(modal, value)){
                   card.classList.add('inactive')
               } else {
                   card.classList.remove('inactive')
               }
       })
   } else {
       openAll()
   }
}

//check input in band name
function checkName(card, value) {
    if (card == null) return
    if (!searchBand && !noFilters()) return true
    const name = card.getElementsByClassName('card-text')[0].innerHTML
    const words = value.toLowerCase().split(' ')
    let count = 0
    for (i = 0; i < words.length; ++i) {
        let w = words[i];
        let re = new RegExp(`\\b${w}`);
        if (name.toLowerCase().match(re) != null) {
            count++
        }
        if (count == words.length) {
            addHint(name, 'band')
            return false
        }
    }
    return true
}

//check input in band members
function checkMembers(modal, value) {
    if (modal == null) return
    if (!searchMembers && !noFilters()) return true
    const members = modal.getElementsByClassName('member')
    for (i = 0; i < members.length; ++i) {
        const name = members[i].querySelector('a').innerHTML
        let words = value.split(' ')
        let count = 0
        for (j = 0; j < words.length; ++j) {
            let w = words[j];
            let re = new RegExp(`\\b${w}`);
            if (name.toLowerCase().match(re) != null) {
                count++
            }
            if (count == words.length) {
                addHint(name, 'member')
                return false
            }
        }
    }
    return true
}

//check input in concert locations or dates
function checkConcerts(modal, value) {
    if (modal == null) return
    if (!searchConcerts && !noFilters()) return true
    const relations = modal.getElementsByClassName('relation-list')
    for (i = 0; i < relations.length; ++i) {
        const locations = relations[i].querySelectorAll('.location')
        for (j = 0; j < locations.length; ++j) {
            let pureLocation = locations[j].innerHTML
            let location = pureLocation.toLowerCase().replaceAll(', ', ' ')
            v = value.replaceAll(', ', ' ').replaceAll(',', ' ').replaceAll('-', ' ')
            words = v.split(' ')
            let count = 0
            for (k = 0; k < words.length; ++k) {
                let w = words[k];
                let re = new RegExp(`\\b${w}`);
                if (location.match(re) != null) {
                    count++
                }
                if (count == words.length) {
                    addHint(pureLocation, 'concert')
                    return false
                }
            }  
        }
    }
    return true
}

//check input in first album date
function checkAlbum(modal, value) {
    if (modal == null) return
    if (!searchAlbum && !noFilters()) return true
    const pureDate = modal.getElementsByClassName('first-album')[0].innerHTML
    let date = pureDate.replaceAll('-', ' ')
    v = value.replaceAll('/', ' ').replaceAll('.', ' ').replaceAll('-', ' ').replaceAll(':', ' ')
    words = v.split(' ')
    let count = 0
    for (i = 0; i < words.length; ++i) {
        let w = words[i];
        let re = new RegExp(`\\b${w}`);
        if (date.match(re) != null) {
            count++
        }
        if (count == words.length) {
            addHint(pureDate, 'album')
            return false
        }
    }  
    return true
}

//check input in creation date
function checkCreation(modal, value) {
    if (modal == null) return
    if (!searchCreation && !noFilters()) return true
    const date = modal.getElementsByClassName('creation-date')[0].innerHTML
    if (date.indexOf(value) == 0) {
        addHint(date, 'creation date')
        return false
    }
    return true
}

function openAll() {
    cardWraps.forEach(card => {
        card.classList.remove('inactive')
    })
}

//check if filter button clicked
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('active')) {
            button.classList.remove('active')
        } else {
            button.classList.add('active')
        }
        setFilters()
        search(searchInput.value)
    })
})

//set filters: no button pressed - no filters, if any pressed filters summed up
function setFilters() {
    buttons.forEach(button => {
        if (button.classList.contains('active')) {
            set(button, true)
        } else {
            set(button, false)
        }
    })
}

function set(button, buttonValue) {
    if (button.id == 'band-button') searchBand = buttonValue
    if (button.id == 'member-button') searchMembers = buttonValue
    if (button.id == 'concert-button') searchConcerts = buttonValue
    if (button.id == 'album-button') searchAlbum = buttonValue
    if (button.id == 'creation-button') searchCreation = buttonValue
}

function noFilters() {
    let tmp = true
    buttons.forEach(button => {
        if (button.classList.contains('active')) {
            tmp = false
        } 
    })
    return tmp
}

function addHint(hintValue, type) {
    if (isExists(hintValue, type)) return
    hintList = hints.getElementsByClassName("hint")
    let hr = document.createElement('hr')
    hr.className = "hint-line"
    let div = document.createElement('div')
    div.className = "hint"
    div.id = 'hint' + (hintList.length + 1)
    div.innerHTML = '<div class="hint-value">' + hintValue + '</div><div class="hint-type">' + type + '</div>'
    div.addEventListener('click', (e) =>{
        searchInput.value = hintValue
        search(searchInput.value)
        hideOptions()
    })
    hints.append(hr)
    hints.append(div)
}

function isExists(hintValue, type) {
    hintList = hints.getElementsByClassName("hint")
    for (i = 0; i < hintList.length; ++i) {
        let hV = hintList[i].getElementsByClassName("hint-value")[0].innerHTML
        let t = hintList[i].getElementsByClassName("hint-type")[0].innerHTML
        if (hintValue == hV && type == t) return true
    }
    return false
}

let activeHint = 0
let activeHintPosition = 0
let scrollDirection = 'down'

searchInput.addEventListener('keydown', (e) => {
    if (e.code == 'ArrowDown' || e.code == 'ArrowUp') {
        hintList = hints.getElementsByClassName("hint")
        if (e.code == 'ArrowDown') {
            activeHint += 1
            scrollDirection = 'down'
            //if (activeHint > hintList.length) activeHint = 1 //for loop scroll
            if (activeHint > hintList.length) activeHint = hintList.length
        }
        if (e.code == 'ArrowUp') {
            activeHint -= 1
            scrollDirection = 'top'
            //if (activeHint < 1) activeHint = hintList.length //for loop scroll
            if (activeHint < 1) activeHint = 1
        }
        cleanHints()
        let hint = document.getElementById('hint' + activeHint)
        activeHintPosition = hint.offsetTop;
        if (hint != null) {
            hint.classList.add('active')
        }

        observer.observe(hint) // add element to observer
    }
})

function cleanHints() {
    activeHints = hints.getElementsByClassName('hint active')
    for (i = 0; i < activeHints.length; ++i) {
        activeHints[i].classList.remove('active')
    }
}

// create new observer
let observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
// write element to console
        if (!entry.isIntersecting) { // if not visible
            if (scrollDirection == 'down') {
                hints.scroll(0, activeHintPosition - 180)
            } else {
                hints.scroll(0, activeHintPosition - 340)
            }
        }
        obs.unobserve(entry.target); // turn off observing for the element
    });
});