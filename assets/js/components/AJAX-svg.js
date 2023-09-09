let thingsNeedSvg = document.querySelectorAll('.request-svg')
if(thingsNeedSvg){
    thingsNeedSvg.forEach(el => {
        AJAXSomething(el)
        el.classList.remove('request-svg')
        el.removeAttribute('data-src')
    })
}