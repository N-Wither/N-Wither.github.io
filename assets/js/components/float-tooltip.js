let floatTip = document.createElement('div')
floatTip.classList.add('float-tip')

let elementsWithTip = document.querySelectorAll('.with-float-tip')
if(elementsWithTip.length != 0){
    elementsWithTip.forEach(el => {
        el.addEventListener('hover')
    })
}