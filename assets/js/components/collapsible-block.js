/*  How to use this component:
 *  
 *  <div class="collapsible">
 *      <div class="open-link">sometext</div>
 *      <div class="close-link">othertext</div>
 *      <div class="content">yourcontent</div>
 *  </div>
*/


document.querySelectorAll('.collapsible').forEach(el => {
    let openLinkText = el.querySelector('.open-link').innerHTML
    let closeLinkText = el.querySelector('.close-link').innerHTML
    let content = el.querySelector('.content').innerHTML
    let template = 
    `<div class="collapsible__closed">
        <a href="javascript:;" class="collapsible__closed-link">${openLinkText}</a>
    </div>
    <div class="collapsible__opened">
        <a href="javascript:;" class="collapsible__opened-link">${closeLinkText}</a>
        <div class="collapsible__content">${content}</div>
    </div>`

    el.innerHTML = template

    let openLink = el.querySelector('.collapsible__closed-link')
    let closeLink = el.querySelector('.collapsible__opened-link')
    let closedDiv = el.querySelector('.collapsible__closed')
    let openedDiv = el.querySelector('.collapsible__opened')

    openLink.addEventListener('click', () => {
        closedDiv.style.display = 'none'
        openedDiv.style.display = 'block'
    })
    closeLink.addEventListener('click', () => {
        closedDiv.style.display = 'block'
        openedDiv.style.display = 'none'
    })
})