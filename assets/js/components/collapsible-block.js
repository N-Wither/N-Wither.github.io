/*  How to use this component:
    Add these to your HTML.
    
    <div class="collapsible">
        <div class="open-link">sometext</div>
        <div class="close-link">othertext</div>
        <div class="content">yourcontent</div>
    </div>
*/

let blocks = document.getElementsByClassName('collapsible')

for(let i = 0; i < blocks.length; i ++){
    let el = blocks[i]

    let openLinkText = el.querySelector('.open-link').innerHTML || 'Show'
    let closeLinkText = el.querySelector('.close-link').innerHTML || 'Hide'
    let content = el.querySelector('.content').innerHTML
    let template =
        `<div class="collapsible__link-container">
            <button class="collapsible__link">${openLinkText}</button>
        </div>
        <div class="collapsible__content">${content}</div>`

    el.innerHTML = template

    let computedContent = el.querySelector('.collapsible__content')

    let link = el.querySelector('.collapsible__link')

    link.addEventListener('click', () => {
        if (link.innerHTML == openLinkText) {
            link.innerHTML = closeLinkText
            link.classList.toggle('open')
            computedContent.style.maxHeight = computedContent.scrollHeight + 'px'
        } else {
            link.innerHTML = openLinkText
            link.classList.toggle('open')
            computedContent.style.maxHeight = 0
        }
    })

    computedContent.addEventListener('click', () => {
        computedContent.style.maxHeight = 'fit-content'
        setTimeout(() => {
            computedContent.style.maxHeight = computedContent.scrollHeight + 'px'
        }, 500)
    })

    window.addEventListener('resize', () => {
        if(computedContent.style.maxHeight == '0px') return;
        computedContent.style.maxHeight = 'fit-content'
        setTimeout(() => {
            computedContent.style.maxHeight = computedContent.scrollHeight + 'px'
        }, 500)
    })

    computedContent.style.maxHeight = 0

}