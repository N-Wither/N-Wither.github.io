let ajaxSvg = () => {
    let thingsNeedSvg = document.querySelectorAll('.request-svg')
    if(thingsNeedSvg){
        thingsNeedSvg.forEach(async el => {
            el.innerHTML = await betterFetch(el.dataset.src)
            if(el.classList.length == 1) el.removeAttribute('class');
            else el.classList.remove('request-svg');
            el.removeAttribute('data-src')
        })
    }
}

ajaxSvg()