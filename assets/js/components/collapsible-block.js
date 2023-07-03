/*  How to use this component:
    Add these to your HTML.
    
    <div class="collapsible">
        <div class="open-link">sometext</div>
        <div class="close-link">othertext</div>
        <div class="content">yourcontent</div>
    </div>
*/


document.querySelectorAll('.collapsible').forEach(el => {
    let openLinkText = el.querySelector('.open-link').innerHTML || 'Show'
    let closeLinkText = el.querySelector('.close-link').innerHTML || 'Hide'
    let content = el.querySelector('.content').innerHTML
    let template = 
    `<div class="collapsible__link-container">
        <a href="javascript:;" class="collapsible__link">${openLinkText}</a>
    </div>
    <div class="collapsible__content">${content}</div>`

    el.innerHTML = template

    let computedContent = el.querySelector('.collapsible__content')
    let height = getComputedStyle(computedContent).height
    computedContent.style.height = 0

    let link = el.querySelector('.collapsible__link')

    window.addEventListener('resize', () => {
        computedContent.style.height = 'auto'
        height = getComputedStyle(computedContent).height
        if(link.innerHTML == openLinkText){
            computedContent.style.height = 0
        }else {
            computedContent.style.height = height
        }
    })
    
    link.addEventListener('click', () => {
        if(link.innerHTML == openLinkText){
            link.innerHTML = closeLinkText
            computedContent.style.height = height
        }else{
            link.innerHTML = openLinkText
            computedContent.style.height = 0
        }
    })
})