const creationDateFilter = document.getElementById('creation-date-filter')
const albumDateFilter = document.getElementById('album-date-filter')
const membersFilter = document.getElementById('members-filter')
const filtersOverlay = document.querySelector('#filters-overlay')

rangeFilterHandler(creationDateFilter, filtersOverlay, minCreationDate, maxCreationDate)
rangeFilterHandler(albumDateFilter, filtersOverlay, minAlbumDate, maxAlbumDate)
checkboxFilterHandler(membersFilter)

// TODO: remove date from variables names
function rangeFilterHandler(rangeFilter, filtersOverlay, minDate, maxDate) {
    const dateToggleMin = rangeFilter.querySelector('.range-toggle-min')
    const dateToggleMax = rangeFilter.querySelector('.range-toggle-max')
    const dateScale = rangeFilter.querySelector('.scale')
    const dateBar = rangeFilter.querySelector('.bar')
    const inputDateMin = rangeFilter.querySelector(".input-min-date")
    const inputDateMax = rangeFilter.querySelector(".input-max-date")

    dateToToggleMin(inputDateMin.value)
    dateToToggleMax(inputDateMax.value)

    let mouseOnDateToggleMin = false
    let mouseOnDateToggleMax = false

    dateToggleMin.addEventListener('mousedown', () => {
        mouseOnDateToggleMin = true
        filtersOverlay.classList.add('active')
    })

    dateToggleMax.addEventListener('mousedown', () => {
        mouseOnDateToggleMax = true
        filtersOverlay.classList.add('active')
    })

    filtersOverlay.addEventListener('mousedown', () => {
        mouseOnDateToggleMin = false
        mouseOnDateToggleMax = false

        filtersOverlay.classList.remove('active')
    })

    function pos(e){
        let mouseX = e.pageX

        if (mouseOnDateToggleMin) {
            moveToggleMin(mouseX)
            changeDateMin()
        }
        if (mouseOnDateToggleMax) {
            moveToggleMax(mouseX)
            changeDateMax()
        }
    }

    addEventListener('mousemove', pos, false);

    function moveToggleMin(position) {
        dateToggleMin.style.left = position - dateScale.getBoundingClientRect().left - dateToggleMin.offsetWidth/2 + 'px'
        if (parseInt(dateToggleMin.style.left) < 0) {
            dateToggleMin.style.left = 0 + 'px'
        }
        let dateToggleMaxLeft = parseInt(window.getComputedStyle(dateToggleMax, null).left)
        if (parseInt(dateToggleMin.style.left) > dateToggleMaxLeft - dateToggleMin.offsetWidth) {
            dateToggleMin.style.left = (dateToggleMaxLeft - dateToggleMin.offsetWidth) + 'px'
        }
        moveDateBar()
    }

    function moveToggleMax(position) {
        dateToggleMax.style.left = position - dateScale.getBoundingClientRect().left - dateToggleMax.offsetWidth/2 + 'px'
        if (parseInt(dateToggleMax.style.left) > dateScale.getBoundingClientRect().right - dateScale.getBoundingClientRect().left - dateToggleMax.offsetWidth) {
            dateToggleMax.style.left = dateScale.getBoundingClientRect().right - dateScale.getBoundingClientRect().left - dateToggleMax.offsetWidth + 'px'
        }
        let dateToggleMinRight = parseInt(window.getComputedStyle(dateToggleMin, null).left) + parseInt(dateToggleMin.offsetWidth)
        let dateToggleMaxLeft = parseInt(window.getComputedStyle(dateToggleMax, null).left)
        if (dateToggleMaxLeft < dateToggleMinRight) {
            dateToggleMax.style.left = (dateToggleMinRight) + 'px'
        }
        moveDateBar()
    }

    function moveDateBar() {
        dateBar.style.left = dateToggleMin.getBoundingClientRect().left - dateScale.getBoundingClientRect().left + dateToggleMin.offsetWidth/2 + 'px'
        dateBar.style.width = dateToggleMax.getBoundingClientRect().left - dateScale.getBoundingClientRect().left - parseInt(dateBar.style.left) + dateToggleMin.offsetWidth/2 + 'px'
    }

    function changeDateMin() {
        field = inputDateMin
        toggle = dateToggleMin
        let gap = maxDate - minDate
        let width = dateScale.offsetWidth - toggle.offsetWidth*2
        let k = gap/width
        let year = Math.round((toggle.getBoundingClientRect().left - dateScale.getBoundingClientRect().left) * k)
        field.value = String(minDate + year)
    }

    function changeDateMax() {
        field = inputDateMax
        toggle = dateToggleMax
        let gap = maxDate - minDate
        let width = dateScale.offsetWidth - toggle.offsetWidth*2
        let k = gap/width
        let year = Math.round((toggle.getBoundingClientRect().left - dateScale.getBoundingClientRect().left - toggle.offsetWidth) * k)
        field.value = String(minDate + year)
    }

    inputDateMin.addEventListener("input", () => {
        formatInput(inputDateMin)
        dateToToggleMin(inputDateMin.value)
    })

    inputDateMax.addEventListener("input", () => {
        formatInput(inputDateMax)
        dateToToggleMax(inputDateMax.value)
        
    })

    function dateToToggleMin(date) {
        let gap = maxDate - minDate
        let width = dateScale.offsetWidth - dateToggleMin.offsetWidth*2
        let k = width/gap
        let position = Math.round((date - minDate) * k) + dateScale.getBoundingClientRect().left + dateToggleMin.offsetWidth/2
        moveToggleMin(position)
    }

    function dateToToggleMax(date) {
        let gap = maxDate - minDate
        let width = dateScale.offsetWidth - dateToggleMax.offsetWidth*2
        let k = width/gap
        let position = Math.round((date - minDate) * k) + dateScale.getBoundingClientRect().left + dateToggleMax.offsetWidth*1.5
        moveToggleMax(position)
    }

    function formatInput(input) {
        input.value = input.value.replaceAll(/[^\d]/g, '')
        if (parseInt(input.value) == 0) input.value = ''
        if (input.value.length > 4) input.value = input.value.slice(0, 4)
    }
}

function checkboxFilterHandler(filter) {
    const boxes = filter.querySelectorAll('.checkbox')
    boxes.forEach(b => {
        if (members.includes(b.value)) {
            b.checked = true
        }
    })
    const checkboxSpans = filter.querySelectorAll('span')
    checkboxSpans.forEach(c => {
        c.addEventListener('click', () =>{
            ch = c.closest('.checkbox-wrap').querySelector('.checkbox')
            ch.checked = !ch.checked
        })
    })
}