let toolTipEl = document.createElement('div')
toolTipEl.classList.add('float-tooltip')
document.body.appendChild(toolTipEl)

function showTooltip(src){
    let content = document.getElementById(src).innerHTML
    toolTipEl.innerHTML = content
    window.addEventListener('mousemove', e => {
        toolTipEl.style.left = e.clientX
        toolTipEl.style.top = e.clientY
    })
}

function removeTooltip(){
    toolTipEl.classList.add('removing')
    window.removeEventListener('mousemove', e => {
        toolTipEl.style.left = e.clientX
        toolTipEl.style.top = e.clientY
    })
    setTimeout(() => {
        document.body.removeChild(toolTipEl)
    }, 250)
}

document.querySelectorAll('.note').forEach(el => {
    let id = el.dataset.target
    el.innerHTML = `<a href="javascript:;">${el.innerHTML}</a>`
    el.addEventListener(('click', 'mouseenter'), () => {
        showTooltip(id)
    })
    el.addEventListener('mouseleave', () => {
        removeTooltip()
    })
})