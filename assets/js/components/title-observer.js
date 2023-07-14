let toTop = document.createElement('div')
let toTopButton = document.createElement('button')
toTopButton.innerHTML = '▲'
toTop.appendChild(toTopButton)
toTop.classList.add('float-div')
toTop.id = 'to-top'
toTop.style.position = 'fixed'
toTop.style.right = '20px'
toTop.style.bottom = '20px'
toTopButton.classList.add('menu-button')
toTopButton.addEventListener('click', () => {
    window.scrollTo(0, 0)
})

let titleObserver = new IntersectionObserver(entries => {
    if(entries[0].intersectionRatio <= 0){
        document.querySelector('.page-header .page-title').style.opacity = 1
        document.body.appendChild(toTop)
        toTop.classList.remove('ani__hide')
    }else{
        document.querySelector('.page-header .page-title').style.opacity = 0
        toTop.classList.add('ani__hide')
        setTimeout(() => {document.body.removeChild(toTop)}, 400)
    }
})

titleObserver.observe(document.querySelector('.page-content .page-title'))