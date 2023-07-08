let titleObserver = new IntersectionObserver(entries => {
    if(entries[0].intersectionRatio <= 0){
        document.querySelector('.page-header .page-title').style.opacity = 1
    }else{
        document.querySelector('.page-header .page-title').style.opacity = 0
    }
})

titleObserver.observe(document.querySelector('.page-content .page-title'))