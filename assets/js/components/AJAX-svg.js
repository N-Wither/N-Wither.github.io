let thingsNeedSvg = document.querySelectorAll('.request-svg')
if(thingsNeedSvg){
    thingsNeedSvg.forEach(el => {
        AJAXSomething(el)
        if(el.classList.length == 1) el.removeAttribute('class');
        else el.classList.remove('request-svg');
        el.removeAttribute('data-src')
    })
}