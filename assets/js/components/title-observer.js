let toTop = document.createElement('div')
let toTopButton = document.createElement('button')
toTopButton.innerHTML = '\ue25a'
toTop.appendChild(toTopButton)
toTop.title = 'To Top'
toTop.classList.add('float-div')
toTop.id = 'to-top'
toTop.style.position = 'fixed'
toTop.style.right = '20px'
toTop.style.bottom = '20px'
toTop.style.zIndex = '99'
toTopButton.style.fontSize = '1.8em'
toTopButton.classList.add('menu-button')
toTopButton.addEventListener('click', () => {
    window.scrollTo(0, 0)
})
document.body.appendChild(toTop)
toTop.style.display = 'none'
toTop.addEventListener('animationend', () => {
    if(toTop.classList.contains('ani__hide'))
    toTop.style.display = 'none'
})

let titleObserver = new IntersectionObserver(entries => {
    if(entries[0].intersectionRatio <= 0){
        toTop.style.display = 'block'
        toTop.classList.remove('ani__hide')
    }else{
        toTop.classList.add('ani__hide')
    }
})

titleObserver.observe(document.querySelector('.page-content .page-title'))